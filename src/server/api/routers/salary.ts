import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const salaryRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.salary.findMany();
    }),

    create: publicProcedure.input(
        z.object({
            userId: z.number(),
            amount: z.number(),
        })
    ).mutation(async ({ctx, input}) => {
        return ctx.prisma.salary.create({
            data: {
                ...input
            },
        });
    }),

    update: publicProcedure.input(
        z.object({
            id: z.number(),
            amount: z.number(),
        })).mutation(async ({ctx, input}) => {
        return ctx.prisma.salary.update({
            where: {
                id: input.id
            },
            data: {
                ...input
            }
        })
    }),

    delete: publicProcedure.input(
        z.object({
            id: z.number()
        })
    ).mutation(async ({ctx, input}) => {
        return ctx.prisma.salary.delete({
            where: {
                id: input.id
            }
        });
    })
});
