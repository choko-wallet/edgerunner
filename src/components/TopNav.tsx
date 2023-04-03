import React from 'react'

export const TopNav = (): JSX.Element => {
    return (<nav className="backdrop-blur0=-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://edgerunner.live" className="flex items-center">
            <span className="self-center text-md font-semibold whitespace-nowrap text-slate-200">Edgerunner</span>
        </a>
      </div>
    </nav>)
}