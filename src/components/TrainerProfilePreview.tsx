import React from 'react';
import Image from "next/image"
import { Star, MapPin, Clock, Users, ChevronLeft } from "lucide-react"

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
                                        <h2 className="text-xl font-semibold mb-2">Kalyan Raygalla</h2>

                                        <div className="flex items-center mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="h-4 w-4 text-gray-300" />
                                            ))}
                                            <span className="text-sm text-gray-500 ml-1">0 (0)</span>
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
                                                    <span>raygalla@gmail.com</span>
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
                                                    <span>+91-9999999999</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Card */}
                            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-lg pb-2 border-b-2 border-blue-500 font-semibold">Analytics</h3>
                                    <div className="mt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <div className="text-sm text-gray-500 mb-1">Profile Views</div>
                                                <div className="flex items-center mb-1">
                                                    <span className="text-2xl font-bold">0</span>
                                                </div>
                                                <div className="flex items-center text-xs text-green-500">
                                                    <span>↑ 12%</span>
                                                    <span className="text-gray-400 ml-1">since last month</span>
                                                </div>
                                            </div>
                                            <div className="bg-pink-50 p-3 rounded-lg">
                                                <div className="text-sm text-gray-500 mb-1">Contact Unlocked</div>
                                                <div className="flex items-center mb-1">
                                                    <span className="text-2xl font-bold">3</span>
                                                    <svg
                                                        className="h-4 w-4 ml-1 text-gray-500"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                                                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                                <div className="flex items-center text-xs text-green-500">
                                                    <span>↑ 8%</span>
                                                    <span className="text-gray-400 ml-1">since last month</span>
                                                </div>
                                            </div>
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
                                                        <h3 className="font-medium">NOTHING YET</h3>
                                                        <p className="text-gray-500 text-sm">WHOCNOWS</p>
                                                    </div>
                                                    <div className="text-gray-500">(2018)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Your Review Card */}
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-xl pb-2 border-b-2 border-blue-500 font-semibold">Post Your Review</h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p>Your rating</p>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className="h-6 w-6 text-gray-300 cursor-pointer hover:text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>

                                            <textarea
                                                className="w-full border rounded-lg p-3 h-24 resize-none"
                                                placeholder="Write your review here..."
                                            ></textarea>

                                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors">
                                                Submit Review
                                            </button>
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