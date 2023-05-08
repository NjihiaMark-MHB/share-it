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

		const { commentId } = req.query;


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

			const result = await prisma.comment.delete({
				where: {
					id: commentId as string,
				},
			});

			return res.json(result);

		} catch (err) {
			// console.log(err);
			return res.status(402).json({ err: "Error has occured while deleting a post" });
		}
	}
}