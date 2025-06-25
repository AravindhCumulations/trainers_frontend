'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SignupModel, User } from '@/models/auth.models';
import { authApis } from "@/lib/apis/auth.apis"
import { setUserDetailsToLocalStore } from '@/lib/utils/auth.utils';
import { useNavigation } from "@/lib/hooks/useNavigation";


export default function SignupPage() {

    const [formData, setFormData] = useState<User>({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        roles: []
    });
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
            last_name: lastName
        }));
    };

    const isFormValid = () => {
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.password.trim()) {
            setError('Password is required');
            return false;
        }
        if (!formData.first_name.trim()) {
            setError('First name is required');
            return false;
        }
        if (!formData.last_name.trim()) {
            setError('Last name is required');
            return false;
        }
        if (formData.roles.length === 0) {
            setError('Please select a role');
            return false;
        }
        if (formData.password !== rePassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };




    const handleSignup = async () => {
        setError(null);
        if (!isFormValid() || !formData) return;

        const signupData = getCleanedSignupData(formData);
        const validationError = validateSignupData(signupData);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const newUser = SignupModel.createUser(signupData);
            const data = await authApis.singUp(newUser);

            await handleSignupResponse(data);
        } catch (err) {
            setError('Failed to create account. Please try again.');
        }
    };

    // --- Helper Functions ---
    const getCleanedSignupData = (formData: User): User => ({
        ...formData,
        email: formData.email.trim(),
        password: formData.password.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        roles: formData.roles,
    });

    const validateSignupData = (data: User): string | null => {
        const model = new SignupModel(data);
        return model.validate();
    };

    const handleSignupResponse = async (data: any) => {
        if (data.status !== "success") {
            if (data.message?.status === "error" && data.message.message) {
                setError(data.message.message);
            }
            return;
        }

        if (!data.user_details || !data.key_details) return;

        const success = setUserDetailsToLocalStore(data);
        if (!success) return;

        if (data.user_details.role_user === "Trainer") {
            await handleNavigation('/trainer-form');
        } else {
            await handleNavigation('/');
        }
    };

    useEffect(() => {
        setError("")

    }, [formData]);


    return (


        <div className="flex flex-col h-screen bg-blue-100">
            <div className="flex flex-1 flex-col justify-center items-center ">
                <motion.div className="top-5 left-5 bg-blue-600 rounded-lg px-2.5 py-3 mb-2  hover:cursor-pointer hover:scale-105">
                    <p className="text-white font-extrabold hover:scale-105" onClick={() => handleNavigation('/')}>Trainer&apos;s Mart</p>
                </motion.div>
                <motion.div

                    className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full"
                >
                    <h2 className="text-[clamp(20px,5vw,30px)] font-bold text-center text-gray-900">Sign Up</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4">
                        <div className="flex mt-[2vh]">
                            <p className='mr-[0.5vw]'>Sign Up as:</p>
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

                        {/* <button
                            type="button"
                            onClick={handleSignup}
                            // disabled={!isFormValid()}
                            className={`w-full text-white px-4 py-2 rounded-lg transition-colors duration-300 bg-blue-500 hover:bg-blue-700 }`}
                        >
                            Continue
                        </button> */}
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 w-full bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-lg font-semibold"
                            onClick={handleSignup}
                        >
                            Continue
                        </motion.button>

                    </form>

                    <p className="text-center text-gray-600 mt-4">Already have an account? &nbsp;
                        <a className="text-blue-600 font-semibold cursor-pointer"
                            onClick={() => handleNavigation('/login')}
                        >Login</a>
                    </p>
                </motion.div>
                <a className="text-blue-600 font-semibold cursor-pointer mt-3 underline"
                    onClick={() => handleNavigation('/')}
                >skip</a>

            </div>

        </div >
    );
}


