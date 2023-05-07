"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const schema = z.object({
  deleteProfile: z
    .string()
    .nonempty({ message: "You must confirm to delete your profile" })
    .regex(/^Delete$/, { message: "You must confirm to delete your profile" }),
});
type FormData = z.infer<typeof schema>;

type DeleteUserFormProps = {
  closeModal: () => void;
};

export default function DeleteUserForm({ closeModal }: DeleteUserFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate } = useMutation(
    async (data: FormData) =>
      await axios.delete("/api/users/deleteUserProfile", {
        params: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    {
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.error || "Something went wrong", {
          id: "profile-toast",
        });
      },
      onSuccess: (data) => {
        toast.success("Profile has been deleted 🔥", { id: "profile-toast" });
        router.replace("/");

        setTimeout(signOut, 1000);
      },
    }
  );

  const onSubmit = async (data: FormData) => {
    toast.loading("Deleting Profile", { id: "profile-toast" });
    closeModal();
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative w-full mb-3">
            <label
              className="block text-blueGray-600 text-lg mb-2"
              htmlFor="grid-password"
            >
              Please enter <b>Delete</b> to confirm
            </label>
            <input
              type="text"
              className="border-1 border-blueGray-300 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
              placeholder="Delete"
              {...register("deleteProfile")}
            />
            <p className="text-red-500">{errors.deleteProfile?.message}</p>
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
          type="submit"
        >
          Ok
        </button>
      </div>
    </form>
  );
}
