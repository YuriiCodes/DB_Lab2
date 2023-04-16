import {api} from "~/utils/api";
import {CircularProgress} from "@mui/material";
import {AppRouter, appRouter} from "~/server/api/root";
import {inferRouterOutputs} from "@trpc/server";


type Data = {
    id: string,
    username: string,
    email: string,
    password: string,
}
export const UsersTable = () => {
    const {data, isLoading, isError} = api.users.getAll.useQuery();
    type RouterOutput = inferRouterOutputs<AppRouter>;
    type User = RouterOutput["users"]["getAll"][0];
    return (
        <div>
            {isLoading && <CircularProgress />}
            {isError && <div>Error</div>}
            {data && (
                <pre>{JSON.stringify(data[0])}</pre>
                )}
        </div>
    )
}
