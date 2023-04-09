"use client";

import React from "react";
import Link from "next/link";
import { Smokum } from "next/font/google";

import LoginLink from "@/app/auth/login-link";

const TwinkeStar = Smokum({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              href="/"
              className={`text-blueGray-700 text-[40px] font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase ${TwinkeStar.className}`}
            >
              SHARE IT.
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <LoginLink />
          </div>
        </div>
      </nav>
    </>
  );
}
