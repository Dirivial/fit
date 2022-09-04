// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { workoutRouter } from "./workout";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter).merge("workout.", workoutRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
