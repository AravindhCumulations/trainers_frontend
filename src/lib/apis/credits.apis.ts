import axios from 'axios';
import { getAuthHeaders, getUserDetails } from '../utils/auth.utils';

export const creditsApis = {
    // Get user credits
    getUserCredits: async () => {
        const user = getUserDetails();
        try {
            const response = await axios.get('/api/resource/Credits', {
                params: {
                    filters: JSON.stringify({ "user": user.email })
                },
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user credits:', error);
            throw error;
        }
    },

    // Add credits to user
    addCredits: async (amount: number) => {
        const user = getUserDetails();
        try {
            const response = await axios.post('/api/resource/Credits', {
                user: user.email,
                amount: amount,
                type: 'credit'
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding credits:', error);
            throw error;
        }
    },

    // Deduct credits from user
    deductCredits: async (amount: number) => {
        const user = getUserDetails();
        try {
            const response = await axios.post('/api/resource/Credits', {
                user: user.email,
                amount: amount,
                type: 'debit'
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error deducting credits:', error);
            throw error;
        }
    },

    // Get credit history
    getCreditHistory: async () => {
        const user = getUserDetails();
        try {
            const response = await axios.get('/api/resource/Credit History', {
                params: {
                    filters: JSON.stringify({ "user": user.email })
                },
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching credit history:', error);
            throw error;
        }
    }
}; 