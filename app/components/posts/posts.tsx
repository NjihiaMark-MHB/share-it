"use client";

import { useEffect } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSession } from "next-auth/react";

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
  updatedAt?: string;
  body: string;
  PostLike: { id: string; postId: string; userId: string }[];
  Comment?: {
    createdAt: string;
    id: string;
    postId: string;
    userId: string;
  }[];
  user: {
    name: string;
    image: string;
    id: string;
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

  const { data: session } = useSession();
  const {user} = session || {};

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

    // console.log("data:",data);

  return (
    <div className="mt-10">
      {isSuccess && data?.pages.map((page) => page.data.map((post: PostsType, index: number) => {
        if (page.data.length === index + 1) {
          return (
            <div ref={ref} key={index}>
              <PostCard
                key={post.id}
                postId={post.id}
                name={post.user.name}
                profilePic={post.user.image}
                likes={post.PostLike}
                body={post.body}
                createdAt={post.createdAt as string}
                updatedAt={post.updatedAt as string}
                userId={post.user?.id}
                currentUserId={user?.id}
              />
            </div>
          );
        } else {
          return (
            <PostCard
              key={post.id}
              name={post.user.name}
              postId={post.id}
              profilePic={post.user.image}
              likes={post.PostLike}
              body={post.body}
              createdAt={post.createdAt as string}
              updatedAt={post.updatedAt as string}
              currentUserId={user?.id}
              userId={post.user?.id}
            />
          );
        }
      }))}


      {(isLoading || isFetchingNextPage) && <p className="mb-4">Loading...</p>}
    </div>
  );
};

export default Posts;
