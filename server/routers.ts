// Type-only compatibility for the existing client package. This router is intentionally
// not mounted by server/_core/index.ts; all active backend routes are same-origin REST.
import { initTRPC } from "@trpc/server";
const t = initTRPC.create();
export const appRouter = t.router({
  auth: t.router({
    me: t.procedure.query((): { id: number; name: string | null; email: string | null } | null => null),
    logout: t.procedure.mutation(() => ({ success: true as const })),
  }),
});
export type AppRouter = typeof appRouter;
