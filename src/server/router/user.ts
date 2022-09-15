import { createRouter } from "./context";
import { z } from "zod";

export const user = createRouter().query("get", {
  input: z.object({
    email: z.string(),
  }),
  async resolve({ ctx, input }) {
    console.log("Fetching users with email: ", input.email);
    const user = await ctx.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });
    console.log(user);
    return user;
  },
});
