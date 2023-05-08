// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {

		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		try {
			const {body, postId} = req.body;

			const result = await prisma.comment.create({
				data: {
					body: body,
					userId: session.user.id as string,
					postId: postId
				},
			});
			return res.status(200).json(result)
		} catch (error: any) {
			return res.status(403).json({ error: error.message })
		}
	}
}
