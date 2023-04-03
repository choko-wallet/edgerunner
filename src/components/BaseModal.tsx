// Copyright 2021-2022 @choko-wallet/frontend authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { setShow } from '~/redux/slices/eventDetail';

interface Props {
  children: JSX.Element;
  show: boolean;
}

function BaseModal ({ children, show}: Props): JSX.Element {

  const dispatch = useDispatch();


  return (
    <Transition appear
      as={Fragment}
      show={show}>
      <Dialog as='div'
        className='relative z-50' 
        onClose={() => dispatch(setShow(false))}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0  backdrop-blur-md' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              {children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>

  );
}

export default BaseModal;
