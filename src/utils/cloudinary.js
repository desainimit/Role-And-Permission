import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath); // remove local file after upload
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove local file if upload fails
    console.error("Error uploading file ", error);
    return null;
  }
};

export { connectCloudinary, uploadOnCloudinary };
