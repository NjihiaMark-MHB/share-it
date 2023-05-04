import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "../../../prisma/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "DELETE") {
		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			return res
				.status(401)
				.json({ message: "Please sign in to delete a post." });
		}

		const { postId } = req.query;


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

			const result = await prisma.post.delete({
				where: {
					id: postId as string,
				},
			});

			return res.json(result);

		} catch (err) {
			// console.log(err);
			return res.status(402).json({ err: "Error has occured while deleting a post" });
		}
	}
}