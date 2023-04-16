import Head from "next/head";
import styles from "~/pages/index.module.css";
import {Button} from "@mui/material";

interface LayoutProps {
    children: React.ReactNode;

}
const Layout = ({ children }: LayoutProps) => {
  return (
      <>
          <Head>
              <title>Lab 2</title>
              <meta name="description" content="Lab #2 By Pidlisnyi Yurii" />
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <link rel="icon" href="/favicon.ico" />
          </Head>
          <main>
              {children}
          </main>
      </>
  );
};

export default Layout;