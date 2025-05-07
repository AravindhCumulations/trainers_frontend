'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditWorkshopPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        objectives: '',
        targetAudience: '',
        format: 'In Person',
        outcomes: '',
        handouts: '',
        programFlow: '',
        evaluation: ''
    });

    const handleClose = () => {
        router.back();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
        handleClose();
    };

    return (
        <div className="bg-white w-full h-full py-8">
            <div className="form max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl p-12 flex flex-col gap-[24px] text-blue-700 font-semibold">
                    <div className="flex justify-between items-center">
                        <p className="text-3xl font-bold text-black">🎓 Create / Edit Workshop</p>
                        <button
                            className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Workshop Title */}
                        <div className="flex flex-col gap-2">
                            <p>Workshop Title</p>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-[40px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin"
                                placeholder="Enter workshop title"
                            />
                        </div>

                        {/* Objectives */}
                        <div className="flex flex-col gap-2">
                            <p>Objectives</p>
                            <textarea
                                value={formData.objectives}
                                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                                className="h-[100px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="List key objectives"
                            ></textarea>
                        </div>

                        {/* Target Audience */}
                        <div className="flex flex-col gap-2">
                            <p>Target Audience</p>
                            <textarea
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                className="h-[50px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="Who is this for?"
                            ></textarea>
                        </div>

                        {/* Program Flow */}
                        <div className="flex flex-col gap-2">
                            <p>Program Flow</p>
                            <textarea
                                value={formData.programFlow}
                                onChange={(e) => setFormData({ ...formData, programFlow: e.target.value })}
                                className="h-[50px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="Step-by-step structure"
                            ></textarea>
                        </div>

                        {/* Outcomes */}
                        <div className="flex flex-col gap-2">
                            <p>Outcomes</p>
                            <textarea
                                value={formData.outcomes}
                                onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                                className="h-[50px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="Expected learning outcomes"
                            ></textarea>
                        </div>

                        {/* Handouts */}
                        <div className="flex flex-col gap-2">
                            <p>Handouts</p>
                            <textarea
                                value={formData.handouts}
                                onChange={(e) => setFormData({ ...formData, handouts: e.target.value })}
                                className="h-[50px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="What materials are provided?"
                            ></textarea>
                        </div>

                        {/* Evaluations */}
                        <div className="flex flex-col gap-2">
                            <p>Evaluations</p>
                            <textarea
                                value={formData.evaluation}
                                onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
                                className="h-[50px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="How is success measured?"
                            ></textarea>
                        </div>

                        {/* Format Selection */}
                        <div className="text-sm text-black font-normal">
                            <p className='text-blue-700 font-semibold text-md'>Format</p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="format"
                                        id="in-person"
                                        checked={formData.format === 'In Person'}
                                        onChange={() => setFormData({ ...formData, format: 'In Person' })}
                                    />
                                    <label htmlFor="in-person">In-person</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="format"
                                        id="virtual"
                                        checked={formData.format === 'Virtual'}
                                        onChange={() => setFormData({ ...formData, format: 'Virtual' })}
                                    />
                                    <label htmlFor="virtual">Virtual</label>
                                </div>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="text-sm text-black font-normal">
                            <label className="block mb-2 text-blue-700 font-semibold">
                                Upload Workshop Images
                            </label>
                            <input
                                type="file"
                                multiple
                                className="block text-sm text-gray-500
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-blue-50 file:text-blue-700
                                       hover:file:bg-blue-100"
                            />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-start gap-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-lg bg-gray-100 text-gray-700 font-normal px-6 py-2 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-700 text-white font-normal px-6 py-2 hover:bg-blue-800"
                            >
                                Save Workshop
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
