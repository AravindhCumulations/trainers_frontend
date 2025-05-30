import axios from 'axios';
import { getAuthHeaders, getUserDetails } from '../utils/auth.utils';
import { Email } from '@mui/icons-material';

export const trainerApis = {
    // Get all trainers
    getAllTrainers: async () => {
        try {
            const response = await axios.get('/api/resource/Trainer', {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trainers:', error);
            throw error;
        }
    },

    // Search trainers with filters and fields
    searchTrainers: async (user: string, search_text?: string, city?: string) => {
        try {
            const params: Record<string, string> = {};
            params.user = user;
            if (search_text) params.search_text = search_text;
            if (city) params.city_filter = city;

            const response = await axios.get('/api/method/trainer.api.global_trainer_search', {
                params,
                // headers: getAuthHeaders(),
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error('Error searching trainers:', error);
            throw error;
        }
    },


    // Get trainer by ID
    getTrainerById: async (id: string) => {
        try {
            const response = await axios.get(`/api/resource/Trainer/${id}`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trainer:', error);
            throw error;
        }
    },

    getTrainerByMail: async (name: string) => {
        try {
            const response = await axios.get(`/api/resource/Trainer`, {
                params: {
                    email: name,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.exc_type === "DoesNotExistError") {
                console.log("DoesNotExistError Occured ");
            }
            console.error('Error fetching trainer:', error);
            throw error;
        }
    },
    getTrainerByName: async (trainerHash: string) => {
        console.log("this is the trainer to fetch, ", trainerHash);

        try {
            const response = await axios.get(`/api/resource/Trainer/${trainerHash}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.exc_type === "DoesNotExistError") {
                console.log("DoesNotExistError Occured ");
            }
            console.error('Error fetching trainer:', error);
            throw error;
        }
    },



    // Wishlist related APIs
    wishlist: {
        // Add trainer to wishlist
        addToWishlist: async (trainerName: string) => {
            const user = getUserDetails();
            try {
                const response = await axios.post('/api/resource/Wishlist',
                    {
                        users: user.email,
                        trainers: trainerName
                    },
                    {
                        headers: getAuthHeaders()
                    }
                );
                return response.data;
            } catch (error) {
                console.error('Error adding to wishlist:', error);
                throw error;
            }
        },

        // Remove trainer from wishlist
        removeFromWishlist: async (trainerName: string) => {
            const user = getUserDetails();
            try {
                // First get the wishlist entry
                const response = await axios.get('/api/resource/Wishlist', {
                    params: {
                        fields: ["name"],
                        filters: JSON.stringify({ "users": user.email, "trainers": trainerName })
                    },
                    headers: getAuthHeaders()
                });

                if (response.data.data && response.data.data.length > 0) {
                    // Then delete it
                    await axios.delete(`/api/resource/Wishlist/${response.data.data[0].name}`, {
                        headers: getAuthHeaders()
                    });
                }
            } catch (error) {
                console.error('Error removing from wishlist:', error);
                throw error;
            }
        },

        // Get user's wishlist
        getUserWishlist: async () => {
            const user = getUserDetails();
            try {
                const response = await axios.get('/api/resource/Wishlist', {
                    params: {
                        filters: JSON.stringify({ "users": user.email })
                    },
                    headers: getAuthHeaders()
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                throw error;
            }
        }
    }
}; 