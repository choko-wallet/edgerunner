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
import { signIn, signOut, useSession } from "next-auth/react";
import { certificateToAuthHeader, mpcLocalKeyToAccount, runKeygenRequest, runKeyRefreshRequest } from "~/mpc";
import { loadAccount, setAccount } from "~/redux/slices/account";
import { hexToU8a, stringToU8a, u8aToHex } from "@skyekiwi/util";
import { useRouter } from "next/router";

import logoImg from '~/img/logo.png';

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


const Landing: NextPage<Props> = ({ token }: Props) => {

  const {data: session} = useSession()

  const dispatch = useDispatch();
  const router = useRouter();

  const isLoading = useSelector(selectIsLoading);
  const userAddr = useSelector(selectAccount);
  
  const [showLogin, setShowLogin] = useState(false);
  const [loginStep, setLoginStep] = useState("login");
  const [loginPending, setLoginPending] = useState(true);

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

      localStorage.setItem('pageRedirect', 'Profile')

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
    dispatch(loadAccount());
    dispatch(cancelLoading())
  }, [dispatch])

  useEffect(() => {
    if (userAddr) {
      setLoginPending(false)
      setShowLogin(false)
    } else {
      if (token) {
        setLoginStep("enter")
        setShowLogin(true)
      }
    }
  }, [userAddr]);

  if (isLoading) return <Loading />
  return (
    <div>
      <Head>
        <title>Edgerunner</title>
        <meta name="description" content="edgerunner" />
        <link rel="icon" href="/favicon.ico" />
        <script async defer data-website-id="29b8f398-606e-496f-b31a-4e8d8e2abe76" src="https://analytics.skye.kiwi/umami.js"></script>
      </Head>

      <main className="h-screen bg-landing-bg bg-cover">
        <div className="flex flex-col justify-around py-10 w-full h-full backdrop-blur-sm backdrop-grayscale-[.7]">
          <div className="flex w-full h-20 text-2xl text-slate-200 font-poppins justify-center">
            Hong Kong 2023
          </div>
          <div className="flex w-full text-2xl text-slate-200 justify-center pl-4">
            <img src={logoImg.src} width={400} className="invert-[10%]" />
          </div>

          <div className="flex w-full text-lg text-slate-200 justify-center font-poppins">
            {`Brought To You By  `}<div className="underline pl-2"><a href="https://staging.choko.app" target="_blank">CHOKO Beta</a></div>
          </div>
          {/* Login Part */}
          {loginPending ? <div className="flex justify-start flex-col">
              <div className="px-10">
                <button
                  className='flex font-poppins items-center bg-indigo-400 justify-center text-[20px] text-slate-200 rounded-md hover:shadow-sm p-3 w-full font-inter transition duration-150 active:scale-95 ease-in-out'
                  onClick={() => setShowLogin(true)}
                >
                  Connect With Choko
                </button>
              </div>

              <div className="px-10 m-5">
                <button
                  className='font-poppins items-center justify-center text-[18px] text-slate-200 rounded-md hover:shadow-sm p-3 w-full font-inter transition duration-150 active:scale-95 ease-in-out'
                  onClick={() => router.push("/home")}
                >
                  Skip To Explore
                </button>
              </div>
            </div> : <div className="flex justify-start flex-col">
              <div className="px-10 m-5 flex">
                  <button
                    className='font-poppins items-center bg-indigo-400 justify-center text-[20px] text-slate-200 rounded-md hover:shadow-sm p-3 w-full font-inter transition duration-150 active:scale-95 ease-in-out'
                    onClick={() => router.push("/home")}
                  >
                    Enter
                  </button>
              </div>
              <div className="px-10 m-5 flex">
                  <button
                    className='font-poppins items-center justify-center text-[15px] text-slate-200 rounded-md hover:shadow-sm p-3 w-full font-inter transition duration-150 active:scale-95 ease-in-out'
                    onClick={() => {
                      localStorage.removeItem("address");
                      signOut().catch(console.error)
                    }}
                  >
                    Sign Out
                  </button>
              </div>
            </div>
          }
        </div>
      </main>

      <BaseModal show={showLogin} close={() => setShowLogin(false)}>
        <Dialog.Panel className='z-50 w-full rounded-t-2xl'>
          {
            loginStep === 'login' ? <ProfileLogin /> : 
              loginStep === 'enter' ? <ProfileEnter enterChoko={enterChoko}/> : null
          }
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

export default Landing;