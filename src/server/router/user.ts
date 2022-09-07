import { createRouter } from "./context";
import { z } from "zod";

export const exercise = createRouter().query("get", {
  input: z.object({
    id: z.number(),
  }),
  async resolve({ ctx, input }) {
    return await ctx.prisma.user.findFirst({
      where: {
        id: input.id,
      },
    });
  },
});
