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

		const prismaUser = await prisma.user.findUnique({
			where: {
				email: session.user?.email || undefined
			}
		});

		try {
			const {body} = req.body;

			const result = await prisma.post.create({
				data: {
					body: body,
					userId: prismaUser?.id as string,
				},
			});
			res.status(200).json(result)
		} catch (error: any) {
			res.status(403).json({ error: error.message })
		}
	}
}
