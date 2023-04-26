// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "../../../prisma/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "DELETE") {
		// fetch all posts
		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const { deleteProfile } = req.query;
		if (deleteProfile == "Delete") {
			try {
				const result = await prisma.user.delete({
					where: {
						email: session?.user?.email,
					},
				});
				res.status(200).json(result);
			} catch (error: any) {
				res.status(403).json({ error: error.message });
			}
		}else{
			res.status(403).json({ error: "Invalid phrase request" });
		}
	}
}
