// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { workoutRouter } from "./workout";
import { exercise } from "./exercise";
import { exerciseTemplate } from "./exerciseTemplate";
import { exerciseSets } from "./exerciseSets";
import { user } from "./user";
import { workoutExercise } from "./workoutExercise";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("workout.", workoutRouter)
  .merge("exerciseTemplate.", exerciseTemplate)
  .merge("exercise.", exercise)
  .merge("exerciseSets.", exerciseSets)
  .merge("user.", user)
  .merge("workoutExercise.", workoutExercise);

// export type definition of API
export type AppRouter = typeof appRouter;
