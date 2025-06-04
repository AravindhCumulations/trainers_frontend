'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Edit } from 'lucide-react';
import Image from 'next/image';
import NavBar from '../../components/Navbar';
import { Workshop, WorkshopFormData, WorkshopModel } from '@/models/workshop.models';
import Footer from '@/components/Footer';
import EditWorkshop from '@/components/EditWorkshop';
import WorkshopDetails from '@/components/WorkshopDetails';
import { initialWorkshops } from '../content/InitialWorkshops';

// Dummy workshops data with images





export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentWorkshop, setCurrentWorkshop] = useState<WorkshopFormData>({
        id: '',
        title: '',
        description: '',
        price: '',
        targetAudience: '',
        image: '',
        format: ''
    });
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


    const handleAddWorkshop = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();



        const workshopModel = new WorkshopModel(currentWorkshop);
        const validationError = workshopModel.validate();

        if (validationError) {
            alert(validationError);
            return;
        }

        const workshopToAdd = workshopModel.toJSON();
        setWorkshops([...workshops, workshopToAdd]);

        // Reset form and close modal
        setCurrentWorkshop({
            id: '',
            title: '',
            description: '',
            price: '',
            targetAudience: '',
            image: '',
            format: ''
        });
        setIsAddModalOpen(false);

        // Make API call to add workshop
        // fetch('http://3.94.205.118:8000/api/resource/Workshop', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `token a6d10becfd9dfd8:e0881f66419822c`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(workshopModel.toJSON())
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.data) {
        //             setWorkshops([...workshops, data.data]);
        //             // Reset form and close modal
        //             setCurrentWorkshop({
        //                 id: '',
        //                 title: '',
        //                 description: '',
        //                 price: '',
        //                 targetAudience: '',
        //                 image: '',
        //                 format: ''
        //             });
        //             setIsAddModalOpen(false);
        //         } else {
        //             alert('Failed to add workshop');
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error adding workshop:', error);
        //         alert('Failed to add workshop');
        //     });
    };

    const handleEditWorkshop = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const workshopModel = new WorkshopModel(currentWorkshop);
        const validationError = workshopModel.validate();

        if (validationError) {
            alert(validationError);
            return;
        }

        const updatedWorkshop = workshopModel.toJSON();
        setWorkshops(workshops.map(workshop =>
            workshop.id === updatedWorkshop.id ? updatedWorkshop : workshop
        ));

        setIsEditModalOpen(false);

        // Make API call to update workshop
        // fetch(`http://3.94.205.118:8000/api/resource/Workshop/${currentWorkshop.id}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Authorization': `token a6d10becfd9dfd8:e0881f66419822c`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(workshopModel.toJSON())
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.data) {
        //             setWorkshops(workshops.map(workshop =>
        //                 workshop.id === data.data.id ? data.data : workshop
        //             ));
        //             setIsEditModalOpen(false);
        //         } else {
        //             alert('Failed to update workshop');
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error updating workshop:', error);
        //         alert('Failed to update workshop');
        //     });
    };

    const handleDeleteWorkshop = (id: string) => {
        setWorkshops(workshops.filter(workshop => workshop.id !== id));

        // Make API call to delete workshop
        // fetch(`http://3.94.205.118:8000/api/resource/Workshop/${id}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Authorization': `token a6d10becfd9dfd8:e0881f66419822c`
        //     }
        // })
        //     .then(response => {
        //         if (response.ok) {
        //             setWorkshops(workshops.filter(workshop => workshop.id !== id));
        //         } else {
        //             alert('Failed to delete workshop');
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error deleting workshop:', error);
        //         alert('Failed to delete workshop');
        //     });
    };

    // const openEditModal = (workshop: Workshop) => {
    //     setCurrentWorkshop({
    //         id: workshop.id,
    //         title: workshop.title,
    //         description: workshop.description,
    //         price: workshop.price.toString(),
    //         targetAudience: workshop.targetAudience,
    //         image: workshop.image,
    //         format: workshop.format
    //     });
    //     setIsEditModalOpen(true);
    // };

    const renderWorkshopModal = (isEdit: boolean) => (
        <AnimatePresence>
            {(isEdit ? isEditModalOpen : isAddModalOpen) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg p-6 w-full max-w-2xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isEdit ? 'Edit Workshop' : 'Create New Workshop'}
                            </h2>
                            <button
                                onClick={() => isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={isEdit ? handleEditWorkshop : handleAddWorkshop} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Workshop Title</label>
                                <input
                                    type="text"
                                    value={currentWorkshop.title}
                                    onChange={(e) => setCurrentWorkshop({ ...currentWorkshop, title: e.target.value })}
                                    placeholder="Enter workshop title"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={currentWorkshop.description}
                                    onChange={(e) => setCurrentWorkshop({ ...currentWorkshop, description: e.target.value })}
                                    placeholder="Describe your workshop"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Price</label>
                                <input
                                    type="number"
                                    value={currentWorkshop.price}
                                    onChange={(e) => setCurrentWorkshop({ ...currentWorkshop, price: e.target.value })}
                                    placeholder="Enter workshop price"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Target Audience</label>
                                <select
                                    value={currentWorkshop.targetAudience}
                                    onChange={(e) => setCurrentWorkshop({ ...currentWorkshop, targetAudience: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Select Target Audience</option>
                                    <option value="Beginners">Beginners</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="All Levels">All Levels</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Format</label>
                                <select
                                    value={currentWorkshop.format}
                                    onChange={(e) => setCurrentWorkshop({ ...currentWorkshop, format: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Select Format</option>
                                    <option value="virtual">Virtual</option>
                                    <option value="In-Person">In-Person</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={currentWorkshop.image}
                                    onChange={(e) => setCurrentWorkshop({ ...currentWorkshop, image: e.target.value })}
                                    placeholder="Enter image URL"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                {isEdit ? 'Update Workshop' : 'Create Workshop'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen bg-blue-100">
            <NavBar />
            <div className="container mx-auto my-4 w-full">

                {/* <Overlay
                    isOpen={overlayState.isOpen}
                    type={overlayState.type}
                    setOverlayState={setOverlayState}
                /> */}


                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Workshops</h1>
                    <button
                        onClick={() => {
                            setCurrentWorkshop({
                                id: '',
                                title: '',
                                description: '',
                                price: '',
                                targetAudience: '',
                                image: '',
                                format: ''
                            });
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        <Plus className="mr-2" /> Add Workshop
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workshops.map((workshop) => (
                        <motion.div
                            key={workshop.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                            onClick={() => handleWorkshopClick('details')}
                        >
                            <div className="relative h-48">
                                <Image
                                    src={workshop.image}
                                    alt={workshop.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-2">{workshop.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">{workshop.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-600 font-bold">${workshop.price.toFixed(2)}</span>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {workshop.targetAudience}
                                    </span>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {workshop.format}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Workshop Creation Modal */}
                {renderWorkshopModal(false)}

                {/* Workshop Edit Modal */}
                {renderWorkshopModal(true)}
            </div>
            <Footer />
        </div>
    );
} 