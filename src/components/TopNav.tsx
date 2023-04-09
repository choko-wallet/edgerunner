import React from 'react'

import logoSM from '~/img/logo-sm.png';

export const TopNav = (): JSX.Element => {
    return (<nav>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://edgerunner.live" className="flex items-center">
          <img src={logoSM.src}  className="h-6" />
            {/* <span className="self-center text-md font-semibold whitespace-nowrap text-slate-200">Edgerunner</span> */}
        </a>
      </div>
    </nav>)
}