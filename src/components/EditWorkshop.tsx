import React, { useState, useEffect, useRef, useMemo } from 'react';
import QuillEditor from '@/components/Quilleditor';
import { isEqual } from 'lodash';
import { useLoading } from '@/context/LoadingContext';
import { usePopup } from '@/lib/hooks/usePopup';
import { trainerApis } from '@/lib/apis/trainer.apis';
import { TextField, Chip } from '@mui/material';

interface EditWorkshopProps {
    onClose: () => void;
    initialData?: {
        idx: string;
        title: string;
        objectives: string;
        price: number;
        targetAudience: string;
        format: string;
        image: string;
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
    const { showError } = usePopup();
    const [errors, setErrors] = useState<string[]>([]);
    const errorContainerRef = useRef<HTMLDivElement>(null);

    const initialFormData = {
        title: initialData?.title || '',
        objectives: initialData?.objectives || '',
        targetAudience: initialData?.targetAudience || '',
        format: initialData?.format || 'In-Person',
        outcomes: initialData?.outcomes || '',
        handouts: initialData?.handouts || '',
        programFlow: initialData?.programFlow || '',
        evaluation: initialData?.evaluation || '',
        price: initialData?.price || 0,
        image: initialData?.image || '',
        isCaseStudy: initialData?.isCaseStudy ?? false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [modifiedFields, setModifiedFields] = useState<Partial<typeof formData>>({});
    const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const initialFormState = useRef(initialFormData);
    const initialImageRef = useRef(initialData?.image || '');

    // Add isEditMode state
    const isEditMode = Boolean(initialData);

    const MAX_CHAR_LIMIT = 300;

    // Function to strip HTML and count characters
    const getTextLength = (htmlContent: string): number => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        return tempDiv.textContent?.length || 0;
    };

    // Function to check if image has changed
    const hasImageChanged = () => {
        if (selectedImage) return true;
        if (!initialImageRef.current && !imagePreview) return false;
        return initialImageRef.current !== imagePreview;
    };

    // Function to handle changes with deep comparison
    const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
        const textLength = typeof value === 'string' ? value.length : 0;
        if (typeof value === 'string' && ['objectives', 'outcomes', 'handouts', 'evaluation'].includes(field) && textLength > MAX_CHAR_LIMIT) {
            return; // Don't update if exceeding character limit
        }

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
        return Object.keys(modifiedFields).length > 0 || hasImageChanged();
    }, [modifiedFields, selectedImage, imagePreview]);

    // Function to handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                // Add image to modified fields
                setModifiedFields(prev => ({
                    ...prev,
                    image: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Function to handle QuillEditor changes with character limit
    const handleQuillChange = (field: keyof typeof formData, value: string) => {
        const textLength = getTextLength(value);
        if (textLength <= MAX_CHAR_LIMIT) {
            handleChange(field, value);
        } else {
            // If text is too long, truncate it to MAX_CHAR_LIMIT
            const truncatedText = value.substring(0, MAX_CHAR_LIMIT);
            handleChange(field, truncatedText);
        }
    };

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            // Ensure HTML content is properly handled for QuillEditor fields
            const newInitialData = {
                title: initialData.title || '',
                objectives: initialData.objectives || '',
                targetAudience: initialData.targetAudience || '',
                format: initialData.format || 'In-Person',
                outcomes: initialData.outcomes || '',
                handouts: initialData.handouts || '',
                programFlow: initialData.programFlow || '',
                evaluation: initialData.evaluation || '',
                price: initialData.price || 0,
                image: initialData.image || '',
                isCaseStudy: initialData.isCaseStudy ?? false
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
        if (!formData.objectives.trim()) {
            errors.push('Objectives is Required');
        }
        if (formData.objectives.length > MAX_CHAR_LIMIT) {
            errors.push('Objectives should be less than 300 characters');
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
        if (formData.outcomes.length > MAX_CHAR_LIMIT) {
            errors.push('Outcomes should be less than 300 characters');
        }
        if (!formData.handouts.trim()) {
            errors.push('Handouts is Required');
        }
        if (formData.handouts.length > MAX_CHAR_LIMIT) {
            errors.push('Handouts should be less than 300 characters');
        }
        if (!formData.programFlow.trim()) {
            errors.push('Program Flow is Required');
        }
        if (getTextLength(formData.programFlow) > MAX_CHAR_LIMIT) {
            errors.push('Program Flow should be less than 300 characters');
        }
        if (!formData.evaluation.trim()) {
            errors.push('Evaluation is Required');
        }
        if (formData.evaluation.length > MAX_CHAR_LIMIT) {
            errors.push('Evaluation should be less than 300 characters');
        }
        if (!imagePreview && !isEditMode) {
            errors.push('Image is Required');
        }

        if (errors.length > 0) {
            setErrors(errors);
            // Scroll to error container and focus it
            setTimeout(() => {
                errorContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorContainerRef.current?.focus();
            }, 100);
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
                isCaseStudy: formData.isCaseStudy,
                format: formData.format // Ensure format is included
            };

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
                        <div
                            ref={errorContainerRef}
                            tabIndex={-1}
                            className="p-4 bg-red-50 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
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
                            <p className="text-base font-normal text-blue-700">Objectives</p>
                            <div className="relative">
                                <textarea
                                    value={formData.objectives}
                                    onChange={(e) => handleChange('objectives', e.target.value)}
                                    className="min-h-[100px] rounded-lg w-full p-2 border border-blue-100 text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-8"
                                    placeholder="Enter workshop objectives"
                                />
                                <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                                    {formData.objectives.length}/{MAX_CHAR_LIMIT}
                                </span>
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Target Audience</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.targetAudience.split(',').map((audience, index) => (
                                    audience.trim() && (
                                        <Chip
                                            key={index}
                                            label={audience.trim()}
                                            onDelete={() => {
                                                const audiences = formData.targetAudience.split(',').map(a => a.trim());
                                                audiences.splice(index, 1);
                                                handleChange('targetAudience', audiences.join(', '));
                                            }}
                                            className="bg-blue-100 text-blue-800"
                                        />
                                    )
                                ))}
                            </div>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Type target audience and press Enter"
                                variant="outlined"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const input = e.target as HTMLInputElement;
                                        const audience = input.value.trim();

                                        if (audience) {
                                            const currentAudiences = formData.targetAudience ? formData.targetAudience.split(',').map(a => a.trim()) : [];
                                            if (!currentAudiences.includes(audience)) {
                                                const newAudiences = [...currentAudiences, audience];
                                                handleChange('targetAudience', newAudiences.join(', '));
                                            }
                                            input.value = '';
                                        }
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.5rem',
                                        '& fieldset': {
                                            borderColor: '#E5E7EB'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#93C5FD'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3B82F6'
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* Program Flow */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Program Flow</p>
                            <div className="relative">
                                <QuillEditor
                                    value={formData.programFlow}
                                    onChange={(val) => handleQuillChange('programFlow', val)}
                                />
                                <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                                    {getTextLength(formData.programFlow)}/{MAX_CHAR_LIMIT}
                                </span>
                            </div>
                        </div>

                        {/* Outcomes */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Outcomes</p>
                            <div className="relative">
                                <textarea
                                    value={formData.outcomes}
                                    onChange={(e) => handleChange('outcomes', e.target.value)}
                                    className="min-h-[100px] rounded-lg w-full p-2 border border-blue-100 text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-8"
                                    placeholder="Enter workshop outcomes"
                                />
                                <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                                    {formData.outcomes.length}/{MAX_CHAR_LIMIT}
                                </span>
                            </div>
                        </div>

                        {/* Handouts */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Handouts</p>
                            <div className="relative">
                                <textarea
                                    value={formData.handouts}
                                    onChange={(e) => handleChange('handouts', e.target.value)}
                                    className="min-h-[100px] rounded-lg w-full p-2 border border-blue-100 text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-8"
                                    placeholder="Enter workshop handouts"
                                />
                                <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                                    {formData.handouts.length}/{MAX_CHAR_LIMIT}
                                </span>
                            </div>
                        </div>

                        {/* Evaluations */}
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-normal text-blue-700">Evaluations</p>
                            <div className="relative">
                                <textarea
                                    value={formData.evaluation}
                                    onChange={(e) => handleChange('evaluation', e.target.value)}
                                    className="min-h-[100px] rounded-lg w-full p-2 border border-blue-100 text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-8"
                                    placeholder="Enter workshop evaluation criteria"
                                />
                                <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                                    {formData.evaluation.length}/{MAX_CHAR_LIMIT}
                                </span>
                            </div>
                        </div>

                        {/* Format Selection */}
                        <div className="text-base text-black font-normal">
                            <p className='text-blue-700 font-normal text-base'>Format</p>
                            <div className="flex gap-4 text-base text-gray-700">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="in-person"
                                        checked={formData.format === 'In-Person'}
                                        onChange={() => handleChange('format', 'In-Person')}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="in-person" className="text-base font-normal">In-person</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="virtual"
                                        checked={formData.format === 'Virtual'}
                                        onChange={() => handleChange('format', 'Virtual')}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                                        type="checkbox"
                                        id="workshop"
                                        checked={!formData.isCaseStudy}
                                        onChange={() => handleChange('isCaseStudy', false)}
                                        disabled={isEditMode}
                                        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <label htmlFor="workshop" className={`text-base font-normal ${isEditMode ? 'text-gray-500' : ''}`}>Workshop</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="case-study"
                                        checked={formData.isCaseStudy}
                                        onChange={() => handleChange('isCaseStudy', true)}
                                        disabled={isEditMode}
                                        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <label htmlFor="case-study" className={`text-base font-normal ${isEditMode ? 'text-gray-500' : ''}`}>Case Study</label>
                                </div>
                            </div>
                            {isEditMode && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Type cannot be changed in edit mode
                                </p>
                            )}
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
                                {hasFormChanges ? 'Save' : 'No Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditWorkshop; 