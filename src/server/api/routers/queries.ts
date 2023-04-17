import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {TRPCError} from "@trpc/server";

export const queriesRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.project.findMany();
    }),
    //   1. Get all the tasks assigned to a specific project:
    getTasksByProjectId: publicProcedure.input(
        z.object({
            projectId: z.number(),
        })).mutation(async ({ctx, input}) => {
        //find all iterationIds where projectId = input.projectId
        const iterationIds = await ctx.prisma.iteration.findMany({
            where: {
                projectId: input.projectId
            }
        }).then(iterations => {
            return iterations.map(iteration => iteration.id);
        });

        //find all taskIds where iterationId is in iterationIds
        return await ctx.prisma.task.findMany({
            where: {
                iterationId: {
                    in: iterationIds
                }
            }
        });
    }),


    // 2. Get all the users assigned to a specific project:
    getUsersByProjectId: publicProcedure.input(
        z.object({
            projectId: z.number(),
        })).mutation(async ({ctx, input}) => {
            //find all projectMemberIds where projectId = input.projectId
            const projectMemberIds = await ctx.prisma.projectMember.findMany({
                    where: {
                        projectId: input.projectId
                    }
                }
            ).then(projectMembers => {
                return projectMembers.map(projectMember => projectMember.userId);
            });

            //find all users where userId is in projectMemberIds
            return await ctx.prisma.user.findMany({
                    where: {
                        id: {
                            in: projectMemberIds
                        }
                    }
                }
            );
        }
    ),

    //     3. Get the salary of a specific user:
    getSalaryByUserId: publicProcedure.input(
        z.object({
            userId: z.number(),
        })).mutation(async ({ctx, input}) => {
        return await ctx.prisma.salary.findMany({
            where: {
                userId: input.userId
            }
        });
    }),


    //4. Get all the tasks assigned to a specific user:
    getTasksByUserId: publicProcedure.input(
        z.object({
                userId: z.number(),
            }
        )).mutation(async ({ctx, input}) => {
        return await ctx.prisma.task.findMany({
            where: {
                executorId: input.userId,
            }
        });
    }),


    //5. Get the owner of a specific project:
    getOwnerByProjectId: publicProcedure.input(
        z.object({
            projectId: z.number(),
        })).mutation(async ({ctx, input}) => {
            //get the ownerId of the project
            const project = await ctx.prisma.project.findUnique({
                where: {
                    id: input.projectId
                }
            }
        )
        if (!project) throw new TRPCError({code: 'NOT_FOUND'});
        //get the user with the ownerId
        return await ctx.prisma.user.findUnique({
            where: {
                id: project.ownerId,
            }
            }
        );
    }),

});
