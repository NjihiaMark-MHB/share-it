"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createPopper } from "@popperjs/core";

import { useSession, signOut } from "next-auth/react";

import useAvatarStore from "@/app/store/avatarStore";
import useOnClickOutside from "@/app/hooks/useOnClickOutside";

const ProfileDropDownMenu = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  // const [closedOutside, setClosedOutside] = React.useState(false);
  const btnDropdownRef = React.useRef<HTMLAnchorElement>(null);
  const popoverDropdownRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const openDropdownPopover = () => {
    setDropdownPopoverShow(true);
    createPopper(
      btnDropdownRef.current as HTMLAnchorElement,
      popoverDropdownRef.current as HTMLDivElement,
      {
        placement: "bottom-start",
      }
    );
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const { data: session } = useSession();
  const { avatar, setAvatar } = useAvatarStore((state) => ({
    avatar: state.avatar,
    setAvatar: state.setAvatar,
  }));

  // setAvatar(session?.user?.image as string);

  React.useEffect(() => {
    setAvatar(session?.user?.image as string);
    // console.log("avatar...");
  }, [session?.user?.image, setAvatar]);

  useOnClickOutside(containerRef, () => closeDropdownPopover());
  // console.log("closedOutside", closedOutside);
  return (
    <div className="relative" ref={containerRef}>
      <Link
        className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
        href="#"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();

          // openDropdownPopover();
        }}
      >
        <Image
          src={avatar}
          alt="..."
          className="shadow rounded-full max-w-full h-auto align-middle border-none"
          width={40}
          height={40}
        />
      </Link>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <Link
          className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-baseline text-xs uppercase font-bold"
          href="/profile"
          onClick={() => closeDropdownPopover()}
        >
          <i className="text-blueGray-500 fa-solid fa-user text-lg mr-2" />{" "}
          Profile
        </Link>
        <Link
          className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-baseline text-xs uppercase font-bold"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
          href="#"
        >
          <i className="text-blueGray-500 fa-solid fa-unlock text-lg mr-2" />{" "}
          Logout
        </Link>
      </div>
    </div>
  );
};

export default ProfileDropDownMenu;
