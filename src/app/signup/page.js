'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState('trainer');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = () => {
    if (role === 'trainer') {
      window.location.href = '/trainer-details'
    } else {
      window.location.href = '/'
    }
  };

  return (
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
            <p className='mr-[0.5vw] font-semibold'>SignUp as:</p>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="trainer"
                checked={role === "trainer"}
                onChange={(e) => setRole(e.target.value)}
                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-700">Trainer</span>
            </label>

            <label className="flex items-center space-x-2 ml-4">
              <input
                type="radio"
                value="company"
                checked={role === "company"}
                onChange={(e) => setRole(e.target.value)}
                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-700">Company</span>
            </label>
          </div>



          {role === 'company' ? (
            <div>
              <label className="block text-gray-700">Company Name</label>
              <input onChange={(e) => setCompanyName(e.target.value)} type="text" placeholder="Enter your company name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ) : (<div>
            <label className="block text-gray-700">Full Name</label>
            <input onChange={(e) => setCompanyName(e.target.value)} type="text" placeholder="Enter your full name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>)
          }
          <div>
            <label className="block text-gray-700">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Create a password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700">Re-enter Password</label>
            <input onChange={(e) => setRePassword(e.target.value)} type="password" placeholder="Create a password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {
            password != rePassword ? (<p className='text-red-600'>password doesnt match</p>) : (<p></p>)
          }

          <button
            type="button"
            onClick={handleSignup}
            className={`w-full px-4 py-2 rounded-lg transition 
                ${password !== rePassword
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
