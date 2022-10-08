import { createRouter } from "./context";
import { z } from "zod";

export const user = createRouter()
  .query("get", {
    input: z.object({
      email: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      return user;
    },
  })
  .query("getWithWorkouts", {
    input: z.object({
      email: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        include: {
          Workout: true,
        },
      });
      return user;
    },
  })
  .query("getWithTemplates", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        include: {
          ExerciseTemplates: true,
        },
      });
      return user;
    },
  });
