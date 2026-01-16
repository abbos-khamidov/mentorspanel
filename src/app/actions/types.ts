// Result type for server actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
