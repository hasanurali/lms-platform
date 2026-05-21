import { config } from "../config/index.js"
import crypto from "crypto"

// Upload to cloudinary
export const uploadToCloudinary = async (file, folder, type = "image") => {

    if (type === "image" && !file.mimetype.startsWith("image/")) {
        throw new Error("Only images are allowed");
    };

    if (type === "video" && !file.mimetype.startsWith("video/")) {
        throw new Error("Only videos are allowed");
    };

    const hash = crypto.createHash("md5").update(file.buffer).digest("hex");

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await config.cloudinary.uploader.upload(base64, {
        resource_type: type,
        folder,
    });

    return {
        url: result.secure_url,
        public_id: result.public_id,
        hash
    };
};

// delete from cloudinary
export const deleteFromCloudinary = async (public_id, resource_type = "image") => {
    await config.cloudinary.uploader.destroy(public_id, { resource_type });
    return null;
};
