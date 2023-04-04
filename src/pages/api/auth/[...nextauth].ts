// Copyright 2021-2022 @choko-wallet/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* tslint:disable */
/* eslint-disable */

import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    // @ts-ignore
    session({ session, token, user }) {
      session.user.provider = token.provider;
      return session;
    },

    // @ts-ignore
    jwt({ token, user, account, profile }) {
      console.log(token, user, account, profile)
      if (user && account && account.provider) {
        token = {
          ...token,
          provider: account.provider,
        };
      }
      return token;
    },
  },
};

// @ts-ignore
export default NextAuth(authOptions);
