import initSqlJs, { type Database } from "sql.js";
import sqliteWasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import type {
  CalendarDaySummary,
  DashboardStats,
  Expense,
  ExpenseCategory,
  PaymentMethod,
  QuickDestination,
  Trip
} from "../types/domain";
import {
  startOfLocalDay,
  startOfLocalMonth,
  startOfLocalWeek,
  toIsoNow
} from "../lib/date";
import { loadDatabaseBytes, saveDatabaseBytes } from "./storage";

let db: Database | null = null;

async function persist() {
  if (!db) return;
  await saveDatabaseBytes(db.export());
}

function mapRow<T>(columns: string[], values: unknown[]): T {
  return Object.fromEntries(columns.map((column, index) => [column, values[index]])) as T;
}

function all<T>(sql: string, params: unknown[] = []) {
  if (!db) throw new Error("La base de datos no esta lista.");
  const result = db.exec(sql, params);
  if (!result[0]) return [];
  return result[0].values.map((row) => mapRow<T>(result[0].columns, row));
}

function getNumber(sql: string, params: unknown[] = []) {
  const rows = all<{ value: number }>(sql, params);
  return Number(rows[0]?.value ?? 0);
}

function migrate() {
  if (!db) return;

  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      destination TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'transfer')),
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
  `);

  db.run("CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at);");
  db.run("CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);");
}

export async function initDatabase() {
  const SQL = await initSqlJs({
    locateFile: () => sqliteWasmUrl
  });
  const bytes = await loadDatabaseBytes();
  db = bytes ? new SQL.Database(bytes) : new SQL.Database();
  migrate();
  await persist();
}

export async function createTrip(input: {
  destination: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}) {
  if (!db) throw new Error("La base de datos no esta lista.");
  const trip: Trip = {
    id: crypto.randomUUID(),
    destination: input.destination.trim(),
    amount: input.amount,
    paymentMethod: input.paymentMethod,
    notes: input.notes?.trim() ?? "",
    createdAt: toIsoNow()
  };

  db.run(
    `INSERT INTO trips (id, destination, amount, payment_method, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [trip.id, trip.destination, trip.amount, trip.paymentMethod, trip.notes, trip.createdAt]
  );
  await persist();
  return trip;
}

export async function createExpense(input: {
  category: ExpenseCategory;
  amount: number;
  notes?: string;
}) {
  if (!db) throw new Error("La base de datos no esta lista.");
  const expense: Expense = {
    id: crypto.randomUUID(),
    category: input.category,
    amount: input.amount,
    notes: input.notes?.trim() ?? "",
    createdAt: toIsoNow()
  };

  db.run(
    `INSERT INTO expenses (id, category, amount, notes, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [expense.id, expense.category, expense.amount, expense.notes, expense.createdAt]
  );
  await persist();
  return expense;
}

export function listRecentTrips(limit = 6) {
  return all<{
    id: string;
    destination: string;
    amount: number;
    payment_method: PaymentMethod;
    notes: string;
    created_at: string;
  }>(
    `SELECT id, destination, amount, payment_method, notes, created_at
     FROM trips
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  ).map((trip) => ({
    id: trip.id,
    destination: trip.destination,
    amount: Number(trip.amount),
    paymentMethod: trip.payment_method,
    notes: trip.notes,
    createdAt: trip.created_at
  }));
}

export function listQuickDestinations(limit = 5): QuickDestination[] {
  return all<{
    destination: string;
    amount: number;
    payment_method: PaymentMethod;
  }>(
    `SELECT t.destination, t.amount, t.payment_method
     FROM trips t
     INNER JOIN (
       SELECT destination, MAX(created_at) as latest_at
       FROM trips
       WHERE destination <> ''
       GROUP BY destination
     ) latest
       ON latest.destination = t.destination
      AND latest.latest_at = t.created_at
     ORDER BY t.created_at DESC
     LIMIT ?`,
    [limit]
  ).map((row) => ({
    destination: row.destination,
    amount: Number(row.amount),
    paymentMethod: row.payment_method
  }));
}

export function getDashboardStats(): DashboardStats {
  const dayStart = startOfLocalDay();
  const weekStart = startOfLocalWeek();
  const monthStart = startOfLocalMonth();

  const dayRevenue = getNumber(
    "SELECT COALESCE(SUM(amount), 0) as value FROM trips WHERE created_at >= ?",
    [dayStart]
  );
  const dayExpenses = getNumber(
    "SELECT COALESCE(SUM(amount), 0) as value FROM expenses WHERE created_at >= ?",
    [dayStart]
  );
  const monthRevenue = getNumber(
    "SELECT COALESCE(SUM(amount), 0) as value FROM trips WHERE created_at >= ?",
    [monthStart]
  );
  const monthExpenses = getNumber(
    "SELECT COALESCE(SUM(amount), 0) as value FROM expenses WHERE created_at >= ?",
    [monthStart]
  );

  return {
    dayTrips: getNumber("SELECT COUNT(*) as value FROM trips WHERE created_at >= ?", [dayStart]),
    dayRevenue,
    dayExpenses,
    dayNet: dayRevenue - dayExpenses,
    weekRevenue: getNumber("SELECT COALESCE(SUM(amount), 0) as value FROM trips WHERE created_at >= ?", [
      weekStart
    ]),
    monthTrips: getNumber("SELECT COUNT(*) as value FROM trips WHERE created_at >= ?", [
      monthStart
    ]),
    monthExpenses,
    monthNet: monthRevenue - monthExpenses
  };
}

export function listHistoryEntries(limit = 80) {
  return all<{
    id: string;
    type: "trip" | "expense";
    title: string;
    subtitle: string;
    amount: number;
    created_at: string;
  }>(
    `SELECT id, 'trip' as type, destination as title, payment_method as subtitle, amount, created_at
     FROM trips
     UNION ALL
     SELECT id, 'expense' as type, category as title, notes as subtitle, amount, created_at
     FROM expenses
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  ).map((entry) => ({
    id: entry.id,
    type: entry.type,
    title: entry.title,
    subtitle: entry.subtitle,
    amount: Number(entry.amount),
    createdAt: entry.created_at
  }));
}

export function listCalendarMonth(year: number, monthIndex: number): CalendarDaySummary[] {
  const start = new Date(year, monthIndex, 1).toISOString();
  const end = new Date(year, monthIndex + 1, 1).toISOString();
  const trips = all<{ date: string; trips: number; revenue: number }>(
    `SELECT substr(created_at, 1, 10) as date, COUNT(*) as trips, COALESCE(SUM(amount), 0) as revenue
     FROM trips
     WHERE created_at >= ? AND created_at < ?
     GROUP BY substr(created_at, 1, 10)`,
    [start, end]
  );
  const expenses = all<{ date: string; expenses: number }>(
    `SELECT substr(created_at, 1, 10) as date, COALESCE(SUM(amount), 0) as expenses
     FROM expenses
     WHERE created_at >= ? AND created_at < ?
     GROUP BY substr(created_at, 1, 10)`,
    [start, end]
  );

  const byDate = new Map<string, CalendarDaySummary>();
  trips.forEach((day) => {
    byDate.set(day.date, {
      date: day.date,
      trips: Number(day.trips),
      revenue: Number(day.revenue),
      expenses: 0,
      net: Number(day.revenue)
    });
  });
  expenses.forEach((day) => {
    const current = byDate.get(day.date) ?? {
      date: day.date,
      trips: 0,
      revenue: 0,
      expenses: 0,
      net: 0
    };
    current.expenses = Number(day.expenses);
    current.net = current.revenue - current.expenses;
    byDate.set(day.date, current);
  });

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

