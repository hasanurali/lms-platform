import reviewModel from "./review.model.js";
import courseModel from "../course/course.model.js";

export const updateCourseRating = async (courseId) => {

    // Get all reviews
    const reviews = await reviewModel.find({ course: courseId })
        .select("rating")
        .lean();

    // Iff no reviews
    if (reviews.length === 0) {
        await courseModel.findByIdAndUpdate(courseId, {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            }
        });

        return;
    };

    // Initialize counters
    const distribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };

    let totalRating = 0;

    // Calculate totals
    for (const review of reviews) {
        distribution[review.rating]++;
        totalRating += review.rating;
    };

    const totalReviews = reviews.length;
    const averageRating = Math.round((totalRating / totalReviews) * 10) / 10;

    // Update course
    await courseModel.findByIdAndUpdate(courseId, {
        averageRating,
        totalReviews,
        ratingDistribution: distribution
    });
};