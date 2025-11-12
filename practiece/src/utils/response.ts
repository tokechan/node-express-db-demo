import type { Response } from "express";

export const success = (res: Response, data: any, status = 200) => {
  res.status(status).json({ success: true, data });
};

export const fail = (res: Response, status: number, message: string) => {
  res.status(status).json({ success: false, error: { code: status, message } });
};
