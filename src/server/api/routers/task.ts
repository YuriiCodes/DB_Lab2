import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.task.findMany();
    }),

    create: publicProcedure.input(
        z.object({
            iterationId: z.number(),
            points: z.number(),
            title: z.string(),
            description: z.string(),
            status: z.string(),
            creatorId: z.number(),
            executorId: z.number(),
        })
    ).mutation(async ({ctx, input}) => {
        return ctx.prisma.task.create({
            data: {
                ...input
            },
        });
    }),

    update: publicProcedure.input(
        z.object({
            id: z.number(),
            iterationId: z.number(),
            points: z.number(),
            title: z.string(),
            description: z.string(),
            status: z.string(),
            creatorId: z.number(),
            executorId: z.number(),
        })).mutation(async ({ctx, input}) => {
        return ctx.prisma.task.update({
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
        return ctx.prisma.task.delete({
            where: {
                id: input.id
            }
        });
    })
});
