"use client";

import Image from "next/image";
import formatDate from "@/utils/format-date";
import capitalizeWord from "@/utils/capitalizeWord";

import HeartIcon from "./like-heart";

type PostCardProps = {
	name: string;
	profilePic: string;
	createdAt: string;
	body: string;
};

const PostCard = (props: PostCardProps) => {
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg p-4">
      <div className="flex items-center">
        <Image
          alt="profile pic"
          src={props.profilePic}
          className="rounded-full object-cover h-10 w-10 mr-3"
          width={40}
          height={40}
        />
        <div>
          <div className="font-medium text-gray-700">{capitalizeWord(props.name)}</div>
          <div className="text-gray-400">{formatDate(props.createdAt)}</div>
        </div>
      </div>
      <div className="mt-9 mb-9 text-gray-500">{props.body}</div>
      <div>
        <div className="flex items-center">
          <span className="text-gray-400 mr-4">0 comments</span>
          <HeartIcon fill={false} onClick={() => console.log("clicked")} />
          <span className="text-gray-400 ml-1">1</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
