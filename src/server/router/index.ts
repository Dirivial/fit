// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { workoutRouter } from "./workout";
import { exerciseRouter } from "./exercise";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("workout.", workoutRouter)
  .merge("exercise.", exerciseRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
