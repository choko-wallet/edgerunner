import { NextPageContext, type NextPage } from "next";
import Head from "next/head";

import { TopNav } from "~/components/TopNav";
import { Promotion } from "~/components/Promotion";
import { EventDisplay } from "~/components/Event";

import { api } from "~/utils/api";
import BaseModal from "~/components/BaseModal";
import { Dialog, Tab, Transition } from "@headlessui/react";

import { secureGenerateRandomKey, AsymmetricEncryption } from '@skyekiwi/crypto';
import { confirmOAuthProofOfOwnership, preimageOAuthProofOfOwnership,
  validateOAuthProofOfOwnership } from '@choko-wallet/auth-client';
import superagent from 'superagent';

import {  XIcon} from '@heroicons/react/outline'

import { useDispatch, useSelector } from "react-redux";
import { selectAccount, selectEventDetail, selectIsLoading } from "~/redux/redux/selectors";
import { Fragment, useEffect, useState } from "react";
import { Ranking } from "~/components/Ranking";

import { Profile } from "~/components/Profile";
import { ProfileLogin } from "~/components/ProfileLogin";
import { ProfileEnter } from "~/components/ProfileEnter";

import Loading from "~/components/Loading";
import { cancelLoading, setLoading } from "~/redux/slices/loading";
import { signOut, useSession } from "next-auth/react";
import { certificateToAuthHeader, mpcLocalKeyToAccount, runKeygenRequest, runKeyRefreshRequest } from "~/mpc";
import { loadAccount, setAccount } from "~/redux/slices/account";
import { hexToU8a, stringToU8a, u8aToHex } from "@skyekiwi/util";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface BottomIconProps {
  pageSelected: string
}
const BottomIcon = ({ pageSelected }: BottomIconProps): JSX.Element => {
  switch(pageSelected) {
    case "Home":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-rose-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 16.75a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H6.75Z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.976c-.671 0-1.263.221-1.879.574-.59.337-1.262.833-2.089 1.442l-3.677 2.71c-1.06.78-1.798 1.322-2.202 2.123-.404.8-.404 1.716-.403 3.033v3.697c0 1.367 0 2.47.117 3.337.12.9.38 1.658.981 2.26.602.602 1.36.86 2.26.982.867.116 1.97.116 3.337.116h7.11c1.367 0 2.47 0 3.337-.116.9-.122 1.658-.38 2.26-.982.602-.602.86-1.36.982-2.26.116-.867.116-1.97.116-3.337v-3.697c0-1.317.001-2.233-.403-3.033-.404-.8-1.142-1.343-2.203-2.124l-3.676-2.709c-.827-.61-1.5-1.105-2.09-1.442-.615-.353-1.207-.574-1.878-.574Zm-3.114 3.25c.872-.642 1.475-1.085 1.98-1.375.49-.28.82-.375 1.134-.375.315 0 .645.096 1.133.375.506.29 1.11.733 1.981 1.375l3.5 2.58c1.259.927 1.671 1.254 1.894 1.695.223.441.242.967.242 2.53V15.5c0 1.435-.002 2.436-.103 3.192-.099.734-.28 1.122-.556 1.399-.277.277-.665.457-1.4.556-.755.101-1.756.103-3.191.103h-7c-1.435 0-2.437-.002-3.192-.103-.734-.099-1.122-.28-1.399-.556-.277-.277-.457-.665-.556-1.4-.101-.755-.103-1.756-.103-3.191v-3.468c0-1.564.019-2.09.242-2.53.223-.442.635-.77 1.894-1.697l3.5-2.579Z"></path>
      </svg>

    case "Ranking":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-rose-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>

    case "Profile":
      return <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 32 32" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-rose-300">
        <path d="M16 14.41553c3.83691 0 6.95801-3.12109 6.95801-6.95752S19.83691.5 16 .5 9.04199 3.62158 9.04199 7.45801 12.16309 14.41553 16 14.41553zM16 3.5c2.18262 0 3.95801 1.77539 3.95801 3.95801 0 2.18213-1.77539 3.95752-3.95801 3.95752s-3.95801-1.77539-3.95801-3.95752C12.04199 5.27539 13.81738 3.5 16 3.5zM23.75879 16.59961H8.24121c-4.1084 0-7.4502 3.34229-7.4502 7.4502S4.13281 31.5 8.24121 31.5h15.51758c4.1084 0 7.4502-3.34229 7.4502-7.4502S27.86719 16.59961 23.75879 16.59961zM23.75879 28.5H8.24121c-2.4541 0-4.4502-1.99658-4.4502-4.4502s1.99609-4.4502 4.4502-4.4502h15.51758c2.4541 0 4.4502 1.99658 4.4502 4.4502S26.21289 28.5 23.75879 28.5z"></path></svg>

    default:
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-rose-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  }
}

const PlusIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>


interface Props {
  token: string;
}

const generateOrRefreshAccount = async (
  userCredential: string, token: string,
): Promise<string> => {
  // 0. we always try to fetch both cert & other setups
  const cert = await validateOAuthProofOfOwnership("twitter", userCredential, token);

  const authHeader = certificateToAuthHeader(cert, cert);
  const jobId = secureGenerateRandomKey();

  // 1. try to see if we have an account or not
  if (
    await preimageOAuthProofOfOwnership("twitter", userCredential)
  ) {
    console.log('Doing Key Refresh');
    // the user already exists
    // we do a key refresh and disable the old key
    const key = await runKeyRefreshRequest(jobId, authHeader);

    if (key.indexOf('Node Returns Error') !== -1) {
      throw new Error(key);
    }

    return key;
  } else {
    console.log('Doing Key Gen');
    // new account - we do a key generation
    const key = await runKeygenRequest(jobId, authHeader);

    if (key.indexOf('Node Returns Error') !== -1) {
      throw new Error(key);
    }

    await confirmOAuthProofOfOwnership("twitter", userCredential, token);
    return key;
  }
};


const Home: NextPage<Props> = ({ token }: Props) => {
  const result = api.events.getAll.useQuery();
  const {data: session} = useSession()

  const dispatch = useDispatch();

  const eventDetails = useSelector(selectEventDetail);
  const isLoading = useSelector(selectIsLoading);
  const userAddr = useSelector(selectAccount);

  const [category, setCategory] = useState("Events");
  const [page, setPage] = useState("Home");

  const [openDetails, setOpenDetails] = useState(false);
  const [allEvents, setAllEvents] = useState([]);

  const enterChoko = async () => {
    if (result.isLoading) alert("loading ..")

    dispatch(setLoading('Setting up an MPC Account ... '));
    try {
      if (!session || !session.user || !session.user.email) {
        console.error("unexpected");
        throw new Error("unexpected");
      }
      const key = await generateOrRefreshAccount(session.user.email, token);

      const userAccount = mpcLocalKeyToAccount(key);
      const addr = await userAccount.getAAWwalletAddress();

      await superagent
        .post('https://alpha-api.wormhole3.io/hongkong/register')
        .send({
          msg: u8aToHex(AsymmetricEncryption.encrypt(
            stringToU8a(JSON.stringify({
              address: addr,
              twitterId: session.user.email
            })), hexToU8a("698e08578460234c209fcc55e09427aec6f82cb606e52863dafff094634c7a69")
          ))
        });

      dispatch(setAccount(addr))
      dispatch(cancelLoading());
    } catch (e) {
      // signOut().catch(console.error);
      console.error('HERE', e);
    }
  };
  
  useEffect(() => {
    if (result.isLoading) return;

    dispatch(setLoading("Loading Account"))
    const shouldBeOnPage = localStorage.getItem("pageRedirect");
    setPage(shouldBeOnPage ? shouldBeOnPage : "Home")
    dispatch(loadAccount());
    dispatch(cancelLoading())
  }, [dispatch, result.isLoading])

  if (isLoading || result.isLoading) return <Loading />

  return (
    <div className="bg-indigo-400">

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
        <main className="flex min-h-screen pb-20 flex-col items-center justify-start bg-indigo-400">
          {/* Promotion */}
          {/* <div className="w-full p-2">
            <Promotion />
          </div> */}

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
              {result.data!.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf()).map((evt, index) => {
                if (!evt.isMeetup)
                  return <EventDisplay 
                    key={index}
                    eventDetail={evt}
                    showDetails={() => setOpenDetails(true)}
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
              {result.data!.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf()).map((evt, index) => {
                if (evt.isMeetup)
                  return <EventDisplay 
                    key={index}
                    eventDetail={evt}
                    showDetails={() => setOpenDetails(true)}
                  />
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
        <main className="flex pt-3 h-screen justify-center bg-indigo-400">
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
        <main className="flex pt-3 h-screen justify-center bg-indigo-400">
          {
            userAddr ? <Profile address={userAddr} /> : 
              token ? <ProfileEnter enterChoko={enterChoko}/> : <ProfileLogin />
          }
        </main>
      </Transition>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 ">
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium hover:backdrop-blur-lg backdrop-blur-md hover:ease-in-out backdrop-grayscale-[.7]">
            {["Home", "Ranking", "Profile"].map(pageSelect => {
              return <button type="button" className="inline-flex flex-col items-center justify-center px-5 border-r-1 border-gray-200 group"
                onClick={() => setPage(pageSelect)}  
              >
                  <BottomIcon pageSelected={pageSelect} />
                  {/* <span className="text-sm text-slate-300 group-hover:text-rose-300">{pageSelect}</span> */}
              </button>
            })}
        </div>
      </div>

      <BaseModal show={openDetails} close={() => {setOpenDetails(false)}} >
          <Dialog.Panel className='fixed bottom-0 left-0 z-50 w-full h-80 rounded-t-2xl'>
            <Dialog.Title
              as='h3'
              className='text-lg font-medium leading-6 flex items-center bg-rose-400 rounded-t-2xl h-16 p-5'
            >
              <p className=' text-slate-200 flex flex-grow'>
                {eventDetails.eventName}
              </p>
              <div onClick={() => setOpenDetails(false)} >
                <XIcon className='text-gray-200 h-6 w-6 cursor-pointer text-slate-200' />
              </div>
            </Dialog.Title>

            <div className=' p-2 bg-rose-200 w-full h-64'>
                {eventDetails.hostList ? <div className="bg-red w-full h-[30%] text-gray-700 text-[14px] pt-5">
                  <b>Host:</b>{eventDetails.hostList.split("|").map(host => `${host} | `)}
                </div> : <></>}

                {eventDetails.cohostList ? <div className="bg-red w-full h-[30%] text-gray-700 text-[14px] pt-5">
                  <b>CoHost:</b>{eventDetails.cohostList.split("|").map(coHost => `${coHost} | `)}
                </div> : <></>}

                <div className="w-full h-[30%]">
                  <div className="text-sm text-gray-600 p-3">Tweet with hashtags for rewards: <a className="text-slate-500" href={`https://twitter.com/intent/tweet?text=%0a${encodeURIComponent(`#hk2023 ${eventDetails.hashTag} #choko`)}`} target="_blank">{`#hk2023 ${eventDetails.hashTag} #choko`}</a>.</div>
                  <button 
                    type="button" 
                    className="text-slate-200 bg-gray-700 font-small rounded-full text-lg px-2.5 py-2.5"
                    onClick={() => window.location.href = `https://twitter.com/intent/tweet?text=%0a${encodeURIComponent(`#hk2023 ${eventDetails.hashTag} #choko`)}`}
                  >
                    <PlusIcon />
                  </button>
                </div>
            </div>

          </Dialog.Panel>
      </BaseModal>
    </div>
  );
};

export function getServerSideProps (context: NextPageContext) {
  const userCookie = context!.req!.headers.cookie;

  try {
    const sessionToken = userCookie!
      .split(';')
      .filter((c) => c.indexOf('next-auth.session-token') !== -1);

    if (sessionToken.length > 0) {
      // expect the token to have content!
      const token = sessionToken[0]!.split('=')[1];

      return {
        props: { token }
      };
    } else {
      return { props: { token: null } };
    }
  } catch (e) {
    return { props: { token: null } };
  }
}

export default Home;
