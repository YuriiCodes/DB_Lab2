import {api} from "~/utils/api";
import {Box, CircularProgress} from "@mui/material";
import UsersCrudTable from "~/components/UsersCrudTable/UsersCrudTable";
import SalaryCrudTable from "~/components/SalaryCrudTable/SalaryCrudTable";
import ProjectsCrudTable from "~/components/ProjectsCrudTable/ProjectsCrudTable";
import IterationCrudTable from "~/components/IterationCrudTable/IterationCrudTableProps";
import TaskCrudTable from "~/components/TaskCrudTable/TaskCrudTable";

// A component that performs data fetching and renders the tables
export const TablesView = () => {
    const {data : usersData, isLoading: isUsersLoading, isError: isUsersError} = api.users.getAll.useQuery();
    const {data: salaryData, isLoading: isSalaryLoading, isError: isSalaryError} = api.salary.getAll.useQuery();
    const {data: projectData, isLoading: isProjectLoading, isError: isProjectError} = api.projects.getAll.useQuery();
    const {data: iterationData, isLoading: isIterationLoading, isError: isIterationError} = api.iteration.getAll.useQuery();
    const {data: taskData, isLoading: isTaskLoading, isError: isTaskError} = api.task.getAll.useQuery();



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


    return (
        <Box>
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
                <h2>Iteration</h2>
                <IterationCrudTable data={iterationData} projects={projectData}/>
            </Box>
            <Box>
                <h2>Tasks</h2>
                <TaskCrudTable data={taskData} iterations={iterationData} users={usersData}/>
            </Box>
        </Box>
    )
}