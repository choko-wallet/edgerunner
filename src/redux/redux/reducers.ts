// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineReducers, Reducer } from '@reduxjs/toolkit';

import eventDetailSlice from '../slices/eventDetail';

export const rootReducer: Reducer = combineReducers({
  eventDetail: eventDetailSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
