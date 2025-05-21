"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import NavBar from "../../components/Navbar";
import EditWorkshop from '@/components/EditWorkshop';
import { useRouter } from "next/navigation";
import { Workshop } from '@/models/workshop.models';
import Cookies from 'js-cookie';
import Footer from "@/components/Footer";
import WorkshopDetails from '@/components/WorkshopDetails';



interface OverlayProps {
    isOpen: boolean;
    type: 'details' | 'edit' | 'create' | null;
    setOverlayState: (state: { isOpen: boolean; type: 'details' | 'edit' | 'create' | null }) => void;
}

// Dummy workshops data with images
const initialWorkshops: Workshop[] = [
    {
        id: '1',
        title: 'Fitness Fundamentals',
        description: 'Learn the basics of physical fitness and create a strong foundation for your health journey.',
        price: 99.99,
        targetAudience: 'Beginners',
        format: 'virtual',
        image: '/assets/w1.jpg'
    },
    {
        id: '2',
        title: 'Advanced Nutrition Masterclass',
        description: 'Deep dive into nutrition science, meal planning, and optimal dietary strategies.',
        price: 149.99,
        targetAudience: 'Intermediate',
        format: 'In-Person',
        image: '/assets/w2.jpg'
    },
    {
        id: '3',
        title: 'Mental Wellness Workshop',
        description: 'Techniques for stress management, mindfulness, and improving mental health.',
        price: 129.99,
        targetAudience: 'All Levels',
        format: 'virtual',
        image: '/assets/w3.jpg'
    },
    {
        id: '4',
        title: 'High-Intensity Training Program',
        description: 'Intensive workout strategies for maximum fitness results and performance.',
        price: 199.99,
        targetAudience: 'Advanced',
        format: 'In-Person',
        image: '/assets/w2.jpg'
    }
];

// Workshop Details Component
const WorkshopDetailsOverlay = ({ setOverlayState }: { setOverlayState: (state: { isOpen: boolean; type: 'details' | 'edit' | 'create' | null }) => void }) => {
    const handleClose = () => {
        setOverlayState({ isOpen: false, type: null });
    };

    const handleEdit = () => {
        setOverlayState({ isOpen: true, type: 'edit' });
    };

    const workshopData = {
        id: '1',
        title: 'Soft Skills Enhancement Workshop',
        description: 'Enhance communication, build team rapport, and develop key interpersonal skills via interactive sessions.',
        price: 99.99,
        targetAudience: 'Corporate teams, managers, team leaders, and HR professionals looking to enhance collaboration.',
        format: 'In Person',
        image: '/assets/edit_model.jpg',
        objectives: 'Enhance communication, build team rapport, and develop key interpersonal skills via interactive sessions.',
        outcomes: 'Stronger communication, better emotional intelligence, and practical tools for collaboration success.',
        handouts: 'Participants receive handouts with exercises, session notes, and reflection prompts for continued learning.',
        programFlow: 'Welcome & Ice-breaker, Interactive activities, Scenario roleplays, Group discussions',
        evaluation: 'Workshop impact is assessed using post-session surveys, self-reflection, and peer feedback methods.'
    };

    return <WorkshopDetails workshop={workshopData} onClose={handleClose} onEdit={handleEdit} />;
};



// Dynamic Overlay Component
const Overlay = ({ isOpen, type, setOverlayState }: OverlayProps) => {
    if (!isOpen) return null;

    const handleClose = () => {
        setOverlayState({ isOpen: false, type: null });
    };

    // Sample workshop data for editing
    const sampleWorkshopData = {
        id: '1',
        title: 'Soft Skills Enhancement Workshop',
        description: 'Enhance communication, build team rapport, and develop key interpersonal skills via interactive sessions.',
        price: 99.99,
        targetAudience: 'Corporate teams, managers, team leaders, and HR professionals looking to enhance collaboration.',
        format: 'In Person',
        image: '/assets/edit_model.jpg',
        objectives: 'Enhance communication, build team rapport, and develop key interpersonal skills via interactive sessions.',
        outcomes: 'Stronger communication, better emotional intelligence, and practical tools for collaboration success.',
        handouts: 'Participants receive handouts with exercises, session notes, and reflection prompts for continued learning.',
        programFlow: 'Welcome & Ice-breaker, Interactive activities, Scenario roleplays, Group discussions',
        evaluation: 'Workshop impact is assessed using post-session surveys, self-reflection, and peer feedback methods.'
    };

    return (
        <div className="absolute edit-overlay top-0 left-0 w-full h-full bg-black/40 z-30 flex justify-center items-start">
            <div className="w-full max-w-7xl flex justify-around items-center">
                {type === 'details' && <WorkshopDetailsOverlay setOverlayState={setOverlayState} />}
                {type === 'edit' && (
                    <div className="bg-white w-full rounded-2xl mt-4">
                        <EditWorkshop
                            onClose={handleClose}
                            initialData={sampleWorkshopData}
                            mode="edit"
                        />
                    </div>
                )}
                {type === 'create' && (
                    <div className="bg-white w-full rounded-2xl mt-4">
                        <EditWorkshop
                            onClose={handleClose}
                            mode="create"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default function TrainerDetails() {
    const [userRole, setUserRole] = useState(null);
    const [isTrainer, setIsTrainer] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("user_details");
        try {
            const userDetails = role ? JSON.parse(role) : null;

            if (userDetails && userDetails.role_user) {
                const Role = userDetails.role_user;
                setUserRole(Role);
                setIsTrainer(Role === "Trainer");
            } else {
                console.warn("No user role found.");
                setUserRole(null);
                setIsTrainer(false);
            }
        } catch (error) {
            console.error("Failed to parse user_details from localStorage", error);
            setUserRole(null);
            setIsTrainer(false);
        }
    }, []);

    // Trainer
    const logged_in = true;
    const trainer_locked = true;
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isEditingApproach, setIsEditingApproach] = useState(false);
    const [aboutText, setAboutText] = useState("My teaching methodology combines traditional techniques with modern technology. I focus on practical applications and real-world examples to make learning relevant and engaging. Every student has unique needs, and I tailor my approach to meet individual learning styles.");
    const [approachText, setApproachText] = useState("My teaching methodology combines traditional techniques with modern technology. I focus on practical applications and real-world examples to make learning relevant and engaging. Every student has unique needs, and I tailor my approach to meet individual learning styles.");
    const [overlayState, setOverlayState] = useState<{
        isOpen: boolean;
        type: 'details' | 'edit' | 'create' | null;
    }>({
        isOpen: false,
        type: null
    });

    const handleWorkshopClick = (type: 'details' | 'edit' | 'create') => {
        setOverlayState({ isOpen: true, type });
    };

    const router = useRouter();


    const handleSaveAbout = () => {
        // Here you would typically make an API call to save the changes
        setIsEditingAbout(false);
    };

    const handleSaveApproach = () => {
        // Here you would typically make an API call to save the changes
        setIsEditingApproach(false);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <NavBar bgColor="bg-white" />

            {/* Main Content */}
            <main className="mx-auto px-4 py-8 bg-blue-100 rounded-t-2xl relative">
                <Overlay
                    isOpen={overlayState.isOpen}
                    type={overlayState.type}
                    setOverlayState={setOverlayState}
                />

                <div className="flex max-w-7xl mx-auto gap-4">
                    <div className="w-[30%] flex flex-col gap-6">
                        <div className="row-span-2 col-span-1">
                            <div className="profile-card shadow-lg flex flex-col gap-4 justify-center items-center rounded-xl bg-white p-10 h-full">
                                <div className="trainer-profile w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                    {/* <span className="text-gray-400">Profile</span> */}
                                    <img src="assets/prof-1.jpeg" alt="img" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="trainer-name text-center text-2xl font-semibold">Josphin S <span className="inline-block self-center"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" /></svg></span> </div>
                                <div className="rating flex items-center justify-center text-md gap-2 p-2">
                                    <div className="flex py-[4px]">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="w-4 h-4 fill-[#FE9A00] text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-md flex items-center">5.0 (23)</span>
                                </div>
                                <div className="flex flex-row gap-2 justify-center items-center text-black-500">
                                    <div className="rounded-2xl border-2 border-blue-500  px-4 py-1"> designer</div>
                                    <div className="rounded-2xl border-2 border-blue-500 px-4 py-1"> creative</div>
                                    <div className="rounded-2xl border-2 border-blue-500 px-4 py-1"> skilled</div>
                                </div>
                                <div className="flex flex-row flex-wrap trainer-details justify-center items-center font-light leading-[2rem] gap-x-2 gap-y-2">
                                    {/* Location */}
                                    <p className="flex items-center gap-1">
                                        <span className="inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000">
                                                <path d="M480.21-480Q510-480 531-501.21t21-51Q552-582 530.79-603t-51-21Q450-624 429-602.79t-21 51Q408-522 429.21-501t51 21ZM480-191q119-107 179.5-197T720-549q0-105-68.5-174T480-792q-103 0-171.5 69T240-549q0 71 60.5 161T480-191Zm0 95Q323.03-227.11 245.51-339.55 168-452 168-549q0-134 89-224.5T479.5-864q133.5 0 223 90.5T792-549q0 97-77 209T480-96Zm0-456Z" />
                                            </svg>
                                        </span>
                                        Bangalore
                                    </p>

                                    {/* Experience */}
                                    <p className="flex items-center gap-1">
                                        <span className="inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000">
                                                <path d="m391-415 34-110-89-70h109l35-108 35 108h109l-89 70 34 110-89-68-89 68ZM263-48v-280q-43-37-69-99t-26-125q0-130 91-221t221-91q130 0 221 91t91 221q0 64-24 125.5T696-327v279L480-96 263-48Zm217-264q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM335-138l145-32 144 32v-138q-33 18-69.5 27t-74.5 9q-38 0-75-8.5T335-276v138Zm145-70Z" />
                                            </svg>
                                        </span>
                                        0 years of experience
                                    </p>

                                    {/* Languages */}
                                    <p className="flex items-center gap-1">
                                        <span className="inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000">
                                                <path d="M809.65-318q-22.65 0-38.15-15.7-15.5-15.71-15.5-38.14v-89.73Q756-484 771.65-500q15.64-16 38-16Q832-516 848-500.2q16 15.79 16 38.36v90.27q0 22.57-15.85 38.07-15.86 15.5-38.5 15.5ZM792-192v-54.91q-47-7.09-77.5-42.04Q684-323.89 684-372h36q0 37.8 26.1 63.9T810-282q37 0 63.34-26.1 26.33-26.1 26.33-63.9H936q0 48.01-31.05 82.88T828-247v55h-36ZM336-480q-60 0-102-42t-42-102q0-60 42-102t102-42q17.07 0 33.54 4Q386-760 402-752q-20 28-31 60.5T360-624q0 35 10.89 68.15Q381.78-522.69 402-496q-16 8-32.46 12-16.47 4-33.54 4ZM48-192v-92q0-25.13 12.5-46.57Q73-352 95-366q47-28 99-44t108-21q-40 23-63 62.5T216-284v92H48Zm528-288q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm-.5-72q29.5 0 51-21 21.5-21.01 21.5-50.5 0-29.5-21.5-51t-51-21.5q-29.49 0-50.5 21.5-21 21.5-21 51 0 29.49 21 50.5 21.01 21 50.5 21ZM288-192v-92q0-25.13 12.5-46.57Q313-352 334-365q55-33 116.5-50T576-432q17 0 34.5 1.5T646-427q-8 17-12 35.5t-4 35.5q-13-2-26.5-3t-27.5-1q-55 0-107 14t-98 42q-5 4-8 9.07-3 5.06-3 10.93v20h294q14 23 33 41.5t45 30.5H288Zm288-432Zm0 360Z" />
                                            </svg>
                                        </span>
                                        English, Hindi, Malyalam, Tamil
                                    </p>
                                </div>

                                <div className=" relative border-1 border-gray-100 rounded-xl shadow-lg p-4 trainer-contact w-full">
                                    <h2 className="border-b-2 border-blue-500 text-lg font-semibold mb-3 pb-3">Contact Information</h2>
                                    {!isTrainer && trainer_locked && (
                                        <div className="absolute top-5  inset-0 w-full h-full flex items-center justify-center z-10">
                                            <button className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-semibold hover:bg-blue-700 transition">
                                                Unlock Trainer
                                            </button>
                                        </div>
                                    )}
                                    <div className={`flex flex-col gap-3 ${!isTrainer && trainer_locked ? 'blur-sm' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">angela@trainer.com</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">+91 1234567890</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-4 items-start p-2 justify-between items-center">
                                                <a href="#">
                                                    <img src="assets/fb24.png" alt="" />
                                                </a>
                                                <a href="#">
                                                    <img src="assets/twtr24.png" alt="" />
                                                </a>
                                                <a href="#">
                                                    <img src="assets/lin24.png" alt="" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 row-span-1 bg-white w-full rounded-xl flex flex-col justify-start items-start text-lg font-semibold p-5">
                            <p className="border-b-2 border-blue-500 text-xl font-semibold pb-3">Analytics</p>
                            {/* <p className="leading-6 text-sm font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus consequuntur quis iste, officia dignissimos unde obcaecati rerum, molestias, dicta porro voluptates repellat tenetur. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia enim, saepe dignissimos omnis quibusdam fugiat aspernatur eius quis, assumenda eligendi nihil, quae earum.</p> */}
                            <div className="flex py-4 gap-2 w-full justify-start">
                                <div className="analytics-item flex flex-col items-start w-1/2 rounded-xl bg-blue-50 p-4 border-1 border-blue-200 font-light text-sm">
                                    <p className="text-sm text-gray-500"> Profile Views</p>
                                    <p className="text-3xl font-semibold py-2 flex items-center gap-2">521 <span className="inline-block rounded-full bg-orange-100 p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                                    </span></p>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000"><path d="m147-209-51-51 281-281 152 152 212-211H624v-72h240v240h-72v-117L529-287 377-439 147-209Z" /></svg>
                                    </span>
                                    <p className="text-green-500 ">12%</p>
                                    <p className=" text-gray-500">since last month</p>
                                </div>
                                <div className="analytics-item flex flex-col items-start  w-1/2 rounded-xl bg-pink-50 p-4 border-1 border-pink-200 font-light text-sm">
                                    <p className=" text-gray-500 "> Contact Unlocked</p>
                                    <p className="text-3xl font-semibold py-2 flex items-center gap-2">48 <span className="inline-block rounded-full bg-pink-100 p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M240-640h360v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85h-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640Zm0 480h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM240-160v-400 400Z" /></svg>
                                    </span></p>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000"><path d="m147-209-51-51 281-281 152 152 212-211H624v-72h240v240h-72v-117L529-287 377-439 147-209Z" /></svg>
                                    </span>
                                    <p className="text-green-500">8%</p>
                                    <p className="text-gray-500">since last month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[70%] mx-auto">
                        {/* Workshops - Full Width */}
                        <div className="mb-6 rounded-xl bg-white p-6 text-lg font-semibold">
                            <div className="flex justify-between items-center w-full">
                                <p className={`border-b-2 border-blue-500 text-xl font-semibold pb-3 ${userRole === "Trainer" && logged_in ? '' : 'w-full'}`}>Workshops</p>
                                {userRole == "Trainer" && logged_in && (
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <button
                                            onClick={() => handleWorkshopClick('create')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Add Workshop
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 px-4 py-8 overflow-auto scrollbar-hidden">
                                {initialWorkshops.map((workshop) => (
                                    <div
                                        key={workshop.id}
                                        className="relative min-h-[176px] min-w-[280px] rounded-xl bg-gray-100 overflow-hidden flex justify-center items-center cursor-pointer"
                                    >
                                        <Image
                                            src={workshop.image}
                                            alt={workshop.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 text-white flex justify-center items-end p-2" onClick={() => handleWorkshopClick('details')}>
                                            <div className="text-center font-light">
                                                <p>{workshop.title}</p>
                                                <p className="text-xs">{workshop.targetAudience}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Me - Full Width */}
                        <div className="mb-6 rounded-xl bg-white p-6 text-lg font-semibold w-full">
                            <div className="flex w-full justify-between items-center">
                                <p className={`${userRole === "Trainer" && logged_in ? '' : 'w-full'} border-b-2 border-blue-500 text-xl font-semibold pb-3`}>About Me</p>
                                {userRole == "Trainer" && logged_in && (
                                    <div className="flex items-center gap-2">
                                        {!isEditingAbout ? (
                                            <button
                                                onClick={() => setIsEditingAbout(true)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <p className=" text-black">Edit</p>
                                                <div className="w-6 h-6">
                                                    <img src="assets/edit.png" alt="Edit" />
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditingAbout(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            {isEditingAbout ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={aboutText}
                                        onChange={(e) => setAboutText(e.target.value)}
                                        className="w-full font-normal text-[16px] leading-[26px] py-4 px-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        rows={4}
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSaveAbout}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="font-normal text-[16px] leading-[26px] py-4">
                                    {aboutText}
                                </p>
                            )}
                        </div>


                        {/* Masonry Grid */}
                        <div className="columns-1 md:columns-2 gap-6 space-y-6">
                            {/* Training Approach */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`${userRole === "Trainer" && logged_in ? '' : 'w-full'} border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Training Approach</p>
                                    {userRole == "Trainer" && logged_in && (
                                        <div className="flex items-center gap-2">
                                            {!isEditingApproach ? (
                                                <button
                                                    onClick={() => setIsEditingApproach(true)}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <p className="text-lg font-semibold text-black">Edit</p>
                                                    <div className="w-6 h-6">
                                                        <img src="assets/edit.png" alt="Edit" />
                                                    </div>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setIsEditingApproach(false)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {isEditingApproach ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={approachText}
                                            onChange={(e) => setApproachText(e.target.value)}
                                            className="w-full font-ariel text-[16px] font-normal py-4 px-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            rows={4}
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleSaveApproach}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="font-ariel text-[16px] font-normal py-4">
                                        {approachText}
                                    </p>
                                )}
                            </div>



                            {/* Certifications */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`${userRole === "Trainer" && logged_in ? '' : 'w-full'} border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Certifications</p>
                                    {userRole == "Trainer" && logged_in && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-semibold">Edit</p>
                                            <div className="w-6 h-6">
                                                <img src="assets/edit.png" alt="Edit" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="py-4">

                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="border-l-4 border-blue-500 bg-gray-100 rounded-xl  p-4 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <p className="text-[16px] font-normal">Data Science Academy</p>
                                                <p className="text-[16px] font-normal">2023</p>
                                            </div>
                                            <p className="text-[14px] font-normal text-gray-500">Certified Data Science Professional</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Clients Worked With */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`${userRole === "Trainer" && logged_in ? '' : 'w-full'} border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Clients Worked With</p>
                                    {userRole == "Trainer" && logged_in && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-semibold">Edit</p>
                                            <div className="w-6 h-6">
                                                <img src="assets/edit.png" alt="Edit" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2  py-4">
                                    {['Google', 'Microsoft', 'Amazon', 'Meta', 'IBM', 'Stanford University', 'Harvard'].map(client => (
                                        <div key={client} className="rounded-md bg-blue-100 text-blue-500 p-3 text-sm font-thin">
                                            {client}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Testimonials */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`${userRole === "Trainer" && logged_in ? '' : 'w-full'} border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Testimonials</p>
                                    {userRole == "Trainer" && logged_in && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-semibold">Edit</p>
                                            <div className="w-6 h-6">
                                                <img src="assets/edit.png" alt="Edit" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="py-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="bg-blue-50 rounded-xl p-4 mb-3">
                                            <p className="text-md">John Doe</p>
                                            <p className="text-xs">Google</p>
                                            <p className="text-sm py-2 font-extralight">
                                                Excellent teacher! The workshop was very
                                                informative and engaging. I learned so much in
                                                such a short time.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>




                            {/* Education */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`${userRole === "Trainer" && logged_in ? '' : 'w-full'} border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Education</p>
                                    {userRole == "Trainer" && logged_in && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-semibold">Edit</p>
                                            <div className="w-6 h-6">
                                                <img src="assets/edit.png" alt="Edit" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative gap-2 py-4">
                                    {/* <div className="absolute left-2 top-0 bottom-0 w-0.5 border-l-3  border-blue-300 z-0"></div> */}
                                    <div className="relative text-md font-thin flex justify-between gap-2 mb-4">
                                        <div className="absolute left-2 top-0 bottom-0 w-0.5 border-l-3  border-blue-300 z-0"></div>
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold z-10"></span>

                                        <div className="py-4">
                                            <p className="text-[16px] font-normal ">Ph.D. in Computer Science &nbsp;&nbsp;<span className="text-orange-500">(2015-2019)</span></p>
                                            <p className="text-[16px] font-normal">Stanford University</p>
                                            <p className="text-[14px] text-gray-500 font-light">Specialized in Machine Learning and Artificial Intelligence</p>
                                        </div>
                                    </div>
                                    <div className="relative text-md font-thin flex justify-between gap-2 mb-4">
                                        <div className="absolute left-2 top-0 bottom-0 w-0.5 border-l-3  border-blue-300 z-0"></div>
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold z-10"></span>

                                        <div className="py-4">
                                            <p className="text-[16px] font-normal">Ph.D. in Computer Science &nbsp;&nbsp;<span className="text-orange-500">(2015-2019)</span></p>
                                            <p className="text-[16px] font-normal">Stanford University</p>
                                            <p className="text-[14px] text-gray-500 font-light">Specialized in Machine Learning and Artificial Intelligence</p>
                                        </div>
                                    </div>
                                    <div className="relative text-md font-thin flex justify-between gap-2 mb-4">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold z-10"></span>

                                        <div className="py-4">
                                            <p className="text-[16px] font-normal">Ph.D. in Computer Science &nbsp;&nbsp;<span className="text-orange-500">(2015-2019)</span></p>
                                            <p className="text-[16px] font-normal">Stanford University</p>
                                            <p className="text-[14px] text-gray-500 font-normal">Specialized in Machine Learning and Artificial Intelligence</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Reviews & Ratings */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex justify-between pb-3">
                                    <p className="border-b-2 border-blue-500 text-xl font-semibold pb-3">Reviews & Ratings</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            <Star
                                                className="w-4 h-4 fill-[#FE9A00] text-yellow-400"
                                            />
                                        </div>
                                        <span>5.0 (23)</span>
                                    </div>
                                </div>
                                {[{ name: 'John Doe' }, { name: 'Jane Smith' }].map((r, i) => (
                                    <div key={i} className="bg-gray-100 rounded-xl p-4 mb-3">
                                        <div className="flex justify-between">
                                            <p className="text-md">{r.name}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className="w-4 h-4 fill-[#FE9A00] text-yellow-400"
                                                        />
                                                    ))}
                                                </div>
                                                <span>5.0 (23)</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 pt-2">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit...
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Post Your Review */}
                            {!isTrainer && !trainer_locked && (
                                <div className="post-review-card break-inside-avoid bg-white rounded-xl p-6">
                                    <p className="border-b-2 border-blue-500 text-2xl font-semibold pb-3">Post Your Review</p>

                                    {/* Star Rating */}
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <p className="text-base">Your rating</p>
                                        <div className="flex gap-1 p-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHovered(star)}
                                                    onMouseLeave={() => setHovered(0)}
                                                    className="w-6 h-6"
                                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                >
                                                    <Star
                                                        className={`w-6 h-6 transition-colors ${(hovered || rating) >= star
                                                            ? 'fill-[#FE9A00] text-[#FE9A00]'
                                                            : 'text-orange-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Textarea */}
                                    <textarea
                                        placeholder="Write your review here..."
                                        className="w-full border border-gray-300 rounded-md p-3 text-base resize-none mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                    />

                                    {/* Submit Button */}
                                    <button
                                        className="w-full mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                                        onClick={() => alert(`Submitted rating: ${rating} stars`)}
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            )}



                        </div>
                    </div>

                </div>




            </main >

            {/* Popular Trainers Section */}
            {!isTrainer && (
                <section className="w-full max-w-7xl mx-auto px-4 py-10 trainer-list-section">
                    <h2 className="text-[30px] font-bold mb-6 text-gray-800 trainer-list-title">Discover Our Popular Trainers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 trainer-list-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex flex-col items-center min-h-[320px] max-w-[300px] mx-auto trainer-card">
                                {/* Trainer image with heart button overlay */}
                                <div className="rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-gray-100 relative  min-h-[230px]  max-w-[260px] trainer-card-avatar">
                                    <img
                                        src={`/assets/trainer${((i - 1) % 4) + 1}.jpg`}
                                        alt="Trainer"
                                        className="object-cover w-full h-full"
                                    />

                                    <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-red-100 transition trainer-card-fav-btn">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                    </button>
                                </div>
                                <div className="text-left">
                                    <span className="text-[18px] flex gap-2 font-bold text-gray-900 mb-0.5 trainer-card-name">{i === 1 ? 'Sanya Gupta' : i === 2 ? 'Rahul Verma' : i === 3 ? 'Anjali Mehta' : i === 4 ? 'Kiran Rao' : i === 5 ? 'Sanya Gupta' : i === 6 ? 'Rahul Verma' : i === 7 ? 'Anjali Mehta' : 'Kiran Rao'}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.84922 8.6201C3.70326 7.96262 3.72567 7.27894 3.91437 6.63244C4.10308 5.98593 4.45196 5.39754 4.92868 4.92182C5.40541 4.4461 5.99453 4.09844 6.64142 3.91109C7.28832 3.72374 7.97205 3.70276 8.62922 3.8501C8.99093 3.2844 9.48922 2.81886 10.0782 2.49638C10.6671 2.17391 11.3278 2.00488 11.9992 2.00488C12.6707 2.00488 13.3313 2.17391 13.9203 2.49638C14.5092 2.81886 15.0075 3.2844 15.3692 3.8501C16.0274 3.70212 16.7123 3.72301 17.3602 3.91081C18.0081 4.09862 18.598 4.44724 19.0751 4.92425C19.5521 5.40126 19.9007 5.99117 20.0885 6.6391C20.2763 7.28703 20.2972 7.97193 20.1492 8.6301C20.7149 8.99181 21.1805 9.4901 21.5029 10.079C21.8254 10.668 21.9944 11.3286 21.9944 12.0001C21.9944 12.6715 21.8254 13.3322 21.5029 13.9211C21.1805 14.5101 20.7149 15.0084 20.1492 15.3701C20.2966 16.0273 20.2756 16.711 20.0882 17.3579C19.9009 18.0048 19.5532 18.5939 19.0775 19.0706C18.6018 19.5473 18.0134 19.8962 17.3669 20.0849C16.7204 20.2736 16.0367 20.2961 15.3792 20.1501C15.018 20.718 14.5193 21.1855 13.9293 21.5094C13.3394 21.8333 12.6772 22.0032 12.0042 22.0032C11.3312 22.0032 10.669 21.8333 10.0791 21.5094C9.48914 21.1855 8.99045 20.718 8.62922 20.1501C7.97205 20.2974 7.28832 20.2765 6.64142 20.0891C5.99453 19.9018 5.40541 19.5541 4.92868 19.0784C4.45196 18.6027 4.10308 18.0143 3.91437 17.3678C3.72567 16.7213 3.70326 16.0376 3.84922 15.3801C3.27917 15.0193 2.80963 14.5203 2.48426 13.9293C2.1589 13.3384 1.98828 12.6747 1.98828 12.0001C1.98828 11.3255 2.1589 10.6618 2.48426 10.0709C2.80963 9.47992 3.27917 8.98085 3.84922 8.6201Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 12L11 14L15 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                    </span>
                                    <span className="text-[#EAB308]">★★★★☆</span>
                                    <p className="text-[14px] font-semibold text-gray-600 mb-0.5 flex items-center gap-1 trainer-card-skills">{i === 1 ? 'Conflict Resolution, Team Building' : i === 2 ? 'Public Speaking, Leadership' : i === 3 ? 'Emotional Intelligence, Life Coaching' : i === 4 ? 'Time Management, Career Growth' : i === 5 ? 'Conflict Resolution, Team Building' : i === 6 ? 'Public Speaking, Leadership' : i === 7 ? 'Emotional Intelligence, Life Coaching' : 'Time Management, Career Growth'}</p>
                                    <p className="text-xs text-gray-500 mb-0.5 trainer-card-exp">{i === 1 ? '12 years • Pune' : i === 2 ? '10 years • Delhi' : i === 3 ? '8 years • Mumbai' : i === 4 ? '6 years • Bengaluru' : i === 5 ? '12 years • Pune' : i === 6 ? '10 years • Delhi' : i === 7 ? '8 years • Mumbai' : '6 years • Bengaluru'}</p>
                                    <p className="text-xs text-gray-500 mb-0.5 trainer-card-lang">Languages spoken: English, Hindi, Tamil</p>

                                </div>

                                <div className="flex items-center w-full justify-between mt-1 pt-1 border-t border-gray-100 trainer-card-bottom">
                                    <span className="text-[14px] font-semibold trainer-card-price">{i === 1 ? '₹1800/hour' : i === 2 ? '₹2500/hour' : i === 3 ? '₹2200/hour' : i === 4 ? '₹1800/hour' : i === 5 ? '₹1800/hour' : i === 6 ? '₹2500/hour' : i === 7 ? '₹2200/hour' : '₹1800/hour'}</span>
                                    <span className="flex items-center text-xs text-gray-400 trainer-card-views"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>1.2k</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-8 trainer-list-viewall">
                        <a href="#" className="text-blue-600 font-semibold hover:underline">View All Profiles</a>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
} 