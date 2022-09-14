// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { workoutRouter } from "./workout";
import { exercise } from "./exercise";
import { exerciseTemplate } from "./exerciseTemplate";
import { exerciseSets } from "./exerciseSets";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("workout.", workoutRouter)
  .merge("exerciseTemplate.", exerciseTemplate)
  .merge("exercise.", exercise)
  .merge("exerciseSets.", exerciseSets);

// export type definition of API
export type AppRouter = typeof appRouter;
