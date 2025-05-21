import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from "react";


interface WorkshopDetailsProps {
    workshop: {
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
    };
    onClose: () => void;
    onEdit: () => void;
}

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ workshop, onClose, onEdit }) => {
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

    return (
        <div className="w-[1024px] flex flex-col mt-4 gap-3 p-6 bg-white rounded-2xl workshop-details">
            <div className="flex justify-between items-center w-full">
                <p className="text-[36px] font-bold">{workshop.title}</p>
                <div className="flex items-center gap-4">
                    {isTrainer && (<button
                        onClick={onEdit}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                        Edit
                    </button>)}
                    <button
                        className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex gap-4 w-full">
                <div className="flex w-[600px] h-[300px] rounded-2xl overflow-hidden">
                    <Image
                        src={workshop.image}
                        alt={workshop.title}
                        width={600}
                        height={300}
                        className="w-full object-cover"
                    />
                </div>
                <div className="w-[320px] flex flex-col justify-between ">
                    <div className=''>
                        <p className="font-semibold">🎯 Objectives</p>
                        <p className="text-gray-600 py-2">{workshop.objectives || workshop.description}</p>
                    </div>
                    <div >
                        <p className="font-semibold">👥 Target Audience</p>
                        <p className="text-gray-600 py-2">{workshop.targetAudience}</p>
                    </div>
                    <div >
                        <p className="font-semibold">💻 Format</p>
                        <p className="text-gray-600 py-2">{workshop.format}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-6 justify-between mt-6 w-full ">
                <div className='w-[50%]'>
                    <p className="font-semibold">🌟 Outcomes</p>
                    <p className="text-gray-600 py-2">{workshop.outcomes || 'Participants will gain practical skills and knowledge in the subject matter.'}</p>
                </div>
                <div className='w-[50%] '>
                    <p className="font-semibold">📄 Handouts</p>
                    <p className="text-gray-600 py-2">{workshop.handouts || 'Participants receive comprehensive handouts with exercises, session notes, and reflection prompts.'}</p>
                </div>
            </div>
            <div className="flex gap-6 justify-between mt-6">
                <div className='w-[50%]'>
                    <p className="font-semibold">🧠 Program Flow</p>
                    <ul className="list-disc list-inside text-gray-600 py-2">
                        {workshop.programFlow ? (
                            <li>{workshop.programFlow}</li>
                        ) : (
                            <>
                                <li>Welcome & Ice-breaker</li>
                                <li>Interactive activities</li>
                                <li>Scenario roleplays</li>
                                <li>Group discussions</li>
                            </>
                        )}
                    </ul>
                </div>
                <div className="w-[50%]">
                    <p className="font-semibold">📊 Evaluation</p>
                    <p className="text-gray-600 py-2">{workshop.evaluation || 'Workshop impact is assessed using post-session surveys, self-reflection, and peer feedback methods.'}</p>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetails; 