"use client";

import { useState, MouseEvent } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import formatDate from "@/utils/format-date";
// import { useRouter } from "next/navigation";
import capitalizeWord from "@/utils/capitalizeWord";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import HeartIcon from "../../shared/like-heart";
import DeleteIcon from "../../shared/delete-icon";
import EditIcon from "../../shared/edit-icon";
import EditCommentForm from "./edit-comment-form";
import Modal from "../../modals";
import { ModalSize } from "../../modals";

type CommentCardProps = {
  name: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  likes: { id: string; commentId: string; userId: string }[];
  userId: string;
  currentUserId: string;
  postId: string;
  commentId: string;
};

const CommentCard = ({
  name,
  profilePic,
  createdAt,
  updatedAt,
  body,
  likes,
  userId,
  currentUserId,
  postId,
  commentId,
}: CommentCardProps) => {
  const [showDeleteModal, setDeleteShowModal] = useState<boolean>(false);
  const [showEditModal, setEditShowModal] = useState<boolean>(false);
  const [loadLike, setLoadLike] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { user } = session || {};
  // const router = useRouter();

  const currentUserLiked =
    (session && likes?.some((like) => like.userId === user?.id)) || false;

  // console.log("likes:",props.likes);

  type LikeParams = {
    commentId: string;
  };

  const likePost = async ({ commentId }: LikeParams) => {
    setLoadLike(true);
    try {
      await axios.post("/api/comments/addLike", { commentId });
      queryClient.invalidateQueries(["post", postId]);
      //return response?.data;
    } catch (error) {
      console.log(error);
    }
    setLoadLike(false);
  };

  const { mutate } = useMutation(
    async (commentId: String) =>
      await axios.delete("/api/comments/deleteComment", { params: { commentId } }),
    {
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.error || "Something went wrong", {
          id: "delete-comment-toast",
        });
      },
      onSuccess: (data) => {
        toast.success("Comment has been Deleted 🔥", { id: "delete-comment-toast" });
        queryClient.invalidateQueries(["post", postId]);
        // console.log(data.data);
      },
    }
  );


  const clickHeart = (e: MouseEvent<HTMLElement>) => {
    likePost({ commentId });
  };

  const openEditModal = (e: MouseEvent<HTMLElement>) => {
    setEditShowModal(true);
  };

  const openDeleteModal = (e: MouseEvent<HTMLElement>) => {
    setDeleteShowModal(true);
  };

  return (
    <>
      <div
        className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg p-4">
        <div className="flex items-center">
          <Image
            alt="profile pic"
            src={profilePic}
            className="rounded-full object-cover h-10 w-10 mr-3"
            width={40}
            height={40}
          />
          <div>
            <div className="font-medium text-gray-700">
              {capitalizeWord(name)}
            </div>
            <div className="text-gray-400">
              {formatDate(createdAt)}{" "}
              {createdAt != updatedAt && <i>(edited)</i>}
            </div>
          </div>
        </div>
        <div className="mt-9 mb-9 text-gray-500">{body}</div>
        <div>
          <div className="flex items-center justify-between">
            <div>
              {loadLike ? (
                <i className="fa-solid fa-spinner text-red-600"></i>
              ) : (
                <HeartIcon fill={currentUserLiked} onClick={clickHeart} />
              )}
              <span className="text-gray-400 ml-1">{likes.length}</span>
            </div>
            {userId === currentUserId && (
              <div className="flex gap-2.5">
                <div>
                  <EditIcon onClick={openEditModal} />
                </div>
                <div>
                  <DeleteIcon onClick={openDeleteModal} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <Modal
          modalTitle="Delete Post"
          closeModal={() => setDeleteShowModal(false)}
          saveFunction={() => mutate(commentId)}
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
          <EditCommentForm
            postId={postId}
            commentId={commentId}
            body={body}
            closeModal={() => setEditShowModal(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default CommentCard;
