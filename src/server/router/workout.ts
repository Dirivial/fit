import { createRouter } from "./context";
import { z } from "zod";

export const workoutRouter = createRouter()
  .query("get", {
    input: z
      .object({
        id: z.number(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      if (!input) return;

      return await ctx.prisma.workout.findFirst({
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("getAll", {
    input: z
      .object({
        id: z.number(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      if (!input) return;
      return await ctx.prisma.workout.findMany({ where: { userId: input.id } });
    },
  });
