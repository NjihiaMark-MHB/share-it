"use client";

import { useEffect } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import PostCard from "../cards/post-card";

type PostQueryParams = {
  take?: number;
  lastCursor?: string;
};

const allPosts = async ({ take, lastCursor }: PostQueryParams) => {
  const response = await axios.get("/api/posts/getPosts", {
    params: { take, lastCursor },
  });
  return response?.data;
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
  const { ref, inView } = useInView();

  const { data, error, isLoading, hasNextPage, fetchNextPage, isSuccess, isFetchingNextPage } = useInfiniteQuery({
    queryFn: ({pageParam=""}) => allPosts({ take: 10, lastCursor: pageParam }),
    queryKey: ["posts"],
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.metaData.lastCursor;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage ]);

  if (error as any)
    return (
      <div className="mt-10">
        {"An error has occurred: " + (error as any).message}
      </div>
    );

  return (
    <div className="mt-10">
      {isSuccess && data?.pages.map((page) => page.data.map((post: PostsType, index: number) => {
        if (page.data.length === index + 1) {
          return (
            <div ref={ref} key={index}>
              <PostCard
                key={post.id}
                name={post.user.name}
                profilePic={post.user.image}
                body={post.body}
                createdAt={post.createdAt as string}
              />
            </div>
          );
        } else {
          return (
            <PostCard
              key={post.id}
              name={post.user.name}
              profilePic={post.user.image}
              body={post.body}
              createdAt={post.createdAt as string}
            />
          );
        }
      }))}


      {(isLoading || isFetchingNextPage) && <p className="mb-4">Loading...</p>}
    </div>
  );
};

export default Posts;
