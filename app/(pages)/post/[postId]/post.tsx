"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import PostCard from "@/app/components/cards/post-card";
import CreateCommentForm from "@/app/components/comments/create-comment-form";
import CommentCard from "@/app/components/cards/comments-card";

type PostProps = {
  postId: string;
};

type CommentType = {
  Image?: string;
  body: string;
  createdAt: string | Date;
  id: string;
  postId: string;
  updatedAt: string | Date;
  userId: string;
  CommentLike: { id: string; commentId: string; userId: string }[];
  user: {
    name: string;
    image: string;
    id: string;
  };
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
    queryKey: ["post", postId],
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
    <>
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
        clickable={false}
        comments={data.Comment}
      />
      <CreateCommentForm postId={postId} />
      {data.Comment?.map((comment: CommentType) => (
        <CommentCard
          key={comment.id}
          postId={data.id}
          name={comment.user.name}
          profilePic={comment.user.image}
          likes={comment.CommentLike}
          body={comment.body}
          createdAt={comment.createdAt as string}
          updatedAt={comment.updatedAt as string}
          userId={comment.user?.id}
          currentUserId={user?.id}
          commentId={comment.id}
        />
      ))}
    </>
  );
};

export default Post;
