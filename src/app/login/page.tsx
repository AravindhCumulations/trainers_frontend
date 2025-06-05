"use client";

import { useState, useCallback } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginModel, LoginFormData } from '@/models/auth.models';
import { motion } from 'framer-motion';
import { useTheme } from '@/styles/ThemeProvider';
import { authApis } from '@/lib/apis/auth.apis';
import { setUserDetailsToLocalStore } from '@/lib/utils/auth.utils';
import { useLoading } from '@/context/LoadingContext';
import { useNavigation } from "@/lib/hooks/useNavigation";
import { useUser } from '@/context/UserContext';


export default function LoginPage() {

    const router = useRouter();
    const { theme } = useTheme();
    const { setUser } = useUser();
    // form
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const { handleNavigation } = useNavigation();

    // handles
    const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        showLoader()

        const loginModel = new LoginModel(formData);
        const validationError = loginModel.validate();

        if (validationError) {
            setError(validationError);
            hideLoader()
            return;
        }

        try {
            const data = await authApis.login(formData.email, formData.password);

            if (data.user_details && data.key_details) {
                setUserDetailsToLocalStore(data);

                // Set user context
                setUser({
                    name: data.user_details.name,
                    email: data.user_details.email,
                    role: data.user_details.role_user === "Trainer" ? "Trainer" : "user_role",
                    profilePic: '',
                    isLoggedIn: true
                });

                if (data.user_details.role_user === "Trainer") {
                    if (data) {
                        handleNavigation('/trainer-details', { 'trainer': data.user_details.name })
                    } else {
                        setError('Trainer profile not found');
                    }
                } else {
                    router.push("/");
                }
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            hideLoader()
        }
    }, [formData, handleNavigation, hideLoader, router, setUser, showLoader]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: LoginFormData) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flexCenter h-screen  transition-colors duration-300"
            style={{ background: theme.gradients.primary }}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full transition-colors duration-300"
            >
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 transition-colors duration-300">Welcome Back</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1 transition-colors duration-300">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1 transition-colors duration-300">Password</label>
                        <div className="flex relative">
                            <input
                                type={show ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            {
                                show ?
                                    <div className="absolute right-4 top-6">
                                        <EyeOff
                                            size={24}
                                            className="transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 transition-colors duration-300"
                                            onClick={() => setShow(!show)}
                                        />
                                    </div> :
                                    <div className="absolute right-4 top-6">
                                        <Eye
                                            size={24}
                                            className="transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 transition-colors duration-300"
                                            onClick={() => setShow(!show)}
                                        />
                                    </div>
                            }
                        </div>
                    </div>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300 relative"
                    // disabled={isLoading || isRouting}
                    >
                        login
                    </motion.button>
                </form>

                <p className="text-center text-gray-600 dark:text-gray-400 mt-4 transition-colors duration-300">
                    Don&apos;t have an account?
                    <a className="text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-1 transition-colors duration-300 cursor-pointer"
                        onClick={() => handleNavigation('/signup')}
                    >Sign up</a>
                </p>
            </motion.div>
        </div>
    );
} 