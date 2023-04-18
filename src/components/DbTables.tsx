import {api} from "~/utils/api";
import {Box, CircularProgress} from "@mui/material";
import UsersCrudTable from "~/components/UsersCrudTable/UsersCrudTable";
import SalaryCrudTable from "~/components/SalaryCrudTable/SalaryCrudTable";
import ProjectsCrudTable from "~/components/ProjectsCrudTable/ProjectsCrudTable";
import IterationCrudTable from "~/components/IterationCrudTable/IterationCrudTableProps";
import TaskCrudTable from "~/components/TaskCrudTable/TaskCrudTable";
import ProjectMemberCrudTable from "~/components/ProjectMemberCrudTable/ProjectMemberCrudTable";
import {SimpleQueriesView} from "~/components/SimpleQueriesView/SimpleQueriesView";
import {ComplexQueriesView} from "~/components/ComplexQueriesView/ComplexQueriesView";

// A component that performs data fetching and renders the tables
export const TasksView = () => {
    const {data : usersData, isLoading: isUsersLoading, isError: isUsersError} = api.users.getAll.useQuery();
    const {data: salaryData, isLoading: isSalaryLoading, isError: isSalaryError} = api.salary.getAll.useQuery();
    const {data: projectData, isLoading: isProjectLoading, isError: isProjectError} = api.projects.getAll.useQuery();
    const {data: iterationData, isLoading: isIterationLoading, isError: isIterationError} = api.iteration.getAll.useQuery();
    const {data: taskData, isLoading: isTaskLoading, isError: isTaskError} = api.task.getAll.useQuery();
    const {data: projectMembersData, isLoading: isProjectMembersLoading, isError: isProjectMembersError} = api.projectMember.getAll.useQuery();



    if (isUsersLoading) return <CircularProgress />;
    if (isUsersError) return <div>Error fetching users</div>;


    if (isSalaryLoading) return <CircularProgress />;
    if (isSalaryError) return <div>Error fetching salaries</div>;

    if (isProjectLoading) return <CircularProgress />;
    if (isProjectError) return <div>Error fetching projects</div>;

    if (isIterationLoading) return <CircularProgress />;
    if (isIterationError) return <div>Error fetching iterations</div>;

    if (isTaskLoading) return <CircularProgress />;
    if (isTaskError) return <div>Error fetching tasks</div>;

    if (isProjectMembersLoading) return <CircularProgress />;
    if (isProjectMembersError) return <div>Error fetching project members</div>;


    return (
        <Box>
            <h1>Database View</h1>
            <Box>
                <h2>Users</h2>
                <UsersCrudTable data={usersData}/>
            </Box>
            <Box>
                <h2>Salaries</h2>
                <SalaryCrudTable data={salaryData} users={usersData}/>
            </Box>
            <Box>
                <h2>Projects</h2>
                <ProjectsCrudTable data={projectData} users={usersData}/>
            </Box>
            <Box>
                <h2>Project members</h2>
                <ProjectMemberCrudTable data={projectMembersData} users={usersData} projects={projectData}/>
            </Box>
            <Box>
                <h2>Iteration</h2>
                <IterationCrudTable data={iterationData} projects={projectData}/>
            </Box>
            <Box>
                <h2>Tasks</h2>
                <TaskCrudTable data={taskData} iterations={iterationData} users={usersData}/>
            </Box>

            <h1>Queries</h1>
            <Box>
                <h2>Simple Queries</h2>
                <SimpleQueriesView users={usersData}
                                   salary={salaryData}
                                   projects={projectData}
                />
            </Box>

            <Box>
            <h2>Complex queries</h2>
                <ComplexQueriesView/>
            </Box>
        </Box>
    )
}