export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details: Record<string, unknown> | undefined;

  constructor(statusCode: number, message: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "HttpError";
  }
}

export function assert(condition: unknown, statusCode: number, message: string) {
  if (!condition) {
    throw new HttpError(statusCode, message);
  }
}
