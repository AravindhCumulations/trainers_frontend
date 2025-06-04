import React, { useState, useEffect, useRef, useMemo } from 'react';
import QuillEditor from '@/components/Quilleditor';
import { isEqual } from 'lodash';
import { useLoading } from '@/context/LoadingContext';
import { useErrorPopup } from '@/lib/hooks/useErrorPopup';

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
    onUpdate?: (updatedWorkshop: any) => void;
}

const EditWorkshop: React.FC<EditWorkshopProps> = ({ onClose, initialData, onUpdate }) => {
    const { showLoader, hideLoader } = useLoading();
    const { showError } = useErrorPopup();

    const initialFormData = {
        title: initialData?.title || '',
        objectives: initialData?.objectives || '',
        targetAudience: initialData?.targetAudience || '',
        format: initialData?.format || 'In Person',
        outcomes: initialData?.outcomes || '',
        handouts: initialData?.handouts || '',
        programFlow: initialData?.programFlow || '',
        evaluation: initialData?.evaluation || ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [modifiedFields, setModifiedFields] = useState<Partial<typeof formData>>({});
    const initialFormState = useRef(initialFormData);

    // Function to handle changes with deep comparison
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Only track modification if value is different from initial state using deep comparison
        const initialValue = initialFormState.current[field];
        if (!isEqual(value, initialValue)) {
            setModifiedFields(prev => ({
                ...prev,
                [field]: value
            }));
        } else {
            // If value is same as initial state, remove it from modifiedFields
            setModifiedFields(prev => {
                const newModifiedFields = { ...prev };
                delete newModifiedFields[field];
                return newModifiedFields;
            });
        }
    };

    // Check if form has changes using useMemo
    const hasFormChanges = useMemo(() => {
        return Object.keys(modifiedFields).length > 0;
    }, [modifiedFields]);

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            const newInitialData = {
                title: initialData.title || '',
                objectives: initialData.objectives || '',
                targetAudience: initialData.targetAudience || '',
                format: initialData.format || 'In Person',
                outcomes: initialData.outcomes || '',
                handouts: initialData.handouts || '',
                programFlow: initialData.programFlow || '',
                evaluation: initialData.evaluation || ''
            };
            setFormData(newInitialData);
            initialFormState.current = newInitialData;
            setModifiedFields({});
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!hasFormChanges || !initialData?.id) return;

        try {
            showLoader();

            // Prepare the update data
            const updateData = {
                ...initialData,
                ...modifiedFields
            };

            // Make API call to update workshop
            const response = await fetch(`http://3.94.205.118:8000/api/resource/Workshop/${initialData.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token a6d10becfd9dfd8:e0881f66419822c`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.data) {
                // Call the onUpdate callback with the updated workshop data
                if (onUpdate) {
                    onUpdate(data.data);
                }
                onClose();
            } else {
                showError('Failed to update workshop');
            }
        } catch (error) {
            console.error('Error updating workshop:', error);
            showError('Failed to update workshop');
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="bg-white max-w-full h-full py-8 rounded-2xl overflow-hidden">
            <div className="form max-w-4xl mx-auto">
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
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="h-[40px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin"
                                placeholder="Enter workshop title"
                            />
                        </div>

                        {/* Objectives */}
                        <div className="flex flex-col gap-2">
                            <p>Objectives</p>
                            <QuillEditor
                                value={formData.objectives}
                                onChange={(val) => handleChange('objectives', val)}
                            />
                        </div>

                        {/* Target Audience */}
                        <div className="flex flex-col gap-2">
                            <p>Target Audience</p>
                            <textarea
                                value={formData.targetAudience}
                                onChange={(e) => handleChange('targetAudience', e.target.value)}
                                className="h-[50px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin resize-none"
                                placeholder="Who is this for?"
                            ></textarea>
                        </div>

                        {/* Program Flow */}
                        <div className="flex flex-col gap-2">
                            <p>Program Flow</p>
                            <QuillEditor
                                value={formData.programFlow}
                                onChange={(val) => handleChange('programFlow', val)}
                            />
                        </div>

                        {/* Outcomes */}
                        <div className="flex flex-col gap-2">
                            <p>Outcomes</p>
                            <QuillEditor
                                value={formData.outcomes}
                                onChange={(val) => handleChange('outcomes', val)}
                            />
                        </div>

                        {/* Handouts */}
                        <div className="flex flex-col gap-2">
                            <p>Handouts</p>
                            <QuillEditor
                                value={formData.handouts}
                                onChange={(val) => handleChange('handouts', val)}
                            />
                        </div>

                        {/* Evaluations */}
                        <div className="flex flex-col gap-2">
                            <p>Evaluations</p>
                            <QuillEditor
                                value={formData.evaluation}
                                onChange={(val) => handleChange('evaluation', val)}
                            />
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
                                        onChange={() => handleChange('format', 'In Person')}
                                    />
                                    <label htmlFor="in-person">In-person</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="format"
                                        id="virtual"
                                        checked={formData.format === 'Virtual'}
                                        onChange={() => handleChange('format', 'Virtual')}
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
                                disabled={!hasFormChanges}
                                className={`rounded-lg px-6 py-2 font-normal transition-colors duration-200 ${hasFormChanges
                                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {hasFormChanges ? 'Save Workshop' : 'No Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditWorkshop; 