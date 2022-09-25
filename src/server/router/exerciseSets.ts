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
          rest: input.restTime,
          weight: input.weight,
        },
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("spicy", {
    input: z.object({
      sets: z
        .object({
          id: z.number(),
          rest: z.number(),
          reps: z.number(),
          weight: z.number(),
          workoutExerciseId: z.number().nullish(),
        })
        .array(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.$transaction(
        input.sets.map((aSet) => {
          if (aSet.id > 0) {
            return ctx.prisma.exerciseSet.update({
              where: {
                id: aSet.id,
              },
              data: {
                reps: aSet.reps,
                rest: aSet.rest,
                weight: aSet.weight,
              },
            });
          } else {
            return ctx.prisma.exerciseSet.create({
              data: {
                reps: aSet.reps,
                rest: aSet.rest,
                weight: aSet.weight,
                workoutExerciseId: aSet.workoutExerciseId,
              },
            });
          }
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
      rest: z.number(),
      weight: z.number(),
      workoutExerciseId: z.number().nullish(),
      exerciseId: z.number().nullish(),
    }),
    async resolve({ ctx, input }) {
      if (input.workoutExerciseId) {
        return ctx.prisma.exerciseSet.create({
          data: {
            reps: input.reps,
            rest: input.rest,
            weight: input.weight,
            workoutExerciseId: input.workoutExerciseId,
          },
        });
      } else {
        return null;
      }
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
