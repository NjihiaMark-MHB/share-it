"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import PostCard from "../cards/post-card";

type PostQueryParams = {
  take?: number;
  lastCursor?: string;
};

const allPosts = async ({take, lastCursor}: PostQueryParams) => {
  const response = await axios.get("/api/posts/getPosts", { params: { take, lastCursor } })
  return response?.data.data;
};

type PostsType = {
  title?: string;
  id: string;
  createdAt?: string;
  body: string;
  Comment?: {
    createdAt: string;
    id: string;
    postId: string;
    userId: string;
  }[];
  user: {
    name: string;
    image: string;
  };
};

const Posts = () => {
  const { data, isLoading, error } = useQuery<PostsType[]>({
    queryFn: () => allPosts({ take: 10, lastCursor: "" }),
    queryKey: ["posts"],
  });

  if (error as any)
    return (
      <div className="mt-10">
        {"An error has occurred: " + (error as any).message}
      </div>
    );
  if (isLoading) return <div className="mt-10">Loading...</div>;

  return (
    <div className="mt-10">
      {data?.map((post) => (
        <PostCard
          key={post.id}
          name={post.user.name}
          profilePic={post.user.image}
          body={post.body}
          createdAt={post.createdAt as string}
        />
      ))}
    </div>
  );
};

export default Posts;