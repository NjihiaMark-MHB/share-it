// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		const session = await getServerSession(req, res, authOptions);
		console.log("session", session);
		if (!session) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		// fetch all posts
		try {
			const result = await prisma.user.findUnique({
				where: {
					email: session.user?.email
				}
			}
			);
			res.status(200).json(result)
		} catch (error: any) {
			res.status(403).json({ error: error.message })
		}
	}
}