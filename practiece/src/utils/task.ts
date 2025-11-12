export type TaskRow = {
  id: number;
  title: string;
  completed: number;
  created_at: string;
};

export type TaskResource = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  links: {
    self: string;
  };
};

export function toTaskResource(row: TaskRow): TaskResource {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    links: {
      self: `/api/tasks/${row.id}`,
    },
  };
}

export function toTaskCollection(rows: TaskRow[]): TaskResource[] {
  return rows.map(toTaskResource);
}
