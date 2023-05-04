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

		const { body, postId } = req.body;

		try {
			const post = await prisma.post.findUnique({
				where: { id: postId as string },
				select: { userId: true },
			});
			if (!post) {
				return res.status(404).json({ message: "Post not found" });
			}
			if (post.userId !== session.user.id) {
				return res.status(403).json({ message: "Forbidden" });
			}
			const result = await prisma.post.update({
				where: {
					id: postId as string,
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
