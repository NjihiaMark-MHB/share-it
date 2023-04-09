// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // fetch all posts
    try {
      const result = await prisma.post.findMany();
      res.status(200).json(result)
    } catch (error: any) {
      res.status(403).json({ error: error.message })
    }
  }
}
