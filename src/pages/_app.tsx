import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import { Provider } from "react-redux";

import { store } from "../redux/redux/store";
import Head from "next/head";

import "~/styles/globals.css";

function Root({
  Component,
  pageProps,
}: AppProps<{ session: Session }>): JSX.Element {
  return (
    <Provider store={store}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* <link href='https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;700&display=swap'
          rel='stylesheet' /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit&family=Roboto&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&family=Kanit&family=Roboto&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Stick&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Saira+Stencil+One&display=swap"
          rel="stylesheet"
        />

        <title>Edgerunner</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />;
      </SessionProvider>
    </Provider>
  );
}

export default api.withTRPC(Root);
