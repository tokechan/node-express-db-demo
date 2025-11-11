import type { ErrorRequestHandler } from "express";
//Expressのエラーハンドラーを定義 Express が用意している「4引数ミドルウェア専用の型」

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Error caught by middlewar:", err);
  //ステータスとメッセージを整理
  const status = (err as any).statusCode || 500;
  const message =
    status === 500 ? "Internal Server Error" : (err as any).message || "Error";
  res.status(status).json({ error: message });
};
