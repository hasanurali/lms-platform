import userModel from "./user.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, CLOUDINARY, REDIS_TTL } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js"
import crypto from "crypto"
import { getCache, setCache, deleteCacheByPattern } from "../../utils/cache.js";

// Common selection for user
const commonSelection = "_id name email profilePicture bio role"

export const getUsersService = async (page = 1, limit = 10) => {

    // Calculate page and limit
    const safePage = Math.max(parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    // Calculate skip
    const skip = (safePage - 1) * safeLimit;

    // Fetch all users except admin
    const result = await userModel.aggregate([
        { $match: { role: { $ne: "admin" } } },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: safeLimit },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            bio: 1,
                            role: 1,
                            profilePicture: "$profilePicture.url",
                        }
                    }
                ],
                total: [{ $count: "count" }]
            }
        }
    ]);

    const users = result[0].data;
    const total = result[0].total[0]?.count || 0;

    // Return data
    return {
        data: users,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            pages: Math.ceil(total / safeLimit),
            hasNext: safePage * safeLimit < total,
            hasPrev: safePage > 1,
        }
    };
};

export const getUserService = async (userId) => {

    // Check chche available 
    const cacheKey = `user:${userId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    };

    // Check valid id
    validateObjectId(userId);

    // Fetch user by id
    const user = await userModel.findById(userId).select(commonSelection).lean();
    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    };

    // Make result data for return and caching
    const resultData = {
        ...user,
        profilePicture: user.profilePicture?.url
    };

    // Set cache
    await setCache(cacheKey, resultData, REDIS_TTL._10M);

    // Return data
    return resultData;
};

export const updateProfileService = async (user, data) => {

    // Delete user releted cache keys
    deleteCacheByPattern(`user:${user._id}`);

    let { imageFile } = data;

    if (imageFile) {

        const currentImageHash = crypto.createHash("md5").update(imageFile.buffer).digest("hex");

        // Check is same image
        if (user.profilePicture?.hash !== currentImageHash) {

            // Upload new image while deleting the old one
            const [uploadResult] = await Promise.all([
                uploadToCloudinary(imageFile, CLOUDINARY.FOLDER.AVATAR),
                user.profilePicture?.publicId ? deleteFromCloudinary(user.profilePicture.publicId) : Promise.resolve()
            ]);

            data.profilePicture = {
                url: uploadResult.url,
                publicId: uploadResult.public_id,
                hash: uploadResult.hash
            };
        }

        delete data.imageFile;
    };

    // Update profile by user id
    const updatedUser = await userModel.findByIdAndUpdate(user._id, data, { returnDocument: "after" })
        .select(commonSelection)
        .lean();

    // Return data
    return {
        ...updatedUser,
        profilePicture: updatedUser.profilePicture?.url
    };

};