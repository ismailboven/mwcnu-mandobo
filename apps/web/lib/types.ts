export type ActionResult<T = void> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; code: string; message: string; fieldErrors?: Record<string, string[]> };
