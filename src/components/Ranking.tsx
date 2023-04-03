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

    return <div className='w-full'>
        {ranking.map((rank, index) => {
            return <div className='m-2 p-3 backdrop-blur-lg bg-red-200'>
                {`${index + 1} - ${rank}`}
            </div>
        })}
    </div>

}