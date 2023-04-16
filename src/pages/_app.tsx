import {type AppType} from "next/app";

import {api} from "~/utils/api";

import "~/styles/globals.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Layout from "~/components/Layout";
import {CssBaseline} from "@mui/material";

const MyApp: AppType = ({Component, pageProps}) => {
    return (
        <Layout>
            <CssBaseline />
            <Component {...pageProps} />;
        </Layout>
    );
};

export default api.withTRPC(MyApp);
