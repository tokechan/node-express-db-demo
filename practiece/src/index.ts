import express from "express";
import tasksRouter from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3000;
//JSONボディを解析するミドルウェアを登録
app.use(express.json());
//ルーティング設定
app.use("/api/tasks", tasksRouter);
//動作確認用ルート
app.get("/", (req, res) => {
  res.send("Serveris running on port 3000");
});
app.use(errorHandler);
//サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
