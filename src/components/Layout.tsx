import Head from "next/head";
import {Toaster} from "react-hot-toast";
import React from "react";
import {Box, Container} from "@mui/material";
import ResponsiveAppBar from "~/components/ResponsiveAppBar";

interface LayoutProps {
    children: React.ReactNode;

}

const Layout = ({children}: LayoutProps) => {
    return (
        <>
            <Head>
                <title>Lab 2</title>
                <meta name="description" content="Lab #2 By Pidlisnyi Yurii"/>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <ResponsiveAppBar />
            <main>
                <Toaster
                    position="bottom-center"
                    reverseOrder={false}
                />
                <Container maxWidth={"xl"}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {children}
                    </Box>
                </Container>
            </main>
        </>
    )
};

export default Layout;