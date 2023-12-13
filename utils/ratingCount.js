import { getUserOrderRating } from "../api/database";

export const ratingCount = async (ownerId) => {
    try {
        if (ownerId) {
            const data = await getUserOrderRating(ownerId);
            if (data.found && data.success) {
                const existingData = data.data;
                if (existingData.length > 0) {
                    const totalRating = existingData.reduce((acc, rating) => acc + rating.rating, 0);
                    const averageRating = totalRating / existingData.length;
                    const res = {
                        rating:  averageRating.toFixed(),
                        total : existingData.length,
                     };
                    return res;
                } else {
                    console.log('No ratings found for the user with ownerId:', ownerId);
                }
            }
        }
    } catch (error) {
        console.error('An error occurred while fetching rating data:', error);
    }
};
