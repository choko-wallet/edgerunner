import dayjs from 'dayjs'
import React from 'react'

import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useDispatch } from 'react-redux';
import { setDetails } from '~/redux/slices/eventDetail';
import { Event } from '@prisma/client';

interface HostProps {
  hostName: string
}
const HostDisplay = ({hostName}: HostProps) => {
  return <span>{`${hostName} ｜ `}</span>
}

interface Props {
  eventDetail: Event,
  showDetails: () => void
}

export const EventDisplay = ({eventDetail, showDetails}: Props): JSX.Element => {

  dayjs.extend(relativeTime)
  dayjs.extend(utc)
  dayjs.extend(timezone)


  const dispatch = useDispatch();
  const {eventName, hostList, startTime, endTime} = eventDetail;

  // current date
  const currentDate = new Date().getUTCDate();
  if (startTime.getUTCDate() < currentDate) {
    return <></>;
  }

  return <div className='flex w-full py-1 px-2'>
    <div className="w-full border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700 h-54 p-4">
      
      <div className="grid grid-col-12">
        <h5 className="mb-1 text-xl font-medium text-slate-200">{eventName}</h5>
        <h5 className="mb-1 text-sm font-medium text-slate-200">{`Happening ${dayjs(startTime).tz("utc").fromNow()}`}</h5>
        <h5 className="mb-1 text-sm font-medium text-slate-400">
          <span className='text-slate-400'>{dayjs(startTime).tz('UTC').format("MMM DD - HH:mm")}</span>
          <span className='text-slate-300'>{`  to `}</span>
          <span className='text-slate-400'>{dayjs(endTime).tz('UTC').format("HH:mm")}</span>
        </h5>
        <div className="text-sm text-slate-200"><span className='text-slate-400'>Hosted By: </span>{hostList.split(",").map((name, index) => <HostDisplay key={`Host${index}`} hostName={name} />)} </div>
        <div className="flex mt-4 space-x-3 md:mt-6">
          <a
            onClick={() => {
              dispatch(setDetails(eventDetail))
              showDetails()
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-slate-200 rounded-lg hover:bg-indigo-700 bg-blue-500">
            Learn More
          </a>
        </div>
      </div>

    </div>
  </div>
}