// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Event } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventDetailsType } from '~/types';

/**
 * statusSlice is used for controlling model behaviours & Loading behavior
 */

/* eslint-disable sort-keys */

interface EventDisplay {
  eventDetail: Event,
}

const initialState: EventDisplay = {
  eventDetail: {
    id: "",
    startTime: new Date(),
    endTime: new Date(),
    eventName: "",
    hostList: "",
    locationText: "",
    locationGoogle: "",
    tweet: "",
    hashTag: "",
    isMeetup: false,
    cohostList: "",
  },
};

export const eventDetailsSlice = createSlice({
  initialState,
  name: 'eventDetails',
  reducers: {
    setDetails: (state, action: PayloadAction<Event>) => {
      const details = action.payload;
      state.eventDetail = details;
    },
  }
});

export const { setDetails } = eventDetailsSlice.actions;
export default eventDetailsSlice.reducer;
