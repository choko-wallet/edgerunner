// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventDetailsType } from '~/types';

/**
 * statusSlice is used for controlling model behaviours & Loading behavior
 */

/* eslint-disable sort-keys */


interface LoadingState {
    text: string;
    loading: boolean;
}

const initialState: LoadingState = {
    text: "",
    loading: false
};

export const loadingSlice = createSlice({
  initialState,
  name: 'loading',
  reducers: {
    setLoading: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
      state.loading = true;
    },
    cancelLoading: (state) => {
      state.text = ""
      state.loading = false
    }
  }
});

export const { setLoading, cancelLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
