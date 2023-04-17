import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const projectMemberRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.projectMember.findMany();
    }),

    create: publicProcedure.input(
        z.object({
            projectId: z.number(),
            userId: z.number(),
        })
    ).mutation(async ({ctx, input}) => {
        return ctx.prisma.projectMember.create({
            data: {
                ...input
            },
        });
    }),

    update: publicProcedure.input(
        z.object({
            id: z.number(),
            projectId: z.number(),
            userId: z.number(),
        })).mutation(async ({ctx, input}) => {
        return ctx.prisma.projectMember.update({
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
        return ctx.prisma.projectMember.delete({
            where: {
                id: input.id
            }
        });
    })
});
