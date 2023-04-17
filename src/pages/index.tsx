import {type NextPage} from "next";

import {Box, CircularProgress, Container} from "@mui/material";
import UsersCrudTable from "~/components/UsersCrudTable/UsersCrudTable";
import SalaryCrudTable from "~/components/SalaryCrudTable/SalaryCrudTable";
import {api} from "~/utils/api";
import {TablesView} from "~/components/DbTables";

const Home: NextPage = () => {
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
                <TablesView />
            </Box>
        </Container>

    );
};

export default Home;
