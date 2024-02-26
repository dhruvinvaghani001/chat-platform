import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 *
 * @param {localFilePath} localFilePath
 * @description upload files on clodinay
 */

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    //upload the file on clodinarry
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "chat-app",
    });
    // console.log(response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); //remove the localy saved temp file as the upload failed
    return null;
  }
};

export { uploadOnCloudinary };
