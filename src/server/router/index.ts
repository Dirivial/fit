// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { workoutRouter } from "./workout";
import { exercise } from "./exercise";
import { exerciseTemplate } from "./exerciseTemplate";
import { workout_ExerciseTemplate } from "./workout_exerciseTemplate";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("workout.", workoutRouter)
  .merge("exerciseTemplate.", exerciseTemplate)
  .merge("workout_ExerciseTemplate.", workout_ExerciseTemplate)
  .merge("exercise.", exercise);

// export type definition of API
export type AppRouter = typeof appRouter;
