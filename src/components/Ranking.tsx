import React from 'react';

export const Ranking = () => {

    const ranking = [
        "@test",
        "@test",
        "@test",
        "@test",
        "@test",
        "@test",
        "@test",
        "@test",
        "@test",
    ]

  return <div className='w-full p-3'>
    <div className='items-center p-2 bg-slate-200 rounded-lg drop-shadow-xl' >
      {ranking.map((rank, index) => {
            return <div>
              <div className='p-3'>
                {`${index + 1} - ${rank}`}
            </div>
            {index === ranking.length - 1 ? null : <div className='w-full h-[1px] bg-gray-300'></div>}
          </div>
      })}
    </div>
  </div>
}