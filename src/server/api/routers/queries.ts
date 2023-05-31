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

            //     3. Get the salary of a specific user: {is}
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

            // 1. Find users involved in all available projects.
            getUsersInAllProjects: publicProcedure.mutation(async ({ctx}) => {
                // Знайдіть всі проекти
                const allProjectIds = await ctx.prisma.project.findMany().then(projects => projects.map(project => project.id));

                // Знайдіть користувачів, які є учасниками усіх проектів
                return await ctx.prisma.user.findMany({
                    where: {
                        projectMembers: {
                            every: {
                                projectId: {
                                    in: allProjectIds
                                }
                            }
                        }
                    }
                });
            }),


            // 2. Find the username of users who work on the same projects as the user with the given email.
            getUsersInSameProjectsByEmail: publicProcedure.input(
                z.object({
                    email: z.string(),
                })).mutation(async ({ctx, input}) => {
                // Знайдіть проекти користувача за email
                const userProjects = await ctx.prisma.projectMember.findMany({
                    where: {
                        user: {
                            email: input.email
                        }
                    }
                }).then(members => members.map(member => member.projectId));

                // Знайдіть користувачів, які є учасниками цих проектів
                return await ctx.prisma.user.findMany({
                    where: {
                        projectMembers: {
                            some: {
                                projectId: {
                                    in: userProjects
                                }
                            }
                        }
                    }
                });
            }),

            // 3. Знайти назви проектів, кожен працівник з яких отримує заробітню плату >=, що й розробник із заданим email.
            getProjectsBySalary: publicProcedure.input(
                z.object({
                    email: z.string(),
                })).mutation(async ({ctx, input}) => {
                // Знайдіть користувача за email
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        email: input.email
                    }
                });

                if (!user) {
                    throw new Error('User not found');
                }

                // Знайдіть зарплату користувача за userId
                const userSalary = await ctx.prisma.salary.findUnique({
                    where: {
                        userId: user.id
                    }
                }).then(salary => salary ? salary.amount : null);

                if (!userSalary) {
                    throw new Error('Salary not found');
                }

                // Знайдіть проекти, в яких кожен працівник отримує зарплату >= користувача
                const projectIds = await ctx.prisma.projectMember.findMany({
                    where: {
                        user: {
                            salary: {
                                amount: {
                                    gte: userSalary
                                }
                            }
                        }
                    }
                }).then(members => members.map(member => member.projectId));

                return await ctx.prisma.project.findMany({
                    where: {
                        id: {
                            in: projectIds
                        }
                    }
                });
            }),


            // 4 Знайти всіх користувачів, які не беруть участь в жодному з проектів користувача з вказаним username
            getUsersNotInUserProjects: publicProcedure.input(
                z.object({
                    username: z.string(),
                })).mutation(async ({ctx, input}) => {
                // Знайдіть проекти користувача за username
                const userProjects = await ctx.prisma.projectMember.findMany({
                    where: {
                        user: {
                            username: input.username
                        }
                    }
                }).then(members => members.map(member => member.projectId));

                // Знайдіть користувачів, які не є учасниками цих проектів
                return await ctx.prisma.user.findMany({
                    where: {
                        projectMembers: {
                            none: {
                                projectId: {
                                    in: userProjects
                                }
                            }
                        }
                    }
                });
            }),




            // Знайти назву ітерації, яка має таку  ж множину задач, як і ітерація {iteration.name}
            getIterationsWithSameTasks: publicProcedure.input(
                z.object({
                    iterationName: z.string(),
                })).mutation(async ({ctx, input}) => {
                // Знайдіть набір задач для даної ітерації
                const targetIterationTasks = await ctx.prisma.task.findMany({
                    where: {
                        iteration: {
                            name: input.iterationName
                        }
                    },
                    select: {
                        id: true,
                    }
                }).then(tasks => tasks.map(task => task.id));

                // Знайдіть усі ітерації
                const allIterations = await ctx.prisma.iteration.findMany({
                    include: {
                        tasks: true,
                    }
                });

                // Виберіть ті ітерації, задачі яких співпадають із задачами цільової ітерації
                const matchingIterations = allIterations.filter(iteration => {
                    const taskIds = iteration.tasks.map(task => task.id);
                    return JSON.stringify(taskIds.sort()) === JSON.stringify(targetIterationTasks.sort());
                });

                return matchingIterations.map(iteration => iteration.name);
            }),


        }
    )
;
