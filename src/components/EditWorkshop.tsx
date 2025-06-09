import React, { useState, useEffect, useRef, useMemo } from 'react';
import QuillEditor from '@/components/Quilleditor';
import { isEqual } from 'lodash';
import { useLoading } from '@/context/LoadingContext';
import { useErrorPopup } from '@/lib/hooks/useErrorPopup';
import { trainerApis } from '@/lib/apis/trainer.apis';
import { TrainerFormValidator } from '@/models/trainerDetails.model';

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




    const { showLoader, hideLoader } = useLoading();
    const { showError } = useErrorPopup();
    const [errors, setErrors] = useState<string[]>([]);

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

    const MAX_CHAR_LIMIT = 300;

    // Function to strip HTML and count characters
    const getTextLength = (htmlContent: string): number => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        return tempDiv.textContent?.length || 0;
    };

    // Function to handle QuillEditor changes with character limit
    const handleQuillChange = (field: keyof typeof formData, value: string) => {
        const textLength = getTextLength(value);
        if (textLength <= MAX_CHAR_LIMIT) {
            handleChange(field, value);
        }
    };

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

        // Clear previous errors
        setErrors([]);

        // Validate form data
        const errors: string[] = [];

        if (!formData.title.trim()) {
            errors.push('Title is Required');
        }
        if (!formData.description.trim()) {
            errors.push('Description is Required');
        }
        if (getTextLength(formData.description) > MAX_CHAR_LIMIT) {
            errors.push('Description should be less than 200 characters');
        }
        if (formData.price <= 0) {
            errors.push('Price should be greater than 0');
        }
        if (!formData.targetAudience.trim()) {
            errors.push('Target Audience is Required');
        }
        if (!formData.outcomes.trim()) {
            errors.push('Outcomes is Required');
        }
        if (getTextLength(formData.outcomes) > MAX_CHAR_LIMIT) {
            errors.push('Description should be less than 200 characters');
        }
        if (!formData.handouts.trim()) {
            errors.push('Handouts is Required');
        }
        if (getTextLength(formData.handouts) > MAX_CHAR_LIMIT) {
            errors.push('Description should be less than 200 characters');
        }
        if (!formData.programFlow.trim()) {
            errors.push('Program Flow is Required');
        }
        if (getTextLength(formData.programFlow) > MAX_CHAR_LIMIT) {
            errors.push('Description should be less than 200 characters');
        }
        if (!formData.evaluation.trim()) {
            errors.push('Evaluation is Required');
        }
        if (getTextLength(formData.evaluation) > MAX_CHAR_LIMIT) {
            errors.push('Description should be less than 200 characters');
        }

        if (errors.length > 0) {
            setErrors(errors);
            return;
        }

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
        <div className="bg-white min-w-[1024px] max-w-full  h-full py-8 rounded-2xl overflow-hidden">
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

                    {errors.length > 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <ul className="list-disc list-inside text-red-600">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-base font-normal">
                        {/* Workshop Title */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Workshop Title</p>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="h-[45px] rounded-lg w-full p-2 border border-blue-100 text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-base placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter workshop title"
                            />
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Price</p>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                className="h-[45px] rounded-lg w-full p-2 border border-blue-100 text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-base placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter workshop price"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Image Upload and Preview */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Workshop Image</p>
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
                                    className="block text-base text-gray-500 font-normal
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded file:border-0
                                           file:text-base file:font-normal
                                           file:bg-blue-50 file:text-blue-700
                                           hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        {/* Objectives */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <p className="text-base font-normal text-blue-700">Objectives</p>
                                <span className="text-base text-gray-500 font-normal">
                                    {getTextLength(formData.description)}/{MAX_CHAR_LIMIT} characters
                                </span>
                            </div>
                            <QuillEditor
                                value={formData.description}
                                onChange={(val) => handleQuillChange('description', val)}
                            />
                        </div>

                        {/* Target Audience */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Target Audience</p>
                            <textarea
                                value={formData.targetAudience}
                                onChange={(e) => handleChange('targetAudience', e.target.value)}
                                className="h-[45px] rounded-lg w-full p-2 border border-blue-100 text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Who is this for?"
                            ></textarea>
                        </div>

                        {/* Program Flow */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <p className="text-base font-normal text-blue-700">Program Flow</p>
                                <span className="text-base text-gray-500 font-normal">
                                    {getTextLength(formData.programFlow)}/{MAX_CHAR_LIMIT} characters
                                </span>
                            </div>
                            <QuillEditor
                                value={formData.programFlow}
                                onChange={(val) => handleQuillChange('programFlow', val)}
                            />
                        </div>

                        {/* Outcomes */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <p className="text-base font-normal text-blue-700">Outcomes</p>
                                <span className="text-base text-gray-500 font-normal">
                                    {getTextLength(formData.outcomes)}/{MAX_CHAR_LIMIT} characters
                                </span>
                            </div>
                            <QuillEditor
                                value={formData.outcomes}
                                onChange={(val) => handleQuillChange('outcomes', val)}
                            />
                        </div>

                        {/* Handouts */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <p className="text-base font-normal text-blue-700">Handouts</p>
                                <span className="text-base text-gray-500 font-normal">
                                    {getTextLength(formData.handouts)}/{MAX_CHAR_LIMIT} characters
                                </span>
                            </div>
                            <QuillEditor
                                value={formData.handouts}
                                onChange={(val) => handleQuillChange('handouts', val)}
                            />
                        </div>

                        {/* Evaluations */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <p className="text-base font-normal text-blue-700">Evaluations</p>
                                <span className="text-base text-gray-500 font-normal">
                                    {getTextLength(formData.evaluation)}/{MAX_CHAR_LIMIT} characters
                                </span>
                            </div>
                            <QuillEditor
                                value={formData.evaluation}
                                onChange={(val) => handleQuillChange('evaluation', val)}
                            />
                        </div>

                        {/* Format Selection */}
                        <div className="text-base text-black font-normal">
                            <p className='text-blue-700 font-normal text-base'>Format</p>
                            <div className="flex gap-4 text-base text-gray-700">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="format"
                                        id="in-person"
                                        checked={formData.format === 'In-Person'}
                                        onChange={() => handleChange('format', 'In-Person')}
                                        className="text-base"
                                    />
                                    <label htmlFor="in-person" className="text-base font-normal">In-person</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="format"
                                        id="virtual"
                                        checked={formData.format === 'Virtual'}
                                        onChange={() => handleChange('format', 'Virtual')}
                                        className="text-base"
                                    />
                                    <label htmlFor="virtual" className="text-base font-normal">Virtual</label>
                                </div>
                            </div>
                        </div>

                        {/* Type Selection (Workshop/Case Study) */}
                        <div className="text-base text-black font-normal">
                            <p className='text-blue-700 font-normal text-base'>Type</p>
                            <div className="flex gap-4 text-base text-gray-700">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="type"
                                        id="workshop"
                                        checked={!formData.isCaseStudy}
                                        onChange={() => handleChange('isCaseStudy', false)}
                                        className="text-base"
                                    />
                                    <label htmlFor="workshop" className="text-base font-normal">Workshop</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="type"
                                        id="case-study"
                                        checked={formData.isCaseStudy}
                                        onChange={() => handleChange('isCaseStudy', true)}
                                        className="text-base"
                                    />
                                    <label htmlFor="case-study" className="text-base font-normal">Case Study</label>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-start gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg bg-gray-100 text-gray-700 text-base font-normal px-6 py-2 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!hasFormChanges}
                                className={`rounded-lg px-6 py-2 text-base font-normal transition-colors duration-200 ${hasFormChanges
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