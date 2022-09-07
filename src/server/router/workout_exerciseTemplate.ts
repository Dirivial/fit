import { createRouter } from "./context";
import { z } from "zod";
import { isPlainObject } from "react-query/types/core/utils";

export const workout_ExerciseTemplate = createRouter()
  .query("getWorkoutExercises", {
    input: z.object({
      workoutId: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workout_ExerciseTemplate.findMany({
        where: {
          workoutId: input.workoutId,
        },
        include: { ExerciseTemplate: true },
      });
    },
  })
  .query("addNew", {
    input: z.object({
      workoutId: z.number(),
      exerciseTemplateId: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workout_ExerciseTemplate.create({
        data: {
          workoutId: input.workoutId,
          exerciseTemplateId: input.exerciseTemplateId,
        },
      });
    },
  })
  .query("getAll", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workout.findMany({ where: { userId: input.id } });
    },
  });
