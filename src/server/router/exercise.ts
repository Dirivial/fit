import { createRouter } from "./context";
import { z } from "zod";

export const exercise = createRouter()
  .query("get", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exercise.findFirst({
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
    }),
    async resolve({ ctx, input }) {
      const exercise = await ctx.prisma.exercise.create({
        data: {
          exerciseTemplateId: input.templateId,
        },
      });
      await ctx.prisma.exerciseSet.create({
        data: { exerciseId: exercise.id },
      });
      return exercise;
    },
  })
  .query("getAll", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseTemplate.findMany({
        where: { userId: input.id },
      });
    },
  });
