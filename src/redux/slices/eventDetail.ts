// Copyright 2021-2022 @choko-wallet/app-redux authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { EventDetailsType } from '~/types';

/**
 * statusSlice is used for controlling model behaviours & Loading behavior
 */

/* eslint-disable sort-keys */

interface EventDisplay {
  eventDetail: EventDetailsType,
  show: boolean,
}

const initialState: EventDisplay = {
  eventDetail: {
    eventName: '',
    eventPrice: 'Free',
    hostList: ["Choko", "Wormhole3"],
    time: (new Date()).toString(),
    
    location: '',
    defaultTweet: '',
  },

  show: false,
};

export const eventDetailsSlice = createSlice({
  initialState,
  name: 'eventDetails',
  reducers: {
    setDetails: (state, action: PayloadAction<EventDetailsType>) => {
      const details = action.payload;
      state.eventDetail = details;
    },
    setShow: (state, action: PayloadAction<boolean>) => {
      const show = action.payload;
      state.show = show
    }
  }
});

export const { setDetails, setShow } = eventDetailsSlice.actions;
export default eventDetailsSlice.reducer;
