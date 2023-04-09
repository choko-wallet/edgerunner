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
      <main className="h-screen bg-landing-bg bg-cover">
        <div className="flex flex-col justify-center py-10 w-full h-full backdrop-blur-[0px]">
          <div className="flex w-full h-20 text-md text-slate-200 font-poppins justify-center">
            Hong Kong Web3 2023
          </div>
          <div className="flex w-full text-slate-200 justify-center pl-8 pb-8">
            <img src={logoImg.src} width={350} className="" />
          </div>

          {/* Login Part */}
          {loginPending ? <div className="flex justify-start flex-col pb-10">
              <div className="px-16">
                <button
                  className='flex font-poppins items-center bg-indigo-400 justify-center text-[20px] text-slate-200 rounded-md hover:shadow-sm p-3 w-full font-inter transition duration-150 active:scale-95 ease-in-out'
                  onClick={() => setShowLogin(true)}
                >
                  Connect with Twitter
                </button>
              </div>

              <div className="px-10 m-5">
                <button
                  className='font-poppins items-center justify-center text-[16px] text-slate-200 rounded-md hover:shadow-sm p-3 w-full font-inter transition duration-150 active:scale-95 ease-in-out'
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

          <div className="w-full text-sm text-slate-300  font-poppins">
            <div className="w-full flex justify-center">{`Powered By  `}<a href="https://twitter.com/choko_wallet" className="underline px-2" target="_blank">CHOKO Beta</a>
              {"&"}
              <a href="https://alpha.wormhole3.io/" className="underline px-2" target="_blank">Wormhole3</a></div>
          </div>
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