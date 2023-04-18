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

//     COMPLEX QUERIES:
//     1. Find all users who have a salary greater than a specific amount, and who are assigned to at least one task with a status of "done":
            getUsersBySalaryAndTaskStatus: publicProcedure.input(
                z.object({
                        salary: z.number(),
                    }
                )).mutation(async ({ctx, input}) => {
                    return await ctx.prisma.user.findMany({
                        where: {
                            salary: {
                                amount: {
                                    gt: input.salary,
                                }
                            },
                            assignedTasks: {
                                some: {
                                    status: "DONE"
                                }
                            }
                        }
                    });
                }
            ),


//     2. Find all projects that have more than a specific number of iterations,
//     and that have at least one user assigned to them:
            getProjectsByIterationsAndUsers: publicProcedure.input(
                z.object({
                        iterationsNumber: z.number(),
                    }
                )).mutation(async ({ctx, input}) => {
                const projectsIds = await ctx.prisma.project.findMany().then(projects => {
                    return projects.map(project => project.id)
                });

                const iterations = await ctx.prisma.iteration.findMany();

                const projectsIdsWithMoreThanIterationsNumber = projectsIds.filter(projectId => {
                        return iterations.filter(iteration => iteration.projectId === projectId).length > input.iterationsNumber;
                    }
                );

                // find all projects with at least one user assigned to them
                const projectMembers = await ctx.prisma.projectMember.findMany();

                const projectsIdsWithUsers = projectMembers.map(projectMember => projectMember.projectId);

                // return the intersection of the two arrays
                const projectsIdsWithMoreThanIterationsNumberAndUsers = projectsIdsWithMoreThanIterationsNumber.filter(projectId => projectsIdsWithUsers.includes(projectId));

                return await ctx.prisma.project.findMany({

                    where: {
                        id: {
                            in: projectsIdsWithMoreThanIterationsNumberAndUsers
                        }
                    }
                });
            }),

            //  3. Find all users who are assigned to at least one task with a status of {firstInput},
            // and who are also assigned to at least one task with a status of {secondInput}:
            getUsersByTasksStatus: publicProcedure.input(
                z.object({
                    firstStatus: z.string(),
                    secondStatus: z.string(),
                })
            ).mutation(async ({ctx, input}) => {
                //find all tasks with status = firstStatus
                const firstStatusTasks = await ctx.prisma.task.findMany({
                        where: {
                            status: input.firstStatus

                        }
                    }
                );

                //find all tasks with status = secondStatus
                const secondStatusTasks = await ctx.prisma.task.findMany({
                        where: {
                            status: input.secondStatus
                        }

                    }
                );


                //find all userIds from firstStatusTasks
                const firstStatusTasksUserIds = firstStatusTasks.map(task => task.executorId);

                //find all userIds from secondStatusTasks
                const secondStatusTasksUserIds = secondStatusTasks.map(task => task.executorId);

                //find the intersection of the two arrays
                const userIds = firstStatusTasksUserIds.filter(userId => secondStatusTasksUserIds.includes(userId));

                //make sure  userIds are number[], and not (number | null)[]:
                const userIdsNumber = userIds.map(userId => userId as number);

                //find all users with userIds
                return await ctx.prisma.user.findMany({
                        where: {
                            id: {
                                in: userIdsNumber
                            }
                        }

                    }
                );

            }),

            // 4. Find all projects that have {input} users assigned to them, and where some task points
            // is greater than {input}:
            getProjectsByUsersAndTasksPoints: publicProcedure.input(
                z.object({
                        usersNumber: z.number(),
                        tasksPoints: z.number(),
                    }
                )).mutation(async ({ctx, input}) => {
                    //find projects with usersNumber users assigned to them
                    const projectMembers = await ctx.prisma.projectMember.findMany()

                    // find all projectIds with input.usersNumber users assigned to them
                    const projectsIdsWithUsersNumberUsers = projectMembers.filter(projectMember => {
                            return projectMembers.filter(pm => pm.projectId === projectMember.projectId).length === input.usersNumber;
                        }
                    ).map(projectMember => projectMember.projectId);

                    //make sure projectsIdsWithUsersNumberUsers has only unique values
                    const projectsWithUsers = projectsIdsWithUsersNumberUsers.filter((projectId, index) => projectsIdsWithUsersNumberUsers.indexOf(projectId) === index);


                    //find all the iterations of the projects
                    const iterations = await ctx.prisma.iteration.findMany({
                        where: {
                            projectId: {
                                in: projectsWithUsers
                            },
                            tasks: {
                                some: {
                                    points: {
                                        gt: input.tasksPoints
                                    }
                                }
                            }
                        }
                    });
                    // get the projectIds of the iterations
                    const projectsIds = iterations.map(iteration => iteration.projectId);
                    return await ctx.prisma.project.findMany({
                        where: {
                            id: {
                                in: projectsIds
                            }
                        }
                    });
                }
            ),

        }
    )
;
