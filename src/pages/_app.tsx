import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from "~/utils/api";
import { Provider } from 'react-redux';

import { store } from '../redux/redux/store';

import "~/styles/globals.css";

function Root ({ Component, pageProps }: AppProps<{ session: Session }>): JSX.Element {
  return <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />;
      </SessionProvider>
    </Provider>
};

export default api.withTRPC(Root);
