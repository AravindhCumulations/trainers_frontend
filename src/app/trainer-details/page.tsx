"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import NavBar from "../../components/Navbar";
import EditWorkshop from '@/components/EditWorkshop';
import { Workshop, } from '@/models/workshop.models';
import Footer from "@/components/Footer";
import WorkshopDetails from '@/components/WorkshopDetails';
import TrainerGrid from "@/components/TrainerGrid";
import { trainerApis } from '@/lib/apis/trainer.apis';
import { TrainerDetailsModel } from '@/models/trainerDetails.model';
import { useLoading } from '@/context/LoadingContext';
import { getCurrentUserName, getCurrentUserRole } from '@/lib/utils/auth.utils'
import { TrainerCardModel } from '@/models/trainerCard.model'
import { RatingStars } from "@/components/RatingStars";
import { dummyTrainers } from "@/app/content/DummyTrainers";
import Loader from '@/components/Loader';
import { useNavigation } from "@/lib/hooks/useNavigation";
import { useErrorPopup } from '@/lib/hooks/useErrorPopup';
import ErrorPopup from '@/components/ErrorPopup';
import { creditsApis } from '@/lib/apis/credits.apis';
import { useRouter } from 'next/navigation';
import WorkshopCard from '@/components/WorkshopCard';
import { useUser } from '@/context/UserContext';


interface WorkshopDetailsData {
    id: string;
    title: string;
    description: string;
    price: number;
    targetAudience: string;
    format: string;
    image: string;
    objectives?: string;
    outcomes?: string;
    handouts?: string;
    programFlow?: string;
    evaluation?: string;
}

interface OverlayProps {
    isOpen: boolean;
    type: 'details' | 'edit' | 'create' | null;
    data?: WorkshopDetailsData;
    setOverlayState: (state: { isOpen: boolean; type: 'details' | 'edit' | 'create' | null; data?: WorkshopDetailsData }) => void;
}

// Workshop Details Component
const WorkshopDetailsOverlay = ({ setOverlayState, workshop }: { setOverlayState: (state: { isOpen: boolean; type: 'details' | 'edit' | 'create' | null; data?: WorkshopDetailsData }) => void; workshop?: WorkshopDetailsData }) => {
    const handleClose = () => {
        setOverlayState({ isOpen: false, type: null });
    };



    if (!workshop) return null;

    return <WorkshopDetails workshop={workshop} onClose={handleClose} />;
};

// Dynamic Overlay Component
const Overlay = ({ isOpen, type, setOverlayState, data }: OverlayProps) => {
    if (!isOpen) return null;

    const handleClose = () => {
        setOverlayState({ isOpen: false, type: null });
    };

    return (
        <div className="absolute edit-overlay top-0 left-0 w-full h-full bg-black/40 z-30 flex justify-center items-start">
            <div className="w-full max-w-5xl flex justify-around items-center">
                {type === 'details' && <WorkshopDetailsOverlay setOverlayState={setOverlayState} workshop={data} />}
                {type === 'edit' && (
                    <div className="bg-white w-full rounded-2xl mt-4">
                        <EditWorkshop
                            onClose={handleClose}
                            initialData={data}
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
    const router = useRouter();
    const { setUser, user, setProfilePic } = useUser();

    // globally
    const [isCompany, setIsCompany] = useState(user.role === 'user_role');
    const [hasOverflow, setHasOverflow] = useState(false);

    // page specific
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);
    const [trainerLocked, setTrainerLocked] = useState(true);
    useEffect(() => {

    }, [trainerLocked])
    const [trainerData, setTrainerData] = useState<TrainerDetailsModel | null>(null);

    // featured trainers grid
    const [trainers, setTrainers] = useState([]);
    const [totalTrainers, setTotalTrainers] = useState(0);

    //utilities
    const [loading, setLoading] = useState(true);
    const { handleNavigation } = useNavigation();

    // looders
    const { showLoader, hideLoader } = useLoading();
    const { isOpen, message, showError, hideError } = useErrorPopup();

    const fetchAllTrainers = async (userName: string) => {
        if (!userName) {
            return;
        }
        showLoader();

        try {
            const allTrainersData = await trainerApis.getAllTrainers(userName, 1, 8);
            setTrainers(allTrainersData.All_trainers);
            setTotalTrainers(allTrainersData.total);
        }
        catch (error) {
            console.error('Error fetching trainers:', error);

        }
        finally {
            hideLoader();
        }
    };

    useEffect(() => {
        const checkOverflow = () => {
            const container = document.querySelector('.workshops-container');
            if (container) {
                setHasOverflow(container.scrollWidth > container.clientWidth);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [trainerData]);

    useEffect(() => {



        const fetchTrainerData = async () => {
            try {
                // Get trainer naname from URL query params
                const searchParams = new URLSearchParams(window.location.search);
                const trainerName = searchParams.get('trainer');
                const userName = getCurrentUserName() || 'guest';
                const userRole = getCurrentUserRole() || 'guest';



                if (!trainerName || !userName) {
                    if (!trainerName) {
                        showError('Trainer not found');
                    }
                    if (!userName) {
                        showError('User not found');
                    }
                    return;
                }

                // setLoading(true);

                if (userRole === 'Trainer' && userName === trainerName) {
                    setIsLoggedInUser(true);


                    const response = await trainerApis.getTrainerByName(trainerName);

                    setTrainerData(response.data);
                    setProfilePic(response.data.image)


                    if (!response.data) {
                        showError('Failed to fetch trainer details');
                        return;
                    }
                }
                else {
                    const res = await trainerApis.company.getTrainerByName(trainerName, userName);


                    if (!res || !res.message) {
                        showError('Failed to fetch trainer details');
                        return;
                    }

                    setTrainerData(res.message);

                    if (res.message.is_unlocked) {
                        setTrainerLocked(false);

                    }
                    else {
                        setTrainerLocked(true);
                    }

                    await fetchAllTrainers(userName);


                }

            } catch (error) {
                console.error('Error fetching trainer data:', error);
                showError('An error occurred while fetching trainer details');
            } finally {
                setLoading(false);
                console.log("user from details : ", user);

            }
        };

        fetchTrainerData();
    }, [showError, window.location.search]);

    const handleUnlockTrainer = async () => {


        if (isCompany) {


            showLoader()
            if (!trainerData?.name) {
                console.error('Trainer data is not available');
                showError('Trainer data is not available');
                return;
            }

            try {
                const res = await creditsApis.unlockTrainer(trainerData.name);

                if (res) {

                    setTrainerLocked(false);
                    // window.location.reload();
                    return;

                }
                else {
                    showError("Some error Occured");
                }


            } catch (error) {
                console.error('Error unlocking trainer:', error);
                showError('An error occurred while trying to unlock the trainer');
            }
            finally {
                hideLoader()
            }
        } else {


            handleNavigation('/login');
        }
    };

    // Trainer
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [overlayState, setOverlayState] = useState<{
        isOpen: boolean;
        type: 'details' | 'edit' | 'create' | null;
        data?: WorkshopDetailsData;
    }>({
        isOpen: false,
        type: null
    });

    const handleWorkshopClick = (type: 'details' | 'edit' | 'create', item: any) => {
        // Map the item to the expected WorkshopDetailsData interface
        const workshopData: WorkshopDetailsData = {
            id: item.idx.toString(),
            title: item.title,
            description: item.description || "",
            price: item.price || 0,
            targetAudience: item.target_audience || "",
            format: 'In-Person',
            image: item.workshop_image || "/assets/w1.jpg",
            objectives: item.description || "",
            outcomes: item.outcomes || "",
            handouts: item.handouts || "",
            programFlow: item.program_flow || "",
            evaluation: item.evaluation || ""
        };
        setOverlayState({ isOpen: true, type, data: workshopData });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <ErrorPopup
                isOpen={isOpen}
                message={message}
                onClose={hideError}
            />
            {/* Header */}
            <NavBar bgColor="bg-white" />

            {/* Main Content */}
            <main className="mx-auto px-4 py-8 bg-blue-100 rounded-t-2xl relative">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <Loader isLoading={true} size="lg" />
                    </div>
                ) : !trainerData ? (
                    <div className="flex justify-center items-center min-h-[10vh]">
                        <p className="text-xl text-gray-600">Trainer not found</p>
                    </div>
                ) : (
                    <Overlay
                        isOpen={overlayState.isOpen}
                        type={overlayState.type}
                        data={overlayState.data}
                        setOverlayState={setOverlayState}
                    />
                )}

                <div className="flex max-w-7xl mx-auto gap-4">
                    <div className="w-[30%] flex flex-col gap-6">
                        <div className="row-span-2 col-span-1">
                            <div className=" profile-card shadow-lg flex flex-col gap-3 justify-center items-center rounded-xl bg-white p-10 h-full">

                                <div className="trainer-profile w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">

                                    <img src={trainerData?.image} alt="img" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="trainer-name text-center text-2xl font-semibold p-0.5 h-[35px]"> {(trainerData && trainerData.full_name) || 'some'}</div>
                                    {isLoggedInUser && (
                                        <div className="w-full flex justify-center ">
                                            <button onClick={() => {
                                                if (trainerData) {
                                                    handleNavigation(`/trainer-form?trainer=${encodeURIComponent(JSON.stringify(trainerData))}`);
                                                } else {
                                                    handleNavigation('/trainer-form');
                                                }
                                            }}
                                                className="rounded-2xl  bg-blue-500 flexCenter text-white py-1.5 px-3 font-semibold hover:scale-105">Edit profile</button>
                                        </div>
                                    )}
                                </div>

                                <div className="rating flex items-center justify-center text-md gap-2 p-2">

                                    <span className="text-[16px] flexCenter text-center">
                                        <RatingStars rating={trainerData ? trainerData.avg_rating : 0} max={5} />
                                        &nbsp;{trainerData?.avg_rating} ({trainerData?.total_reviews})
                                    </span>
                                </div>
                                <div className="flex flex-row gap-2 justify-center items-center text-black-500">

                                    {trainerData?.expertise_in
                                        ?.split(',')
                                        .map((skill, index) => (
                                            <div
                                                key={index}
                                                className="rounded-2xl border-2 border-blue-500 px-4 py-1"
                                            >
                                                {skill.trim()}
                                            </div>
                                        ))}
                                </div>
                                <div className="flex flex-row flex-wrap trainer-details justify-center items-center font-light leading-[2rem] gap-x-2 gap-y-2">
                                    {/* Location */}
                                    <p className="flex items-center gap-1">
                                        <span className="inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000">
                                                <path d="M480.21-480Q510-480 531-501.21t21-51Q552-582 530.79-603t-51-21Q450-624 429-602.79t-21 51Q408-522 429.21-501t51 21ZM480-191q119-107 179.5-197T720-549q0-105-68.5-174T480-792q-103 0-171.5 69T240-549q0 71 60.5 161T480-191Zm0 95Q323.03-227.11 245.51-339.55 168-452 168-549q0-134 89-224.5T479.5-864q133.5 0 223 90.5T792-549q0 97-77 209T480-96Zm0-456Z" />
                                            </svg>
                                        </span>
                                        {trainerData?.city}
                                    </p>

                                    {/* Experience */}
                                    <p className="flex items-center gap-1">
                                        <span className="inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000">
                                                <path d="m391-415 34-110-89-70h109l35-108 35 108h109l-89 70 34 110-89-68-89 68ZM263-48v-280q-43-37-69-99t-26-125q0-130 91-221t221-91q130 0 221 91t91 221q0 64-24 125.5T696-327v279L480-96 263-48Zm217-264q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM335-138l145-32 144 32v-138q-33 18-69.5 27t-74.5 9q-38 0-75-8.5T335-276v138Zm145-70Z" />
                                            </svg>
                                        </span>
                                        {trainerData?.experience} years of experience
                                    </p>

                                    {/* Languages */}
                                    <p className="flex items-center gap-1">
                                        <span className="inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000">
                                                <path d="M809.65-318q-22.65 0-38.15-15.7-15.5-15.71-15.5-38.14v-89.73Q756-484 771.65-500q15.64-16 38-16Q832-516 848-500.2q16 15.79 16 38.36v90.27q0 22.57-15.85 38.07-15.86 15.5-38.5 15.5ZM792-192v-54.91q-47-7.09-77.5-42.04Q684-323.89 684-372h36q0 37.8 26.1 63.9T810-282q37 0 63.34-26.1 26.33-26.1 26.33-63.9H936q0 48.01-31.05 82.88T828-247v55h-36ZM336-480q-60 0-102-42t-42-102q0-60 42-102t102-42q17.07 0 33.54 4Q386-760 402-752q-20 28-31 60.5T360-624q0 35 10.89 68.15Q381.78-522.69 402-496q-16 8-32.46 12-16.47 4-33.54 4ZM48-192v-92q0-25.13 12.5-46.57Q73-352 95-366q47-28 99-44t108-21q-40 23-63 62.5T216-284v92H48Zm528-288q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm-.5-72q29.5 0 51-21 21.5-21.01 21.5-50.5 0-29.5-21.5-51t-51-21.5q-29.49 0-50.5 21.5-21 21.5-21 51 0 29.49 21 50.5 21.01 21 50.5 21ZM288-192v-92q0-25.13 12.5-46.57Q313-352 334-365q55-33 116.5-50T576-432q17 0 34.5 1.5T646-427q-8 17-12 35.5t-4 35.5q-13-2-26.5-3t-27.5-1q-55 0-107 14t-98 42q-5 4-8 9.07-3 5.06-3 10.93v20h294q14 23 33 41.5t45 30.5H288Zm288-432Zm0 360Z" />
                                            </svg>
                                        </span>
                                        {trainerData?.language}
                                    </p>
                                </div>

                                <div className=" relative border-1 border-gray-100 rounded-xl shadow-lg p-4 trainer-contact w-full">
                                    <h2 className="border-b-2 border-blue-500 text-lg font-semibold mb-3 pb-3">Contact Information</h2>
                                    {!isLoggedInUser && trainerLocked && (
                                        <div className="absolute top-5  inset-0 w-full h-full flex items-center justify-center z-10">
                                            <button
                                                onClick={handleUnlockTrainer}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-semibold hover:bg-blue-700 transition hover:scale-105"
                                            >
                                                Unlock Trainer
                                            </button>
                                        </div>
                                    )}
                                    <div className={`flex flex-col gap-3 ${!isLoggedInUser && trainerLocked ? 'blur-sm' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">{trainerData?.full_name}@trainer.com</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">{trainerData?.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-4 items-start p-2 justify-between items-center">
                                                {trainerData?.facebook && (
                                                    <a href={trainerData.facebook} target="_blank" rel="noopener noreferrer">
                                                        <img src="assets/fb24.png" alt="Facebook" />
                                                    </a>
                                                )}
                                                {trainerData?.twitter && (
                                                    <a href={trainerData.twitter} target="_blank" rel="noopener noreferrer">
                                                        <img src="assets/twtr24.png" alt="Twitter" />
                                                    </a>
                                                )}
                                                {trainerData?.linkedin && (
                                                    <a href={trainerData.linkedin} target="_blank" rel="noopener noreferrer">
                                                        <img src="assets/lin24.png" alt="LinkedIn" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 row-span-1 bg-white w-full rounded-xl flex flex-col justify-start items-start text-lg font-semibold p-5">
                            <p className="border-b-2 w-full border-blue-500 text-xl font-semibold pb-3">Analytics</p>
                            {/* <p className="leading-6 text-sm font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus consequuntur quis iste, officia dignissimos unde obcaecati rerum, molestias, dicta porro voluptates repellat tenetur. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia enim, saepe dignissimos omnis quibusdam fugiat aspernatur eius quis, assumenda eligendi nihil, quae earum.</p> */}
                            <div className="flex py-4 gap-2 w-full justify-start">
                                <div className="analytics-item flex flex-col items-start w-1/2 rounded-xl bg-blue-50 p-4 border-1 border-blue-200 font-light text-sm">
                                    <p className="text-sm text-gray-500"> Profile Views</p>
                                    <p className="text-3xl font-semibold py-2 flex items-center gap-2"> {trainerData?.profile_views} <span className="inline-block rounded-full bg-orange-100 p-2">
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
                                <p className={`border-b-2 border-blue-500 text-xl font-semibold pb-3 ${isLoggedInUser ? '' : 'w-full'} `}>Workshops & CaseStudies</p>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    {isLoggedInUser && (
                                        <button
                                            onClick={() => handleNavigation(`/workshop?workshops=${encodeURIComponent(JSON.stringify(trainerData?.workshop))}`)}
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                                        >
                                            view all
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="flex gap-4 px-4 py-8 overflow-x-auto scrollbar-hidden workshops-container">
                                    {trainerData?.casestudy.map((casestudy) => (
                                        <WorkshopCard
                                            key={casestudy.idx.toString()}
                                            workshop={{
                                                id: casestudy.idx.toString(),
                                                title: casestudy.title,
                                                description: casestudy.description || "",
                                                price: casestudy.price,
                                                targetAudience: casestudy.target_audience,
                                                format: 'In-Person',
                                                image: casestudy.workshop_image,
                                            }}
                                            onClick={() => handleWorkshopClick('details', casestudy)}
                                            tag="CaseStudy"
                                        />
                                    ))}
                                    {trainerData?.workshop.map((workshop) => (
                                        <WorkshopCard
                                            key={workshop.idx.toString()}
                                            workshop={{
                                                id: workshop.idx.toString(),
                                                title: workshop.title,
                                                description: workshop.description,
                                                price: workshop.price,
                                                targetAudience: workshop.target_audience,
                                                format: 'In-Person',
                                                image: workshop.workshop_image,
                                            }}
                                            onClick={() => handleWorkshopClick('details', workshop)}
                                            tag="Workshop"
                                        />
                                    ))}
                                </div>
                                {hasOverflow && (
                                    <div className="flex justify-center gap-4 mt-4">
                                        <button
                                            onClick={() => {
                                                const container = document.querySelector('.workshops-container');
                                                if (container) {
                                                    container.scrollLeft -= 300;
                                                }
                                            }}
                                            className="bg-white hover:bg-gray-50 p-2 rounded-full shadow-md border border-gray-200 transition-all duration-200 hover:scale-105"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                const container = document.querySelector('.workshops-container');
                                                if (container) {
                                                    container.scrollLeft += 300;
                                                }
                                            }}
                                            className="bg-white hover:bg-gray-50 p-2 rounded-full shadow-md border border-gray-200 transition-all duration-200 hover:scale-105"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* About Me - Full Width */}
                        <div className="mb-6 rounded-xl bg-white p-6 text-lg font-semibold w-full">
                            <div className="flex w-full justify-between items-center">
                                <p className={`w-full border-b-2 border-blue-500 text-xl font-semibold pb-3`}>About Me</p>
                            </div>

                            <p className="font-normal text-[16px] leading-[26px] py-4">
                                {trainerData?.bio_line}
                            </p>

                        </div>


                        {/* Masonry Grid */}
                        <div className="columns-1 md:columns-2 gap-6 space-y-6">
                            {/* Training Approach */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`w-full border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Training Approach</p>

                                </div>

                                <p className="font-ariel text-[16px] font-normal py-4">
                                    {trainerData?.trainers_approach}
                                </p>

                            </div>



                            {/* Certifications */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`w-full border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Certifications</p>

                                </div>
                                <div className="pt-4">
                                    <div className="">
                                        {trainerData?.certificates.map((certificate, index) => {

                                            const isLast = index === trainerData.education.length - 1;

                                            return (<div key={index}
                                                className={`border-l-4 border-blue-500 bg-[#EDF1FF] rounded-xl p-4 ${isLast ? '' : 'mb-4'}`}>
                                                <div className="flex justify-between text-sm">
                                                    <p className="text-[16px] font-normal">{certificate.certificate_name}</p>
                                                    <p className="text-[16px] font-normal">({certificate.issued_date})</p>
                                                </div>
                                                <p className="text-[14px] font-normal text-gray-500">{certificate.issued_by}</p>
                                            </div>);
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Clients Worked With */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`w-full border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Clients Worked With</p>

                                </div>
                                <div className="flex flex-wrap gap-2  py-4">
                                    {trainerData?.client_worked.map(client => (
                                        <div key={client.company} className="rounded-md bg-blue-100 text-blue-500 p-3 text-sm font-thin">
                                            {client.company}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Testimonials */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`w-full border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Testimonials</p>
                                </div>
                                <div className="pt-4 flex flex-col gap-4">


                                    {trainerData?.testimonilas.map((test, index) => {

                                        const isLastIndex = index === trainerData?.testimonilas.length - 1;


                                        return (
                                            <div key={index} className="bg-[#EDF1FF] rounded-xl p-4">
                                                <p className="text-md">{test.client_name}</p>
                                                <p className="text-xs">{test.company}</p>
                                                <p className="text-sm py-2 font-extralight">
                                                    {test.testimonials}
                                                </p>
                                            </div>
                                        );
                                    })}


                                </div>
                            </div>




                            {/* Education */}
                            <div className="break-inside-avoid bg-white rounded-xl p-6 ">
                                <div className="flex w-full justify-between items-center">
                                    <p className={`w-full border-b-2 border-blue-500 text-xl font-semibold pb-3`}>Education</p>

                                </div>
                                <div className="relative gap-2 pt-4">
                                    {/* <div className="absolute left-2 top-0 bottom-10 w-1   z-3 bg-blue-500"></div> */}

                                    {trainerData?.education.map((education, index) => {
                                        const isLast = index === trainerData.education.length - 1;

                                        return (
                                            <div
                                                key={index}
                                                className="relative text-md font-thin flex justify-between gap-2 mb-2 "
                                            >
                                                {!isLast && (
                                                    <div className="absolute left-[7px] top-0 bottom-1 w-[2.5px] bg-blue-300 z-0"></div>
                                                )}

                                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold z-10"></span>

                                                <div className={`pt-1 ${isLast ? 'pb-0' : 'pb-8'} pl-2 pr-4`} >
                                                    <p className="text-[16px] font-normal ">
                                                        {education.course}
                                                        &nbsp;&nbsp;
                                                        <span className="text-orange-500"> ({education.year}) </span>
                                                    </p>
                                                    <p className="text-[16px] font-normal">{education.institution}</p>
                                                    <p className="text-[14px] text-gray-500 font-light">
                                                        Specialized in Machine Learning and Artificial Intelligence
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}


                                    {/* <div className="relative text-md font-thin flex justify-between gap-2 mb-4">
                                        <div className="absolute left-2 top-0 bottom-1 w-[2.5px] bg-blue-400  z-0"></div>
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold z-10"></span>

                                        <div className="pt-4 pb-8">
                                            <p className="text-[16px] font-normal ">Ph.D. in Computer Science &nbsp;&nbsp;<span className="text-orange-500">(2015-2019)</span></p>
                                            <p className="text-[16px] font-normal">Stanford University</p>
                                            <p className="text-[14px] text-gray-500 font-light">Specialized in Machine Learning and Artificial Intelligence</p>
                                        </div>
                                    </div>
                                    <div className="relative text-md font-thin flex justify-between gap-2 ">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold z-10"></span>

                                        <div className="pt-4 pb-8">
                                            <p className="text-[16px] font-normal ">Ph.D. in Computer Science &nbsp;&nbsp;<span className="text-orange-500">(2015-2019)</span></p>
                                            <p className="text-[16px] font-normal">Stanford University</p>
                                            <p className="text-[14px] text-gray-500 font-light">Specialized in Machine Learning and Artificial Intelligence</p>
                                        </div>
                                    </div> */}
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
                            {!isLoggedInUser && !trainerLocked && (
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
            {!isLoggedInUser && (
                <section className="w-full max-w-7xl mx-auto px-4 py-10 trainer-list-section">
                    <h2 className="text-[30px] font-bold mb-6 text-gray-800 trainer-list-title">Discover Related Trainers</h2>
                    {/* <TrainerGrid trainers={dummyTrainers} limit={8} /> */}
                    <TrainerGrid
                        trainers={trainers}
                        paginationMode="client"
                        paginationConfig={{ page: 1, pageSize: 12 }}
                        pageLocked={true}
                    />
                </section>

            )}

            <Footer />
        </div>
    );
} 