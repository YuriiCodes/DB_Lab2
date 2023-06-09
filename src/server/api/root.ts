import {createTRPCRouter} from "~/server/api/trpc";
import {userRouter} from "~/server/api/routers/users";
import {salaryRouter} from "~/server/api/routers/salary";
import {projectRouter} from "~/server/api/routers/project";
import {iterationRouter} from "~/server/api/routers/iteration";
import {taskRouter} from "~/server/api/routers/task";
import {projectMemberRouter} from "~/server/api/routers/projectmember";
import {queriesRouter} from "~/server/api/routers/queries";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    users: userRouter,
    salary: salaryRouter,
    projects: projectRouter,
    iteration: iterationRouter,
    task: taskRouter,
    projectMember: projectMemberRouter,
    queries: queriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
