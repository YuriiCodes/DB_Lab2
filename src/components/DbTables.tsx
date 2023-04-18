import {Box} from "@mui/material";
import UsersCrudTable, {UserType} from "~/components/UsersCrudTable/UsersCrudTable";
import SalaryCrudTable, {SalaryType} from "~/components/SalaryCrudTable/SalaryCrudTable";
import ProjectsCrudTable, {ProjectType} from "~/components/ProjectsCrudTable/ProjectsCrudTable";
import IterationCrudTable, {IterationType} from "~/components/IterationCrudTable/IterationCrudTableProps";
import TaskCrudTable, {TaskType} from "~/components/TaskCrudTable/TaskCrudTable";
import ProjectMemberCrudTable, {ProjectMemberType} from "~/components/ProjectMemberCrudTable/ProjectMemberCrudTable";
import {SimpleQueriesView} from "~/components/SimpleQueriesView/SimpleQueriesView";
import {ComplexQueriesView} from "~/components/ComplexQueriesView/ComplexQueriesView";

// A component that performs data fetching and renders the tables

type TaskViewProps = {
    usersData: UserType[];
    salaryData: SalaryType[];
    projectData: ProjectType[];
    iterationData: IterationType[];
    taskData: TaskType[];
    projectMembersData: ProjectMemberType[];
}
export const TasksView = ({usersData, salaryData, projectData, iterationData, taskData, projectMembersData}: TaskViewProps) => {

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