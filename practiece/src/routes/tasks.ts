import { Router } from "express";
import { initDB } from "../db";
import { errorHandler } from "../middleware/errorHandler";

const router = Router();

//タスク一覧取得
router.get("/", async (req, res) => {
  try {
    const db = await initDB();
    const tasks = await db.all("SELECT * FROM tasks");

    //正常レスポンス
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks: ", err); //ログに詳細を出す
    res.status(500).json({ error: "Internal server error" }); //クライアントに安全なエラーメッセージを返す
  }
});

//新規タスクを追加
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const db = await initDB();
    const result = await db.run(
      "INSERT INTO tasks (title, completed) VALUES (?, ?)",
      title,
      0
    );

    const newTask = await db.get(
      "SELECT * FROM tasks WHERE id = ?",
      result.lastID
    );
    res.json(newTask);
  } catch (err) {
    console.error("Error creating task: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//タスク完了状態の更新
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  //バリデーション
  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invaild request body" });
  }

  const db = await initDB();
  const result = await db.run(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    completed ? 1 : 0,
    id
  );

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updated = await db.get("SELECT * FROM tasks WHERE id = ?", id);
  res.json(updated);
});

//部分更新
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const db = await initDB();

  //   //バリデーション
  //   if (typeof completed !== "boolean") {
  //     return res.status(400).json({ error: "Invaild request body" });
  //   }

  //対象タスク存在確認
  const existing = await db.get("SELECT * FROM tasks WHERE id = ?", id);
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }
  //更新対象を動的に決定
  const newTitle = title ?? existing.title;
  const newCompleted =
    typeof completed === "boolean" ? (completed ? 1 : 0) : existing.completed;

  await db.run(
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
    newTitle,
    newCompleted,
    id
  );

  //更新後のタスクを取得
  const updated = await db.get("SELECT *FROM tasks WHERE id = ?", id);
  res.status(200).json(updated);
});

//タスク削除
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await initDB();
    const result = await db.run("DELETE FROM tasks WHERE id = ?", [id]);

    if (result.changes === 0)
      return res.status(404).json({ error: "Task not found" });

    res.json({ message: `Task${id} deleted successfully` });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
