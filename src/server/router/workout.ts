import { createRouter } from "./context";
import { z } from "zod";

export const workoutRouter = createRouter()
  .query("get", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workout.findFirst({
        where: {
          id: input.id,
        },
        include: { Exercises: true },
      });
    },
  })
  .query("newFromTemplate", {
    input: z.object({
      id: z.number(),
      templateId: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workout.findFirst({
        where: {
          id: input.id,
        },
        include: { Exercises: true },
      });
    },
  })
  .query("getAll", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workout.findMany({ where: { userId: input.id } });
    },
  });
