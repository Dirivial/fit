import { createRouter } from "./context";
import { z } from "zod";

export const user = createRouter()
  .query("get", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      console.log(user);
      return user;
    },
  })
  .query("getWithWorkouts", {
    input: z.object({
      email: z.string(),
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
      console.log(user);
      return user;
    },
  });
