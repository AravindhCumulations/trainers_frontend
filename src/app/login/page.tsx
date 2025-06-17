"use client";

import { useState, useCallback } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginModel, LoginFormData } from '@/models/auth.models';
import { motion } from 'framer-motion';
import { authApis } from '@/lib/apis/auth.apis';
import { setUserDetailsToLocalStore } from '@/lib/utils/auth.utils';
import { useLoading } from '@/context/LoadingContext';
import { useNavigation } from "@/lib/hooks/useNavigation";
import { useUser } from '@/context/UserContext';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useUser();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const { handleNavigation } = useNavigation();

    // Forgot Password States
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

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
                    isLoggedIn: true,
                    credits: 0
                });

                if (data.user_details.role_user === "Trainer") {
                    if (data.user_details.is_first_login) {
                        handleNavigation('/trainer-form');
                        return;
                    }
                    handleNavigation('/trainer-details', { 'trainer': data.user_details.name });
                } else {
                    handleNavigation('/');
                }
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message ?? 'Login failed. Please try again.';
            setError(errorMessage);
        } finally {
            hideLoader()
        }
    }, [formData, handleNavigation, hideLoader, router, setUser, showLoader]);


    // const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setError(null);
    //     showLoader();

    //     const validationError = validateLoginForm(formData);
    //     if (validationError) {
    //         setError(validationError);
    //         hideLoader();
    //         return;
    //     }

    //     try {
    //         const data = await authApis.login(formData.email, formData.password);
    //         const isStored = handleLoginSuccess(data);
    //         if (isStored) {
    //             navigateAfterLogin(data.user_details);
    //         }
    //     } catch (err: any) {
    //         handleLoginError(err);
    //     } finally {
    //         hideLoader();
    //     }
    // }, [formData, handleNavigation, hideLoader, router, setUser, showLoader]);

    // // --- Helper Functions ---
    // const validateLoginForm = (formData: any): string | null => {
    //     const loginModel = new LoginModel(formData);
    //     return loginModel.validate();
    // };

    // const handleLoginSuccess = (data: any): boolean => {
    //     if (data.user_details && data.key_details) {
    //         setUserDetailsToLocalStore(data);
    //         setUser({
    //             name: data.user_details.name,
    //             email: data.user_details.email,
    //             role: data.user_details.role_user === "Trainer" ? "Trainer" : "user_role",
    //             profilePic: '',
    //             isLoggedIn: true,
    //             credits: 0
    //         });
    //         return true;
    //     }
    //     return false;
    // };

    // const navigateAfterLogin = (userDetails: any) => {
    //     if (userDetails.role_user === "Trainer") {
    //         if (userDetails.is_first_login) {
    //             handleNavigation('/trainer-form');
    //         } else {
    //             handleNavigation('/trainer-details', { 'trainer': userDetails.name });
    //         }
    //     } else {
    //         handleNavigation('/');
    //     }
    // };

    // const handleLoginError = (err: any) => {
    //     console.error('Login error:', err);
    //     const errorMessage = err?.response?.data?.message ?? 'Login failed. Please try again.';
    //     setError(errorMessage);
    // };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: LoginFormData) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        showLoader();

        try {
            if (forgotPasswordStep === 'email') {
                await authApis.otp.generateOTP(forgotPasswordData.email);
                setForgotPasswordStep('otp');
                setError(null);
            } else if (forgotPasswordStep === 'otp') {
                const response = await authApis.otp.verifyOTP(forgotPasswordData.email, forgotPasswordData.otp);
                if (response.message.status === 'success') {
                    setError(null);
                    setForgotPasswordStep('reset');
                } else {
                    setError(response.message.message);
                }
            } else if (forgotPasswordStep === 'reset') {
                if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                await authApis.Password.resetPassword(forgotPasswordData.email, forgotPasswordData.newPassword);
                setShowForgotPassword(false);
                setForgotPasswordStep('email');
                setForgotPasswordData({
                    email: '',
                    otp: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setError(null);
            }
        } catch (err) {
            setError('Operation failed. Please try again.');
        } finally {
            hideLoader();
        }
    };

    // forgot password

    // const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setError(null);
    //     showLoader();

    //     try {
    //         switch (forgotPasswordStep) {
    //             case 'email':
    //                 await authApis.otp.generateOTP(forgotPasswordData.email);
    //                 setForgotPasswordStep('otp');
    //                 break;

    //             case 'otp':
    //                 const response = await authApis.otp.verifyOTP(forgotPasswordData.email, forgotPasswordData.otp);
    //                 if (response.message.status === 'success') {
    //                     setForgotPasswordStep('reset');
    //                 } else {
    //                     setError(response.message.message);
    //                 }
    //                 break;

    //             case 'reset':
    //                 if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
    //                     setError('Passwords do not match');
    //                     return;
    //                 }
    //                 await authApis.Password.resetPassword(forgotPasswordData.email, forgotPasswordData.newPassword);
    //                 resetForgotPasswordState();
    //                 break;
    //         }
    //     } catch (err: unknown) {
    //         console.error('Forgot password error:', err);
    //         if (isErrorWithMessage(err)) {
    //             setError(err.message);
    //         } else {
    //             setError('Operation failed. Please try again.');
    //         }
    //     } finally {
    //         hideLoader();
    //     }
    // };

    // // --- Helper Functions ---
    // const resetForgotPasswordState = () => {
    //     setShowForgotPassword(false);
    //     setForgotPasswordStep('email');
    //     setForgotPasswordData({
    //         email: '',
    //         otp: '',
    //         newPassword: '',
    //         confirmPassword: ''
    //     });
    //     setError(null);
    // };

    // const isErrorWithMessage = (err: unknown): err is { message: string } => {
    //     return typeof err === 'object' && err !== null && 'message' in err;
    // };

    // forgot password


    const handleForgotPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForgotPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex flex-col  h-screen  transition-colors duration-300 bg-theme">

            <div className="flex flex-1 flex-col justify-center items-center relative">
                <motion.div className="top-5 left-5 bg-blue-600 rounded-lg px-2.5 py-3 mb-2  hover:cursor-pointer hover:scale-105"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}>

                    <p className="text-white font-extrabold hover:scale-105" onClick={() => handleNavigation('/')}>Trainer&apos;s Mart</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full transition-colors duration-300"
                >
                    {!showForgotPassword ? (
                        <>
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
                                    whileHover={{ scale: formData.email && formData.password ? 1.05 : 1 }}
                                    whileTap={{ scale: formData.email && formData.password ? 0.95 : 1 }}
                                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors duration-300 relative ${formData.email && formData.password
                                        ? 'bg-primary hover:bg-primary-hover text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    disabled={!formData.email || !formData.password}
                                >
                                    login
                                </motion.button>
                            </form>

                            <p
                                className='forgot-password text-blue-600 dark:text-blue-400 cursor-pointer hover:underline text-center mt-4'
                                onClick={() => {
                                    setShowForgotPassword(true);
                                    setError(null);
                                }}
                            >
                                Forgot Password?
                            </p>

                            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 transition-colors duration-300">
                                Don&apos;t have an account?&nbsp;
                                <a className="text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-1 transition-colors duration-300 cursor-pointer"
                                    onClick={() => {
                                        handleNavigation('/signup');
                                        setError(null);
                                    }}
                                >Sign up</a>
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center mb-6 gap-3">
                                <button
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotPasswordStep('email');
                                        setForgotPasswordData({
                                            email: '',
                                            otp: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        setError(null);
                                    }}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                                >
                                    ⟵  &nbsp; back to login
                                </button>
                            </div>
                            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                                {forgotPasswordStep === 'email' ? 'Reset Password' :
                                    forgotPasswordStep === 'otp' ? 'Enter OTP' :
                                        'Set New Password'}
                            </h2>


                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleForgotPassword}>
                                {forgotPasswordStep === 'email' && (
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={forgotPasswordData.email}
                                            onChange={handleForgotPasswordInputChange}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                )}

                                {forgotPasswordStep === 'otp' && (
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">OTP</label>
                                        <input
                                            type="text"
                                            name="otp"
                                            value={forgotPasswordData.otp}
                                            onChange={handleForgotPasswordInputChange}
                                            placeholder="Enter OTP"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                )}

                                {forgotPasswordStep === 'reset' && (
                                    <>
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={forgotPasswordData.newPassword}
                                                onChange={handleForgotPasswordInputChange}
                                                placeholder="Enter new password"
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={forgotPasswordData.confirmPassword}
                                                onChange={handleForgotPasswordInputChange}
                                                placeholder="Confirm new password"
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-4">
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-lg font-semibold"
                                    >
                                        {forgotPasswordStep === 'email' ? 'Send OTP' :
                                            forgotPasswordStep === 'otp' ? 'Verify OTP' :
                                                'Reset Password'}
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            setForgotPasswordStep('email');
                                            setForgotPasswordData({
                                                email: '',
                                                otp: '',
                                                newPassword: '',
                                                confirmPassword: ''
                                            });
                                        }}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
                <a className="text-blue-600 font-semibold cursor-pointer mt-3 underline"
                    onClick={() => handleNavigation('/')}
                >skip</a>
            </div>

        </div>
    );
} 