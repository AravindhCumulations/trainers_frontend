'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit } from 'lucide-react';
import Image from 'next/image';
import NavBar from '../../components/Navbar';
import { Workshop } from '@/models/workshop.models';
import Footer from '@/components/Footer';
import EditWorkshop from '@/components/EditWorkshop';
import { trainerApis } from '@/lib/apis/trainer.apis';
import { TrainerDetailsModel, TrainerFormDto } from '@/models/trainerDetails.model';
import Overlay from '@/components/Overlay';
import WorkshopDetails from '@/components/WorkshopDetails';
import { usePopup } from '@/lib/hooks/usePopup';
import Popup from '@/components/Popup';

// Utility methods for payload construction
const constructWorkshopPayload = (workshops: Workshop[], caseStudies: Workshop[], trainerId: string, isCaseStudy: boolean): Partial<TrainerFormDto> => {
    const basePayload = {
        name: trainerId
    };

    if (isCaseStudy) {
        const payload = {
            ...basePayload,
            casestudy: caseStudies.map(caseStudy => ({
                title: caseStudy.title,
                objectives: caseStudy.objectives,
                price: caseStudy.price,
                target_audience: caseStudy.targetAudience,
                format: caseStudy.format,
                image: caseStudy.image,
                outcomes: caseStudy.outcomes,
                handouts: caseStudy.handouts,
                program_flow: caseStudy.programFlow,
                evaluation: caseStudy.evaluation
            }))
        } as any;
        console.log('Constructed Case Study Payload:', payload);
        return payload;
    }

    const payload = {
        ...basePayload,
        workshop: workshops.map(workshop => ({
            title: workshop.title,
            objectives: workshop.objectives,
            price: workshop.price,
            target_audience: workshop.targetAudience,
            format: workshop.format,
            image: workshop.image,
            outcomes: workshop.outcomes,
            handouts: workshop.handouts,
            program_flow: workshop.programFlow,
            evaluation: workshop.evaluation
        }))
    } as any;
    console.log('Constructed Workshop Payload:', payload);
    return payload;
};

const addWorkshop = (workshops: Workshop[], caseStudies: Workshop[], newWorkshop: Workshop, isCaseStudy: boolean) => {
    console.log('Adding new item:', { newWorkshop, isCaseStudy });
    if (isCaseStudy) {
        return {
            workshops: [...workshops],
            caseStudies: [...caseStudies, newWorkshop]
        };
    }
    return {
        workshops: [...workshops, newWorkshop],
        caseStudies: [...caseStudies]
    };
};

const updateWorkshop = (workshops: Workshop[], caseStudies: Workshop[], updatedWorkshop: Workshop, isCaseStudy: boolean) => {
    console.log('Updating item:', { updatedWorkshop, isCaseStudy });
    if (isCaseStudy) {
        return {
            workshops: [...workshops],
            caseStudies: caseStudies.map(workshop =>
                workshop.idx === updatedWorkshop.idx ? updatedWorkshop : workshop
            )
        };
    }
    return {
        workshops: workshops.map(workshop =>
            workshop.idx === updatedWorkshop.idx ? updatedWorkshop : workshop
        ),
        caseStudies: [...caseStudies]
    };
};

const deleteWorkshop = (workshops: Workshop[], caseStudies: Workshop[], idx: string, isCaseStudy: boolean) => {
    console.log('Deleting item:', { idx, isCaseStudy });
    if (isCaseStudy) {
        return {
            workshops: [...workshops],
            caseStudies: caseStudies.filter(workshop => workshop.idx !== idx)
        };
    }
    return {
        workshops: workshops.filter(workshop => workshop.idx !== idx),
        caseStudies: [...caseStudies]
    };
};

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [caseStudies, setCaseStudies] = useState<Workshop[]>([]);
    const { toastSuccess, toastError, showConfirmation, popupState, hidePopup } = usePopup();

    const [overlayState, setOverlayState] = useState<{
        isOpen: boolean;
        type: 'details' | 'edit' | 'create' | null;
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

            // Separate workshops and case studies
            const workshopList: Workshop[] = trainerData.workshop.map(w => ({
                idx: w.idx.toString(),
                title: w.title,
                objectives: w.objectives || '',
                price: w.price,
                targetAudience: w.target_audience,
                format: w.format as 'virtual' | 'In-Person',
                image: w.image,
                outcomes: w.outcomes || '',
                handouts: w.handouts || '',
                programFlow: w.program_flow || '',
                evaluation: w.evaluation || '',
                isCaseStudy: false
            }));

            const caseStudyList: Workshop[] = trainerData.casestudy.map(c => ({
                idx: `case_${c.idx}`,
                title: c.title,
                objectives: c.objectives || '',
                price: c.price,
                targetAudience: c.target_audience,
                format: c.format as 'virtual' | 'In-Person',
                image: c.image,
                outcomes: c.outcomes || '',
                handouts: c.handouts || '',
                programFlow: c.program_flow || '',
                evaluation: c.evaluation || '',
                isCaseStudy: true
            }));

            setWorkshops(workshopList);
            setCaseStudies(caseStudyList);
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

    const handleDeleteWorkshop = async (idx: string, isCaseStudy: boolean = false) => {
        try {
            console.log('Starting delete operation:', { idx, isCaseStudy });

            const searchParams = new URLSearchParams(window.location.search);
            const trainerName = searchParams.get('trainer');
            if (!trainerName) {
                throw new Error('Trainer name not found in URL');
            }

            const trainerResponse = await trainerApis.getTrainerByName(trainerName);
            const trainerId = trainerResponse.data.name;
            console.log('Retrieved trainer ID:', trainerId);

            const { workshops: updatedWorkshops, caseStudies: updatedCaseStudies } =
                deleteWorkshop(workshops, caseStudies, idx, isCaseStudy);
            console.log('Updated state after deletion:', { updatedWorkshops, updatedCaseStudies });

            const payload = constructWorkshopPayload(updatedWorkshops, updatedCaseStudies, trainerId, isCaseStudy);
            console.log('Sending delete payload to API:', payload);

            // Make API call to update trainer with the modified list
            await trainerApis.trainerForm.editFormData(payload);
            console.log('Delete API call successful');

            // Update local state
            if (isCaseStudy) {
                setCaseStudies(updatedCaseStudies);
            } else {
                setWorkshops(updatedWorkshops);
            }
            console.log('Local state updated after deletion');

            toastSuccess(`${isCaseStudy ? 'Case study' : 'Workshop'} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting ${isCaseStudy ? 'case study' : 'workshop'}:`, error);
            toastError(`Failed to delete ${isCaseStudy ? 'case study' : 'workshop'}`);
        }
    };

    const handleEditClick = (item: Workshop, e: React.MouseEvent, isCaseStudy: boolean = false) => {
        e.stopPropagation(); // Prevent card click event
        setOverlayState({
            isOpen: true,
            type: 'edit',
            data: {
                ...item,
                isCaseStudy
            }
        });
    };

    const handleDeleteClick = (idx: string, e: React.MouseEvent, isCaseStudy: boolean = false) => {
        e.stopPropagation(); // Prevent card click event
        showConfirmation(
            `Are you sure you want to delete this ${isCaseStudy ? 'case study' : 'workshop'}?`,
            () => handleDeleteWorkshop(idx, isCaseStudy),
            {
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        );
    };

    const handleWorkshopUpdate = async (workshopData: Workshop, isCreate: boolean, isCaseStudy: boolean) => {
        try {
            console.log('Starting workshop update operation:', { workshopData, isCreate, isCaseStudy });

            const searchParams = new URLSearchParams(window.location.search);
            const trainerName = searchParams.get('trainer');
            if (!trainerName) {
                throw new Error('Trainer name not found in URL');
            }

            const trainerResponse = await trainerApis.getTrainerByName(trainerName);
            const trainerId = trainerResponse.data.name;
            console.log('Retrieved trainer ID:', trainerId);

            let updatedWorkshops, updatedCaseStudies;

            if (isCreate) {
                console.log('Creating new item');
                const result = addWorkshop(workshops, caseStudies, workshopData, isCaseStudy);
                updatedWorkshops = result.workshops;
                updatedCaseStudies = result.caseStudies;
            } else {
                console.log('Updating existing item');
                const result = updateWorkshop(workshops, caseStudies, workshopData, isCaseStudy);
                updatedWorkshops = result.workshops;
                updatedCaseStudies = result.caseStudies;
            }

            console.log('Updated state:', { updatedWorkshops, updatedCaseStudies });

            const payload = constructWorkshopPayload(updatedWorkshops, updatedCaseStudies, trainerId, isCaseStudy);
            console.log('Sending payload to API:', payload);

            // Make API call to update trainer with the modified list
            await trainerApis.trainerForm.editFormData(payload);
            console.log('API call successful');

            // Fetch fresh data from the server
            await fetchWorkshops();
            console.log('Local state reloaded from server');

            // Show appropriate success message
            if (isCreate) {
                toastSuccess(`${isCaseStudy ? 'Case study' : 'Workshop'} created successfully`);
            } else {
                toastSuccess(`${isCaseStudy ? 'Case study' : 'Workshop'} updated successfully`);
            }

            setOverlayState({ isOpen: false, type: null });
        } catch (error) {
            console.error(`Error ${isCreate ? 'creating' : 'updating'} ${isCaseStudy ? 'case study' : 'workshop'}:`, error);
            toastError(`Failed to ${isCreate ? 'create' : 'update'} ${isCaseStudy ? 'case study' : 'workshop'}. Please try again.`);
        }
    };

    const renderCard = (item: Workshop, isCaseStudy: boolean = false) => {
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
                <div className="relative h-48">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            onClick={(e) => handleEditClick(item, e, isCaseStudy)}
                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={(e) => handleDeleteClick(item.idx, e, isCaseStudy)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <span className="whitespace-nowrap w-fit self-end text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.format}
                    </span>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-semibold">{item.title}</h2>

                    </div>
                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{item.objectives}</p>
                    <div className="flex flex-col justify-end items-start gap-2 mt-auto">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                                {isCaseStudy ? 'Case Study' : 'Workshop'}
                            </span>
                        </div>
                        <span className="text-green-600 font-bold">₹ {item.price}/hour</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
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
            <div className="container mx-auto my-10 w-full flex-grow">
                <div className="flex justify-between items-center mb-8 ">
                    <h1 className="text-4xl font-bold text-gray-800">Workshops & Case Studies</h1>
                    <button
                        onClick={() => {
                            setOverlayState({ isOpen: true, type: 'create' });
                        }}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        <Plus className="mr-2" /> Add
                    </button>
                </div>

                {/* Combined Workshops and Case Studies Section */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...workshops, ...caseStudies].map((item) => {
                            const isCaseStudy = item?.idx?.startsWith('case_') || false;
                            return renderCard(item, isCaseStudy);
                        })}
                    </div>
                </div>

                {workshops.length === 0 && caseStudies.length === 0 && (
                    <p>Add workshop or case study to display</p>
                )}

                {/* Overlay for Edit/Create/Details */}
                <Overlay
                    isOpen={overlayState.isOpen}
                    onClose={() => setOverlayState({ isOpen: false, type: null })}
                >
                    {overlayState.type === 'details' && overlayState.data && (
                        <WorkshopDetails
                            type={overlayState.data.isCaseStudy ? 'Case Study' : 'Workshop'}
                            workshop={overlayState.data}
                            onClose={() => setOverlayState({ isOpen: false, type: null })}
                        />
                    )}
                    {overlayState.type === 'edit' && (
                        <div className="bg-white w-full rounded-2xl mt-4">
                            <EditWorkshop
                                onClose={() => setOverlayState({ isOpen: false, type: null })}
                                initialData={overlayState.data}
                                mode="edit"
                                onUpdate={(workshopData) => handleWorkshopUpdate(workshopData, false, workshopData.isCaseStudy || false)}
                            />
                        </div>
                    )}
                    {overlayState.type === 'create' && (
                        <div className="bg-white w-full rounded-2xl mt-4">
                            <EditWorkshop
                                onClose={() => setOverlayState({ isOpen: false, type: null })}
                                mode="create"
                                onUpdate={(workshopData) => handleWorkshopUpdate(workshopData, true, workshopData.isCaseStudy || false)}
                            />
                        </div>
                    )}
                </Overlay>
            </div>
            <Footer />
        </div>
    );
} 