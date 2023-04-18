import {type NextPage} from "next";
import {Box, Button} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
const Home: NextPage = () => {

    return (
        <Box>
        <h1> DB Lab 2</h1>
            <Box sx={
                {
                    width: '30vw',
                }
            }>
                <Image src="/DBDiagram.png" alt="DB diagram" width={1214 / 2} height={1752 / 2} />
            </Box>


            <Link href={"/tables"}>
                <Button>
                    Open Tables & Queries section
                </Button>
            </Link>
        </Box>
    )
};

export default Home;
