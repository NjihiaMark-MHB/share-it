"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

import ProfileDropDownMenu from "@/app/components/profile/profile-dropdown-menu";

export default function LoginLink() {
  const { data: session } = useSession();
  // console.log("session", session);
  return (
    <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
      {session ? (
        <li className="flex items-center">
          <ProfileDropDownMenu />
        </li>
      ) : (
        <li className="flex items-center">
          <Link
            className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-baseline text-xs uppercase font-bold"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            <i className="text-blueGray-500 fa-solid fa-lock text-lg mr-2" />{" "}
            Login
          </Link>
        </li>
      )}
    </ul>
  );
}
