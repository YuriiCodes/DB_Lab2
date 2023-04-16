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
        await ctx.prisma.projectMember.deleteMany({
            where: {
                userId: input.id
            }
        });
        await ctx.prisma.salary.deleteMany({
            where: {
                userId: input.id

            }
        });
        //find all the projects that the user is the owner of
        const projects = await ctx.prisma.project.findMany({
            where: {
                ownerId: input.id
            }
        })

//find all the iterations that belong to the projects that the user is the owner of
        const iterations = await ctx.prisma.iteration.findMany({
                where: {
                    projectId: {
                        in: projects.map(project => project.id)

                    }
                }
            }
        )

        //delete all the tasks that belong to the iterations that belong to the projects that the user is the owner of
        await ctx.prisma.task.deleteMany({
            where: {
                iterationId: {
                    in: iterations.map(iteration => iteration.id)
                }
            }
        })

        //delete all the iterations that belong to the projects that the user is the owner of
        await ctx.prisma.iteration.deleteMany({
            where: {
                id: {
                    in: iterations.map(iteration => iteration.id)
                }
            }})

        //delete all the projects that the user is the owner of
        await ctx.prisma.project.deleteMany({
            where: {
                id: {
                    in: projects.map(project => project.id)
                }
            }
        })

        //delete all the
        return ctx.prisma.user.delete({
            where: {
                id: input.id
            }
        });
    })
});
