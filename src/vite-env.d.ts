/// <reference types="vite/client" />

declare module "sql.js" {
  export type Database = {
    run(sql: string, params?: unknown[]): void;
    exec(sql: string, params?: unknown[]): Array<{
      columns: string[];
      values: unknown[][];
    }>;
    export(): Uint8Array;
  };

  export default function initSqlJs(config?: {
    locateFile?: (file: string) => string;
  }): Promise<{
    Database: new (data?: Uint8Array) => Database;
  }>;
}
