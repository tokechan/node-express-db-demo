import sqlite3 from "sqlite3";
import { open } from "sqlite";

// SQLite 接続用の async 関数を作る
export const initDB = async () => {
  const db = await open({
    filename: "./tasks.db",
    driver: sqlite3.Database,
  });

  // テーブルがなければ作成（1回目起動時に自動で整う）
  await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLIEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

  console.log("Database connected & tasks table ready!");
  return db;
};
