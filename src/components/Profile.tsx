import React, { useEffect } from 'react';
import {signIn, signOut, useSession} from 'next-auth/react';

interface Props {
  address: string
}
export const Profile = ({ address }: Props ) => {
  const {data: session} = useSession();

  useEffect(() => {
    localStorage.removeItem('pageRedirect')
  }, []);

  return <div className='w-full p-3'>
    <div className=' flex flex-col items-center justify-center space-y-4 p-12 bg-slate-200 rounded-lg drop-shadow-xl' >
      <p className=' text-black flex flex-grow font-roboto text-[20px] sm:text-[24px] font-semibold whitespace-nowrap pb-2'>
        <span className='text-black font-normal mr-2 whitespace-nowrap'>
          Connected with
        </span>
        <a className='underline decoration-rose-400 underline-offset-4 decoration-4' href='https://staging.choko.app' target="_blank">
          {`CHOKO  `}<span className=''>Beta ²</span>
        </a>
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
          src={"https://authjs.dev/img/providers/twitter.svg"}
        />
      </div>

      <p className='text-gray-500 flex flex-grow font-roboto text-center text-sm'>
        {address}
      </p>

      <p className='text-gray-500 font-roboto text-center text-sm'>
        Join our <a className="underline" href='https://discord.com/invite/zkp8UEQctM'>Discord</a> #HK2023 channel to claim whitelist & receive updates. Let us know if you spot anything wrong. 
      </p>

      <p className='text-gray-500 font-roboto text-center text-sm'>
        You can now post on twitter & receive rewards from <a href="https://alpha.wormhole3.io/" className="underline px-1" target="_blank">Wormhole3</a>.
      </p>

      <div className="px-15 m-5 flex">
        <button
          className='font-poppins items-center bg-indigo-400 justify-center text-[16px] text-slate-200 rounded-md hover:shadow-sm mt-3 p-3 px-5 w-full font-inter transition duration-150 active:scale-95 ease-in-out'
          onClick={() => {
            localStorage.removeItem("address");
            signOut().catch(console.error)
          }}
        >
          Sign Out
        </button>
      </div>
      {/* <p className='text-gray-700  font-roboto text-center text-[20px] pt-5' onClick={() => {
        localStorage.removeItem("address");
        signOut().catch(console.error)
      }}>
        SignOut
      </p> */}

      
    </div>
  </div>
}