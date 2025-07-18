'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit, ArrowLeft, Eye } from 'lucide-react';
import Image from 'next/image';
import NavBar from '../../components/Navbar';
import { Workshop } from '@/models/workshop.models';
import Footer from '@/components/Footer';
import EditWorkshop from '@/components/EditWorkshop';
import { trainerApis } from '@/lib/apis/trainer.apis';
import { TrainerDetailsModel } from '@/models/trainerDetails.model';
import Overlay from '@/components/Overlay';
import WorkshopDetails from '@/components/WorkshopDetails';
import { usePopup } from '@/lib/hooks/usePopup';
import Popup from '@/components/Popup';
import { useUser } from '@/context/UserContext'
import { constructWorkshopPayload, addWorkshop, updateWorkshop, deleteWorkshop } from './workshop.helpers';
import { useRouter } from 'next/navigation';



export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const { toastSuccess, toastError, showConfirmation, popupState, hidePopup } = usePopup();
    const { user } = useUser();
    const router = useRouter();

    // Sample workshop data for preview
    const sampleWorkshop: Workshop = {
        idx: 'preview',
        title: 'The Change Playbook: Leading with Agility',
        objectives: 'Navigate change with our immersive program! Begin with expectation-setting, dive into activities like "Pass the Baton" and "Shuffle Pixel," explore Kotter\'s 8-Step Model, apply change initiatives in real time, and wrap up with shared takeaways for lasting impact.',
        price: 50000,
        target_audience: 'Business Unit Heads driving cultural or structural shifts, Team Leaders and Department Heads, Mid to Senior-Level Managers',
        format: 'In-Person',
        image: '/assets/edit_model.jpg',
        outcomes: 'Understand the Psychology of Change, Apply Kotter\'s 8-Step Model, Enhance Adaptability and Agility, Improve Team Collaboration During Change, Develop Strategic Thinking for Change Initiatives, Translate Learning into Action, Build Leadership Behaviours for Change',
        handouts: 'Participants receive structured handouts with Kotter\'s 8-Step Model, activity guides, reflection prompts, and space for insights, serving as practical takeaways to reinforce learning and apply change tools at work.',
        program_flow: 'Begin with expectation setting, Experience activities like "Pass the Baton" & "Shuffle Pixel", Explore Kotter\'s 8-Step Model & apply real change scenarios, Wrap with powerful takeaways',
        evaluation: 'Content Relevance, Facilitator Effectiveness, Learning Application, Participant Engagement, Overall Experience, Clarity of Learning Outcomes, Usefulness of Materials, Impact on Mindset',
        type: 'Workshop'
    };

    const [overlayState, setOverlayState] = useState<{
        isOpen: boolean;
        type: 'details' | 'edit' | 'create' | 'preview' | null;
        data?: Workshop;
    }>({
        isOpen: false,
        type: null
    });

    const fetchWorkshops = async () => {
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const trainerName = searchParams.get('trainer');

            if (!trainerName) {
                toastError('Trainer name not found in URL');
                return;
            }
            const response = await trainerApis.getTrainerByName(trainerName);

            const trainerData: TrainerDetailsModel = response.data;

            // Map API fields to Workshop model fields and ensure 'type' is set
            const allWorkshops: Workshop[] = trainerData.workshop.map(w => (
                {
                    idx: w.idx.toString(),
                    title: w.title,
                    objectives: w.objectives || '',
                    price: w.price,
                    target_audience: w.target_audience,
                    format: w.format as 'virtual' | 'In-Person',
                    image: w.image,
                    outcomes: w.outcomes || '',
                    handouts: w.handouts || '',
                    program_flow: w.program_flow || '',
                    evaluation: w.evaluation || '',
                    type: (w as any).type || 'Workshop',
                }));

            setWorkshops(allWorkshops);
        } catch (error) {
            console.error('Error fetching workshops:', error);
            toastError('Failed to fetch workshops and case studies');
        }
    };

    // Initial load when page loads
    useEffect(() => {
        fetchWorkshops();

        // Check for action=create parameter
        const searchParams = new URLSearchParams(window.location.search);
        const action = searchParams.get('action');
        if (action === 'create') {
            setOverlayState({ isOpen: true, type: 'create' });
        }
    }, []);

    const handleDeleteWorkshop = async (idx: string) => {
        try {


            const searchParams = new URLSearchParams(window.location.search);
            const trainerName = searchParams.get('trainer');
            if (!trainerName) {
                throw new Error('Trainer name not found in URL');
            }

            const trainerResponse = await trainerApis.getTrainerByName(trainerName);
            const trainerId = trainerResponse.data.name;


            const updatedWorkshops = deleteWorkshop(workshops, idx);


            const payload = constructWorkshopPayload(updatedWorkshops, trainerId);


            // Make API call to update trainer with the modified list
            await trainerApis.trainerForm.editFormData(payload);


            // // Update local state
            setWorkshops(updatedWorkshops);


            toastSuccess(`${workshops.find(w => w.idx === idx)?.type === 'Workshop' ? 'Workshop' : 'Casestudy'} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting workshop:`, error);
            toastError(`Failed to delete workshop/case study`);
        }
    };

    const handleEditClick = (item: any, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event



        setOverlayState({
            isOpen: true,
            type: 'edit',
            data: item
        });
    };

    const handleDeleteClick = (idx: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event
        const item = workshops.find(w => w.idx === idx);
        showConfirmation(
            `Are you sure you want to delete this ${item?.type === 'Workshop' ? 'Workshop' : 'Casestudy'}?`,
            () => handleDeleteWorkshop(idx),
            {
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        );
    };

    const handleWorkshopUpdate = async (workshopData: Workshop, isCreate: boolean) => {
        try {


            const searchParams = new URLSearchParams(window.location.search);
            const trainerName = searchParams.get('trainer');
            if (!trainerName) {
                throw new Error('Trainer name not found in URL');
            }

            const trainerId = user.name;

            let updatedWorkshops;

            if (isCreate) {

                updatedWorkshops = addWorkshop(workshops, workshopData);
            } else {

                updatedWorkshops = updateWorkshop(workshops, workshopData);
            }



            const payload = constructWorkshopPayload(updatedWorkshops, trainerId);


            // Make API call to update trainer with the modified list
            await trainerApis.trainerForm.editFormData(payload);


            // Fetch fresh data from the server
            await fetchWorkshops();


            // Show appropriate success message
            const action = isCreate ? 'created' : 'updated';
            const type = workshopData.type === 'Workshop' ? 'Workshop' : 'Casestudy';
            toastSuccess(`${type} ${action} successfully`);

            setOverlayState({ isOpen: false, type: null });
        } catch (error) {
            console.error(`Error ${isCreate ? 'creating' : 'updating'} workshop:`, error);
            toastError(`Failed to ${isCreate ? 'create' : 'update'} workshop/case study. Please try again.`);
        }
    };

    // const renderPreviewCard = () => {
    //     return (
    //         <motion.div
    //             initial={{ opacity: 0, y: 20 }}
    //             animate={{ opacity: 1, y: 0 }}
    //             className="bg-white rounded-lg shadow-lg overflow-hidden relative group cursor-pointer flex flex-col h-full border-2 border-dashed border-blue-300"
    //             onClick={() => setOverlayState({ isOpen: true, type: 'preview', data: sampleWorkshop })}
    //         >
    //             <div className="relative h-32 sm:h-40 lg:h-48">
    //                 <Image
    //                     src={sampleWorkshop.image}
    //                     alt={sampleWorkshop.title}
    //                     fill
    //                     className="object-cover opacity-80"
    //                 />
    //                 <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
    //                     <div className="text-center text-white">
    //                         <Eye className="w-8 h-8 mx-auto mb-2" />
    //                         <p className="text-sm font-medium">Preview</p>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="p-3 sm:p-4 lg:p-6 flex flex-col flex-grow">
    //                 <span className="whitespace-nowrap w-fit self-end text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
    //                     {sampleWorkshop.format}
    //                 </span>
    //                 <div className="flex justify-between items-start mb-2">
    //                     <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold line-clamp-2">{sampleWorkshop.title}</h2>
    //                 </div>
    //                 <p className="text-gray-600 mb-3 sm:mb-4 flex-grow line-clamp-3 text-sm sm:text-base">{sampleWorkshop.objectives}</p>
    //                 <div className="flex flex-col justify-end items-start gap-2 mt-auto">
    //                     <div className="flex flex-wrap gap-1 sm:gap-2">
    //                         <span className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
    //                             {sampleWorkshop.type}
    //                         </span>
    //                     </div>
    //                     <div className="flex items-center gap-1">
    //                         <span className="text-xs sm:text-sm font-semibold text-[#111827] leading-tight sm:leading-[20px] trainer-card-price">
    //                             ₹{sampleWorkshop.price}
    //                         </span>
    //                         <span
    //                             className="text-blue-600 text-sm cursor-pointer"
    //                             title={`₹${sampleWorkshop.price} per session for 50 pax`}
    //                         >
    //                             ⓘ
    //                         </span>
    //                     </div>
    //                 </div>
    //             </div>
    //         </motion.div>
    //     );
    // };

    const renderCard = (item: Workshop) => {



        // Safely check if item and idx exist
        if (!item || !item.idx) {
            console.error('Invalid item data:', item);
            return null;
        }
        return (
            <motion.div
                key={item.idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden relative group cursor-pointer flex flex-col h-full"
                onClick={() => setOverlayState({ isOpen: true, type: 'details', data: item })}
            >
                <div className="relative h-32 sm:h-40 lg:h-48">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1 sm:gap-2">
                        <button
                            onClick={(e) => handleEditClick(item, e)}
                            className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-600 transition"
                        >
                            <Edit size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                            onClick={(e) => handleDeleteClick(item.idx, e)}
                            className="bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition"
                        >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 flex flex-col flex-grow">
                    <span className="whitespace-nowrap w-fit self-end text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.format}
                    </span>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold line-clamp-2">{item.title}</h2>
                    </div>
                    <p className="text-gray-600 mb-3 sm:mb-4 flex-grow line-clamp-3 text-sm sm:text-base">{item.objectives}</p>
                    <div className="flex flex-col justify-end items-start gap-2 mt-auto">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                            <span className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                                {item.type === 'Workshop' ? 'Workshop' : 'Casestudy'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs sm:text-sm font-semibold text-[#111827] leading-tight sm:leading-[20px] trainer-card-price">
                                ₹{item.price}
                            </span>
                            <span
                                className="text-blue-600 text-sm cursor-pointer"
                                title={`₹${item.price} per session for 50 pax`}
                            >
                                ⓘ
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <>
            <style jsx>{`
                @media (max-width: 640px) {
                    .workshop-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
            <div className="min-h-screen bg-blue-100 flex flex-col">
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
                <NavBar />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-6 sm:my-8 lg:my-10 w-full flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="p-1 rounded hover:scale-105 transition"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-700" />
                            </button>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Workshops & Case Studies</h1>
                        </div>
                        <button
                            onClick={() => {
                                setOverlayState({ isOpen: true, type: 'create' });
                            }}
                            className="flex items-center bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm sm:text-base"
                        >
                            <Plus className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Add
                        </button>
                    </div>

                    {/* Combined Workshops and Case Studies Section */}
                    <div className="mb-8 sm:mb-12">
                        <div className="workshop-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {workshops.map((item) => renderCard(item))}
                        </div>
                    </div>

                    {workshops.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <p className="text-gray-500 text-sm sm:text-base mb-6">Add workshop or case study to display</p>
                            <div className="flex flex-col items-center justify-center">
                                <button
                                    onClick={() => setOverlayState({ isOpen: true, type: 'preview', data: sampleWorkshop })}
                                    className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    Sample Workshop Layout
                                </button>
                                <p className="text-xs text-gray-400 mt-2">See how your workshop will look when listed</p>
                            </div>
                        </div>
                    )}

                    {/* Overlay for Edit/Create/Details */}
                    <Overlay
                        isOpen={overlayState.isOpen}
                        onClose={() => setOverlayState({ isOpen: false, type: null })}
                    >
                        {overlayState.type === 'details' && overlayState.data && (
                            <WorkshopDetails
                                workshop={overlayState.data}
                                onClose={() => setOverlayState({ isOpen: false, type: null })}
                            />
                        )}
                        {overlayState.type === 'edit' && (
                            <div className="bg-white w-full rounded-xl sm:rounded-2xl mt-2 sm:mt-4 mx-2 sm:mx-4">
                                <EditWorkshop
                                    onClose={() => setOverlayState({ isOpen: false, type: null })}
                                    initialData={overlayState.data}
                                    mode="edit"
                                    onUpdate={(workshopData) => handleWorkshopUpdate(workshopData, false)}
                                />
                            </div>
                        )}
                        {overlayState.type === 'create' && (
                            <div className="bg-white w-full rounded-xl sm:rounded-2xl mt-2 sm:mt-4 mx-2 sm:mx-4">
                                <EditWorkshop
                                    onClose={() => setOverlayState({ isOpen: false, type: null })}
                                    mode="create"
                                    onUpdate={(workshopData) => handleWorkshopUpdate(workshopData, true)}
                                />
                            </div>
                        )}
                        {overlayState.type === 'preview' && overlayState.data && (
                            <WorkshopDetails
                                workshop={overlayState.data}
                                onClose={() => setOverlayState({ isOpen: false, type: null })}
                            />
                        )}
                    </Overlay>
                </div>
                <Footer />
            </div>
        </>
    );
} 