import { Router } from "express";
import { getDB } from "../db";
import { sendSuccess } from "../utils/response";
import { asyncHandler } from "../middleware/asyncHandler";
import { HttpError } from "../utils/httpError";
import {
  optionalTitle,
  parseCompleted,
  parseTaskId,
  requireTitle,
} from "../utils/validators";
import { toTaskCollection, toTaskResource } from "../utils/task";

const router = Router();

const booleanToSQLite = (value: boolean) => (value ? 1 : 0);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const db = await getDB();
    const tasks = await db.all("SELECT * FROM tasks ORDER BY created_at DESC");
    res.setHeader("Cache-Control", "private, max-age=30");
    sendSuccess(res, toTaskCollection(tasks));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseTaskId(req.params.id);
    const db = await getDB();
    const task = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    if (!task) throw new HttpError(404, "Task not found");
    res.setHeader("Cache-Control", "private, max-age=30");
    sendSuccess(res, toTaskResource(task));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const title = requireTitle(req.body.title);
    const completed = parseCompleted(req.body.completed) ?? false;

    const db = await getDB();
    const result = await db.run(
      "INSERT INTO tasks (title, completed) VALUES (?, ?)",
      title,
      booleanToSQLite(completed)
    );
    const newTask = await db.get("SELECT * FROM tasks WHERE id = ?", result.lastID);
    if (!newTask) {
      throw new HttpError(500, "Failed to load created task");
    }
    const resource = toTaskResource(newTask);
    res.setHeader("Location", resource.links.self);
    sendSuccess(res, resource, 201);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseTaskId(req.params.id);
    const title = requireTitle(req.body.title);
    const completed = parseCompleted(req.body.completed, { required: true })!;

    const db = await getDB();
    const result = await db.run(
      "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
      title,
      booleanToSQLite(completed),
      id
    );

    if (result.changes === 0) {
      throw new HttpError(404, "Task not found");
    }

    const updated = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    if (!updated) {
      throw new HttpError(500, "Failed to load updated task");
    }
    sendSuccess(res, toTaskResource(updated));
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseTaskId(req.params.id);
    const title = optionalTitle(req.body.title);
    const completed = parseCompleted(req.body.completed);

    if (title === undefined && completed === undefined) {
      throw new HttpError(400, "Provide at least one field to update");
    }

    const db = await getDB();
    const existing = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    if (!existing) throw new HttpError(404, "Task not found");

    await db.run(
      "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
      title ?? existing.title,
      completed === undefined
        ? existing.completed
        : booleanToSQLite(completed),
      id
    );

    const updated = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    if (!updated) {
      throw new HttpError(500, "Failed to load updated task");
    }
    sendSuccess(res, toTaskResource(updated));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseTaskId(req.params.id);
    const db = await getDB();
    const result = await db.run("DELETE FROM tasks WHERE id = ?", id);
    if (result.changes === 0) throw new HttpError(404, "Task not found");
    res.status(204).end();
  })
);

export default router;
