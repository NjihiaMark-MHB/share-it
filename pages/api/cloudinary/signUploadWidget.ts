import signUploadWidget from "@/utils/sign-upload-widget";
import { v2 as cloudinary } from "cloudinary";
require("../../../cloudinary.config");
import type { NextApiRequest, NextApiResponse } from "next";

const cloudName = cloudinary.config().cloud_name;
const apiKey = cloudinary.config().api_key;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // fetch all posts
    try {
      const signature = signUploadWidget();
	  const result = {
		signature: signature.signature,
		timestamp: signature.timestamp,
		cloudname: cloudName,
		apikey: apiKey
	  }
      res.status(200).json(result)
    } catch (error: any) {
      res.status(403).json({ error: error.message })
    }
  }
}