import Head from "next/head";
import {Toaster} from "react-hot-toast";
import React from "react";
import {BottomNavigation, BottomNavigationAction, Box, Container, useTheme} from "@mui/material";
import ResponsiveAppBar from "~/components/ResponsiveAppBar";
import Link from "next/link";
import Typography from "@mui/material/Typography";

interface LayoutProps {
    children: React.ReactNode;

}

const Layout = ({children}: LayoutProps) => {
    const theme = useTheme();
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
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: '2rem',
                height: '5rem',
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
            }}>
                <Link href={"https://github.com/YuriiCodes"}>
                    <Typography >
                           © 2023 Yurii Pidlisnyi
                    </Typography>
                </Link>

            </Box>
        </>
    )
};

export default Layout;