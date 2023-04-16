import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.user.findMany();
    }),

    create: publicProcedure.input(
        z.object({
            username: z.string().min(3).max(20),
            email: z.string().email(),
            password: z.string().min(8).max(20),
        })
    ).mutation(async ({ctx, input}) => {
        return ctx.prisma.user.create({
            data: {
                ...input
            },
        });
    }),

    delete: publicProcedure.input(
        z.object({
            id: z.number()
        })
    ).mutation(async ({ctx, input}) => {
        //delete all the
        return ctx.prisma.user.delete({
            where: {
                id: input.id
            }
        });
    })
});
