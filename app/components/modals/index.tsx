"use client";

import React from "react";

export enum ModalSize {
  small = "small",
  medium = "medium",
  large = "large",
}

type ModalProps = {
  closeModal: () => void;
  saveFunction?: () => void;
  saveBtnText?: string;
  modalTitle: string;
  footer?: boolean;
  children: React.ReactNode;
  size?: ModalSize;
};

// { closeModal, modalTitle, body, size = ModalSize.small }: IModal

export default function Modal({
  closeModal,
  modalTitle,
  footer = true,
  size = ModalSize.small,
  saveFunction,
  children,
  saveBtnText = "Ok",
}: ModalProps) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div
          className={`relative w-full my-6 mx-auto ${
            size == ModalSize.large
              ? "max-w-6xl"
              : size == ModalSize.medium
              ? "max-w-3xl"
              : size == ModalSize.small
              ? "max-w-sm"
              : "max-w-sm"
          } `}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">{modalTitle}</h3>
              <button className="p-1 ml-auto bg-transparent border-0 opacity-50 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                <span
                  className="bg-transparent text-black opacity-75 h-6 w-6 text-2xl block outline-none focus:outline-none"
                  onClick={() => closeModal()}
                >
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">{children}</div>
            {/* {!footer && (
              <div className="border-t border-solid border-blueGray-200 p-6" />
            )} */}
            {/*footer*/}
            {footer && (
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => closeModal()}
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    saveFunction != undefined && saveFunction();
                    closeModal();
                  }}
                >
                  {saveBtnText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
