import {type NextPage} from "next";

import {Box, Container} from "@mui/material";
import {UsersTable} from "~/components/UsersTable";
import ValidUsersCrudTable from "~/components/UsersCrudTable/ValidUsersCrudTable";

const Home: NextPage = () => {
    // call the trpc client & get all users


    return (
        <Container maxWidth={"xl"}>
            <Box
                sx={{
                    border: "1px solid",
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >

                <UsersTable />
                <ValidUsersCrudTable />
            </Box>
        </Container>

    );
};

export default Home;
