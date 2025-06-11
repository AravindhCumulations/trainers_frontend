import React from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';


interface WorkshopDetailsProps {
    workshop: {
        idx: string;
        title: string;
        price: number;
        targetAudience: string;
        format: string;
        image: string;
        objectives: string;
        outcomes?: string;
        handouts?: string;
        programFlow?: string;
        evaluation?: string;
    };
    onClose: () => void;
}

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ workshop, onClose }) => {

    return (
        <div className="w-[1024px] flex flex-col mt-4 gap-3 p-6 bg-white rounded-2xl workshop-details">
            <div className="flex justify-between items-center w-full">
                <p className="text-[36px] font-bold">{workshop.title}</p>
                <div className="flex items-center gap-4">
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
                        <p className="text-gray-600 py-2">{workshop.objectives}</p>
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
                    <div
                        className="text-gray-600 py-2 template-container"

                    >
                        {workshop.outcomes}
                    </div>
                </div>
                <div className='w-[50%] '>
                    <p className="font-semibold">📄 Handouts</p>
                    <div
                        className="text-gray-600 py-2 template-container"
                    >
                        {workshop.handouts}
                    </div>
                </div>
            </div>
            <div className="flex gap-6 justify-between mt-6">
                <div className='w-[50%]'>
                    <p className="font-semibold">🧠 Program Flow</p>
                    <div
                        className="text-gray-600 py-2 template-container"
                    >
                        {parse(workshop.programFlow || 'programFlow here')}
                    </div>

                </div>
                <div className="w-[50%]">
                    <p className="font-semibold">📊 Evaluation</p>
                    <div
                        className="text-gray-600 py-2 template-container"
                    >
                        {workshop.evaluation}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetails; 