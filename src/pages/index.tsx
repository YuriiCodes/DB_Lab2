import {type NextPage} from "next";

import {Box, Button, Container} from "@mui/material";
import {UsersTable} from "~/components/UsersTable";

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
            </Box>
        </Container>

    );
};

export default Home;
