import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const iterationRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.iteration.findMany();
    }),

    create: publicProcedure.input(
        z.object({
            projectId: z.number(),
            name: z.string(),
            description: z.string(),
        })
    ).mutation(async ({ctx, input}) => {
        return ctx.prisma.iteration.create({
            data: {
                ...input
            },
        });
    }),

    update: publicProcedure.input(
        z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
            projectId: z.number(),
        })).mutation(async ({ctx, input}) => {
        return ctx.prisma.iteration.update({
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
        return ctx.prisma.iteration.delete({
            where: {
                id: input.id
            }
        });
    })
});
