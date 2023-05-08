// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "../../../prisma/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "PUT") {
		// fetch all posts
		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const { body, commentId } = req.body;

		try {
			const comment = await prisma.comment.findUnique({
				where: { id: commentId as string },
				select: { userId: true },
			});
			if (!comment) {
				return res.status(404).json({ message: "Post not found" });
			}
			if (comment.userId !== session.user.id) {
				return res.status(403).json({ message: "Forbidden" });
			}
			const result = await prisma.comment.update({
				where: {
					id: commentId as string,
				},
				data: {
					body
				},
			});
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(403).json({ error: error.message });
		}
	}
}
