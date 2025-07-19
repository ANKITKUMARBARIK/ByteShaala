import cloudinary from "../config/cloudinary.controller.js";
import streamifier from "streamifier";

export const uploadOnCloudinary = async (fileBuffer) => {
    if (!fileBuffer) return null;

    try {
        return await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(fileBuffer).pipe(stream);
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return null;

    try {
        const response = await cloudinary.uploader.destroy(publicId);

        if (response.result !== "ok") {
            console.warn("cloudinary deletion failed:", response);
            return null;
        }

        console.log("deleted from cloudinary. PUBLIC ID - ", publicId);

        return response;
    } catch (err) {
        console.error("error deleting from cloudinary ", err.message);

        return null;
    }
};
