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
        include: { exercise: true },
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
