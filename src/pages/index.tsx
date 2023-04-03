import { type NextPage } from "next";
import Head from "next/head";

import { TopNav } from "~/components/TopNav";
import { BottomNav } from "~/components/BottomNav";
import { Promotion } from "~/components/Promotion";
import { Event } from "~/components/Event";

// import { api } from "~/utils/api";
import BaseModal from "~/components/BaseModal";
import { Dialog, Tab, Transition } from "@headlessui/react";

import { XIcon} from '@heroicons/react/outline'

import { useDispatch, useSelector } from "react-redux";
import { selectEventDetail, selectShowEventDetail } from "~/redux/redux/selectors";
import { setShow } from "~/redux/slices/eventDetail";
import { Fragment, useState } from "react";
import { Ranking } from "~/components/Ranking";
import { Profile } from "~/components/Profile";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface BottomIconProps {
  pageSelected: string
}
const BottomIcon = ({ pageSelected }: BottomIconProps): JSX.Element => {
  switch(pageSelected) {
    case "Home":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-red-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>

    case "Ranking":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-red-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>

    case "Profile":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-red-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>

    default:
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-red-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  }
}

const RightIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const dispatch = useDispatch();

  const showEventDetails = useSelector(selectShowEventDetail);
  const eventDetails = useSelector(selectEventDetail);

  const [category, setCategory] = useState("Events");
  const [page, setPage] = useState("Home");
  const [rangeValue, setRangeValue] = useState(0);

  const eventList = [{
    eventName: "HK 2023",
    eventPrice: "Free",
    hostList: ["Choko Wallet", "Wormhole3"],
    time: "2023-04-03T06:18:27.925Z",
  }, {
    eventName: "HK 2023",
    eventPrice: "Free",
    hostList: ["Choko Wallet", "Wormhole3"],
    time: "2023-04-03T06:18:27.925Z",
  }, {
    eventName: "HK 2023",
    eventPrice: "Free",
    hostList: ["Choko Wallet", "Wormhole3"],
    time: "2023-04-03T06:18:27.925Z",
  }, {
    eventName: "HK 2023",
    eventPrice: "Free",
    hostList: ["Choko Wallet", "Wormhole3"],
    time: "2023-04-03T06:18:27.925Z",
  }, {
    eventName: "HK 2023",
    eventPrice: "Free",
    hostList: ["Choko Wallet", "Wormhole3"],
    time: "2023-04-03T06:18:27.925Z",
  },{
    eventName: "HK 2023",
    eventPrice: "Free",
    hostList: ["Choko Wallet", "Wormhole3"],
    time: "2023-04-03T06:18:27.925Z",
  },{
    eventName: "HK 2023",
    eventPrice: "Free",
    hostList: ["Choko Wallet", "Wormhole3"],
    time: "2023-04-03T06:18:27.925Z",
  },{
    eventName: "HK 2023",
    eventPrice: "Free",
    hostList: ["Choko Wallet", "Wormhole3"],
    time: "2023-04-03T06:18:27.925Z",
  }]

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="sticky top-0 z-50 backdrop-blur-md backdrop-grayscale-[.5]" >
        <TopNav />
      </div>

      {/* Events */}
      <Transition
        as={Fragment}
        show={page === "Home"}
        enter="transform transition duration-[400ms]"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 rotate-0 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 rotate-0 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
        {/* Main List */}
        <main className="flex min-h-screen pb-20 flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {/* Promotion */}
          <div className="w-full p-2">
            <Promotion />
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-2 w-full">
              {
                ["Events", "Meetups"].map(categories => (
                  <Tab
                    key={categories}
                    onClick={() => setCategory(categories)}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-slate-200',
                        selected
                          ? 'bg-slate-700 shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                      )
                    }
                  >
                    {categories}
                  </Tab>
                ))
              }
            </Tab.List>
          </Tab.Group>

          <Transition
            as={Fragment}
            show={category === "Events"}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 rotate-0 scale-100 "
            leaveTo="opacity-0 scale-95 "
          >
            <div className="w-full">
              {eventList.map((evt, index) => {
                  return <Event 
                    key={index}
                    eventName={evt.eventName}
                    eventPrice={evt.eventPrice}
                    hostList={evt.hostList}
                    time={evt.time} 
                    location={""} 
                    defaultTweet={""}                  
                  />
                }
              )}
            </div>
          </Transition>

          <Transition
            as={Fragment}
            show={category === "Meetups"}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 rotate-0 scale-100 "
            leaveTo="opacity-0 scale-95 "
          >
            <div className="w-full">
              {eventList.map((evt, index) => {
                  return <Event 
                    key={index}
                    eventName={evt.eventName}
                    eventPrice={evt.eventPrice}
                    hostList={evt.hostList}
                    time={evt.time} location={""} defaultTweet={""}                  />
                }
              )}
            </div>
          </Transition>
        </main>
      </Transition>

      {/* Ranking */}
      <Transition
        as={Fragment}
        show={page === "Ranking"}
        enter="transform transition duration-[200ms]"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 rotate-0 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 rotate-0 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
        <main className="flex pt-3 h-screen justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <Ranking />
        </main>
      </Transition>

      {/* Profile */}
      <Transition
        as={Fragment}
        show={page === "Profile"}
        enter="transform transition duration-[200ms]"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 rotate-0 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 rotate-0 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
        <main className="flex pt-3 h-screen justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <Profile />
        </main>
      </Transition>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 ">
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium hover:backdrop-blur-lg backdrop-blur-md hover:ease-in-out backdrop-grayscale-[.5]">
            {["Home", "Ranking", "Profile"].map(pageSelect => {
              return <button type="button" className="inline-flex flex-col items-center justify-center px-5 border-r-1 border-gray-200 group"
                onClick={() => setPage(pageSelect)}  
              >
                  <BottomIcon pageSelected={pageSelect} />
                  <span className="text-sm text-slate-300 group-hover:text-red-400">{pageSelect}</span>
              </button>
            })}
        </div>
      </div>

      <BaseModal show={showEventDetails} >
          <Dialog.Panel className='fixed bottom-0 left-0 z-50 w-full h-80 rounded-t-2xl bg-gray-400'>
            <Dialog.Title
              as='h3'
              className='text-lg font-medium leading-6 flex items-center bg-gray-500 rounded-t-2xl h-16 p-5'
            >
              <p className=' text-slate-200 dark:text-white flex flex-grow font-poppins'>
                {eventDetails.eventName}
              </p>
              <div onClick={() => dispatch(setShow(false))} >
                <XIcon className=' text-gray-200 h-6 w-6 cursor-pointer dark:text-white' />
              </div>
            </Dialog.Title>

            <div className=' p-2 bg-gray-400 grid grid-cols-12 w-full h-64 flex content-center'>
                <div className="bg-red col-span-7 w-full h-full">
                  Location: 
                </div>
                <div className="bg-red col-span-5">
                  <div className="text-sm text-gray-600 p-2">Check In on Twitter</div>
                  <button 
                    type="button" 
                    className="text-slate-200 bg-gray-500 font-small rounded-full text-lg px-5 py-2.5 text-center backdrop-blue-sm"
                  >
                    <RightIcon />
                  </button>
                </div>

            </div>
          </Dialog.Panel>
        </BaseModal>
    </div>
  );
};

export default Home;
