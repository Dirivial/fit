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
  .query("create", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      userid: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workout.create({
        data: {
          name: input.name,
          description: input.description,
          userId: input.userid,
        },
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
