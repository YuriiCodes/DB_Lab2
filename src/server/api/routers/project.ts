import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.project.findMany();
    }),

    create: publicProcedure.input(
        z.object({
            name: z.string(),
            description: z.string(),
            joinCode: z.string(),
            ownerId: z.number(),
        })
    ).mutation(async ({ctx, input}) => {
        return ctx.prisma.project.create({
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
            joinCode: z.string(),
            ownerId: z.number(),
        })).mutation(async ({ctx, input}) => {
        return ctx.prisma.project.update({
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
        return ctx.prisma.project.delete({
            where: {
                id: input.id
            }
        });
    })
});
