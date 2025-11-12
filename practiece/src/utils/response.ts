import type { Response } from "express";

type Meta = Record<string, unknown> | undefined;

export const sendSuccess = <T>(
  res: Response,
  data: T,
  status = 200,
  meta?: Meta
) => {
  res.status(status).json({ success: true, data, meta });
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  details?: Meta
) => {
  res.status(status).json({
    success: false,
    error: { code: status, message, details },
  });
};
