import {type NextPage} from "next";

import {Box, Container} from "@mui/material";
import {TasksView} from "~/components/DbTables";
import {SimpleQueriesView} from "~/components/SimpleQueriesView/SimpleQueriesView";

const Home: NextPage = () => {
    return (
        <Container maxWidth={"xl"}>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >

                <TasksView />
            </Box>
        </Container>

    );
};

export default Home;
