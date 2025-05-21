import React, { useState } from 'react';
import QuillEditor from '@/components/Quilleditor';

interface EditWorkshopProps {
    onClose: () => void;
    initialData?: {
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
    mode: 'create' | 'edit';
}

const EditWorkshop: React.FC<EditWorkshopProps> = ({ onClose, initialData }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        objectives: initialData?.objectives || '',
        targetAudience: initialData?.targetAudience || '',
        format: initialData?.format || 'In Person',
        outcomes: initialData?.outcomes || '',
        handouts: initialData?.handouts || '',
        programFlow: initialData?.programFlow || '',
        evaluation: initialData?.evaluation || ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
        onClose();
    };

    return (
        <div className="bg-white w-full h-full py-8 rounded-2xl overflow-hidden">
            <div className="form max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl p-12 flex flex-col gap-[24px] text-blue-700 font-semibold">
                    <div className="flex justify-between items-center">
                        <p className="text-3xl font-bold text-black">🎓 Create / Edit Workshop</p>
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

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Workshop Title */}
                        <div className="flex flex-col gap-2">
                            <p>Workshop Title</p>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="h-[40px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin"
                                placeholder="Enter workshop title"
                            />
                        </div>

                        {/* Objectives */}
                        <div className="flex flex-col gap-2">
                            <p>Objectives</p>
                            <QuillEditor
                                value={formData.objectives}
                                onChange={(val) => setFormData(prev => ({ ...prev, objectives: val }))}
                            />
                        </div>

                        {/* Target Audience */}
                        <div className="flex flex-col gap-2">
                            <p>Target Audience</p>
                            <textarea
                                value={formData.targetAudience}
                                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                                className="h-[50px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="Who is this for?"
                            ></textarea>
                        </div>

                        {/* Program Flow */}
                        <div className="flex flex-col gap-2">
                            <p>Program Flow</p>
                            <QuillEditor
                                value={formData.programFlow}
                                onChange={(val) => setFormData(prev => ({ ...prev, programFlow: val }))}
                            />
                        </div>

                        {/* Outcomes */}
                        <div className="flex flex-col gap-2">
                            <p>Outcomes</p>
                            <QuillEditor
                                value={formData.outcomes}
                                onChange={(val) => setFormData(prev => ({ ...prev, outcomes: val }))}
                            />
                        </div>

                        {/* Handouts */}
                        <div className="flex flex-col gap-2">
                            <p>Handouts</p>
                            <textarea
                                value={formData.handouts}
                                onChange={(e) => setFormData(prev => ({ ...prev, handouts: e.target.value }))}
                                className="h-[50px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="What materials are provided?"
                            ></textarea>
                        </div>

                        {/* Evaluations */}
                        <div className="flex flex-col gap-2">
                            <p>Evaluations</p>
                            <textarea
                                value={formData.evaluation}
                                onChange={(e) => setFormData(prev => ({ ...prev, evaluation: e.target.value }))}
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
                                        onChange={() => setFormData(prev => ({ ...prev, format: 'In Person' }))}
                                    />
                                    <label htmlFor="in-person">In-person</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="format"
                                        id="virtual"
                                        checked={formData.format === 'Virtual'}
                                        onChange={() => setFormData(prev => ({ ...prev, format: 'Virtual' }))}
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
                                onClick={onClose}
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
};

export default EditWorkshop; 