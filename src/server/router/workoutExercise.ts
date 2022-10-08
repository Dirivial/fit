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
      return await ctx.prisma.workoutExercise.create({
        data: {
          exerciseTemplateId: input.templateId,
          workoutId: input.workoutId,
        },
      });
    },
  })
  .query("delete", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.$transaction([
        ctx.prisma.exerciseSet.deleteMany({
          where: { workoutExerciseId: input.id },
        }),
        ctx.prisma.workoutExercise.delete({
          where: { id: input.id },
          include: { ExerciseSets: true },
        }),
      ]);
    },
  })
  .query("getWorkoutExercises", {
    input: z.object({
      workoutId: z.number(),
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.workoutExercise.findMany({
        where: { workoutId: input.workoutId },
        include: { ExerciseTemplate: true, ExerciseSets: true },
      });
      if (res.every((item) => item.ExerciseTemplate.userId === input.userId)) {
        return res;
      } else {
        return null;
      }
    },
  });
