"use client";

import { useState, useCallback } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginModel, LoginFormData } from '@/models/auth.models';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const loginModel = new LoginModel(formData);
        const validationError = loginModel.validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {

            const response = await fetch('/api/method/trainer.api.customLogin', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "usr": formData.email, "pwd": formData.password }),
                credentials: 'include'
            });// use global axios setup

            const data = await response.json();

            if (data.user_details && data.key_details) {

                localStorage.setItem("user_details", JSON.stringify(data.user_details));
                localStorage.setItem("auth", JSON.stringify(data.key_details));
            }

            if (data.user_details.role_user == "Trainer") {



                const response1 = await fetch(
                    `/api/resource/Trainer?filters=${JSON.stringify({ trainer: data.user_details.email })}`,
                    {
                        method: "GET",
                        headers: {
                            'Authorization': `token ${data.key_details.api_key}:${data.key_details.api_secret}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                );


                // Convert response to JSON
                const responseData = await response1.json();
                const trainerName = responseData.data[0].name;
                console.log("dfadf", responseData.data[0].name);

                router.push(`/trainer-details?${trainerName}`);

                //  1 need to add and check first time login to route 
            }
            else {

                // same 1 here
                router.push("/");
            }


        } catch (err) {
            setError('Login failed. Please try again.');
        }
    }, [formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (

        <div className="flex justify-center items-center h-screen bg-gradient-to-r bg-blue-100 translate-transform">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full"
            >
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Welcome Back</h2>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                        <div className="flex relative">
                            <input
                                type={show ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            {
                                show ?
                                    <div className="absolute right-4 top-6">
                                        <EyeOff
                                            size={24}
                                            className="transform -translate-y-1/2 cursor-pointer text-gray"
                                            onClick={() => setShow(!show)}
                                        />
                                    </div> :
                                    <div className="absolute right-4 top-6">
                                        <Eye
                                            size={24}
                                            className="transform -translate-y-1/2 cursor-pointer text-gray"
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
                        className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Login
                    </motion.button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?
                    <a href="/signup" className="text-blue-600 font-semibold hover:underline ml-1">Sign up</a>
                </p>
            </motion.div>
        </div>
    );
} 