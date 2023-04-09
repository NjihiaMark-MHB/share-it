import { v2 as cloudinary } from "cloudinary";
require("../cloudinary.config");
const apiSecret = cloudinary.config().api_secret;

const signUploadWidget = () => {
	const timestamp = Math.round(new Date().getTime() / 1000);

	const signature = cloudinary.utils.api_sign_request({
		timestamp: timestamp,
		source: "upload_widget",
		folder: "share_it_profile_pictures",
	}, apiSecret as string);

	return { timestamp, signature };
}

export default signUploadWidget;