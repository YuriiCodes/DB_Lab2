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

    update: publicProcedure.input(
        z.object({
            id: z.number(),
            username: z.string().min(3).max(20),
            email: z.string().email(),
            password: z.string().min(8).max(20),
        })).mutation(async ({ctx, input}) => {
        return ctx.prisma.user.update({
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
        const userId = input.id;

        // Delete tasks where the user is the creator
        await ctx.prisma.task.deleteMany({
            where: {
                creatorId: userId,
            },
        });

        // Remove the user as executor from tasks
        await ctx.prisma.task.updateMany({
            where: {
                executorId: userId,
            },
            data: {
                executorId: null,
            },
        });

        // Delete ProjectMember entries for the user
        await ctx.prisma.projectMember.deleteMany({
            where: {
                userId: userId,
            },
        });

        // Delete the projects owned by the user
        await ctx.prisma.project.deleteMany({
            where: {
                ownerId: userId,
            },
        });

        // Delete the user's Salary if exists
        await ctx.prisma.salary.deleteMany({
            where: {
                userId: userId,
            },
        });

        // Delete the user
        return ctx.prisma.user.delete({
            where: {
                id: userId,
            },
        });
    })
});
