import { HttpError } from "./httpError";

const TITLE_MAX_LENGTH = 255;

export function parseTaskId(idParam: string | undefined): number {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Task id must be a positive integer");
  }
  return id;
}

export function requireTitle(raw: unknown): string {
  if (typeof raw !== "string") {
    throw new HttpError(400, "title must be a string");
  }
  const title = raw.trim();
  if (!title) {
    throw new HttpError(400, "title is required");
  }
  if (title.length > TITLE_MAX_LENGTH) {
    throw new HttpError(400, `title must be <= ${TITLE_MAX_LENGTH} characters`);
  }
  return title;
}

export function optionalTitle(raw: unknown): string | undefined {
  if (raw === undefined) return undefined;
  return requireTitle(raw);
}

export function parseCompleted(
  raw: unknown,
  { required = false }: { required?: boolean } = {}
): boolean | undefined {
  if (raw === undefined) {
    if (required) {
      throw new HttpError(400, "completed is required");
    }
    return undefined;
  }

  if (typeof raw === "boolean") return raw;
  if (raw === 1 || raw === "1") return true;
  if (raw === 0 || raw === "0") return false;

  throw new HttpError(400, "completed must be a boolean value");
}
