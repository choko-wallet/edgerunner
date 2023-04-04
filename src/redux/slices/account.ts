// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventDetailsType } from '~/types';

/**
 * statusSlice is used for controlling model behaviours & Loading behavior
 */

/* eslint-disable sort-keys */


interface AccountState {
    account: string
}

const initialState: AccountState = {
    account: ""
};

export const accountSlice = createSlice({
  initialState,
  name: 'loading',
  reducers: {
    loadAccount: (state) => {
        const maybeAddr = localStorage.getItem("address");
        state.account = maybeAddr ? maybeAddr : "";
    },
    setAccount: (state, action: PayloadAction<string>) => {
      const addr = action.payload;

      localStorage.setItem("address", addr);

      state.account = addr;
    }
  }
});

export const { loadAccount, setAccount } = accountSlice.actions;
export default accountSlice.reducer;
