// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EventDetailsType } from '~/types';
import type { RootState } from './store';

/* eslint-disable */
export const selectEventDetail = (state: RootState): EventDetailsType => state.eventDetail.eventDetail;
export const selectShowEventDetail = (state: RootState): boolean => state.eventDetail.show;
