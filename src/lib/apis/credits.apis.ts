import axios from 'axios';
import { getAuthHeaders, getUserDetails } from '../utils/auth.utils';
import { toast } from 'react-hot-toast';

export const creditsApis = {
    // Get user credits
    getUserCredits: async () => {
        const user = getUserDetails();
        try {
            const response = await axios.get(`/api/resource/Credits?fields=["credits"]&filters=${encodeURIComponent(JSON.stringify({ "user": user.email }))}`, {
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
    deductCredits: async (name: string) => {
        const user = getUserDetails();
        try {
            const response = await axios.post(`/api/method/trainer.api.deduct_credits`, {
                user: user.email,
                trainer: name
            }, {
                headers: getAuthHeaders(),
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
    },

    // Unlock trainer profile
    unlockTrainer: async (trainerName: string) => {
        try {
            const response = await creditsApis.deductCredits(trainerName);
            return response.message.success;
        } catch (error) {
            console.error('Error unlocking trainer:', error);
            toast.error('An error occurred while trying to unlock the trainer');
            return false;
        }
    },

    // Create order for payment
    createOrder: async (username: string, amount: number) => {
        try {
            const response = await axios.post('/api/method/trainer.api.create_order', {
                username: username,
                amount: amount
            },
                {
                    headers: getAuthHeaders(),
                });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Verify payment and update credits
    verifyPaymentAndUpdateCredits: async (paymentId: string, orderId: string, signature: string) => {
        try {
            const response = await axios.post('/api/method/trainer.api.verify_payment_and_update_credits', {
                razorpay_payment_id: paymentId,
                razorpay_order_id: orderId,
                razorpay_signature: signature
            }, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error verifying payment and updating credits:', error);
            throw error;
        }
    },

    // Get credit transaction history
    getCreditTransactionHistory: async () => {
        const user = getUserDetails();
        try {
            const response = await axios.get('/api/resource/Credit Transaction', {
                params: {
                    filters: JSON.stringify([["user", "=", user.email]]),
                    fields: JSON.stringify(["user", "credits", "transaction_type", "amount", "reference_trainer", "trainer_name"])
                },
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching credit transaction history:', error);
            throw error;
        }
    }
};