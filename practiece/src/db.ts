import sqlite3 from "sqlite3";
import { open } from "sqlite";

//SQLite 接続用とテーブル初期化
export async function initDB() {
  const db = await open({
    // filename: "./tasks.db",
    filename: "/invalid/path/database.db",
    driver: sqlite3.Database,
  });

  //テーブルがなければ作成
  await db.exec(`
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
