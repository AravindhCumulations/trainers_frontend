"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { ArrowLeft, Star } from "lucide-react";
import NavBar from "../../components/Navbar";
import Footer from "@/components/Footer";
import WorkshopDetails from '@/components/WorkshopDetails';
import TrainerGrid from "@/components/TrainerGrid";
import { trainerApis } from '@/lib/apis/trainer.apis';
import { TrainerDetailsModel } from '@/models/trainerDetails.model';
import { useLoading } from '@/context/LoadingContext';
import { getCurrentUserMail, getCurrentUserName, getCurrentUserRole } from '@/lib/utils/auth.utils'
import { RatingStars } from "@/components/RatingStars";
import { useNavigation } from "@/lib/hooks/useNavigation";

import { creditsApis } from '@/lib/apis/credits.apis';
import WorkshopCard from '@/components/WorkshopCard';
import { useUser } from '@/context/UserContext';
import Overlay from '@/components/Overlay';
import { TrainerCardModel } from '@/models/trainerCard.model';
import TrainerDetailsSkeleton from '@/components/TrainerDetailsSkeleton';
import { useSearchParams } from 'next/navigation';
import { usePopup } from '@/lib/hooks/usePopup';
import Popup from '@/components/Popup';
import { Workshop } from "@/models/workshop.models";
import { useRouter } from "next/navigation";

// Add this LockOverlay component near the top (after imports, before TrainerDetailsContent)
const LockOverlay = ({ message = "Kindly unlock to access these details." }) => (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        {/* Blurred background */}
        <div className="absolute inset-0 backdrop-blur-sm  rounded-xl" />
        {/* Centered lock icon and tooltip, not blurred */}
        <div className=" w-full h-full  relative flex flex-col items-center justify-center rounded">
            <svg
                className="w-8 h-8 text-gray-700 drop-shadow"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{ marginBottom: '0.5rem' }}
            >
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="bg-blue-100 text-gray-800 text-xs px-3 py-2 rounded shadow sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity mt-1 whitespace-nowrap">
                {message}
            </span>
        </div>
    </div>
);

// Main Content
const TrainerDetailsContent = () => {
    const { user, updateCredits, setProfilePic } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();


    // page specific
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);
    const [trainerLocked, setTrainerLocked] = useState(true);
    useEffect(() => {

    }, [trainerLocked])
    const [trainerData, setTrainerData] = useState<TrainerDetailsModel | null>(null);

    // featured trainers grid
    const [trainers, setTrainers] = useState<TrainerCardModel[]>([]);

    //utilities
    const [loading, setLoading] = useState(true);

    const { handleNavigation } = useNavigation();

    // looders
    const { showLoader, hideLoader } = useLoading();
    const { popupState, showError, hidePopup, showConfirmation, toastSuccess, showSuccess, toastError } = usePopup();



    const handleWishlistUpdate = (trainer: TrainerCardModel, isWishlisted: boolean) => {
        // Update the trainer in the trainers list
        setTrainers(prevTrainers =>
            prevTrainers.map(t =>
                t.name === trainer.name
                    ? { ...t, is_wishlisted: isWishlisted ? 1 : 0 }
                    : t
            )
        );
    };

    const fetchAllTrainers = async (userMail: string) => {
        if (!userMail) {
            return;
        }
        showLoader();

        try {
            const allTrainersData = await trainerApis.getAllTrainers(userMail, 1, 8);
            setTrainers(allTrainersData.All_trainers);
        }
        catch (error) {
            console.error('Error fetching trainers:', error);

        }
        finally {
            hideLoader();
        }
    };

    // Inside the workshops display container section:
    const workshopsContainerRef = useRef<HTMLDivElement>(null);
    const [workshopsHasOverflow, setWorkshopsHasOverflow] = useState(false);

    useEffect(() => {
        const container = workshopsContainerRef.current;
        if (!container) return;

        const checkOverflow = () => {
            setWorkshopsHasOverflow(container.scrollWidth > container.clientWidth);
        };

        // Initial check after a tick
        setTimeout(checkOverflow, 0);

        // Listen for scroll (in case content changes)
        container.addEventListener('scroll', checkOverflow);

        // Listen for resize/content changes
        const resizeObserver = new window.ResizeObserver(checkOverflow);
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener('scroll', checkOverflow);
            resizeObserver.disconnect();
        };
    }, [trainerData?.workshop, trainerData?.Casestudy]);



    useEffect(() => {
        const fetchTrainerData = async () => {
            try {
                const trainerName = searchParams.get('trainer');
                const userName = getCurrentUserName() || 'guest';
                const userRole = getCurrentUserRole() || 'guest';
                const userMail = getCurrentUserMail() || 'guest';

                console.log("get the mail here : ", userMail);



                if (!trainerName) {
                    showError('Trainer not found');
                    return;
                }

                if (userRole === 'Trainer' && userName === trainerName) {

                    setIsLoggedInUser(true);

                    const response = await trainerApis.getTrainerByName(trainerName);

                    setTrainerData(response.data);
                    setProfilePic(response.data.image);
                    setTrainerLocked(false);
                    if (!response.data) {
                        showError('Failed to fetch trainer details', {
                            onConfirm: () => handleNavigation('/')
                        });
                        return;
                    }
                }
                else {
                    const res = await trainerApis.company.getTrainerByName(trainerName, userMail);

                    if (!res || !res.data) {
                        showError('Failed to fetch trainer details');
                        return;
                    }

                    setTrainerData(res.data);

                    if (res.data.is_unlocked) {
                        setTrainerLocked(false);

                    }
                    else {
                        setTrainerLocked(true);
                    }

                    await fetchAllTrainers(userMail);

                }

            } catch (error) {
                console.error('Error fetching trainer data:', error);
                showError('Trainer Details not found', {
                    onConfirm: () => handleNavigation('/')
                });

            } finally {
                setLoading(false);
            }
        };

        fetchTrainerData();
    }, [showError, searchParams]);

    const handleUnlockTrainer = async () => {
        if (user.isLoggedIn) {
            if (!trainerData?.name) {
                console.error('Trainer data is not available');
                toastError('Trainer data is not available');
                return;
            }

            if (!user.credits) {
                showConfirmation(
                    "You're out of credits! Would you like to purchase more to continue?",
                    () => handleNavigation('/manage-credits'),
                    {
                        confirmText: 'Buy',
                        cancelText: 'Cancel'
                    }

                );
            }
            else {
                showConfirmation(
                    "Unlocking this trainer will deduct 10 credits from your balance.",
                    async () => {
                        showLoader();
                        try {
                            const res = await creditsApis.unlockTrainer(trainerData.name);
                            if (res) {
                                setTrainerLocked(false);
                                try {
                                    await updateCredits(); // Handle this separately
                                } catch (creditUpdateErr) {
                                    console.error("Failed to update credits:", creditUpdateErr);
                                    toastError("Failed to update your credits.");
                                }
                                const userMail = getCurrentUserMail() || 'guest';
                                const updatedTrainerData = await trainerApis.company.getTrainerByName(trainerData.name, userMail);
                                if (updatedTrainerData && updatedTrainerData.data) {
                                    setTrainerData(updatedTrainerData.data);
                                }
                                showSuccess('Trainer unlocked successfully!');
                            } else {
                                toastError("Some error occurred while unlocking trainer");
                            }
                        } catch (error) {
                            console.error('Error unlocking trainer:', error);
                            toastError('An error occurred while trying to unlock the trainer');
                        } finally {
                            hideLoader();
                        }
                    },
                    {
                        confirmText: 'Proceed',
                        cancelText: 'Cancel'
                    }
                );
            }


        } else {
            showConfirmation(
                'You need to be logged in to access this feature. Would you like to proceed to the login page?',
                () => handleNavigation('/login'),
                {
                    title: 'Login Required',
                    confirmText: 'Proceed to Login',
                    cancelText: 'Stay Here'
                }
            );
        }
    };

    // Trainer
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [overlayState, setOverlayState] = useState<{
        isOpen: boolean;
        type: 'details' | 'edit' | 'create' | null;
        data?: Workshop;
    }>({
        isOpen: false,
        type: null
    });

    const callLogin = () => {


        showConfirmation(
            'You need to be logged in to access this feature. Would you like to proceed to the login page?',
            () => {
                router.push('/login');
            },
            {
                title: 'Login Required',
                confirmText: 'Proceed to Login',
                cancelText: 'Stay Here'
            }
        );
    }

    const handleWorkshopClick = (type: 'details' | 'edit' | 'create', item: Workshop) => {

        if (trainerLocked) {
            return;
        }

        if (!item) {
            showError("Failed to load Data")
        }
        // Map the item to the expected WorkshopDetailsData interface
        const workshopData: Workshop = {
            idx: item.idx.toString(),
            title: item.title,
            price: item.price,
            target_audience: item.target_audience,
            format: item.format,
            image: item.image,
            objectives: item.objectives,
            outcomes: item.outcomes,
            handouts: item.handouts,
            program_flow: item.program_flow,
            evaluation: item.evaluation,
            type: item.type
        };
        setOverlayState({ isOpen: true, type, data: workshopData });
    };

    const handleSubmitReview = async () => {
        if (!rating || !reviewText.trim()) {
            toastError('Please provide both rating and review');
            return;
        }

        setIsSubmitting(true);
        try {
            await trainerApis.fileUpload.ratings.submitReview({
                users: user.email,
                trainers: trainerData?.name ?? '',
                rating: rating,
                review: reviewText.trim()
            });

            // Reset form
            setRating(0);
            setReviewText('');
            toastSuccess('Review submitted successfully!');

            const userMail = getCurrentUserMail() || 'guest';


            // Refresh trainer data to show new review
            const trainerName = searchParams.get('trainer');
            if (trainerName) {
                const response = await trainerApis.company.getTrainerByName(trainerName, userMail);
                setTrainerData(response.data);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toastError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
            <Popup
                isOpen={popupState.isOpen}
                type={popupState.type}
                message={popupState.message}
                title={popupState.title}
                onClose={hidePopup}
                onConfirm={popupState.onConfirm}
                confirmText={popupState.confirmText}
                cancelText={popupState.cancelText}
            />
            {/* Header */}
            <NavBar bgColor="bg-white" />

            {/* Main Content */}
            <main className="w-full flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-blue-100 rounded-t-2xl relative">
                {loading ? (
                    <TrainerDetailsSkeleton />
                ) : !trainerData ? (
                    <div className="flex justify-center items-center min-h-[10vh]">
                        <p className="text-xl text-gray-600">Trainer not found</p>
                    </div>
                ) : (
                    <>
                        <Overlay isOpen={overlayState.isOpen} onClose={() => setOverlayState({ isOpen: false, type: null })}>
                            {overlayState.type === 'details' && overlayState.data && (
                                <WorkshopDetails
                                    workshop={overlayState.data}
                                    onClose={() => setOverlayState({ isOpen: false, type: null })}
                                />
                            )}
                        </Overlay>

                        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-4 lg:gap-6">
                            <div className="w-full lg:w-[30%] flex flex-col gap-4 lg:gap-6">
                                <div className="row-span-2 col-span-1">
                                    {/* ProfileCard */}
                                    <div className="profile-card shadow-lg flex flex-col gap-3 justify-center items-center rounded-xl bg-white p-4 sm:p-6 lg:p-10 h-full">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (typeof window !== 'undefined') {
                                                    const ref = document.referrer;
                                                    if (ref && (ref.includes('/login') || ref.includes('/signup') || ref.includes('/trainer-form'))) {
                                                        router.push('/');
                                                    } else {
                                                        router.back();
                                                    }
                                                } else {
                                                    router.back();
                                                }
                                            }}
                                            className="p-1 rounded hover:scale-105 transition self-start"
                                            aria-label="Go back"
                                        >
                                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                                        </button>
                                        <div className="trainer-profile w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                            <img src={trainerData.image} alt="img" className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            <div className="trainer-name text-center text-lg sm:text-xl lg:text-[24px] font-bold leading-tight sm:leading-[32px] text-[#1E2939]">{trainerData.full_name}</div>
                                            {isLoggedInUser && (
                                                <div className="w-full flex justify-center">
                                                    <button onClick={() => {
                                                        showLoader();
                                                        window.location.href = `/trainer-form?trainerData=${encodeURIComponent(JSON.stringify(trainerData))}`;
                                                    }}
                                                        className="rounded-2xl bg-blue-500 flex justify-center items-center text-white py-1.5 px-3 font-semibold hover:scale-105 text-sm sm:text-base">Edit profile</button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="rating flex items-center justify-center text-sm sm:text-md gap-1 p-2">
                                            <RatingStars rating={trainerData.avg_rating} max={5} />
                                            <span className="text-sm sm:text-[16px]">
                                                {trainerData.avg_rating} ({trainerData.total_reviews})
                                            </span>
                                        </div>
                                        <div className="flex flex-row flex-wrap gap-2 justify-center items-center text-black-500">
                                            {trainerData.expertise_in
                                                ?.split(',')
                                                .map((skill, index) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-2xl border-2 border-blue-500 px-2 sm:px-4 py-1 whitespace-nowrap text-xs sm:text-sm"
                                                    >
                                                        {skill.trim()}
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="flex flex-col sm:flex-row flex-wrap trainer-details justify-center items-center font-normal leading-[20px] sm:leading-[24px] text-sm sm:text-[16px] text-[#4A5565] gap-x-2 gap-y-2">
                                            {/* Location */}
                                            <p className="flex items-center gap-1">
                                                <span className="inline-block">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 -960 960 960" fill="#000" className="sm:h-5 sm:w-5">
                                                        <path d="M480.21-480Q510-480 531-501.21t21-51Q552-582 530.79-603t-51-21Q450-624 429-602.79t-21 51Q408-522 429.21-501t51 21ZM480-191q119-107 179.5-197T720-549q0-105-68.5-174T480-792q-103 0-171.5 69T240-549q0 71 60.5 161T480-191Zm0 95Q323.03-227.11 245.51-339.55 168-452 168-549q0-134 89-224.5T479.5-864q133.5 0 223 90.5T792-549q0 97-77 209T480-96Zm0-456Z" />
                                                    </svg>
                                                </span>
                                                {trainerData.city}
                                            </p>

                                            {/* Experience */}
                                            <p className="flex items-center gap-1">
                                                <span className="inline-block">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 -960 960 960" fill="#000" className="sm:h-5 sm:w-5">
                                                        <path d="m391-415 34-110-89-70h109l35-108 35 108h109l-89 70 34 110-89-68-89 68ZM263-48v-280q-43-37-69-99t-26-125q0-130 91-221t221-91q130 0 221 91t91 221q0 64-24 125.5T696-327v279L480-96 263-48Zm217-264q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM335-138l145-32 144 32v-138q-33 18-69.5 27t-74.5 9q-38 0-75-8.5T335-276v138Zm145-70Z" />
                                                    </svg>
                                                </span>
                                                {trainerData.experience} years of experience
                                            </p>

                                            {/* Languages */}
                                            <p className="flex items-center gap-1 cursor-pointer" title={trainerData.language}>
                                                <span className="inline-block">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 -960 960 960" fill="#000" className="sm:h-5 sm:w-5">
                                                        <path d="M809.65-318q-22.65 0-38.15-15.7-15.5-15.71-15.5-38.14v-89.73Q756-484 771.65-500q15.64-16 38-16Q832-516 848-500.2q16 15.79 16 38.36v90.27q0 22.57-15.85 38.07-15.86 15.5-38.5 15.5ZM792-192v-54.91q-47-7.09-77.5-42.04Q684-323.89 684-372h36q0 37.8 26.1 63.9T810-282q37 0 63.34-26.1 26.33-26.1 26.33-63.9H936q0 48.01-31.05 82.88T828-247v55h-36ZM336-480q-60 0-102-42t-42-102q0-60 42-102t102-42q17.07 0 33.54 4Q386-760 402-752q-20 28-31 60.5T360-624q0 35 10.89 68.15Q381.78-522.69 402-496q-16 8-32.46 12-16.47 4-33.54 4ZM48-192v-92q0-25.13 12.5-46.57Q73-352 95-366q47-28 99-44t108-21q-40 23-63 62.5T216-284v92H48Zm528-288q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm-.5-72q29.5 0 51-21 21.5-21.01 21.5-50.5 0-29.5-21.5-51t-51-21.5q-29.49 0-50.5 21.5-21 21.5-21 51 0 29.49 21 50.5 21.01 21 50.5 21ZM288-192v-92q0-25.13 12.5-46.57Q313-352 334-365q55-33 116.5-50T576-432q17 0 34.5 1.5T646-427q-8 17-12 35.5t-4 35.5q-13-2-26.5-3t-27.5-1q-55 0-107 14t-98 42q-5 4-8 9.07-3 5.06-3 10.93v20h294q14 23 33 41.5t45 30.5H288Zm288-432Zm0 360Z" />
                                                    </svg>
                                                </span>
                                                {(() => {
                                                    const langs = (trainerData.language || '').split(',').map(l => l.trim()).filter(Boolean);
                                                    const maxToShow = 2;
                                                    if (langs.length <= maxToShow) {
                                                        return langs.join(', ');
                                                    } else {
                                                        return `${langs.slice(0, maxToShow).join(', ')}, +${langs.length - maxToShow}`;
                                                    }
                                                })()}
                                            </p>
                                        </div>

                                        {/* Contact Details */}
                                        <div className="w-full max-w-[300px] relative border-1 border-gray-100 rounded-xl shadow-lg p-3 sm:p-4 trainer-contact ">
                                            <h2 className="border-b-2 border-blue-500 text-base sm:text-lg font-semibold mb-3 pb-3">Contact Information</h2>

                                            {/* unlock button */}
                                            {!isLoggedInUser && trainerLocked && (
                                                <div className="absolute top-5  inset-0 w-full h-full flex items-center justify-center z-10">
                                                    <button
                                                        onClick={handleUnlockTrainer}
                                                        className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-2xl font-semibold hover:bg-blue-700 transition hover:scale-105 text-sm sm:text-base"
                                                    >
                                                        Unlock Trainer
                                                    </button>
                                                </div>
                                            )}

                                            <div className={`flex flex-col gap-3 ${!isLoggedInUser && trainerLocked ? 'blur-sm' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-xs sm:text-sm text-gray-600">{trainerLocked ? 'dummymail27@gmail.com' : trainerData.trainer}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="text-xs sm:text-sm text-gray-600">{trainerLocked ? '+91-81234558722' : trainerData.phone}</span>
                                                </div>
                                                {/* social links */}
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-2 sm:gap-4 items-start p-2 justify-between items-center">
                                                        {trainerLocked ? (
                                                            <>
                                                                <a href={'/'} target="_blank" rel="noopener noreferrer">
                                                                    <img src="assets/social/Facebook.svg" alt="Facebook" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                </a>

                                                                <a href={'/'} target="_blank" rel="noopener noreferrer">
                                                                    <img src="assets/social/Twitter.svg" alt="Twitter" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                </a>

                                                                <a href={'/'} target="_blank" rel="noopener noreferrer">
                                                                    <img src="assets/social/LinkedIn.svg" alt="LinkedIn" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                </a>

                                                                <a href={'/'} target="_blank" rel="noopener noreferrer">
                                                                    <img src="assets/social/Instagram.svg" alt="Instagram" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                </a>

                                                                <a href={'/'} target="_blank" rel="noopener noreferrer">
                                                                    <img src="assets/social/Website.svg" alt="Website" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                </a>

                                                            </>
                                                        ) : (
                                                            <>
                                                                {trainerData.facebook?.trim() && (
                                                                    <a href={trainerData.facebook} target="_blank" rel="noopener noreferrer">
                                                                        <img src="assets/social/Facebook.svg" alt="Facebook" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                    </a>
                                                                )}
                                                                {trainerData.twitter?.trim() && (
                                                                    <a href={trainerData.twitter} target="_blank" rel="noopener noreferrer">
                                                                        <img src="assets/social/Twitter.svg" alt="Twitter" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                    </a>
                                                                )}
                                                                {trainerData.linkedin?.trim() && (
                                                                    <a href={trainerData.linkedin} target="_blank" rel="noopener noreferrer">
                                                                        <img src="assets/social/LinkedIn.svg" alt="LinkedIn" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                    </a>
                                                                )}
                                                                {trainerData.instagram?.trim() && (
                                                                    <a href={trainerData.instagram} target="_blank" rel="noopener noreferrer">
                                                                        <img src="assets/social/Instagram.svg" alt="Instagram" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                    </a>
                                                                )}
                                                                {trainerData.personal_website?.trim() && (
                                                                    <a href={trainerData.personal_website} target="_blank" rel="noopener noreferrer">
                                                                        <img src="assets/social/Website.svg" alt="Website" className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                    </a>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Analytics */}
                                <div className="col-span-1 row-span-1 bg-white w-full rounded-xl flex flex-col justify-start items-start text-base sm:text-lg font-semibold p-3 sm:p-5">
                                    <p className="border-b-2 w-full border-blue-500 text-lg sm:text-xl font-semibold pb-3">Analytics</p>
                                    <div className="flex flex-col sm:flex-row py-4 gap-3 sm:gap-2 w-full justify-start">
                                        <div className="analytics-item flex flex-col items-start w-full sm:w-1/2 rounded-xl bg-blue-50 p-3 sm:p-4 border-1 border-blue-200 font-light text-xs sm:text-sm">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1"> Profile Views</p>
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-2xl sm:text-3xl font-semibold">{trainerData.profile_views}</p>
                                                <span className="inline-block rounded-full bg-orange-100 p-1 sm:p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 -960 960 960" fill="#000" className="sm:h-6 sm:w-6"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="12px" width="12px" viewBox="0 -960 960 960" fill="#000" className="sm:h-5 sm:w-5"><path d="m147-209-51-51 281-281 152 152 212-211H624v-72h240v240h-72v-117L529-287 377-439 147-209Z" /></svg>
                                                <p className="text-green-500 text-xs sm:text-sm">12%</p>
                                            </div>
                                            <p className="text-gray-500 text-xs">since last month</p>
                                        </div>
                                        <div className="analytics-item flex flex-col items-start w-full sm:w-1/2 rounded-xl bg-pink-50 p-3 sm:p-4 border-1 border-pink-200 font-light text-xs sm:text-sm">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1"> Contact Unlocked</p>
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-2xl sm:text-3xl font-semibold">{trainerData.total_unlocks}</p>
                                                <span className="inline-block rounded-full bg-pink-100 p-1 sm:p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 -960 960 960" fill="#000" className="sm:h-6 sm:w-6"><path d="M240-640h360v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85h-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640Zm0 480h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM240-160v-400 400Z" /></svg>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="12px" width="12px" viewBox="0 -960 960 960" fill="#000" className="sm:h-5 sm:w-5"><path d="m147-209-51-51 281-281 152 152 212-211H624v-72h240v240h-72v-117L529-287 377-439 147-209Z" /></svg>
                                                <p className="text-green-500 text-xs sm:text-sm">8%</p>
                                            </div>
                                            <p className="text-gray-500 text-xs">since last month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-[70%] mx-auto">
                                {/* Workshops - Full Width */}
                                <div className="mb-4 sm:mb-6 rounded-xl bg-white p-3 sm:p-6 text-base sm:text-lg font-semibold">
                                    <div className="flex flex-row  justify-between items-start sm:items-center w-full gap-2 sm:gap-0">
                                        <p className={`border-b-2 border-blue-500 text-lg sm:text-xl font-semibold pb-3 ${isLoggedInUser ? '' : 'w-full'} `}>Workshops & Case Studies</p>
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            {isLoggedInUser && (
                                                <button
                                                    onClick={() => {
                                                        handleNavigation(`/workshop?trainer=${user.name}`);
                                                    }}
                                                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                                                >
                                                    {trainerData.workshop.length === 0 ? 'Add' : 'View all'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div
                                            ref={workshopsContainerRef}
                                            className="flex gap-4 px-5 py-8 overflow-x-auto scrollbar-hidden workshops-container"
                                        >
                                            {(!trainerData.Casestudy || trainerData.Casestudy.length === 0) &&
                                                (!trainerData.workshop || trainerData.workshop.length === 0) ? (
                                                <div className="w-full" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
                                                    {isLoggedInUser ? (
                                                        <p>Add workshops or case studies to display.</p>
                                                    ) : (
                                                        <p>No data available.</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    {(trainerData.workshop || []).map((workshop) => (
                                                        <div key={workshop.idx.toString()} className={`relative group`}>
                                                            <WorkshopCard
                                                                workshop={{
                                                                    idx: workshop.idx.toString(),
                                                                    title: workshop.title ?? '',
                                                                    objectives: workshop.objectives ?? '',
                                                                    price: workshop.price ?? '',
                                                                    target_audience: workshop.target_audience ?? '',
                                                                    format: workshop.format ?? '',
                                                                    image: workshop.image ?? '',
                                                                    outcomes: workshop.outcomes ?? '',
                                                                    handouts: workshop.handouts ?? '',
                                                                    program_flow: workshop.program_flow ?? '',
                                                                    evaluation: workshop.evaluation ?? '',
                                                                    type: workshop.type
                                                                }}
                                                                onClick={() => {
                                                                    // Prevent click if locked
                                                                    handleWorkshopClick('details', workshop);
                                                                }}
                                                            />
                                                            {trainerLocked && (
                                                                <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <LockOverlay message="Kindly unlock to access this workshop." />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                        {workshopsHasOverflow && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        const container = workshopsContainerRef.current;
                                                        if (container) container.scrollLeft -= 300;
                                                    }}
                                                    className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-blue-400 hover:bg-blue-200 p-2 rounded-full shadow-md  transition-all duration-200 hover:scale-105"
                                                    style={{ transform: 'translateY(-50%)' }}
                                                    aria-label="Scroll left"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" color="#FFFFFF" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                                                        <path d="M15 18l-6-6 6-6" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const container = workshopsContainerRef.current;
                                                        if (container) container.scrollLeft += 300;
                                                    }}
                                                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-blue-400 hover:bg-blue-200 p-2 rounded-full shadow-md  transition-all duration-200 hover:scale-105"
                                                    style={{ transform: 'translateY(-50%)' }}
                                                    aria-label="Scroll right"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" color="#FFFFFF" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                                                        <path d="M9 18l6-6-6-6" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* About Me - Full Width */}
                                <div className="mb-4 sm:mb-6 rounded-xl bg-white p-3 sm:p-6 text-base sm:text-lg font-semibold w-full">
                                    <div className="flex w-full justify-between items-center">
                                        <p className="w-full border-b-2 border-blue-500 text-base sm:text-[18px] font-bold leading-tight sm:leading-[28px] text-[#1E2939] pb-3">About Me</p>
                                    </div>

                                    <p className="font-normal text-sm sm:text-[16px] leading-relaxed sm:leading-[26px] py-3 sm:py-4 break-words">
                                        {trainerData.bio_line}
                                    </p>
                                </div>

                                {/* Masonry Grid */}
                                <div className="masonry-grid columns-1 lg:columns-2 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
                                    {/* Training Approach */}
                                    <div className="break-inside-avoid bg-white rounded-xl p-3 sm:p-6">
                                        <div className="flex w-full justify-between items-center">
                                            <p className="w-full border-b-2 border-blue-500 text-base sm:text-[18px] font-bold leading-tight sm:leading-[28px] text-[#1E2939] pb-3">Training Approach</p>
                                        </div>

                                        {(!isLoggedInUser && trainerLocked) ? (
                                            <div className="relative group">
                                                <p className="font-normal text-sm sm:text-[16px] leading-relaxed sm:leading-[26px] py-3 sm:py-4 break-words select-none bg-blue-50 rounded-md px-4 py-6">
                                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis odio eaque in obcaecati, ipsa at! Itaque molestias odit cumque maxime laborum explicabo sequi voluptatibus.
                                                </p>
                                                <LockOverlay />
                                            </div>
                                        ) : (
                                            <p className="font-normal text-sm sm:text-[16px] leading-relaxed sm:leading-[26px] py-3 sm:py-4  break-words">
                                                {trainerData.training_approach}
                                            </p>
                                        )}
                                    </div>

                                    {/* Certifications */}
                                    <div className="break-inside-avoid bg-white rounded-xl p-3 sm:p-6">
                                        <div className="flex w-full justify-between items-center">
                                            <p className="w-full border-b-2 border-blue-500 text-base sm:text-[18px] font-bold leading-tight sm:leading-[28px] pb-3">Certifications</p>
                                        </div>
                                        <div className="pt-3 sm:pt-4">
                                            {(!isLoggedInUser && trainerLocked) ? (
                                                <div className="relative group">
                                                    <div className={`border-l-4 border-blue-500 bg-[#EDF1FF] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4`}>
                                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                                            <p className="text-sm sm:text-[15.88px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">Lorem ipsum dolor sit.</p>
                                                            <p className="text-xs sm:text-[14px] font-normal text-[#4A5565] leading-tight sm:leading-[20px]">(2025)</p>
                                                        </div>
                                                        <p className="text-xs sm:text-[14px] font-normal text-[#4A5565] leading-tight sm:leading-[20px]">Lorem, ipsum.</p>
                                                    </div>
                                                    <div className={`border-l-4 border-blue-500 bg-[#EDF1FF] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4`}>
                                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                                            <p className="text-sm sm:text-[15.88px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">Lorem ipsum dolor sit.</p>
                                                            <p className="text-xs sm:text-[14px] font-normal text-[#4A5565] leading-tight sm:leading-[20px]">(2025)</p>
                                                        </div>
                                                        <p className="text-xs sm:text-[14px] font-normal text-[#4A5565] leading-tight sm:leading-[20px]">Lorem, ipsum.</p>
                                                    </div>
                                                    <LockOverlay />
                                                </div>
                                            ) : (
                                                <div className="">
                                                    {trainerData.certificates?.map ? trainerData.certificates.map((certificate, index) => {
                                                        const isLast = index === trainerData.certificates.length - 1;

                                                        return (<div key={index}
                                                            className={`border-l-4 border-blue-500 bg-[#EDF1FF] rounded-xl p-3 sm:p-4 ${isLast ? '' : 'mb-3 sm:mb-4'}`}>
                                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                                                <p className="text-sm sm:text-[15.88px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">{certificate.certificate_name}</p>
                                                                <p className="text-xs sm:text-[14px] font-normal text-[#4A5565] leading-tight sm:leading-[20px]">({certificate.issued_date})</p>
                                                            </div>
                                                            <p className="text-xs sm:text-[14px] font-normal text-[#4A5565] leading-tight sm:leading-[20px]">{certificate.issued_by}</p>
                                                        </div>);
                                                    }) : null}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reviews & Ratings */}
                                    {(trainerData.total_reviews ?? 0) > 0 && (
                                        <>
                                            {/* Reviews & Ratings */}
                                            <div className="break-inside-avoid bg-white rounded-xl p-3 sm:p-6">
                                                <div className="flex flex-col sm:flex-row sm:justify-between pb-3 gap-2 sm:gap-0">
                                                    <p className="border-b-2 border-blue-500 text-lg sm:text-xl font-semibold pb-3">Reviews & Ratings</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex">
                                                            <Star
                                                                className="w-4 h-4 fill-[#FE9A00] text-yellow-400"
                                                            />
                                                        </div>
                                                        <span className="text-sm sm:text-base">{trainerData.avg_rating} ({trainerData.total_reviews})</span>
                                                    </div>
                                                </div>
                                                {trainerData.reviews?.slice ? (
                                                    trainerData.reviews.slice(0, 3).map((review, i) => (
                                                        <div key={i} className="bg-[#EDF1FF] rounded-xl p-3 sm:p-4 mb-3">
                                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                                                                <p className="text-sm sm:text-md">{review.user_name}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Star
                                                                                key={star}
                                                                                className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= review.rating ? 'fill-[#FE9A00] text-yellow-400' : 'text-gray-300'}`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs sm:text-[14px] font-normal text-[#4A5565] leading-tight sm:leading-[20px] text-gray-500 pt-2">
                                                                {review.review}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : null}
                                            </div>
                                        </>
                                    )}

                                    {/* Clients Worked With */}
                                    <div className="break-inside-avoid bg-white rounded-xl p-3 sm:p-6">
                                        <div className="flex w-full justify-between items-center">
                                            <p className="w-full border-b-2 border-blue-500 text-base sm:text-[18px] font-bold leading-tight sm:leading-[28px] pb-3">Clients Worked With</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 py-3 sm:py-4">
                                            {(trainerData.client_worked || []).map(client => (
                                                <div key={client.company} className="rounded-md bg-blue-100 text-[#3B82F6] p-2 sm:p-3 text-xs sm:text-[14px] font-normal leading-tight sm:leading-[20px]">
                                                    {client.company}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Testimonials */}
                                    <div className="break-inside-avoid bg-white rounded-xl p-3 sm:p-6">
                                        <div className="flex w-full justify-between items-center">
                                            <p className="w-full border-b-2 border-blue-500 text-base sm:text-[18px] font-bold leading-tight sm:leading-[28px] pb-3">Testimonials</p>
                                        </div>
                                        <div className="pt-3 sm:pt-4 flex flex-col gap-3 sm:gap-4">
                                            {(trainerData.testimonials || []).map((test, index) => (
                                                <div key={index} className="bg-[#EDF1FF] rounded-xl p-3 sm:p-4">
                                                    <p className="text-sm sm:text-[16px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">{test.client_name}</p>
                                                    <p className="text-xs sm:text-[12px] font-normal text-[#1E2939] leading-tight sm:leading-[18px]">{test.company}</p>
                                                    <p className="text-xs sm:text-[14px] font-normal text-[#4A5565] leading-tight sm:leading-[20px] py-2  break-words">
                                                        {test.testimonials}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Education */}
                                    <div className="break-inside-avoid bg-white rounded-xl p-3 sm:p-6 ">
                                        <div className="flex w-full justify-between items-center">
                                            <p className="w-full border-b-2 border-blue-500 text-base sm:text-[18px] font-bold leading-tight sm:leading-[28px] pb-3">Education</p>
                                        </div>
                                        <div className="relative gap-2 pt-3 sm:pt-4">
                                            {(!isLoggedInUser && trainerLocked) ? (
                                                <div className="relative group">
                                                    <div className="space-y-2  select-none">
                                                        <div className="relative text-sm sm:text-md font-thin flex justify-start gap-2 mb-2">
                                                            <div className="absolute left-1 md:left-2 top-0 bottom-1 w-[2.5px] bg-blue-300 z-0"></div>
                                                            <span className="flex-shrink-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold z-10 text-xs sm:text-sm"></span>
                                                            <div className="pt-1 pb-0 pl-2 pr-2 sm:pr-4">
                                                                <p className="text-sm sm:text-[16px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">
                                                                    Lorem ipsum dolor sit amet. &nbsp;&nbsp;
                                                                    <span className="text-[#F54900]">(2025)</span>
                                                                </p>
                                                                <p className="text-sm sm:text-[16px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">Lorem, ipsum dolor.</p>
                                                            </div>
                                                        </div>
                                                        <div className="relative text-sm sm:text-md font-thin flex justify-start gap-2 mb-2">
                                                            <span className="flex-shrink-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold z-10 text-xs sm:text-sm"></span>
                                                            <div className="pt-1 pb-0 pl-2 pr-2 sm:pr-4">
                                                                <p className="text-sm sm:text-[16px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">
                                                                    Lorem ipsum dolor sit amet. &nbsp;&nbsp;
                                                                    <span className="text-[#F54900]">(2025)</span>
                                                                </p>
                                                                <p className="text-sm sm:text-[16px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">Lorem, ipsum dolor.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <LockOverlay />
                                                </div>
                                            ) : (
                                                (trainerData.education || []).map((education, index) => {
                                                    const isLast = index === trainerData.education.length - 1;

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="relative text-sm sm:text-md font-thin flex justify-start gap-2 mb-2"
                                                        >
                                                            {!isLast && (
                                                                <div className="absolute left-1 md:left-2 top-0 bottom-1 w-[2.5px] bg-blue-300 z-0"></div>
                                                            )}

                                                            <span className="flex-shrink-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold z-10 text-xs sm:text-sm"></span>

                                                            <div className={`pt-1 ${isLast ? 'pb-0' : 'pb-6 sm:pb-8'} pl-2 pr-2 sm:pr-4`}>
                                                                <p className="text-sm sm:text-[16px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">
                                                                    {education.course}
                                                                    &nbsp;&nbsp;
                                                                    <span className="text-[#F54900]">({education.year})</span>
                                                                </p>
                                                                <p className="text-sm sm:text-[16px] font-normal text-[#1E2939] leading-tight sm:leading-[24px]">{education.institution}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Post Your Review */}
                                    {!isLoggedInUser && !trainerLocked && (
                                        <div className="post-review-card break-inside-avoid bg-white rounded-xl p-3 sm:p-6">
                                            <p className="border-b-2 border-blue-500 text-xl sm:text-2xl font-semibold pb-3">Post Your Review</p>

                                            {/* Star Rating */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                                <p className="text-sm sm:text-base">Your rating</p>
                                                <div className="flex gap-1 p-2 sm:p-4">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHovered(star)}
                                                            onMouseLeave={() => setHovered(0)}
                                                            className="w-5 h-5 sm:w-6 sm:h-6"
                                                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                        >
                                                            <Star
                                                                className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${(hovered || rating) >= star
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
                                                className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base resize-none mt-2 focus:border-transparent"
                                                rows={4}
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                            />

                                            {/* Submit Button */}
                                            <button
                                                className="w-full mt-4 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base font-medium transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={handleSubmitReview}
                                                disabled={isSubmitting || !rating || !reviewText.trim()}
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Popular Trainers Section */}
            {trainerData && !isLoggedInUser && !loading && (
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 trainer-list-section">
                    <h2 className="text-xl sm:text-2xl lg:text-[30px] font-bold mb-4 sm:mb-6 text-gray-800 trainer-list-title">Discover Related Trainers</h2>
                    <TrainerGrid
                        trainers={trainers.filter(t => t.name !== searchParams.get('trainer'))}
                        paginationMode="client"
                        paginationConfig={{ page: 1, pageSize: 12 }}
                        pageLocked={true}
                        onWishlistUpdate={handleWishlistUpdate}
                        callLogin={callLogin}
                        isLoading={loading}
                    />
                </section>
            )}

            <Footer />
        </div>
    );
}

// Main component with Suspense
export default function TrainerDetails() {
    return (
        <>
            <style jsx>{`
                @media (max-width: 768px) {
                    .workshops-container {
                        scroll-snap-type: x mandatory;
                    }
                    .workshops-container > * {
                        scroll-snap-align: start;
                        min-width: 280px;
                    }
                }
                
                @media (max-width: 640px) {
                    .masonry-grid {
                        columns: 1 !important;
                    }
                    .break-inside-avoid {
                        break-inside: avoid;
                        margin-bottom: 1rem;
                    }
                }
            `}</style>
            <Suspense fallback={<TrainerDetailsSkeleton />}>
                <TrainerDetailsContent />
            </Suspense>
        </>
    );
} 