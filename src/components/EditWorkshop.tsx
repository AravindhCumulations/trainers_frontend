import React, { useState, useEffect, useRef, useMemo } from 'react';
import QuillEditor from '@/components/Quilleditor';
import { isEqual } from 'lodash';
import { useLoading } from '@/context/LoadingContext';
import { useErrorPopup } from '@/lib/hooks/useErrorPopup';
import { trainerApis } from '@/lib/apis/trainer.apis';

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
        isCaseStudy?: boolean;
    };
    mode: 'create' | 'edit';
    onUpdate?: (updatedWorkshop: any) => void;
}

const EditWorkshop: React.FC<EditWorkshopProps> = ({ onClose, initialData, onUpdate }) => {

    console.log(" Initial Data");
    console.log(initialData);


    const { showLoader, hideLoader } = useLoading();
    const { showError } = useErrorPopup();

    const initialFormData = {
        title: initialData?.title || '',
        description: initialData?.description || '',
        targetAudience: initialData?.targetAudience || '',
        format: initialData?.format || 'In-Person',
        outcomes: initialData?.outcomes || '',
        handouts: initialData?.handouts || '',
        programFlow: initialData?.programFlow || '',
        evaluation: initialData?.evaluation || '',
        price: initialData?.price || 0,
        image: initialData?.image || '',
        isCaseStudy: initialData?.isCaseStudy || false
    };




    const [formData, setFormData] = useState(initialFormData);
    const [modifiedFields, setModifiedFields] = useState<Partial<typeof formData>>({});
    const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const initialFormState = useRef(initialFormData);

    // Function to handle changes with deep comparison
    const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
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

    // Function to handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            // Ensure HTML content is properly handled for QuillEditor fields
            const newInitialData = {
                title: initialData.title || '',
                description: initialData.description || '',
                targetAudience: initialData.targetAudience || '',
                format: initialData.format || 'In-Person',
                outcomes: initialData.outcomes || '',
                handouts: initialData.handouts || '',
                programFlow: initialData.programFlow || '',
                evaluation: initialData.evaluation || '',
                price: initialData.price || 0,
                image: initialData.image || '',
                isCaseStudy: initialData.isCaseStudy || false
            };

            // Set the form data
            setFormData(newInitialData);
            setImagePreview(initialData.image || '');
            initialFormState.current = newInitialData;
            setModifiedFields({});
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!hasFormChanges) return;

        try {
            showLoader();

            let imageUrl = formData.image; // Keep existing image URL by default

            // Only upload new image if a new file was selected
            if (selectedImage) {
                const uploadResponse = await trainerApis.fileUpload.uploadProfilePicture(selectedImage);
                imageUrl = uploadResponse.message.file_url;
            }

            // Prepare the update data
            const updateData = {
                ...initialData,
                ...modifiedFields,
                image: imageUrl,
                isCaseStudy: formData.isCaseStudy
            };

            // Log the data being submitted




            // Call the onUpdate callback with the data
            if (onUpdate) {
                onUpdate(updateData);
            }
            onClose();
        } catch (error) {
            console.error('Error preparing update:', error);
            showError('Failed to prepare update');
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

                        {/* Price */}
                        <div className="flex flex-col gap-2">
                            <p>Price</p>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                className="h-[40px] rounded-lg w-full p-2 border border-blue-100 text-gray-700 font-normal placeholder:text-gray-400 placeholder:text-xs placeholder:font-thin"
                                placeholder="Enter workshop price"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Image Upload and Preview */}
                        <div className="flex flex-col gap-2">
                            <p>Workshop Image</p>
                            <div className="flex flex-col gap-4">
                                {imagePreview && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Workshop preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block text-sm text-gray-500
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-blue-50 file:text-blue-700
                                           hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        {/* Objectives */}
                        <div className="flex flex-col gap-2">
                            <p>Objectives</p>
                            <QuillEditor
                                value={formData.description}
                                onChange={(val) => handleChange('description', val)}
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
                                        checked={formData.format === 'In-Person'}
                                        onChange={() => handleChange('format', 'In-Person')}
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

                        {/* Type Selection (Workshop/Case Study) */}
                        <div className="text-sm text-black font-normal">
                            <p className='text-blue-700 font-semibold text-md'>Type</p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="type"
                                        id="workshop"
                                        checked={!formData.isCaseStudy}
                                        onChange={() => handleChange('isCaseStudy', false)}
                                    />
                                    <label htmlFor="workshop">Workshop</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="type"
                                        id="case-study"
                                        checked={formData.isCaseStudy}
                                        onChange={() => handleChange('isCaseStudy', true)}
                                    />
                                    <label htmlFor="case-study">Case Study</label>
                                </div>
                            </div>
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