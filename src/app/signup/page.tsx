'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SignupModel, User } from '@/models/auth.models';
import { authApis } from "@/lib/apis/auth.apis"
import { setUserDetailsToLocalStore } from '@/lib/utils/auth.utils';
import { useNavigation } from "@/lib/hooks/useNavigation";
import { Eye, EyeOff, X } from "lucide-react";
import { useUser } from '@/context/UserContext';
import { trainerTerms, companyTerms } from '../content/terms';
// import { useSearchParams } from 'next/navigation';


export default function SignupPage() {

    const { setUser, resetUser } = useUser();
    // const searchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
    const [formData, setFormData] = useState<User>({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        roles: ['Trainer']
    });
    const [rePassword, setRePassword] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { handleNavigation } = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [showTermsPopup, setShowTermsPopup] = useState(false);
    const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

    // Initialize searchParams on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSearchParams(new URLSearchParams(window.location.search));
        }
    }, []);

    // Handle URL parameters for role selection
    useEffect(() => {
        if (searchParams) {
            const roleParam = searchParams.get('role');
            if (roleParam === 'company') {
                setFormData(prev => ({
                    ...prev,
                    roles: ['user_role']
                }));
            }
        }
    }, [searchParams]);

    // Reset terms agreement when role changes
    useEffect(() => {
        setHasAgreedToTerms(false);
    }, [formData.roles]);

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
        if (formData.roles.length === 0) {
            setError('Please select a role');
            return false;
        }
        if (formData.password !== rePassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!hasAgreedToTerms) {
            setError('Please agree to the terms and conditions');
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
        const responseData = data.data || data;
        
        if (responseData.status !== "success") {
            if (responseData.message?.status === "error" && responseData.message.message) {
                setError(responseData.message.message);
            }
            return;
        }

        if (!responseData.user_details || !responseData.key_details) return;

        const success = setUserDetailsToLocalStore(responseData);
        resetUser();
        setUser({
            name: responseData.user_details.name,
            email: responseData.user_details.email,
            role: responseData.user_details.role_user === "Trainer" ? "Trainer" : "user_role",
            profilePic: '',
            isLoggedIn: true,
            credits: 0
        });

        if (!success) return;

        const userRole = responseData.user_details.role_user;
        
        if (userRole === "Trainer" || userRole === "trainer" || userRole === "TRAINER") {
            await handleNavigation('/trainer-form');
        } else if (userRole === "user_role" || userRole === "User_Role" || userRole === "USER_ROLE") {
            await handleNavigation('/company-form');
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

                <motion.div

                    className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full"
                >
                    {/* <p className="text-blue-600 text-xl font-extrabold hover:scale-105 self-center mb-3 text-center">Trainer&apos;s Mart</p> */}
                    <svg width="120" height="92" className="block mx-auto hover:scale-105 transition-transform mb-5" viewBox="0 0 35 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.77734 17.3105V11.9053C2.77734 11.7705 2.73047 11.6562 2.63672 11.5625C2.54297 11.4629 2.42578 11.4131 2.28516 11.4131C2.15039 11.4131 2.03613 11.4629 1.94238 11.5625C1.84863 11.6562 1.80176 11.7705 1.80176 11.9053V17.3105C1.80176 17.4453 1.84863 17.5596 1.94238 17.6533C2.03613 17.7471 2.15039 17.7939 2.28516 17.7939C2.42578 17.7939 2.54297 17.7471 2.63672 17.6533C2.73047 17.5596 2.77734 17.4453 2.77734 17.3105ZM1.80176 21.2568V23.4893C1.80176 23.624 1.84863 23.7383 1.94238 23.832C2.03613 23.9258 2.15039 23.9727 2.28516 23.9727C2.42578 23.9727 2.54297 23.9258 2.63672 23.832C2.73047 23.7383 2.77734 23.624 2.77734 23.4893V21.2568C2.77734 21.1221 2.73047 21.0049 2.63672 20.9053C2.54297 20.8115 2.42578 20.7646 2.28516 20.7646C2.15039 20.7646 2.03613 20.8115 1.94238 20.9053C1.84863 21.0049 1.80176 21.1221 1.80176 21.2568ZM4.37695 10.3057V11.2637H4.10449C4.22168 11.5273 4.28027 11.7998 4.28027 12.0811V17.1348C4.28027 17.6797 4.08398 18.1484 3.69141 18.541C3.30469 18.9277 2.83594 19.1211 2.28516 19.1211C2.13281 19.1211 1.97754 19.1006 1.81934 19.0596C1.77246 19.0361 1.71973 19.0215 1.66113 19.0156C1.65527 19.0156 1.64355 19.0156 1.62598 19.0156C1.45605 19.0273 1.37109 19.0977 1.37109 19.2266C1.37109 19.373 1.68457 19.4463 2.31152 19.4463C2.85645 19.4463 3.31934 19.6426 3.7002 20.0352C4.08691 20.4219 4.28027 20.8877 4.28027 21.4326V23.3135C4.28027 23.8584 4.08398 24.3271 3.69141 24.7197C3.30469 25.1064 2.83594 25.2998 2.28516 25.2998C1.74023 25.2998 1.27441 25.1064 0.887695 24.7197C0.495117 24.3271 0.298828 23.8584 0.298828 23.3135V21.4326C0.298828 21.04 0.445313 20.6094 0.738281 20.1406C0.392578 19.877 0.225586 19.584 0.237305 19.2617C0.249023 18.9395 0.427734 18.6758 0.773438 18.4707C0.457031 17.9492 0.298828 17.5039 0.298828 17.1348V12.0811C0.298828 11.5303 0.495117 11.0615 0.887695 10.6748C1.27441 10.2881 1.74023 10.0947 2.28516 10.0947C2.60156 10.0947 2.90332 10.165 3.19043 10.3057H4.37695ZM6.31934 14.4893H7.30371V11.8965C7.30371 11.7617 7.25684 11.6475 7.16309 11.5537C7.06348 11.46 6.94629 11.4131 6.81152 11.4131C6.67676 11.4131 6.5625 11.46 6.46875 11.5537C6.36914 11.6475 6.31934 11.7617 6.31934 11.8965V14.4893ZM5.40527 10.666C5.79785 10.2793 6.2666 10.0859 6.81152 10.0859C7.3623 10.0859 7.83105 10.2793 8.21777 10.666C8.61035 11.0586 8.80664 11.5273 8.80664 12.0723V15.9658H6.31934V19.2705C6.31934 19.4053 6.36914 19.5195 6.46875 19.6133C6.5625 19.707 6.67676 19.7539 6.81152 19.7539C6.94629 19.7539 7.06348 19.707 7.16309 19.6133C7.25684 19.5195 7.30371 19.4053 7.30371 19.2705V16.6074H8.80664V19.0947C8.80664 19.6396 8.61035 20.1084 8.21777 20.501C7.83105 20.8877 7.3623 21.0811 6.81152 21.0811C6.2666 21.0811 5.79785 20.8877 5.40527 20.501C5.01855 20.1084 4.8252 19.6396 4.8252 19.0947V12.0723C4.8252 11.5273 5.01855 11.0586 5.40527 10.666ZM11.6191 10.2881V11.7559H11.127V20.8789H9.65039V11.7559H9.16699V10.2881H9.65039V7.33496H11.127V10.2881H11.6191ZM20.918 15.1572V9.45312C20.918 9.18945 20.833 9.00781 20.6631 8.9082C20.5811 8.86133 20.4961 8.84082 20.4082 8.84668H20.083V15.7637H20.4082C20.4961 15.7695 20.5811 15.749 20.6631 15.7021C20.833 15.6025 20.918 15.4209 20.918 15.1572ZM22.3682 9.22461V15.3857C22.3682 15.5498 22.3652 15.6904 22.3594 15.8076C22.3418 16.1182 22.3008 16.3672 22.2363 16.5547C22.0723 17.0352 21.7031 17.2754 21.1289 17.2754H20.083V20.8789H18.6064V7.33496H21.1289C21.7031 7.33496 22.0723 7.5752 22.2363 8.05566C22.3008 8.24902 22.3418 8.49805 22.3594 8.80273C22.3652 8.91992 22.3682 9.06055 22.3682 9.22461ZM25.2773 11.6416C25.2305 11.5596 25.0869 11.5186 24.8467 11.5186C24.7119 11.5186 24.5889 11.5654 24.4775 11.6592C24.3604 11.7588 24.3018 11.873 24.3018 12.002V20.8789H22.8076V10.2793H24.2842V10.6221C24.2783 10.6221 24.2812 10.6162 24.293 10.6045C24.3047 10.5928 24.3193 10.5781 24.3369 10.5605C24.3955 10.5137 24.46 10.4668 24.5303 10.4199C24.7588 10.2852 25.0078 10.209 25.2773 10.1914V11.6416ZM27.0439 11.8965V19.2705C27.0439 19.4053 27.0938 19.5195 27.1934 19.6133C27.2871 19.707 27.4014 19.7539 27.5361 19.7539C27.6709 19.7539 27.7881 19.707 27.8877 19.6133C27.9814 19.5195 28.0283 19.4053 28.0283 19.2705V11.8965C28.0283 11.7617 27.9814 11.6475 27.8877 11.5537C27.7881 11.46 27.6709 11.4131 27.5361 11.4131C27.4014 11.4131 27.2871 11.46 27.1934 11.5537C27.0938 11.6475 27.0439 11.7617 27.0439 11.8965ZM26.1299 10.666C26.5225 10.2793 26.9912 10.0859 27.5361 10.0859C28.0869 10.0859 28.5557 10.2793 28.9424 10.666C29.335 11.0586 29.5312 11.5273 29.5312 12.0723V19.0947C29.5312 19.6396 29.335 20.1084 28.9424 20.501C28.5557 20.8877 28.0869 21.0811 27.5361 21.0811C26.9912 21.0811 26.5225 20.8877 26.1299 20.501C25.7432 20.1084 25.5498 19.6396 25.5498 19.0947V12.0723C25.5498 11.5273 25.7432 11.0586 26.1299 10.666ZM30.5596 10.6924C30.9521 10.2998 31.4209 10.1035 31.9658 10.1035C32.5166 10.1035 32.9854 10.2998 33.3721 10.6924C33.7646 11.0791 33.9609 11.5479 33.9609 12.0986V14.1729H32.458V11.9229C32.458 11.7881 32.4111 11.6709 32.3174 11.5713C32.2178 11.4775 32.1006 11.4307 31.9658 11.4307C31.8311 11.4307 31.7168 11.4775 31.623 11.5713C31.5293 11.6709 31.4824 11.7881 31.4824 11.9229V14.2432C31.4824 14.3721 31.5205 14.4834 31.5967 14.5771C31.6846 14.6768 31.793 14.7266 31.9219 14.7266H32.2031C32.9648 14.7266 33.4863 15.0811 33.7676 15.79C33.8555 16.0127 33.9141 16.2588 33.9434 16.5283C33.9492 16.6104 33.9551 16.6895 33.9609 16.7656C33.9609 16.7891 33.9609 16.8125 33.9609 16.8359V19.2705V19.2793C33.9141 19.7891 33.7002 20.2168 33.3193 20.5625C32.9385 20.9082 32.4873 21.0811 31.9658 21.0811C31.4502 21.0811 31.002 20.9082 30.6211 20.5625C30.2402 20.2168 30.0264 19.792 29.9795 19.2881V17.0205H31.4824V19.2705C31.4824 19.4053 31.5293 19.5195 31.623 19.6133C31.7168 19.707 31.8311 19.7539 31.9658 19.7539C32.1006 19.7539 32.2178 19.707 32.3174 19.6133C32.4111 19.5195 32.458 19.4053 32.458 19.2705V16.8623C32.458 16.54 32.3115 16.3789 32.0186 16.3789H31.9219C31.3594 16.3789 30.8818 16.1592 30.4893 15.7197C30.1494 15.3389 29.9795 14.8965 29.9795 14.3926V12.0986C29.9795 11.5479 30.1729 11.0791 30.5596 10.6924Z" fill="#2563EB"/>
                        <path d="M17.5 13.4286L16.5625 12H13.4403L12.5 13.4286M17.5 13.4286L15 17M17.5 13.4286H12.5M15 17L12.5 13.4286M15 17L14.0625 13.4286M15 17L15.9375 13.4286" stroke="#2563EB" stroke-width="0.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

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

                        {formData?.roles[0] === 'user_role' ? (
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
                            <div className="flex relative">
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="w-full flex flex-1  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {showPassword ? (
                                    <div className="absolute right-4 top-5">
                                        <EyeOff
                                            size={22}
                                            className="transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={() => setShowPassword(false)}
                                        />
                                    </div>
                                ) : (
                                    <div className="absolute right-4 top-5">
                                        <Eye
                                            size={22}
                                            className="transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={() => setShowPassword(true)}
                                        />
                                    </div>
                                )}

                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700">Re-enter Password</label>
                            <div className="flex relative">
                                <input
                                    name="rePassword"
                                    value={rePassword}
                                    onChange={(e) => setRePassword(e.target.value)}
                                    type={showRePassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {showRePassword ? (
                                    <div className="absolute right-4 top-5">
                                        <EyeOff
                                            size={22}
                                            className="transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={() => setShowRePassword(false)}
                                        />
                                    </div>
                                ) : (
                                    <div className="absolute right-4 top-5">
                                        <Eye
                                            size={22}
                                            className="transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={() => setShowRePassword(true)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {formData?.password && rePassword && formData.password !== rePassword ? (
                            <p className="text-red-600">Password doesn&apos;t match</p>
                        ) : (
                            <p></p>
                        )}

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={hasAgreedToTerms}
                                onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-500 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                                    I agree to the{' '}
                                    <button
                                        type="button"
                                        onClick={() => setShowTermsPopup(true)}
                                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                                    >
                                        Terms and Conditions
                                    </button>
                                </label>
                            </div>
                        </div>

                        <motion.button
                            type="button"
                            whileHover={hasAgreedToTerms ? { scale: 1.05 } : {}}
                            whileTap={hasAgreedToTerms ? { scale: 0.95 } : {}}
                            className={`flex-1 w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                                hasAgreedToTerms 
                                    ? 'bg-primary hover:bg-primary-hover text-white cursor-pointer' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={hasAgreedToTerms ? handleSignup : undefined}
                            disabled={!hasAgreedToTerms}
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
                >Go Back</a>

            </div>

            {/* Terms and Conditions Popup */}
            {showTermsPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">
                                Terms and Conditions - {formData.roles[0] === 'Trainer' ? 'Trainer' : 'Company'}
                            </h2>
                            <button
                                onClick={() => setShowTermsPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                                    {formData.roles[0] === 'Trainer' ? trainerTerms : companyTerms}
                                </pre>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowTermsPopup(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setHasAgreedToTerms(true);
                                        setShowTermsPopup(false);
                                    }}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    I Agree
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
}



