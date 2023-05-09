"use client";

import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const schema = z.object({
  body: z
    .string()
    .trim()
    .nonempty({ message: "Can't be blank" })
    .max(300, { message: "Should not exceed 300 characters" }),
});
type FormData = z.infer<typeof schema>;

type CreateCommentFormProps = {
  postId: string;
};

const CreateCommentForm = ({postId}: CreateCommentFormProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate } = useMutation(
    async (data: FormData) =>
      await axios.post("/api/comments/addComment", {...data, postId}),
    {
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.error || "Something went wrong", {
          id: "comment-toast",
        });
      },
      onSuccess: (data) => {
        toast.success("Comment has been created 🔥", { id: "comment-toast" });
        queryClient.invalidateQueries(["post", postId]);
        reset();
        console.log(data.data);
      },
    }
  );

  const onSubmit = async (data: FormData) => {
    toast.loading("Creating a comment", { id: "comment-toast" });
    mutate(data);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="post_box" className="text-lg text-gray-600">
        {session ? "" : "Sign in to comment"}
      </label>
      <textarea
        placeholder="Comment here..."
        rows={4}
        id="post_box"
        className={
          `px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full mb-2 mt-1 shadow-md` +
          (!session ? " cursor-not-allowed" : "")
        }
        disabled={!session}
        {...register("body")}
      ></textarea>
      <p className="text-red-500">{errors.body?.message}</p>
      <button
        className={
          `bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 mb-6` +
          (!session ? " opacity-50 cursor-not-allowed" : "")
        }
        type="submit"
        disabled={!session}
      >
        Comment
      </button>
    </form>
  );
};

export default CreateCommentForm;
