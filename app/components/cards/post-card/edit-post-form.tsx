import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import * as z from "zod";

type EditPostFormProps = {
  postId: string;
  body: string;
  closeModal: () => void;
};

const schema = z.object({
  body: z
    .string()
    .nonempty({ message: "Can't be blank" })
    .max(300, { message: "Should not exceed 300 characters" }),
});
type FormData = z.infer<typeof schema>;

const EditPostForm = ({ postId, body, closeModal }: EditPostFormProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      body: body,
    },
    resolver: zodResolver(schema),
  });

  const { mutate } = useMutation(
    async (data: FormData) => await axios.put("/api/posts/updatePost", {...data, postId}),
    {
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.error || "Something went wrong", {
          id: "post-toast",
        });
      },
      onSuccess: (data) => {
        toast.success("Post has been updated 🔥", { id: "post-toast" });
        queryClient.invalidateQueries(["posts"]);
        reset();
		closeModal();
        console.log(data.data);
      },
    }
  );

  const onSubmit = async (data: FormData) => {
    toast.loading("Editing post", { id: "post-toast" });
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea
        placeholder="What's on your mind..."
        rows={4}
        id="post_box"
        className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full mb-2 mt-1"
        {...register("body")}
      ></textarea>
      <p className="text-red-500">{errors.body?.message}</p>
      <div className="flex items-center justify-end">
        <button
          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => closeModal()}
        >
          Close
        </button>
        <button
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="submit"
        >
          {/* {saveBtnText} */}
          Save edits
        </button>
      </div>
    </form>
  );
};

export default EditPostForm;
