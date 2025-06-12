import axios from 'axios';
import { getAuthHeaders, getCurrentUserName, getUserDetails } from '../utils/auth.utils';
import { FileUploadResponse } from '@/models/trainer.models';
import { TrainerFormDto } from '@/models/trainerDetails.model';
// import { headers } from 'next/headers';
// import { use } from 'react';

export const trainerApis = {
    // Get all trainers
    getAllTrainers: async (userName: string, page: number, page_size: number) => {



        const params: Record<string, string | number> = {};

        params.user = userName;
        params.page = page;
        params.page_size = page_size;

        try {
            const response = await axios.get('/api/method/trainer.api.get_all_trainers', {
                params,
            });
            return response.data.message;
        } catch (error) {
            console.error('Error fetching trainers:', error);
            throw error;
        }
    },

    getComapanyTrainers: async (userName: string) => {


        const params: Record<string, string> = {};
        params.user = userName;

        try {
            const response = await axios.get('/api/method/trainer.api.company_trainers', {
                params,
                withCredentials: true,
            });
            return response.data.message;
        } catch (error) {
            console.error('Error fetching company trainers:', error);
            throw error;
        }
    },

    // Search trainers with filters and fields
    searchTrainers: async (user: string, search_text?: string, city?: string, page: number = 1, limit: number = 10) => {
        try {
            const params: Record<string, string> = {};
            params.user = user;
            if (search_text) params.search_text = search_text;
            if (city) params.city_filter = city;
            params.page = page.toString();
            params.page_size = limit.toString();

            const response = await axios.get('/api/method/trainer.api.global_trainer_search', {
                params,
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
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.exc_type === "DoesNotExistError") {
                // Handle DoesNotExistError case
            }
            console.error('Error fetching trainer:', error);
            throw error;
        }
    },

    getTrainerByName: async (trainer: string) => {


        const headers = getAuthHeaders();


        try {
            const response = await axios.get(`/api/method/trainer.api.get_trainer?trainer_id=${trainer}`, {
                headers,
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.exc_type === "DoesNotExistError") {
                // Handle DoesNotExistError case
            }
            console.error('Error fetching trainer:', error);
            throw error;
        }
    },

    company: {
        getTrainerByName: async (trainer: string, user: string) => {


            const params: Record<string, string> = {};
            params.trainer_id = trainer;
            params.user = user;

            try {
                const response = await axios.get(`/api/method/trainer.api.get_trainer_profile`, {
                    params,
                    ...(user !== 'guest' && { headers: getAuthHeaders() })
                });

                return response.data;
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response?.data?.exc_type === "DoesNotExistError") {
                    // Handle DoesNotExistError case
                }
                console.error('Error fetching trainer:', error);
                throw error;
            }
        },
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
    },

    trainerForm: {

        editFormData: async (form: Partial<TrainerFormDto>) => {
            try {

                const userName = getCurrentUserName();
                const headers = getAuthHeaders();
                const response = await axios.put(
                    `/api/resource/Trainer/${userName}`,
                    form, {
                    headers,
                }
                );

                return response.data;
            } catch (error) {
                console.error('Error submitting trainer form:', error);
                throw error;
            }
        },
        createFormData: async (form: TrainerFormDto) => {

            const headers = getAuthHeaders();

            try {
                const response = await axios.post('/api/resource/Trainer', form, {
                    headers,
                });
                return response.data;
            } catch (error) {
                console.error('Error submitting trainer form:', error);
                throw error;
            }
        }
    },

    fileUpload: {
        uploadProfilePicture: async (file: File): Promise<FileUploadResponse> => {
            const headers = getAuthHeaders('multipart/form-data');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('is_private', '0');

            try {
                const response = await axios.post('/api/method/upload_file', formData, {
                    headers,
                });
                return response.data;
            } catch (error) {
                console.error('Error uploading file:', error);
                throw error;
            }
        },

        // Ratings and Reviews
        ratings: {
            submitReview: async (data: {
                user: string;
                trainer: string;
                rating: number;
                review: string;
            }) => {
                try {
                    const response = await axios.post('/api/resource/Ratings_Reviews', data, {
                        headers: getAuthHeaders()
                    });
                    return response.data;
                } catch (error) {
                    console.error('Error submitting review:', error);
                    throw error;
                }
            }
        }
    }
}; 