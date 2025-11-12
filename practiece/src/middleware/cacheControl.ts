import type { RequestHandler } from "express";

export const declareNoCache: RequestHandler = (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};
