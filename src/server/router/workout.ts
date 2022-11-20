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
  .query("delete", {
    input: z.object({
      id: z.number(),
      workoutExerciseIds: z.number().array(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.$transaction([
        // Delete workout exercises
        ctx.prisma.workoutExercise.deleteMany({
          where: { id: { in: input.workoutExerciseIds } },
        }),
        // Finally delete the workout itself
        ctx.prisma.workout.delete({
          where: {
            id: input.id,
          },
        }),
      ]);
    },
  })
  .query("create", {
    input: z.object({
      name: z.string(),
      userid: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.workout.create({
        data: {
          name: input.name,
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
