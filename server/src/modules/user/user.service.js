import userModel from "./user.model.js";

export const getUsersService = async () => {

    // Fetch all users except admin
    const users = await userModel.find({ role: { $not: { $eq: "admin" } } });

    // Return data
    return users;
};
