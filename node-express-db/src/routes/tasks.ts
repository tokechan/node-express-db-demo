import { Router } from "express";
import { initDB } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const db = await initDB();
    const tasks = await db.all("SELECT * FROM tasks");
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//新規タスク追加
router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const db = await initDB();
    await db.run("INSERT INTO tasks (title) VALUES (?)", [title]);
    const tasks = await db.all("SELECT * FROM tasks"); //追加後の全件返す（確認しやすい）
    res.status(201).json(tasks);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

//タスクの完了状態を更新
router.put("/:id/", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (completed === undefined)
    return res.status(400).json({ error: "completed status is required" });

  try {
    const db = await initDB();
    await db.run("UPDATE tasks SET completed = ? WHERE id = ?", [
      completed,
      id,
    ]);
    const updatedTask = await db.get("SELECT *FROM tasks WHERE id = ?", [id]);
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

//タスクの削除

export default router;
