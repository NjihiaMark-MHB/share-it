import { getServerSession } from "next-auth/next";
import prisma from "../../../prisma/prisma";
import LoginRequired from "@/app/auth/auth-required";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import CardSettings from "@/app/components/cards/settings-card";

export const metadata = {
  title: "Share It - Profile",
  description: "Your profile page",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  async function getCurrentUser() {
    try {
      const result = await prisma.user.findUnique({
        where: {
          email: session?.user?.email,
        },
      });
      return result;
    } catch (error: any) {
      console.log(error.message);
      return { error: error.message };
    }
  }

  const currentUser: any = await getCurrentUser();

  return (
    <>
      {session ? (
        <>
          {!currentUser?.error ? (
            <div className="pt-40">
              <div className="container mx-auto px-2">
                <CardSettings
                  firstName={currentUser.name.split(" ")[0]}
                  lastName={currentUser.name.split(" ")[1]}
                  bio={currentUser.bio}
                  image={currentUser.image}
                />
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-2">
              <p className="text-red-500 mt-40">
                There was an error displaying this page
              </p>
            </div>
          )}
        </>
      ) : (
        <LoginRequired />
      )}
    </>
  );
}
