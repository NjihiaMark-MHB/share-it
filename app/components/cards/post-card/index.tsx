"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import formatDate from "@/utils/format-date";
import capitalizeWord from "@/utils/capitalizeWord";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import HeartIcon from "../../shared/like-heart";
import DeleteIcon from "../../shared/delete-icon";
import EditIcon from "../../shared/edit-icon";
import EditPostForm from "./edit-post-form";
import Modal from "../../modals";
import { ModalSize } from "../../modals";

type PostCardProps = {
  name: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  likes: { id: string; postId: string; userId: string }[];
  userId: string;
  currentUserId: string;
  postId: string;
};

const PostCard = (props: PostCardProps) => {
  const [showDeleteModal, setDeleteShowModal] = useState<boolean>(false);
  const [showEditModal, setEditShowModal] = useState<boolean>(false);
  const [loadLike, setLoadLike] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { user } = session || {};

  const currentUserLiked =
    (session && props.likes?.some((like) => like.userId === user?.id)) || false;

  // console.log("likes:",props.likes);

  type LikeParams = {
    postId: string;
  };

  const likePost = async ({ postId }: LikeParams) => {
    setLoadLike(true);
    try {
      await axios.post("/api/posts/addLike", { postId });
      queryClient.invalidateQueries(["posts"]);
      //return response?.data;
    } catch (error) {
      console.log(error);
    }
    setLoadLike(false);
  };

  const { mutate } = useMutation(
    async (postId: String) =>
      await axios.delete("/api/posts/deletePost", { params: { postId } }),
    {
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.error || "Something went wrong", {
          id: "delete-post-toast",
        });
      },
      onSuccess: (data) => {
        toast.success("Post has been Deleted 🔥", { id: "delete-post-toast" });
        queryClient.invalidateQueries(["posts"]);
        // console.log(data.data);
      },
    }
  );

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
          <div className="font-medium text-gray-700">
            {capitalizeWord(props.name)}
          </div>
          <div className="text-gray-400">
            {formatDate(props.createdAt)}{" "}
            {props.createdAt != props.updatedAt && <i>(edited)</i>}
          </div>
        </div>
      </div>
      <div className="mt-9 mb-9 text-gray-500">{props.body}</div>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 mr-4">0 comments</span>
            {loadLike ? <i className="fa-solid fa-spinner text-red-600"></i> : <HeartIcon
              fill={currentUserLiked}
              onClick={() => session && likePost({ postId: props.postId })}
            />}
            <span className="text-gray-400 ml-1">{props.likes.length}</span>
          </div>
          {props.userId === props.currentUserId && (
            <div className="flex gap-2.5">
              <div>
                <EditIcon onClick={() => setEditShowModal(true)} />
              </div>
              <div>
                <DeleteIcon onClick={() => setDeleteShowModal(true)} />
              </div>
            </div>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <Modal
          modalTitle="Delete Post"
          closeModal={() => setDeleteShowModal(false)}
          saveFunction={() => mutate(props.postId)}
          footer={true}
          size={ModalSize.small}
        >
          Are you sure you want to delete this post?
        </Modal>
      )}
      {showEditModal && (
        <Modal
          modalTitle="Edit Post"
          closeModal={() => setEditShowModal(false)}
          footer={false}
          size={ModalSize.medium}
        >
          <EditPostForm
            postId={props.postId}
            body={props.body}
            closeModal={() => setEditShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default PostCard;
