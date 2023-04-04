// Copyright 2021-2022 @choko-wallet/loading-module authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useSelector } from 'react-redux';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { selectIsLoading, selectLoadingText } from '~/redux/redux/selectors';

function Loading (): JSX.Element {
  const loadingText = useSelector(selectLoadingText);
  const isLoading = useSelector(selectIsLoading);

  if (!isLoading) return <></>;

  return <div className='bg-indigo-400 h-[95vh] flex flex-col items-center justify-center'>
      <div className='p-5'>
        <p className='text-xl'>
          <span className='text-rose-300 font-poppins w-36 '>{loadingText}</span>
        </p>
      </div>
      <PacmanLoader color='#fda4af'
        size={30}
        className="pl-[-10px]" />
    </div>;
}

export default Loading;
