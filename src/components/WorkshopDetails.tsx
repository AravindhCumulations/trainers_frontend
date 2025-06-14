import React from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';

type ContentType = 'Workshop' | 'Case Study';

interface WorkshopDetailsProps {
    type: ContentType;
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

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ type, workshop, onClose }) => {

    console.log(type);


    return (
        <div className="w-full max-w-4xl min-w-[900px] bg-white rounded-3xl shadow-2xl z-50 relative pb-10 px-6 pt-8 my-8">
            {/* Close Button */}
            <button
                className="absolute top-5 right-6 text-gray-400 hover:text-gray-700 transition z-50"
                onClick={onClose}
                aria-label="Close"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-gray-800 text-left mb-6 leading-snug">
                {workshop.title}
            </h2>

            {/* Image */}
            <div className="mb-6">
                <Image
                    src={workshop.image}
                    alt={workshop.title}
                    width={1600}
                    height={325}
                    className="w-full h-[325px] object-cover rounded-xl"
                />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className="bg-blue-100 text-blue-800 px-4 py-1 text-sm rounded-full">
                    👥 {workshop.targetAudience}
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-1 text-sm rounded-full">
                    💻 {workshop.format}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-1 text-sm rounded-full">
                    💰 ₹{workshop.price}
                </span>
                <span className="bg-orange-100 text-yellow-800 px-4 py-1 text-sm rounded-full">
                    {type === "Workshop" ? "🛠 Workshop" : "📘 Case Study"}
                </span>

            </div>

            {/* Content */}
            <div className="space-y-10 text-sm leading-relaxed text-gray-700">
                {/* Objectives */}
                <div>
                    <p className="font-semibold text-gray-800 text-base mb-1">🎯 Objectives</p>
                    <p>{workshop.objectives}</p>
                </div>

                {/* Outcomes & Handouts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="font-semibold text-gray-800 text-base mb-1">🌟 Outcomes</p>
                        <p>{workshop.outcomes}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-base mb-1">📄 Handouts</p>
                        <p>{workshop.handouts}</p>
                    </div>
                </div>

                {/* Program Flow & Evaluation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="font-semibold text-gray-800 text-base mb-1">🧠 Program Flow</p>
                        <div className="template-container program-flow-list">
                            {parse(workshop.programFlow || '')}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-base mb-1">📊 Evaluation</p>
                        <p>{workshop.evaluation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetails; 