import sqlite3 from "sqlite3";

let db: sqlite3.Database;
let databasePath: string;

/**
 * Initialize the SQLite database connection
 * @param dbPath Path to the SQLite database file
 */
export function initDatabase(dbPath: string): Promise<void> {
  databasePath = dbPath;
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Execute a SQL query and get all results
 * @param query SQL query to execute
 * @param params Query parameters
 * @returns Promise with query results
 */
export function dbAll(query: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err: Error | null, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Execute a SQL query that modifies data
 * @param query SQL query to execute
 * @param params Query parameters
 * @returns Promise with result info
 */
export function dbRun(query: string, params: any[] = []): Promise<{ changes: number, lastID: number }> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes, lastID: this.lastID });
      }
    });
  });
}

/**
 * Execute multiple SQL statements
 * @param query SQL statements to execute
 * @returns Promise that resolves when execution completes
 */
export function dbExec(query: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.exec(query, (err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Close the database connection
 */
export function closeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }
    
    db.close((err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Get the current database path
 */
export function getDatabasePath(): string {
  return databasePath;
} 