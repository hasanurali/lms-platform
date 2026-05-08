import userModel from "./user.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, CLOUDINARY } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/Cloudinary.js"
import crypto from "crypto"

export const getUsersService = async () => {

    // Fetch all users except admin
    const users = await userModel.find({ role: { $not: { $eq: "admin" } } });

    // Return data
    return users;
};

export const getUserService = async (userId) => {

    // Check valid id
    validateObjectId(userId);

    // Fetch user by id
    const user = await userModel.findById(userId);
    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    };

    // Return data
    return user;
};

export const updateProfileService = async (userId, data) => {

    let { imageFile } = data;

    if (imageFile) {

        const userImage = await userModel.findById(userId).select("profilePicture");
        const currentImageHash = crypto.createHash("md5").update(imageFile.buffer).digest("hex");

        // Check is same image
        if (userImage.profilePicture?.hash !== currentImageHash) {

            // Delete from cloudinary
            await deleteFromCloudinary(userImage.profilePicture.publicId)

            // Uplode to cloudinary
            const { url, public_id, hash } = await uploadToCloudinary(imageFile, CLOUDINARY.FOLDER.AVATAR);
            data.profilePicture = {
                url,
                publicId: public_id,
                hash
            }
        }

        delete data.imageFile;
    };

    // Update profile by user id
    const user = await userModel.findByIdAndUpdate(userId, data, { returnDocument: "after" });

    // Return data
    return user;
};