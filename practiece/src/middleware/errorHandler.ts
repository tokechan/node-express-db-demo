import type { ErrorRequestHandler } from "express";
import { sendError } from "../utils/response";

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error("Error caught by middleware:", err);
  const status = typeof (err as any).statusCode === "number" ? (err as any).statusCode : 500;
  const message = status === 500 ? "Internal Server Error" : err.message || "Error";
  const details = (err as any).details;

  sendError(res, status, message, details);
};
