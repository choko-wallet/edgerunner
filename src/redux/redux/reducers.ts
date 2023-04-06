// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineReducers, Reducer } from '@reduxjs/toolkit';

import eventDetailSlice from '../slices/eventDetail';
import loadingSlice from '../slices/loading';
import accountSlice from '../slices/account';

export const rootReducer: Reducer = combineReducers({
  eventDetail: eventDetailSlice,
  loading: loadingSlice,
  account: accountSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
