import express from "express";
import { initDB } from "./db";
import tasksRouter from "./routes/tasks";

const app = express();
app.use(express.json());

const PORT = 3000;

const startServer = async () => {
  await initDB();
  //テスト用ルート
  app.get("/", (req, res) => {
    res.send("Server & DB are running!");
  });

  //ここでルートを登録
  app.use("/api/tasks", tasksRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  });
};

startServer();
