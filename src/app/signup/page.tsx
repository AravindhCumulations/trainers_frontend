'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SignupModel, User } from '@/models/auth.models';
import { authApis } from "@/lib/apis/auth.apis"
import { setUserDetailsToLocalStore } from '@/lib/utils/auth.utils';
import { useNavigation } from "@/lib/hooks/useNavigation";


export default function SignupPage() {

    const [formData, setFormData] = useState<User>();
    const [rePassword, setRePassword] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { handleNavigation } = useNavigation();



    const handleFullNameChange = (value: string) => {
        setFullName(value);
        const nameParts = value.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFormData(prev => ({
            ...prev,
            first_name: firstName,
            last_name: lastName,
            roles: prev?.roles || [],
            email: prev?.email || '',
            password: prev?.password || ''
        }));
    };


    const handleSignup = async () => {
        setError(null);




        try {
            if (formData) {

                // Ensure the data is properly formatted
                const signupData: User = {
                    ...formData,
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                    roles: formData.roles
                };




                const signupModel = new SignupModel(signupData);
                const validationError = signupModel.validate();

                if (validationError) {




                    setError(validationError);
                    return;
                }

                const newUser = SignupModel.createUser(signupData);


                const data = await authApis.singUp(newUser);




                if (data.status === "success") {
                    if (data.user_details && data.key_details) {
                        const success: boolean = setUserDetailsToLocalStore(data);
                        if (success) {
                            if (data.user_details.role_user === "Trainer") {

                                if (data) {
                                    // router.push(`/trainer-form`);
                                    await handleNavigation('/trainer-form')
                                } else {
                                    setError('Trainer profile not found');
                                }
                            } else {
                                await handleNavigation('/')
                            }
                        }

                    }
                }
                else {
                    if (data.message.status === "error" && data.message.message)
                        setError(data.message.message);
                }

            }
        } catch (err) {
            setError('Failed to create account. Please try again.');
        }
    };

    useEffect(() => {
        setError("")

    }, [formData]);


    return (


        <div className="flex justify-center items-center h-screen bg-blue-100">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full"
            >
                <h2 className="text-3xl font-bold text-center text-gray-900">Sign Up</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form className="space-y-4">
                    <div className="flex mt-[2vh]">
                        <p className='mr-[0.5vw]'>SignUp as:</p>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="role"
                                value="Trainer"
                                checked={formData?.roles[0] === "Trainer"}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    roles: [e.target.value],
                                    first_name: prev?.first_name || '',
                                    last_name: prev?.last_name || '',
                                    email: prev?.email || '',
                                    password: prev?.password || ''
                                }))}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Trainer</span>
                        </label>

                        <label className="flex items-center space-x-2 ml-4">
                            <input
                                type="radio"
                                name="role"
                                value="user_role"
                                checked={formData?.roles[0] === "user_role"}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    roles: [e.target.value],
                                    first_name: prev?.first_name || '',
                                    last_name: prev?.last_name || '',
                                    email: prev?.email || '',
                                    password: prev?.password || ''
                                }))}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Company</span>
                        </label>
                    </div>

                    {formData?.roles[0] === 'company' ? (
                        <div>
                            <label className="block text-gray-700">Company Name</label>
                            <input
                                name="fullName"
                                value={fullName}
                                onChange={(e) => handleFullNameChange(e.target.value)}
                                type="text"
                                placeholder="Enter your company name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-gray-700">Full Name</label>
                            <input
                                name="fullName"
                                value={fullName}
                                onChange={(e) => handleFullNameChange(e.target.value)}
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            name="email"
                            value={formData?.email}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                email: e.target.value,
                                roles: prev?.roles || [],
                                first_name: prev?.first_name || '',
                                last_name: prev?.last_name || '',
                                password: prev?.password || ''
                            }))}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            name="password"
                            value={formData?.password}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                password: e.target.value,
                                roles: prev?.roles || [],
                                first_name: prev?.first_name || '',
                                last_name: prev?.last_name || '',
                                email: prev?.email || ''
                            }))}
                            type="password"
                            placeholder="Create a password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Re-enter Password</label>
                        <input
                            name="rePassword"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            type="password"
                            placeholder="Create a password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {formData?.password && rePassword && formData.password !== rePassword ? (
                        <p className="text-red-600">Password doesn&apos;t match</p>
                    ) : (
                        <p></p>
                    )}

                    <button
                        type="button"
                        onClick={handleSignup}
                        disabled={!formData?.email || !formData?.password || !formData?.first_name || !formData?.last_name || !formData?.roles?.length || formData.password !== rePassword}
                        className={`w-full px-4 py-2 rounded-lg transition-colors duration-300 ${!formData?.email || !formData?.password || !formData?.first_name || !formData?.last_name || !formData?.roles?.length || formData.password !== rePassword
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-700 text-white"
                            }`}
                    >
                        Continue
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">Already have an account?
                    <a className="text-blue-600 font-semibold cursor-pointer"
                        onClick={() => handleNavigation('/login')}
                    >Login</a>
                </p>
            </motion.div>
        </div>
    );
}


