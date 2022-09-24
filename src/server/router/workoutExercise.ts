import { createRouter } from "./context";
import { z } from "zod";

export const workoutExercise = createRouter()
  .query("get", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workoutExercise.findFirst({
        where: {
          id: input.id,
        },
        include: {
          ExerciseTemplate: true,
          ExerciseSets: true,
        },
      });
    },
  })
  .query("create", {
    input: z.object({
      templateId: z.number(),
      workoutId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const exercise = await ctx.prisma.workoutExercise.create({
        data: {
          exerciseTemplateId: input.templateId,
          workoutId: input.workoutId,
        },
      });
      await ctx.prisma.exerciseSet.create({
        data: { exerciseId: exercise.id },
      });
      return exercise;
    },
  })
  .query("getWorkoutExercises", {
    input: z.object({
      workoutId: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workoutExercise.findMany({
        where: { workoutId: input.workoutId },
        include: { ExerciseTemplate: true, ExerciseSets: true },
      });
    },
  });