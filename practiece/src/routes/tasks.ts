import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { initDB } from "../db";
import { success, fail } from "../utils/response";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

//タスク一覧取得
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const db = await initDB();
    const tasks = await db.all("SELECT * FROM tasks");
    //正常レスポンス
    success(res, tasks, 200);
  })
);

//タスク詳細取得
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = await initDB();
    const task = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    if (!task) return fail(res, 404, "Task not found");
    success(res, task, 200);
  })
);

//新規タスクを追加
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title) return fail(res, 400, "Title is required");
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
    success(res, newTask, 201);
  })
);

//タスク完了状態の更新
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { completed } = req.body;
    //バリデーション
    if (completed === undefined)
      return fail(res, 400, "completed status is required");
    //DB更新
    const db = await initDB();
    await db.run(
      "UPDATE tasks SET completed = ? WHERE id = ?",
      completed ? 1 : 0,
      id
    );
    //更新後のタスクを取得
    const updated = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    success(res, updated, 200);
  })
);

//部分更新
router.patch(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const db = await initDB();

    //対象タスク存在確認
    const existing = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    if (!existing) return fail(res, 404, "Task not found");
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
    success(res, updated, 200);
  })
);

//タスク削除
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = await initDB();
    const result = await db.run("DELETE FROM tasks WHERE id = ?", id);
    if (result.changes === 0) return fail(res, 404, "Task not found");
    success(res, null, 204);
  })
);

export default router;
