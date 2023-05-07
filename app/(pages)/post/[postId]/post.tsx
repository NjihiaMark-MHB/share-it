"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import PostCard from "../../../components/cards/post-card";

type PostProps = {
  postId: string;
};

const getPost = async ({ postId }: PostProps) => {
  const response = await axios.get("/api/posts/getPost", {
    params: { postId },
  });
  return response?.data;
};

const Post = ({ postId }: PostProps) => {
  const { data: session } = useSession();
  const { user } = session || {};

  const { data, error, isLoading } = useQuery({
    queryFn: () => getPost({ postId }),
    queryKey: ["post", postId ],
  });

  if (error as any)
    return (
      <div className="mt-10">
        {"An error has occurred: " + (error as any).message}
      </div>
    );

  if (isLoading) return <div className="mt-10">Loading...</div>;

  // console.log("data:", data);

  return (
    <div className="mt-10">
      <PostCard
        postId={data.id}
        name={data.user.name}
        profilePic={data.user.image}
        likes={data.PostLike}
        body={data.body}
        createdAt={data.createdAt as string}
        updatedAt={data.updatedAt as string}
        userId={data.user?.id}
        currentUserId={user?.id}
      />
    </div>
  );
};

export default Post;
