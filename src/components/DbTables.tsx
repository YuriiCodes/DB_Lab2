import {api} from "~/utils/api";
import {Box, CircularProgress} from "@mui/material";
import UsersCrudTable from "~/components/UsersCrudTable/UsersCrudTable";
import SalaryCrudTable from "~/components/SalaryCrudTable/SalaryCrudTable";

// A component that performs data fetching and renders the tables
export const TablesView = () => {
    const {data : usersData, isLoading: isUsersLoading, isError: isUsersError} = api.users.getAll.useQuery();
    const {data: salaryData, isLoading: isSalaryLoading, isError: isSalaryError} = api.salary.getAll.useQuery();



    if (isUsersLoading) return <CircularProgress />;
    if (isUsersError) return <div>Error fetching users</div>;


    if (isSalaryLoading) return <CircularProgress />;
    if (isSalaryError) return <div>Error fetching salaries</div>;

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
        </Box>
    )
}