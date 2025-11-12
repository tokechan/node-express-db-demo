import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { initDB } from "../db";
import { success, fail } from "../utils/response";

const router = Router();

//タスク一覧取得
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = await initDB();
    const tasks = await db.all("SELECT * FROM tasks");
    //正常レスポンス
    success(res, tasks, 200);
  } catch (err) {
    next(err); //共通エラーハンドラーに処理を委譲
  }
});

//タスク詳細取得
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const db = await initDB();

    const task = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    if (!task) {
      return fail(res, 404, "Task not found");
    }

    success(res, task, 200);
  } catch (err) {
    next(err);
  }
});

//新規タスクを追加
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;

    if (!title) {
      return fail(res, 400, "Title is required");
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
    success(res, newTask, 201);
  } catch (err) {
    next(err); //共通エラーハンドラーに処理を委譲
  }
});

//タスク完了状態の更新
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    //バリデーション
    if (typeof completed !== "boolean") {
      return fail(res, 400, "Invaild request body");
    }

    const db = await initDB();
    const result = await db.run(
      "UPDATE tasks SET completed = ? WHERE id = ?",
      completed ? 1 : 0,
      id
    );

    if (result.changes === 0) {
      return fail(res, 404, "Task not found");
    }

    const updated = await db.get("SELECT * FROM tasks WHERE id = ?", id);
    success(res, updated, 200);
  } catch (err) {
    next(err); //共通エラーハンドラーに処理を委譲
  }
});

//部分更新
router.patch(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
        return fail(res, 404, "Task not found");
      }
      //更新対象を動的に決定
      const newTitle = title ?? existing.title;
      const newCompleted =
        typeof completed === "boolean"
          ? completed
            ? 1
            : 0
          : existing.completed;

      await db.run(
        "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
        newTitle,
        newCompleted,
        id
      );

      //更新後のタスクを取得
      const updated = await db.get("SELECT *FROM tasks WHERE id = ?", id);
      success(res, updated, 200);
    } catch (err) {
      next(err); //共通エラーハンドラーに処理を委譲
    }
  }
);

//タスク削除
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const db = await initDB();
      const result = await db.run("DELETE FROM tasks WHERE id = ?", [id]);

      if (result.changes === 0) {
        return fail(res, 404, "Task not found");
      }

      success(res, null, 204);
    } catch (err) {
      next(err); //共通エラーハンドラーに処理を委譲
    }
  }
);

export default router;
