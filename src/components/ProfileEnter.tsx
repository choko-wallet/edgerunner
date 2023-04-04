import React from 'react';
import {signIn, useSession} from 'next-auth/react';

interface Props {
  enterChoko: () => Promise<void>
}
export const ProfileEnter = ({ enterChoko }: Props ) => {
  
  const {data: session} = useSession();

  return <div className='w-full p-3'>
    <div className=' flex flex-col items-center justify-center space-y-4 p-12 bg-slate-200 rounded-lg drop-shadow-xl' >
      <p className=' text-black flex flex-grow font-roboto text-[20px] sm:text-[24px] font-semibold whitespace-nowrap pb-2'>
        <span className='text-black font-normal mr-2 whitespace-nowrap'>
            You are signed in with 
        </span>
        {/* <a className='underline decoration-rose-400 underline-offset-4 decoration-4' href='https://staging.choko.app' target="_blank">
          {`CHOKO  `}<span className='text-sm'>Beta ²</span>
        </a> */}
      </p>

      <div className='flex items-center justify-between'>
        <img
          alt=''
          className='rounded-full border p-[2px] w-10 h-10'
          src={session?.user?.image as string}
        />

        <div className='flex-1 mx-4'>
          <h2 className='font-bold w-44 truncate'>
            {session?.user?.name}
          </h2>
          <h3 className='text-sm text-gray-400 w-28 sm:w-44 md:w-48'>
            
            {
              // @ts-ignore
              `@${session?.user?.twitterHandler}`
            }
          </h3>
        </div>

        <img className='w-8 h-8 mr-3'
          src={"https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg"}
        />
      </div>

      <p className='text-gray-500 flex flex-grow font-roboto text-center text-sm'>
        Now you can create a wallet address!
      </p>

      <div className='flex space-x-2 items-center justify-center py-2'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 animate-bounce text-indigo-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      <button
        className='flex items-center justify-center text-[20px] text-gray-700 rounded-md hover:shadow-sm p-2 w-full border-2 border-indigo-400 font-inter transition duration-150 active:scale-95 ease-in-out'
        onClick={() => enterChoko()}
      >
        Create Wallet with CHOKO
      </button><br/>

      <div className='flex items-center justify-center w-full my-5'>
        <div className='w-full h-[1px] bg-gray-300'></div>
      </div>

      <p className=' text-gray-500  font-roboto text-center text-[12px] pt-5'>
        CHOKO is a bleeding edge MPC & EIP4337 Web3 Portal. To proceed, you will be running a native light node directly inside of your browser to generate a crypto wallet. To learn more - join our  
        <a className="underline decoration-rose-400 underline-offset-4 decoration-1" target="_blank" href="https://google.com"> discord channel.</a>. 
      </p>
    </div>
  </div>
}