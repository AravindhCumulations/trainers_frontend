import React from 'react';
import Image from "next/image"
import { MapPin, Clock, Users, ChevronLeft } from "lucide-react"
import { RatingStars } from './RatingStars';

interface TrainerProfilePreviewProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TrainerProfilePreview({ isOpen, onClose }: TrainerProfilePreviewProps) {
    // Prevent background scroll when overlay is open
    React.useEffect(() => {
        if (isOpen) {
            // Disable body scroll
            document.body.style.overflow = 'hidden';
            // Also disable scroll on html element for better compatibility
            document.documentElement.style.overflow = 'hidden';
        } else {
            // Re-enable body scroll
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }

        // Cleanup function to ensure scroll is re-enabled when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-7xl rounded-xl max-h-[95vh] overflow-y-auto overscroll-contain"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Sample Trainer Profile</h1>
                        <div></div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 bg-blue-100">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Sidebar */}
                        <div className="w-full lg:w-80 space-y-6">
                            {/* Profile Card */}
                            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                                <div className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
                                            <Image
                                                src="/assets/avatar1.png"
                                                alt="Profile picture"
                                                width={96}
                                                height={96}
                                                className="rounded-full"
                                            />
                                        </div>
                                        <h2 className="text-xl font-semibold mb-2">Arjun Kumar</h2>

                                        <div className="rating flex items-center justify-center text-sm sm:text-md gap-1 p-2">
                                            <RatingStars rating={3} max={5} />
                                            <span className="text-sm sm:text-[16px]">
                                                {3} ({23})
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm border border-blue-200 rounded-full">
                                                Leadership
                                            </span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm border border-blue-200 rounded-full">
                                                Negotiation
                                            </span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm border border-blue-200 rounded-full">
                                                Executive Presence
                                            </span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>Gurgaon</span>
                                            <Clock className="h-4 w-4 ml-3 mr-1" />
                                            <span>10 years of experience</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <Users className="h-4 w-4 mr-1" />
                                            <span>English, Telugu, +1</span>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="w-full border-t pt-4">
                                            <h3 className="font-semibold mb-2 pb-2 border-b-2 border-blue-500">Contact Information</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-sm">
                                                    <svg
                                                        className="h-4 w-4 mr-3 text-gray-500"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>arjunkumar@gmail.com</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <svg
                                                        className="h-4 w-4 mr-3 text-gray-500"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>+91-xxxxxx</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Card */}
                            {/* Analytics */}
                            <div className="col-span-1 row-span-1 bg-white w-full rounded-xl flex flex-col justify-start items-start text-base sm:text-lg font-semibold p-3 sm:p-5">
                                    <p className="border-b-2 w-full border-blue-500 text-lg sm:text-xl font-semibold pb-3">Analytics</p>
                                    <div className="flex flex-col sm:flex-row py-4 gap-3 sm:gap-2 w-full justify-start">
                                        <div className="analytics-item flex flex-col items-start w-full sm:w-1/2 rounded-xl bg-blue-50 p-3 sm:p-4 border-1 border-blue-200 font-light text-xs sm:text-sm">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1"> Profile Views</p>
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-2xl sm:text-3xl font-semibold">78</p>
                                                <span className="inline-block rounded-full bg-orange-100 p-1 sm:p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 -960 960 960" fill="#000" className="sm:h-6 sm:w-6"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="analytics-item flex flex-col items-start w-full sm:w-1/2 rounded-xl bg-pink-50 p-3 sm:p-4 border-1 border-pink-200 font-light text-xs sm:text-sm">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1"> Contact Unlocked</p>
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-2xl sm:text-3xl font-semibold">12</p>
                                                <span className="inline-block rounded-full bg-pink-100 p-1 sm:p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 -960 960 960" fill="#000" className="sm:h-6 sm:w-6"><path d="M240-640h360v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85h-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640Zm0 480h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM240-160v-400 400Z" /></svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-6">
                            {/* Workshops & Case Studies Card */}
                            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">Workshops & Case Studies</h3>
                                    <div className="mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                <div className="h-40 relative">
                                                    <Image src="/assets/playbook.png" alt="Workshop" fill className="object-cover" />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold mb-2">The Change Playbook: Leading...</h3>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        Navigate change with our immersive program! Begin with expectation-setting, dive into activities
                                                        like &apos;Pass the Baton&apos; &...
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center text-green-600">
                                                            <span className="font-medium">₹ 50000</span>
                                                            <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
                                                            </svg>
                                                        </div>
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Workshop</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                <div className="h-40 relative">
                                                    <Image
                                                        src="/assets/learnbydoing.png"
                                                        alt="Learning by Doing"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold mb-2">Learning by Doing</h3>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        To showcase how an experiential learning intervention improved collaboration, agility, and
                                                        leadership behaviors in a corporate...
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center text-green-600">
                                                            <span className="font-medium">₹ 50000</span>
                                                        </div>
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Casestudy</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* About Me Card */}
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">About Me</h3>
                                        <div className="mt-4">
                                            <p className="text-gray-700">
                                                Arjun is a spirited experiential learning facilitator with over 12 years of experience in team
                                                transformation and corporate learning. From leading dynamic sessions at Fortune 500 firms to designing
                                                offbeat learning journeys, his work seamlessly blends behavioral science, storytelling, and play. He has
                                                trained over 15,000 professionals across the APAC region, and his signature style is characterized by
                                                equal parts energy, empathy, and insight, making learning stick beyond the session.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Training Approach Card */}
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">Training Approach</h3>
                                        <div className="mt-4">
                                            <p className="text-gray-700">
                                                Arjun&apos;s approach is rooted in the experiential learning cycle—starting with immersive challenges,
                                                leading into deep reflection, group sharing, and real-world application. He uses simulations, team
                                                games, visual thinking, and live coaching to anchor key concepts. His sessions skip the lecture-style
                                                norm and instead create space for dialogue, creativity, and co-creation. The goal? To shift mindsets,
                                                build behaviours, and spark change from the inside out.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Education Card */}
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">Education</h3>
                                        <div className="mt-4">
                                            <div className="space-y-6">
                                                <div className="flex">
                                                    <div className="mr-4 flex flex-col items-center">
                                                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                                        <div className="h-full w-0.5 bg-blue-200 mt-2"></div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">
                                                            Doctor of Philosophy in Communication <span className="text-blue-500">(2022)</span>
                                                        </h3>
                                                        <p className="text-gray-600">Banaras Hindu University</p>
                                                    </div>
                                                </div>

                                                <div className="flex">
                                                    <div className="mr-4 flex flex-col items-center">
                                                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                                        <div className="h-full w-0.5 bg-blue-200 mt-2"></div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">
                                                            Masters of Arts in Media and Communication <span className="text-blue-500">(2014)</span>
                                                        </h3>
                                                        <p className="text-gray-600">Christ University</p>
                                                    </div>
                                                </div>

                                                <div className="flex">
                                                    <div className="mr-4 flex flex-col items-center">
                                                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">
                                                            Bachelor of Arts in Mass Communication and Journalism{" "}
                                                            <span className="text-blue-500">(2011)</span>
                                                        </h3>
                                                        <p className="text-gray-600">Loyola Academy Degree & PG College</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Certifications Card */}
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">Certifications</h3>
                                        <div className="mt-4">
                                            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-medium">Certified Professional Coach (CPC)</h3>
                                                        <p className="text-gray-500 text-sm">International Coach Federation</p>
                                                    </div>
                                                    <div className="text-gray-500">(2023)</div>
                                                </div>
                                            </div>
                                            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50 mt-4">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-medium">Advanced Leadership Development</h3>
                                                        <p className="text-gray-500 text-sm">Harvard Business School</p>
                                                    </div>
                                                    <div className="text-gray-500">(2021)</div>
                                                </div>
                                            </div>

                                            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50 mt-4">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-medium">Negotiation Mastery Program</h3>
                                                        <p className="text-gray-500 text-sm">Dale Carnegie Training</p>
                                                    </div>
                                                    <div className="text-gray-500">(2020)</div>
                                                </div>
                                            </div>

                                            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50 mt-4">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-medium">Corporate Training Excellence</h3>
                                                        <p className="text-gray-500 text-sm">Indian Leadership Academy</p>
                                                    </div>
                                                    <div className="text-gray-500">(2019)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Reviews Card */}
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">Company Reviews</h3>
                                        <div className="mt-4 space-y-4">
                                            {/* Review 1 */}
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">TechCorp Solutions</h4>
                                                        <p className="text-sm text-gray-500">Senior HR Manager</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <RatingStars rating={5} max={5} />
                                                        <span className="text-sm text-gray-600">5.0</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm">
                                                    &ldquo;Arjun delivered an exceptional leadership workshop for our executive team. His experiential approach 
                                                    and engaging facilitation style made complex concepts accessible and actionable. The team is still 
                                                    implementing strategies from the session.&rdquo;
                                                </p>
                                            </div>

                                            {/* Review 2 */}
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">InnovateLabs</h4>
                                                        <p className="text-sm text-gray-500">Learning & Development Head</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <RatingStars rating={4} max={5} />
                                                        <span className="text-sm text-gray-600">4.0</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm">
                                                    &ldquo;Arjun&apos;s negotiation skills training was highly effective. His real-world examples and interactive 
                                                    exercises helped our sales team improve their deal-closing rates by 25%. Highly recommend for 
                                                    corporate training programs.&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Clients Worked With Card */}
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">Clients Worked With</h3>
                                        <div className="mt-4">
                                            <div className="flex flex-wrap gap-3">
                                                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">Maldea</span>
                                                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">Kohler</span>
                                                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">Better Cotton Initiative</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonials Card */}
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">Testimonials</h3>
                                        <div className="mt-4">
                                            <div className="space-y-4">
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="mb-2">
                                                        <h3 className="font-medium">Rajesh P</h3>
                                                        <p className="text-xs text-gray-500 uppercase">THINGSWEKNOW COMPANY</p>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">
                                                        Arjun&apos;s Boot Camp was intense, impactful, and emotionally resonant. His engaging style turned
                                                        leadership into a lived, lasting experience, not just a lesson.
                                                    </p>
                                                </div>

                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="mb-2">
                                                        <h3 className="font-medium">Rajesh P</h3>
                                                        <p className="text-xs text-gray-500 uppercase">WHATDOYOUDO COMPANY</p>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">
                                                        Arjun brilliantly engaged our senior management with high-energy team building and impactful
                                                        leadership insights. His ability to connect and inspire is remarkable. Wishing him continued
                                                        success!
                                                    </p>
                                                </div>

                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="mb-2">
                                                        <h3 className="font-medium">Rajesh P</h3>
                                                        <p className="text-xs text-gray-500 uppercase">SOMUCHMORE COMPANY</p>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">
                                                        Working with Arjun has been a delight! His energy, dedication, and flawless execution made every BCN
                                                        event engaging and memorable. A true pro who always goes above and beyond. All the best!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 