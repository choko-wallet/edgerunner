import dayjs from 'dayjs'
import React from 'react'

import relativeTime from 'dayjs/plugin/relativeTime';
import { useDispatch } from 'react-redux';
import { setDetails, setShow } from '~/redux/slices/eventDetail';
import { EventDetailsType } from '~/types';

interface Props {
  eventName: string,
  eventPrice: string,
  hostList: string[],
  time: string
}

interface HostProps {
  hostName: string
}
const HostDisplay = ({hostName}: HostProps) => {
  return <span>{`${hostName} ｜ `}</span>
}

export const Event = (eventDetail: EventDetailsType): JSX.Element => {

  dayjs.extend(relativeTime)
  const dispatch = useDispatch();
  const {eventName, eventPrice, hostList, time} = eventDetail;

  return <div className='flex w-full py-1 px-2'>
    <div className="w-full border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700 h-48 p-4">
      <div className="flex flex-col items-start grid grid-col-12">
        <h5 className="mb-1 text-xl font-medium text-slate-200">{eventName}</h5>
        <h5 className="mb-1 text-sm font-medium text-slate-200">{`Time To Go: ${dayjs(time).fromNow()}`}</h5>
        <h5 className="mb-1 text-sm font-medium text-slate-400">{`${eventPrice} | `}<span className='text-white'>{dayjs(time).format("DD/MM/YYYY - HH:MM")}</span></h5>
        <div className="text-sm text-slate-200"><span className='text-slate-400'>Hosted By: </span>{hostList.map(name => <HostDisplay hostName={name} />)} </div>
        <div className="flex mt-4 space-x-3 md:mt-6">
          <a
            onClick={() => {
              dispatch(setDetails(eventDetail))
              dispatch(setShow(true))
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-slate-200 rounded-lg hover:bg-indigo-700 bg-blue-500">
            Learn More
          </a>
        </div>
      </div>
    </div>
  </div>
}