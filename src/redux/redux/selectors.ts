// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EventDetailsType } from '~/types';
import type { RootState } from './store';

/* eslint-disable */
export const selectEventDetail = (state: RootState): EventDetailsType => state.eventDetail.eventDetail;
export const selectShowEventDetail = (state: RootState): boolean => state.eventDetail.show;

export const selectLoadingText = (state: RootState): string => state.loading.text;
export const selectIsLoading = (state: RootState): boolean => state.loading.loading;

export const selectAccount = (state: RootState): string => state.account.account;