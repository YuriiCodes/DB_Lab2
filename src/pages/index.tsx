import {type NextPage} from "next";

import {Box, Container} from "@mui/material";
import {TablesView} from "~/components/DbTables";

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
                <TablesView />
            </Box>
        </Container>

    );
};

export default Home;
