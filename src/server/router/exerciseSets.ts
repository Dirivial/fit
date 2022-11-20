import { createRouter } from "./context";
import { z } from "zod";
import { ExerciseSet } from "@prisma/client";

export const exerciseSets = createRouter()
  .query("get", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exercise.findFirst({
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("update", {
    input: z.object({
      id: z.number(),
      reps: z.number(),
      restTime: z.number(),
      weight: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseSet.update({
        data: {
          reps: input.reps,
          weight: input.weight,
        },
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("spicy", {
    // Potentially remove this one.
    input: z.object({
      sets: z
        .object({
          id: z.number(),
          reps: z.number(),
          weight: z.number(),
          exerciseId: z.number(),
        })
        .array(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.$transaction(
        input.sets.map((aSet) => {
          return ctx.prisma.exerciseSet.create({
            data: {
              reps: aSet.reps,
              weight: aSet.weight,
              exerciseId: aSet.exerciseId,
            },
          });
        })
      );
    },
  })
  .query("remove", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.exerciseSet.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("removeMany", {
    input: z.object({
      ids: z.number().array(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.exerciseSet.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    },
  })
  .query("create", {
    input: z.object({
      reps: z.number(),
      weight: z.number(),
      exerciseId: z.number(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.exerciseSet.create({
        data: {
          reps: input.reps,
          weight: input.weight,
          exerciseId: input.exerciseId,
        },
      });
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
