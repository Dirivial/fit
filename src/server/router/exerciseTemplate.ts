import { createRouter } from "./context";
import { z } from "zod";

export const exerciseTemplate = createRouter()
  .query("get", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseTemplate.findFirst({
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("getHistory", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseTemplate.findFirst({
        where: {
          id: input.id,
        },
        include: {
          Exercise: {
            include: {
              ExerciseSets: true,
            },
          },
        },
      });
    },
  })
  .query("create", {
    input: z.object({
      userid: z.string(),
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseTemplate.create({
        data: {
          userId: input.userid,
          name: input.name,
        },
      });
    },
  })
  .query("getAllWithHistory", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseTemplate.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          Exercise: {
            include: {
              ExerciseSets: true,
            },
          },
        },
      });
    },
  })
  .query("getAllWithHistoryAndWorkouts", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseTemplate.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          Exercise: {
            include: {
              ExerciseSets: true,
            },
          },
          WorkoutExercise: {
            include: {
              Workout: true,
            },
          },
        },
      });
    },
  })
  .query("getAll", {
    input: z.object({
      userId: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      if (!input.userId) return null;
      return await ctx.prisma.exerciseTemplate.findMany({
        where: { userId: input.userId },
      });
    },
  })
  .query("delete", {
    input: z.object({
      templateId: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseTemplate.delete({
        where: { id: input.templateId },
        include: {
          Exercise: true,
          WorkoutExercise: true,
        },
      });
    },
  });
