import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";

type SqliteInstance = Database<sqlite3.Database, sqlite3.Statement>;

let dbPromise: Promise<SqliteInstance> | null = null;

async function createDatabaseConnection(): Promise<SqliteInstance> {
  const db = await open({
    filename: "./tasks.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

  console.log("Database connected & tasks table ready!");
  return db;
}

export async function getDB(): Promise<SqliteInstance> {
  if (!dbPromise) {
    dbPromise = createDatabaseConnection();
  }
  return dbPromise;
}

// Backward compatibility with previous name
export const initDB = getDB;
