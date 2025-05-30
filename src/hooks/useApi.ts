import { useLoading } from '@/context/LoadingContext';
import axios, { AxiosRequestConfig } from 'axios';

export const useApi = () => {
    const { showLoader, hideLoader } = useLoading();

    const callApi = async <T>(config: AxiosRequestConfig): Promise<T> => {
        showLoader();
        try {
            const response = await axios(config);
            return response.data;
        } finally {
            hideLoader();
        }
    };

    return { callApi };
}; 