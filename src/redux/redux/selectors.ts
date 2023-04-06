// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Event } from '@prisma/client';
import type { RootState } from './store';

/* eslint-disable */
export const selectEventDetail = (state: RootState): Event => state.eventDetail.eventDetail;
export const selectLoadingText = (state: RootState): string => state.loading.text;
export const selectIsLoading = (state: RootState): boolean => state.loading.loading;

export const selectAccount = (state: RootState): string => state.account.account;
