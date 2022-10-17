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
  .query("create", {
    input: z.object({
      userid: z.string(),
      name: z.string(),
      description: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.exerciseTemplate.create({
        data: {
          userId: input.userid,
          name: input.name,
          description: input.description,
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
  });
