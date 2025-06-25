import React from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import { Workshop } from '@/models/workshop.models';


interface WorkshopDetailsProps {
    workshop: Workshop
    onClose: () => void;
}

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ workshop, onClose }) => {



    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl z-50 relative pb-6 sm:pb-8 lg:pb-10 px-4 sm:px-6 pt-6 sm:pt-8 my-2 sm:my-4 lg:my-8">
            {/* Close Button */}
            <button
                className="absolute top-3 sm:top-4 lg:top-5 right-4 sm:right-5 lg:right-6 text-gray-400 hover:text-gray-700 transition z-50 p-1 sm:p-2"
                onClick={onClose}
                aria-label="Close"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-800 text-left mb-4 sm:mb-6 leading-tight sm:leading-snug pr-8 sm:pr-12">
                {workshop.title}
            </h2>

            {/* Image */}
            <div className="mb-4 sm:mb-6">
                <Image
                    src={workshop.image}
                    alt={workshop.title}
                    width={1600}
                    height={325}
                    className="w-full h-48 sm:h-64 lg:h-[325px] object-cover rounded-lg sm:rounded-xl"
                />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="bg-blue-100 text-blue-800 px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-full">
                    👥 {workshop.target_audience}
                </span>
                <span className="bg-green-100 text-green-800 px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-full">
                    💻 {workshop.format}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-full">
                    💰 ₹{workshop.price}
                </span>
                <span className="bg-orange-100 text-yellow-800 px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-full">
                    {workshop.type === "Workshop" ? "🛠 Workshop" : "📘 Case Study"}
                </span>

            </div>

            {/* Content */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-xs sm:text-sm leading-relaxed text-gray-700">
                {/* Objectives */}
                <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">🎯 Objectives</p>
                    <p className="text-xs sm:text-sm">{workshop.objectives}</p>
                </div>

                {/* Outcomes & Handouts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">🌟 Outcomes</p>
                        <p className="text-xs sm:text-sm">{workshop.outcomes}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">📄 Handouts</p>
                        <p className="text-xs sm:text-sm">{workshop.handouts}</p>
                    </div>
                </div>

                {/* Program Flow & Evaluation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">🧠 Program Flow</p>
                        <div className="template-container program-flow-list text-xs sm:text-sm">
                            {parse(workshop.program_flow || '')}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">📊 Evaluation</p>
                        <p className="text-xs sm:text-sm">{workshop.evaluation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetails; 