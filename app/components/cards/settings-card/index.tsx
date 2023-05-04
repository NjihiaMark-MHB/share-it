"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Modal from "../../modals";
import { ModalSize } from "../../modals";
import DeleteUserForm from "./delete-user-form";
import useAvatarStore from "@/app/store/avatarStore";

const schema = z.object({
  firstName: z.string().nonempty({ message: "First name is required" }),
  lastName: z.string().nonempty({ message: "Last name is required" }),
  bio: z.string().optional(),
  image: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function CardSettings(props: FormData) {
  const [showModal, setShowModal] = useState<boolean>(false);

  // const router = useRouter();

  // create a post
  const isBrowser = typeof window !== "undefined";

  const { avatar, setAvatar } = useAvatarStore((state) => ({
    avatar: state.avatar,
    setAvatar: state.setAvatar,
  }));


  const cloudinaryWidget =
    isBrowser &&
    (window as any).cloudinary?.createUploadWidget(
      {
        cloudName: "hzxyensd5",
        uploadPreset: "aoh4fpwm",
        sources: ["local", "facebook", "instagram", "camera"],
        multiple: false,
        cropping: true,
        // croppingCoordinatesMode: "face",
        showAdvancedOptions: false,
        croppingAspectRatio: 1,
        folder: "demo_uw_folder",
      },
      (error: unknown, result: any) => {
        if (!error && result && result.event === "success") {
          const image = result.info.secure_url;
          axios
            .put("/api/users/updateAvatar", { image })
            .then(function (response) {
              console.log(response.data);
              setAvatar(response.data.image);
              // console.log("avatar", avatar);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        if (error) console.log("widget error", error);
      }
    );

  const { mutate } = useMutation(
    async (data: FormData) =>
      await axios.put("/api/users/updateProfile", data),
    {
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.error || "Something went wrong", {
          id: "profile-toast",
        });
      },
      onSuccess: (data) => {
        toast.success("Profile has been updated 🔥", { id: "profile-toast" });
        console.log(data.data);
      },
    }
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: props.firstName,
      lastName: props.lastName,
      bio: props.bio,
    },
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: FormData) => {
    toast.loading("Updating Profile", { id: "profile-toast" });
    mutate(data);
  };
  // console.log("firstName", FirstName);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-center">
            <h6 className="text-blueGray-700 text-xl font-bold mb-9">
              My account
            </h6>
          </div>
        </div>
        <div className="w-full px-4 flex justify-center">
          <div className="relative">
            <Image
              alt="..."
              src={avatar || props.image as string}
              className="shadow-xl rounded-full h-auto align-middle border-none relative -mt-12 mb-2 ml-3 max-w-150-px"
              width={100}
              height={100}
              priority
            />
            <div className="justify-center flex">
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
                id="upload_widget"
                onClick={() => cloudinaryWidget.open()}
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              User Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="John"
                    {...register("firstName")}
                  />
                  <p className="text-red-500">{errors.firstName?.message}</p>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Doe"
                    {...register("lastName")}
                  />
                  <p className="text-red-500">{errors.lastName?.message}</p>
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              About Me
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    About me
                  </label>
                  <textarea
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Some text about you..."
                    rows={4}
                    {...register("bio")}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex">
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <p
        className="mt-2 mb-4 text-red-500 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        Delete account
      </p>
      {showModal && (
        <Modal
          modalTitle="Delete Account"
          closeModal={() => setShowModal(false)}
          footer={false}
          size={ModalSize.medium}
        >
          <DeleteUserForm closeModal={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
}
