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
import { TrainerDetailsModel } from '@/models/trainerDetails.model';
import Overlay from '@/components/Overlay';
import WorkshopDetails from '@/components/WorkshopDetails';

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [caseStudies, setCaseStudies] = useState<Workshop[]>([]);

    const [overlayState, setOverlayState] = useState<{
        isOpen: boolean;
        type: 'details' | 'edit' | 'create' | null;
        data?: Workshop;
    }>({
        isOpen: false,
        type: null
    });

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const trainerName = searchParams.get('trainer');

                if (!trainerName) {
                    return;
                }
                const response = await trainerApis.getTrainerByName(trainerName);

                const trainerData: TrainerDetailsModel = response.data;

                // Log the raw data received from the API


                // Separate workshops and case studies
                const workshopList: Workshop[] = trainerData.workshop.map(w => ({
                    id: w.idx.toString(),
                    title: w.title,
                    description: w.description,
                    price: w.price,
                    targetAudience: w.target_audience,
                    format: w.format as 'virtual' | 'In-Person',
                    image: w.workshop_image,
                    objectives: w.description,
                    outcomes: w.outcomes || '',
                    handouts: w.handouts || '',
                    programFlow: w.program_flow || '',
                    evaluation: w.evaluation || ''
                }));

                const caseStudyList: Workshop[] = trainerData.casestudy.map(c => ({
                    id: c.idx.toString(),
                    title: c.title,
                    description: c.description,
                    price: c.price,
                    targetAudience: c.target_audience,
                    format: c.format as 'virtual' | 'In-Person',
                    image: c.workshop_image,
                    objectives: c.description,
                    outcomes: c.outcomes || '',
                    handouts: c.handouts || '',
                    programFlow: c.program_flow || '',
                    evaluation: c.evaluation || ''
                }));

                setWorkshops(workshopList);
                setCaseStudies(caseStudyList);





            } catch (error) {
                console.error('Error fetching workshops:', error);
            }
        };

        fetchWorkshops();
    }, []);

    const handleDeleteWorkshop = async (id: string, isCaseStudy: boolean = false) => {
        try {
            // Get trainer ID from URL
            const searchParams = new URLSearchParams(window.location.search);
            const trainerName = searchParams.get('trainer');
            if (!trainerName) {
                throw new Error('Trainer name not found in URL');
            }

            // Get trainer details to get the trainer ID
            const trainerResponse = await trainerApis.getTrainerByName(trainerName);
            const trainerId = trainerResponse.data.name;

            // Create payload with the updated list (excluding the deleted item)
            const payload = {
                name: trainerId,
                ...(isCaseStudy ? {
                    casestudy: caseStudies
                        .filter(caseStudy => caseStudy.id !== id)
                        .map(caseStudy => ({
                            title: caseStudy.title,
                            description: caseStudy.description,
                            price: caseStudy.price,
                            target_audience: caseStudy.targetAudience,
                            format: caseStudy.format,
                            workshop_image: caseStudy.image,
                            outcomes: caseStudy.outcomes,
                            handouts: caseStudy.handouts,
                            program_flow: caseStudy.programFlow,
                            evaluation: caseStudy.evaluation
                        }))
                } : {
                    workshop: workshops
                        .filter(workshop => workshop.id !== id)
                        .map(workshop => ({
                            title: workshop.title,
                            description: workshop.description,
                            price: workshop.price,
                            target_audience: workshop.targetAudience,
                            format: workshop.format,
                            workshop_image: workshop.image,
                            outcomes: workshop.outcomes,
                            handouts: workshop.handouts,
                            program_flow: workshop.programFlow,
                            evaluation: workshop.evaluation
                        }))
                })
            } as any;



            // Make API call to update trainer with the modified list
            await trainerApis.trainerForm.editFormData(payload);

            // Update local state
            if (isCaseStudy) {
                setCaseStudies(caseStudies.filter(caseStudy => caseStudy.id !== id));
            } else {
                setWorkshops(workshops.filter(workshop => workshop.id !== id));
            }
        } catch (error) {
            console.error(`Error deleting ${isCaseStudy ? 'case study' : 'workshop'}:`, error);
            alert(`Failed to delete ${isCaseStudy ? 'case study' : 'workshop'}`);
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

    const handleDeleteClick = (id: string, e: React.MouseEvent, isCaseStudy: boolean = false) => {
        e.stopPropagation(); // Prevent card click event
        if (window.confirm('Are you sure you want to delete this item?')) {
            handleDeleteWorkshop(id, isCaseStudy);
        }
    };

    const renderCard = (item: Workshop, isCaseStudy: boolean = false) => (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden relative group cursor-pointer"
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
                        onClick={(e) => handleDeleteClick(item.id, e, isCaseStudy)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-semibold">{item.title}</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.format}
                    </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                <div className="flex flex-col justify-center items-start gap-2">
                    <div className="flex flex-wrap gap-2">
                        {item.targetAudience.split(',').map((audience, index) => (
                            <span key={index} className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {audience.trim()}
                            </span>
                        ))}
                    </div>
                    <span className="text-green-600 font-bold">  ₹ {item.price.toFixed(2)}</span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col">
            <NavBar />
            <div className="container mx-auto my-4 w-full flex-grow">
                <div className="flex justify-between items-center mb-8">
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

                {/* Workshops Section */}
                {workshops.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Workshops</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workshops.map((workshop) => renderCard(workshop))}
                        </div>
                    </div>
                )}

                {/* Case Studies Section */}
                {caseStudies.length > 0 && (

                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Case Studies</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {caseStudies.map((caseStudy) => renderCard(caseStudy, true))}
                        </div>
                    </div>
                )}
                {workshops.length === 0 && caseStudies.length === 0 && (
                    <p>Add workshop or casestudy to display</p>
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
                        <div className="bg-white w-full rounded-2xl mt-4">
                            <EditWorkshop
                                onClose={() => setOverlayState({ isOpen: false, type: null })}
                                initialData={overlayState.data}
                                mode="edit"
                                onUpdate={async (workshopData) => {
                                    const isCreate = overlayState.type === 'create';
                                    const isCaseStudy = workshopData.isCaseStudy || false;

                                    try {
                                        // First, update the local state
                                        let updatedWorkshops, updatedCaseStudies;
                                        if (isCreate) {
                                            // Add new item to the appropriate list
                                            if (isCaseStudy) {
                                                updatedCaseStudies = [...caseStudies, {
                                                    id: workshopData.id,
                                                    title: workshopData.title,
                                                    description: workshopData.description,
                                                    price: workshopData.price,
                                                    targetAudience: workshopData.targetAudience,
                                                    format: workshopData.format as 'virtual' | 'In-Person',
                                                    image: workshopData.image,
                                                    objectives: workshopData.objectives,
                                                    outcomes: workshopData.outcomes,
                                                    handouts: workshopData.handouts,
                                                    programFlow: workshopData.programFlow,
                                                    evaluation: workshopData.evaluation
                                                }];
                                                updatedWorkshops = [...workshops];
                                            } else {
                                                updatedWorkshops = [...workshops, {
                                                    id: workshopData.id,
                                                    title: workshopData.title,
                                                    description: workshopData.description,
                                                    price: workshopData.price,
                                                    targetAudience: workshopData.targetAudience,
                                                    format: workshopData.format as 'virtual' | 'In-Person',
                                                    image: workshopData.image,
                                                    objectives: workshopData.objectives,
                                                    outcomes: workshopData.outcomes,
                                                    handouts: workshopData.handouts,
                                                    programFlow: workshopData.programFlow,
                                                    evaluation: workshopData.evaluation
                                                }];
                                                updatedCaseStudies = [...caseStudies];
                                            }
                                        } else {
                                            // Update existing item in the appropriate list
                                            if (isCaseStudy) {
                                                updatedCaseStudies = caseStudies.map(caseStudy =>
                                                    caseStudy.id === workshopData.id ? {
                                                        ...caseStudy,
                                                        title: workshopData.title,
                                                        description: workshopData.description,
                                                        price: workshopData.price,
                                                        targetAudience: workshopData.targetAudience,
                                                        format: workshopData.format as 'virtual' | 'In-Person',
                                                        image: workshopData.image,
                                                        objectives: workshopData.objectives,
                                                        outcomes: workshopData.outcomes,
                                                        handouts: workshopData.handouts,
                                                        programFlow: workshopData.programFlow,
                                                        evaluation: workshopData.evaluation
                                                    } : caseStudy
                                                );
                                                updatedWorkshops = [...workshops];
                                            } else {
                                                updatedWorkshops = workshops.map(workshop =>
                                                    workshop.id === workshopData.id ? {
                                                        ...workshop,
                                                        title: workshopData.title,
                                                        description: workshopData.description,
                                                        price: workshopData.price,
                                                        targetAudience: workshopData.targetAudience,
                                                        format: workshopData.format as 'virtual' | 'In-Person',
                                                        image: workshopData.image,
                                                        objectives: workshopData.objectives,
                                                        outcomes: workshopData.outcomes,
                                                        handouts: workshopData.handouts,
                                                        programFlow: workshopData.programFlow,
                                                        evaluation: workshopData.evaluation
                                                    } : workshop
                                                );
                                                updatedCaseStudies = [...caseStudies];
                                            }
                                        }

                                        // Get trainer ID from URL
                                        const searchParams = new URLSearchParams(window.location.search);
                                        const trainerName = searchParams.get('trainer');
                                        if (!trainerName) {
                                            throw new Error('Trainer name not found in URL');
                                        }

                                        // Get trainer details to get the trainer ID
                                        const trainerResponse = await trainerApis.getTrainerByName(trainerName);
                                        const trainerId = trainerResponse.data.name;

                                        // Create payload with only the modified list
                                        const payload = {
                                            name: trainerId,
                                            ...(isCaseStudy ? {
                                                casestudy: updatedCaseStudies.map((caseStudy) => ({
                                                    title: caseStudy.title,
                                                    description: caseStudy.description,
                                                    price: caseStudy.price,
                                                    target_audience: caseStudy.targetAudience,
                                                    format: caseStudy.format,
                                                    casestudy_image: caseStudy.image,
                                                    outcomes: caseStudy.outcomes,
                                                    handouts: caseStudy.handouts,
                                                    program_flow: caseStudy.programFlow,
                                                    evaluation: caseStudy.evaluation
                                                }))
                                            } : {
                                                workshop: updatedWorkshops.map((workshop) => ({
                                                    title: workshop.title,
                                                    description: workshop.description,
                                                    price: workshop.price,
                                                    target_audience: workshop.targetAudience,
                                                    format: workshop.format,
                                                    workshop_image: workshop.image,
                                                    outcomes: workshop.outcomes,
                                                    handouts: workshop.handouts,
                                                    program_flow: workshop.programFlow,
                                                    evaluation: workshop.evaluation
                                                }))
                                            })
                                        } as any;




                                        // Make API call to update trainer with the modified list
                                        await trainerApis.trainerForm.editFormData(payload);

                                        // Update local state with the new data
                                        if (isCaseStudy) {
                                            setCaseStudies(updatedCaseStudies);
                                        } else {
                                            setWorkshops(updatedWorkshops);
                                        }
                                        setOverlayState({ isOpen: false, type: null });
                                    } catch (error) {
                                        console.error(`Error ${overlayState.type === 'create' ? 'creating' : 'updating'} ${isCaseStudy ? 'case study' : 'workshop'}:`, error);
                                        alert(`Failed to ${overlayState.type === 'create' ? 'create' : 'update'} ${isCaseStudy ? 'case study' : 'workshop'}`);
                                    }
                                }}
                            />
                        </div>
                    )}
                    {overlayState.type === 'create' && (
                        <div className="bg-white w-full rounded-2xl mt-4">
                            <EditWorkshop
                                onClose={() => setOverlayState({ isOpen: false, type: null })}
                                mode="create"
                                onUpdate={async (workshopData) => {
                                    const isCreate = overlayState.type === 'create';
                                    const isCaseStudy = workshopData.isCaseStudy || false;

                                    try {
                                        // First, update the local state
                                        let updatedWorkshops, updatedCaseStudies;
                                        if (isCreate) {
                                            // Add new item to the appropriate list
                                            if (isCaseStudy) {
                                                updatedCaseStudies = [...caseStudies, {
                                                    id: workshopData.id,
                                                    title: workshopData.title,
                                                    description: workshopData.description,
                                                    price: workshopData.price,
                                                    targetAudience: workshopData.targetAudience,
                                                    format: workshopData.format as 'virtual' | 'In-Person',
                                                    image: workshopData.image,
                                                    objectives: workshopData.objectives,
                                                    outcomes: workshopData.outcomes,
                                                    handouts: workshopData.handouts,
                                                    programFlow: workshopData.programFlow,
                                                    evaluation: workshopData.evaluation
                                                }];
                                                updatedWorkshops = [...workshops];
                                            } else {
                                                updatedWorkshops = [...workshops, {
                                                    id: workshopData.id,
                                                    title: workshopData.title,
                                                    description: workshopData.description,
                                                    price: workshopData.price,
                                                    targetAudience: workshopData.targetAudience,
                                                    format: workshopData.format as 'virtual' | 'In-Person',
                                                    image: workshopData.image,
                                                    objectives: workshopData.objectives,
                                                    outcomes: workshopData.outcomes,
                                                    handouts: workshopData.handouts,
                                                    programFlow: workshopData.programFlow,
                                                    evaluation: workshopData.evaluation
                                                }];
                                                updatedCaseStudies = [...caseStudies];
                                            }
                                        } else {
                                            // Update existing item in the appropriate list
                                            if (isCaseStudy) {
                                                updatedCaseStudies = caseStudies.map(caseStudy =>
                                                    caseStudy.id === workshopData.id ? {
                                                        ...caseStudy,
                                                        title: workshopData.title,
                                                        description: workshopData.description,
                                                        price: workshopData.price,
                                                        targetAudience: workshopData.targetAudience,
                                                        format: workshopData.format as 'virtual' | 'In-Person',
                                                        image: workshopData.image,
                                                        objectives: workshopData.objectives,
                                                        outcomes: workshopData.outcomes,
                                                        handouts: workshopData.handouts,
                                                        programFlow: workshopData.programFlow,
                                                        evaluation: workshopData.evaluation
                                                    } : caseStudy
                                                );
                                                updatedWorkshops = [...workshops];
                                            } else {
                                                updatedWorkshops = workshops.map(workshop =>
                                                    workshop.id === workshopData.id ? {
                                                        ...workshop,
                                                        title: workshopData.title,
                                                        description: workshopData.description,
                                                        price: workshopData.price,
                                                        targetAudience: workshopData.targetAudience,
                                                        format: workshopData.format as 'virtual' | 'In-Person',
                                                        image: workshopData.image,
                                                        objectives: workshopData.objectives,
                                                        outcomes: workshopData.outcomes,
                                                        handouts: workshopData.handouts,
                                                        programFlow: workshopData.programFlow,
                                                        evaluation: workshopData.evaluation
                                                    } : workshop
                                                );
                                                updatedCaseStudies = [...caseStudies];
                                            }
                                        }

                                        // Get trainer ID from URL
                                        const searchParams = new URLSearchParams(window.location.search);
                                        const trainerName = searchParams.get('trainer');
                                        if (!trainerName) {
                                            throw new Error('Trainer name not found in URL');
                                        }

                                        // Get trainer details to get the trainer ID
                                        const trainerResponse = await trainerApis.getTrainerByName(trainerName);
                                        const trainerId = trainerResponse.data.name;

                                        // Create payload with only the modified list
                                        const payload = {
                                            name: trainerId,
                                            ...(isCaseStudy ? {
                                                casestudy: updatedCaseStudies.map((caseStudy) => ({
                                                    title: caseStudy.title,
                                                    description: caseStudy.description,
                                                    price: caseStudy.price,
                                                    target_audience: caseStudy.targetAudience,
                                                    format: caseStudy.format,
                                                    casestudy_image: caseStudy.image,
                                                    outcomes: caseStudy.outcomes,
                                                    handouts: caseStudy.handouts,
                                                    program_flow: caseStudy.programFlow,
                                                    evaluation: caseStudy.evaluation
                                                }))
                                            } : {
                                                workshop: updatedWorkshops.map((workshop) => ({
                                                    title: workshop.title,
                                                    description: workshop.description,
                                                    price: workshop.price,
                                                    target_audience: workshop.targetAudience,
                                                    format: workshop.format,
                                                    workshop_image: workshop.image,
                                                    outcomes: workshop.outcomes,
                                                    handouts: workshop.handouts,
                                                    program_flow: workshop.programFlow,
                                                    evaluation: workshop.evaluation
                                                }))
                                            })
                                        } as any;









                                        // Make API call to update trainer with the modified list
                                        await trainerApis.trainerForm.editFormData(payload);

                                        // Update local state with the new data
                                        if (isCaseStudy) {
                                            setCaseStudies(updatedCaseStudies);
                                        } else {
                                            setWorkshops(updatedWorkshops);
                                        }
                                        setOverlayState({ isOpen: false, type: null });
                                    } catch (error) {
                                        console.error(`Error ${overlayState.type === 'create' ? 'creating' : 'updating'} ${isCaseStudy ? 'case study' : 'workshop'}:`, error);
                                        alert(`Failed to ${overlayState.type === 'create' ? 'create' : 'update'} ${isCaseStudy ? 'case study' : 'workshop'}`);
                                    }
                                }}
                            />
                        </div>
                    )}
                </Overlay>
            </div>
            <Footer />
        </div>
    );
} 