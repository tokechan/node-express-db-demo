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

export default router;
