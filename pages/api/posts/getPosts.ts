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
      // get page and lastCursor from query
      const { take, lastCursor } = req.query;

      let result = await prisma.post.findMany({
        take: take ? parseInt(take as string) : 7,
        ...(lastCursor && {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: lastCursor as string,
          }
        }),
        include: {
          user: true,
          PostLike: true,
        },
        orderBy: {
          createdAt: "desc",
        }
      }
      );


      if (result.length == 0) {
        return res.status(200).json({
          data: [],
          metaData: {
            lastCursor: null,
            hasNextPage: false,
          },
        });
      }

      const lastPostInResults: any = result[result.length - 1];
      const cursor: any = lastPostInResults.id;

      const nextPage = await prisma.post.findMany({
        // Same as before, limit the number of events returned by this query.
        take: take ? parseInt(take as string) : 7,
        skip: 1, // Do not include the cursor itself in the query result.
        cursor: {
          id: cursor,
        },
      });

      const data = {
        data: result, metaData: {
          lastCursor: cursor,
          hasNextPage: nextPage.length > 0,
        }
      };

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(403).json({ error: error.message })
    }
  }
}
