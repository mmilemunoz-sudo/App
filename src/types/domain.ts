export type PaymentMethod = "cash" | "transfer";

export type ExpenseCategory =
  | "fuel"
  | "workshop"
  | "wash"
  | "insurance"
  | "other";

export type Trip = {
  id: string;
  destination: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  notes: string;
  createdAt: string;
};

export type DashboardStats = {
  dayTrips: number;
  dayRevenue: number;
  dayExpenses: number;
  dayNet: number;
  weekRevenue: number;
  monthTrips: number;
  monthExpenses: number;
  monthNet: number;
};

export type QuickDestination = {
  destination: string;
  amount: number;
  paymentMethod: PaymentMethod;
};

export type CalendarDaySummary = {
  date: string;
  trips: number;
  revenue: number;
  expenses: number;
  net: number;
};

export type HistoryEntry = {
  id: string;
  type: "trip" | "expense";
  title: string;
  subtitle: string;
  amount: number;
  createdAt: string;
};
