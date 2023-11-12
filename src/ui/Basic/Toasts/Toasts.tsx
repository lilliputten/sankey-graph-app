/** @module Toasts
 *  @since 2023.01.27, 20:59
 *  @changed 2023.03.31, 18:51
 */

import React from 'react';
// import { AxiosError } from 'axios';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';

import { defaultToastDelay } from 'src/config/app';
import { errorToString } from 'src/helpers';

import 'react-toastify/dist/ReactToastify.css';
import { isProd } from 'src/config/build';

export { toast };

// Export some toast shorthands

export type TMessage = Error | string; // | AxiosError;

export type ToastId = ReturnType<typeof toast.info>;

export type ToastFunc = (msg: TMessage, options?: ToastOptions) => ToastId;

export function showInfo(msg: TMessage, options?: ToastOptions): ToastId {
  return toast.info(errorToString(msg), options);
}
export function showSuccess(msg: TMessage, options?: ToastOptions): ToastId {
  return toast.success(errorToString(msg), options);
}
export function showWarn(msg: TMessage, options?: ToastOptions): ToastId {
  return toast.warn(errorToString(msg), options);
}
export function showError(msg: TMessage, options?: ToastOptions): ToastId {
  return toast.error(errorToString(msg), options);
}

// Create context...

const toastContextData = { toast };

export const ToastsContext = React.createContext(toastContextData);

export function useToast() {
  const toastsContext = React.useContext(ToastsContext);
  return toastsContext.toast;
}

interface TToastsProps {
  children: React.ReactNode;
}

export function WithToastsWrapper(props: TToastsProps) {
  const { children } = props;
  return (
    <ToastsContext.Provider value={toastContextData}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={defaultToastDelay}
        hideProgressBar
        // newestOnTop
        closeOnClick
        // pauseOnFocusLoss={isProd}
        pauseOnFocusLoss={false}
        // draggable
        pauseOnHover={isProd}
        theme="colored"
      />
    </ToastsContext.Provider>
  );
}
