'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SignupModel, SignupFormData } from '@/models/auth.models';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<SignupFormData>({
        role: 'trainer',
        companyName: '',
        email: '',
        password: '',
        rePassword: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = () => {
        setError(null);

        const signupModel = new SignupModel(formData);
        const validationError = signupModel.validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const newUser = SignupModel.createUser(formData);
            console.log('User created:', newUser);
            //<- replace with api call
            if (formData.role === 'trainer') {
                window.location.href = '/trainer-form';
            } else {
                window.location.href = '/';
            }

            // Make API call to signup endpoint
            // fetch('http://3.94.205.118:8000/api/method/signup', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(signupModel.toJSON())
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         if (data.message && data.message.user) {
            //             // Store user details in localStorage
            //             localStorage.setItem('user_details', JSON.stringify(data.message.user));

            //             // Handle redirection based on user type
            //             if (data.message.user.role === 'trainer') {
            //                 // Always redirect to trainer-form for new trainers
            //                 window.location.href = '/trainer-form';
            //             } else {
            //                 window.location.href = '/';
            //             }
            //         } else {
            //             setError('Failed to create account. Please try again.');
            //         }
            //     })
            //     .catch(err => {
            //         setError('Failed to create account. Please try again.');
            //     });
        } catch (err) {
            setError('Failed to create account. Please try again.');
        }
    };

    return (
        // <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        //     <div className="sm:mx-auto sm:w-full sm:max-w-md">
        //         <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Create your account</h2>
        //         <p className="mt-2 text-center text-sm text-gray-600">
        //             Already have an account?{' '}
        //             <a href="/login" className="font-medium text-primary hover:text-primary-light">
        //                 Sign in
        //             </a>
        //         </p>
        //     </div>

        //     <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        //         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        //             <form className="space-y-6" onSubmit={handleSignup}>
        //                 {error && (
        //                     <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        //                         {error}
        //                     </div>
        //                 )}

        //                 <div className="flex mt-[2vh]">
        //                     <p className='mr-[0.5vw] font-semibold'>SignUp as:</p>
        //                     <label className="flex items-center space-x-2">
        //                         <input
        //                             type="radio"
        //                             name="role"
        //                             value="trainer"
        //                             checked={formData.role === "trainer"}
        //                             onChange={handleInputChange}
        //                             className="w-4 h-4 text-blue-500 focus:ring-blue-500"
        //                         />
        //                         <span className="text-gray-700">Trainer</span>
        //                     </label>

        //                     <label className="flex items-center space-x-2 ml-4">
        //                         <input
        //                             type="radio"
        //                             name="role"
        //                             value="company"
        //                             checked={formData.role === "company"}
        //                             onChange={handleInputChange}
        //                             className="w-4 h-4 text-blue-500 focus:ring-blue-500"
        //                         />
        //                         <span className="text-gray-700">Company</span>
        //                     </label>
        //                 </div>

        //                 <div>
        //                     <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        //                         Full Name
        //                     </label>
        //                     <div className="mt-1">
        //                         <input
        //                             id="name"
        //                             name="companyName"
        //                             value={formData.companyName}
        //                             onChange={handleInputChange}
        //                             type="text"
        //                             placeholder={formData.role === 'company' ? "Enter your company name" : "Enter your full name"}
        //                             required
        //                             className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        //                         />
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        //                         Email address
        //                     </label>
        //                     <div className="mt-1">
        //                         <input
        //                             id="email"
        //                             name="email"
        //                             value={formData.email}
        //                             onChange={handleInputChange}
        //                             type="email"
        //                             autoComplete="email"
        //                             required
        //                             className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        //                         />
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        //                         Password
        //                     </label>
        //                     <div className="mt-1">
        //                         <input
        //                             id="password"
        //                             name="password"
        //                             value={formData.password}
        //                             onChange={handleInputChange}
        //                             type="password"
        //                             autoComplete="new-password"
        //                             required
        //                             className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        //                         />
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700">
        //                         Re-enter Password
        //                     </label>
        //                     <div className="mt-1">
        //                         <input
        //                             id="rePassword"
        //                             name="rePassword"
        //                             value={formData.rePassword}
        //                             onChange={handleInputChange}
        //                             type="password"
        //                             autoComplete="new-password"
        //                             required
        //                             className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        //                         />
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <button
        //                         type="submit"
        //                         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        //                     >
        //                         Sign up
        //                     </button>
        //                 </div>
        //             </form>
        //         </div>
        //     </div>
        // </div>

        <div className="flex justify-center items-center h-screen bg-blue-100">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full"
            >
                <h2 className="text-3xl font-bold text-center text-gray-900">Sign Up</h2>

                <form className="space-y-4">
                    <div className="flex mt-[2vh]">
                        <p className='mr-[0.5vw]'>SignUp as:</p>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="role"
                                value="trainer"
                                checked={formData.role === "trainer"}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Trainer</span>
                        </label>

                        <label className="flex items-center space-x-2 ml-4">
                            <input
                                type="radio"
                                name="role"
                                value="company"
                                checked={formData.role === "company"}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Company</span>
                        </label>
                    </div>

                    {formData.role === 'company' ? (
                        <div>
                            <label className="block text-gray-700">Company Name</label>
                            <input
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Enter your company name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-gray-700">Full Name</label>
                            <input
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
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
                            value={formData.email}
                            onChange={handleInputChange}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            type="password"
                            placeholder="Create a password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Re-enter Password</label>
                        <input
                            name="rePassword"
                            value={formData.rePassword}
                            onChange={handleInputChange}
                            type="password"
                            placeholder="Create a password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {
                        formData.password != formData.rePassword ? (<p className='text-red-600'>password doesnt match</p>) : (<p></p>)
                    }

                    <button
                        type="button"
                        onClick={handleSignup}
                        className={`w-full px-4 py-2 rounded-lg transition 
          ${formData.password !== formData.rePassword
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-700 text-white"}`}
                    >
                        Continue
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">Already have an account? <a href="/login" className="text-blue-600 font-semibold">Login</a></p>
            </motion.div>
        </div>
    );
} 