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

import { XIcon} from '@heroicons/react/outline'

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
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>

    case "Ranking":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-rose-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>

    case "Profile":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-rose-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>

    default:
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-rose-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  }
}

const RightIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const result = api.events.getAll.useQuery();

  const {data: session} = useSession()

  const allEvents = result.data!;
  const dispatch = useDispatch();

  const eventDetails = useSelector(selectEventDetail);
  const isLoading = useSelector(selectIsLoading);
  const userAddr = useSelector(selectAccount);

  const [category, setCategory] = useState("Events");
  const [page, setPage] = useState("Home");

  const [openDetails, setOpenDetails] = useState(false);

  if (result.isLoading) {
    dispatch(setLoading("Loading Events ..."))
  } else {
    dispatch(cancelLoading())
  }
  
  const enterChoko = async () => {
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
    dispatch(setLoading("Loading Account"))
    const shouldBeOnPage = localStorage.getItem("pageRedirect");
    setPage(shouldBeOnPage ? shouldBeOnPage : "Home")
    dispatch(loadAccount());
    dispatch(cancelLoading())
  }, [dispatch])

  if (isLoading || result.isLoading) return <Loading />
  return (
    <div className="bg-indigo-400">
      <Head>
        <title>Edgerunner</title>
        <meta name="description" content="edgerunner" />
        <link rel="icon" href="/favicon.ico" />
        <script async defer data-website-id="29b8f398-606e-496f-b31a-4e8d8e2abe76" src="https://analytics.skye.kiwi/umami.js"></script>
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
        <main className="flex min-h-screen pb-20 flex-col items-center justify-start bg-indigo-400">
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
              {allEvents.map((evt, index) => {
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
              {allEvents.map((evt, index) => {
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
                  <span className="text-sm text-slate-300 group-hover:text-rose-300">{pageSelect}</span>
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

                <div className="bg-red w-full h-[50%] text-gray-700">
                  <span>Location: <a className="underline decoration-rose-400 underline-offset-4 decoration-3" href={eventDetails.locationGoogle} target="_blank">{`${eventDetails.locationText}`}</a></span>
                </div>

                <div className="w-full h-[50%]">
                  <div className="text-sm text-gray-600 p-3">Check In on Twitter</div>
                  <button 
                    type="button" 
                    className="text-slate-200 bg-gray-500 font-small rounded-full text-lg px-5 py-2.5"
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
