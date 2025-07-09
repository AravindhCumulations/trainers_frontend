import React, { useState, useEffect, useRef, useMemo } from 'react';
import QuillEditor from '@/components/Quilleditor';
import { isEqual } from 'lodash';
import { useLoading } from '@/context/LoadingContext';
import { usePopup } from '@/lib/hooks/usePopup';
import { trainerApis } from '@/lib/apis/trainer.apis';
import { TextField, Chip } from '@mui/material';
import { Workshop, } from '@/models/workshop.models';

interface EditWorkshopProps {
    onClose: () => void;
    initialData?: Workshop
    mode: 'create' | 'edit';
    onUpdate?: (updatedWorkshop: any) => void;
}



const EditWorkshop: React.FC<EditWorkshopProps> = ({ onClose, initialData, onUpdate }) => {
    const { showLoader, hideLoader } = useLoading();
    const { showError } = usePopup();
    const [errors, setErrors] = useState<string[]>([]);
    const errorContainerRef = useRef<HTMLDivElement>(null);







    const initialFormData = {
        idx: initialData?.idx ?? '',
        title: initialData?.title ?? '',
        objectives: initialData?.objectives ?? '',
        target_audience: initialData?.target_audience ?? '',
        format: initialData?.format ?? 'In-Person',
        outcomes: initialData?.outcomes ?? '',
        handouts: initialData?.handouts ?? '',
        program_flow: initialData?.program_flow ?? '',
        evaluation: initialData?.evaluation ?? '',
        price: initialData?.price ?? 0,
        image: initialData?.image ?? '',
        type: initialData?.type ?? 'Workshop'
    };

    const [formData, setFormData] = useState(initialFormData);
    const [modifiedFields, setModifiedFields] = useState<Partial<typeof formData>>({});
    const [imagePreview, setImagePreview] = useState<string>(initialData?.image ?? '');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const initialFormState = useRef(initialFormData);
    const initialImageRef = useRef(initialData?.image ?? '');

    // Add isEditMode state
    const isEditMode = Boolean(initialData);

    const MAX_CHAR_LIMIT = 300;

    // Add error states for character limits
    const [objectivesError, setObjectivesError] = useState('');
    const [outcomesError, setOutcomesError] = useState('');
    const [handoutsError, setHandoutsError] = useState('');
    const [evaluationError, setEvaluationError] = useState('');

    // Function to strip HTML and count characters
    const getTextLength = (htmlContent: string): number => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        return tempDiv.textContent?.length ?? 0;
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
            const normalizedType: 'Workshop' | 'Casestudy' =
                initialData.type?.toLowerCase() === 'Casestudy'
                    ? 'Casestudy'
                    : 'Workshop';
            // Ensure HTML content is properly handled for QuillEditor fields
            const newInitialData = {
                idx: initialData.idx,
                title: initialData.title ?? '',
                objectives: initialData.objectives ?? '',
                target_audience: initialData.target_audience ?? '',
                format: initialData.format ?? 'In-Person',
                outcomes: initialData.outcomes ?? '',
                handouts: initialData.handouts ?? '',
                program_flow: initialData.program_flow ?? '',
                evaluation: initialData.evaluation ?? '',
                price: initialData.price ?? 0,
                image: initialData.image ?? '',
                type: normalizedType
            };

            // Set the form data
            setFormData(newInitialData);
            setImagePreview(initialData.image ?? '');
            initialFormState.current = newInitialData;
            setModifiedFields({});
        }
    }, [initialData]);

    const prepareUpdateData = (
        initialData: any,
        modifiedFields: any,
        formData: any,
        imageUrl: string
    ) => ({
        ...initialData,
        ...modifiedFields,
        image: imageUrl,
        format: formData.format,
        type: formData.type
    });

    const getImageUrl = async (currentImage: string, selectedImage: File | null): Promise<string> => {
        if (!selectedImage) return currentImage;
        const uploadResponse = await trainerApis.fileUpload.uploadProfilePicture(selectedImage);
        return uploadResponse.message.file_url;
    };
    const validateFormData = (formData: Workshop, imagePreview: string | null, isEditMode: boolean): string[] => {
        const errors: string[] = [];

        const check = (condition: boolean, message: string) => {
            if (condition) errors.push(message);
        };

        check(!formData.title.trim(), 'Title is Required');
        check(!formData.objectives.trim(), 'Objectives is Required');
        check(formData.objectives.length > MAX_CHAR_LIMIT, 'Objectives should be less than 300 characters');
        check(formData.price <= 0, 'Price should be greater than 0');
        check(!formData.target_audience.trim(), 'Target Audience is Required');
        check(!formData.outcomes.trim(), 'Outcomes is Required');
        check(formData.outcomes.length > MAX_CHAR_LIMIT, 'Outcomes should be less than 300 characters');
        check(!formData.handouts.trim(), 'Handouts is Required');
        check(formData.handouts.length > MAX_CHAR_LIMIT, 'Handouts should be less than 300 characters');
        check(!formData.program_flow.trim(), 'Program Flow is Required');
        check(getTextLength(formData.program_flow) > MAX_CHAR_LIMIT, 'Program Flow should be less than 300 characters');
        check(!formData.evaluation.trim(), 'Evaluation is Required');
        check(formData.evaluation.length > MAX_CHAR_LIMIT, 'Evaluation should be less than 300 characters');
        check(!imagePreview && !isEditMode, 'Image is Required');

        return errors;
    };
    const focusOnErrorContainer = () => {
        setTimeout(() => {
            errorContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorContainerRef.current?.focus();
        }, 100);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!hasFormChanges) return;

        setErrors([]);

        const validationErrors = validateFormData(formData, imagePreview, isEditMode);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            focusOnErrorContainer();
            return;
        }

        try {
            showLoader();
            const imageUrl = await getImageUrl(formData.image, selectedImage);

            const updateData = prepareUpdateData(initialData, modifiedFields, formData, imageUrl);





            if (onUpdate) onUpdate(updateData);
            onClose();
        } catch (error) {
            console.error('Error preparing update:', error);
            showError('Failed to prepare update');
        } finally {
            hideLoader();
        }
    };



    return (
        <div className="bg-white min-w-full max-w-full h-full py-4 sm:py-6 lg:py-8 rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="form max-w-4xl mx-auto">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-12 flex flex-col gap-4 sm:gap-6 lg:gap-[24px] text-blue-700 font-semibold">
                    <div className="flex justify-between items-center">
                        <p className="text-lg sm:text-xl lg:text-3xl font-bold text-black">🎓 Create / Edit Workshop or Case Study</p>
                        <button
                            className="text-gray-500 hover:text-gray-800 text-lg sm:text-xl font-bold p-1 sm:p-2"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                                <path d="M18 6L6 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {errors.length > 0 && (
                        <div
                            ref={errorContainerRef}
                            tabIndex={-1}
                            className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <ul className="list-disc list-inside text-red-600 text-sm sm:text-base">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 text-sm sm:text-base font-normal">
                        {/* Workshop Title */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm sm:text-base font-normal text-blue-700">Workshop Title</p>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="h-[40px] sm:h-[45px] rounded-lg w-full p-2 sm:p-3 border border-blue-100 text-sm sm:text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter workshop title"
                            />
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm sm:text-base font-normal text-blue-700">Price (per session for 50 pax)</p>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                className="h-[40px] sm:h-[45px] rounded-lg w-full p-2 sm:p-3 border border-blue-100 text-sm sm:text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter workshop price"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Image Upload and Preview */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm sm:text-base font-normal text-blue-700">Workshop Image</p>
                            <div className="flex flex-col gap-3 sm:gap-4">
                                {imagePreview && (
                                    <div className="relative w-full h-32 sm:h-40 lg:h-80 rounded-lg overflow-hidden">
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
                                    className="block text-sm sm:text-base text-gray-500 font-normal
                                           file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
                                           file:rounded file:border-0
                                           file:text-sm sm:file:text-base file:font-normal
                                           file:bg-blue-50 file:text-blue-700
                                           hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        {/* Objectives */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm sm:text-base font-normal text-blue-700">Objectives</p>
                            <div className="relative">
                                <textarea
                                    value={formData.objectives}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= MAX_CHAR_LIMIT) {
                                            handleChange('objectives', value);
                                            setObjectivesError('');
                                        } else {
                                            setObjectivesError('Only 300 characters are allowed. Please shorten your input.');
                                        }
                                    }}
                                    className="min-h-[80px] sm:min-h-[100px] rounded-lg w-full p-2 sm:p-3 border border-blue-100 text-sm sm:text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-8"
                                    placeholder="Enter workshop objectives"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <div>
                                        {objectivesError && (
                                            <span className="text-xs text-red-500">{objectivesError}</span>
                                        )}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        {formData.objectives.length}/{MAX_CHAR_LIMIT}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm sm:text-base font-normal text-blue-700">Target Audience</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                                {formData.target_audience.split(',').map((audience, index) => (
                                    audience.trim() && (
                                        <Chip
                                            key={index}
                                            label={audience.trim()}
                                            onDelete={() => {
                                                const audiences = formData.target_audience.split(',').map(a => a.trim());
                                                audiences.splice(index, 1);
                                                handleChange('target_audience', audiences.join(', '));
                                            }}
                                            className="bg-blue-100 text-blue-800 text-xs sm:text-sm"
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
                                            const currentAudiences = formData.target_audience ? formData.target_audience.split(',').map(a => a.trim()) : [];
                                            if (!currentAudiences.includes(audience)) {
                                                const newAudiences = [...currentAudiences, audience];
                                                handleChange('target_audience', newAudiences.join(', '));
                                            }
                                            input.value = '';
                                        }
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                        '@media (min-width: 640px)': {
                                            fontSize: '1rem',
                                        },
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
                            <p className="text-sm sm:text-base font-normal text-blue-700">Program Flow</p>
                            <div className="relative">
                                <QuillEditor
                                    value={formData.program_flow}
                                    onChange={(val) => handleQuillChange('program_flow', val)}
                                />
                                <span className="absolute bottom-2 right-2 text-xs sm:text-sm text-gray-500">
                                    {getTextLength(formData.program_flow)}/{MAX_CHAR_LIMIT}
                                </span>
                            </div>
                        </div>

                        {/* Outcomes */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm sm:text-base font-normal text-blue-700">Outcomes</p>
                            <div className="relative">
                                <textarea
                                    value={formData.outcomes}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= MAX_CHAR_LIMIT) {
                                            handleChange('outcomes', value);
                                            setOutcomesError('');
                                        } else {
                                            setOutcomesError('Only 300 characters are allowed. Please shorten your input.');
                                        }
                                    }}
                                    className="min-h-[80px] sm:min-h-[100px] rounded-lg w-full p-2 sm:p-3 border border-blue-100 text-sm sm:text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-8"
                                    placeholder="Enter workshop outcomes"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <div>
                                        {outcomesError && (
                                            <span className="text-xs text-red-500">{outcomesError}</span>
                                        )}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        {formData.outcomes.length}/{MAX_CHAR_LIMIT}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Handouts */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm sm:text-base font-normal text-blue-700">Handouts</p>
                            <div className="relative">
                                <textarea
                                    value={formData.handouts}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= MAX_CHAR_LIMIT) {
                                            handleChange('handouts', value);
                                            setHandoutsError('');
                                        } else {
                                            setHandoutsError('Only 300 characters are allowed. Please shorten your input.');
                                        }
                                    }}
                                    className="min-h-[80px] sm:min-h-[100px] rounded-lg w-full p-2 sm:p-3 border border-blue-100 text-sm sm:text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-8"
                                    placeholder="Enter workshop handouts"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <div>
                                        {handoutsError && (
                                            <span className="text-xs text-red-500">{handoutsError}</span>
                                        )}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        {formData.handouts.length}/{MAX_CHAR_LIMIT}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Evaluations */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm sm:text-base font-normal text-blue-700">Evaluations</p>
                            <div className="relative">
                                <textarea
                                    value={formData.evaluation}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= MAX_CHAR_LIMIT) {
                                            handleChange('evaluation', value);
                                            setEvaluationError('');
                                        } else {
                                            setEvaluationError('Only 300 characters are allowed. Please shorten your input.');
                                        }
                                    }}
                                    className="min-h-[80px] sm:min-h-[100px] rounded-lg w-full p-2 sm:p-3 border border-blue-100 text-sm sm:text-base text-gray-700 font-normal leading-6 placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base placeholder:font-light resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-8"
                                    placeholder="Enter workshop evaluation criteria"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <div>
                                        {evaluationError && (
                                            <span className="text-xs text-red-500">{evaluationError}</span>
                                        )}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        {formData.evaluation.length}/{MAX_CHAR_LIMIT}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Format Selection */}
                        <div className="text-sm sm:text-base text-black font-normal">
                            <p className='text-blue-700 font-normal text-sm sm:text-base'>Format</p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm sm:text-base text-gray-700">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="in-person"
                                        checked={formData.format.split(',').map(f => f.trim()).includes('In-Person')}
                                        onChange={() => {
                                            const formats = formData.format ? formData.format.split(',').map(f => f.trim()) : [];
                                            let newFormats;
                                            if (formats.includes('In-Person')) {
                                                newFormats = formats.filter(f => f !== 'In-Person');
                                            } else {
                                                newFormats = [...formats, 'In-Person'];
                                            }
                                            handleChange('format', newFormats.join(', '));
                                        }}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="in-person" className="text-sm sm:text-base font-normal">In-person</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="virtual"
                                        checked={formData.format.split(',').map(f => f.trim()).includes('Virtual')}
                                        onChange={() => {
                                            const formats = formData.format ? formData.format.split(',').map(f => f.trim()) : [];
                                            let newFormats;
                                            if (formats.includes('Virtual')) {
                                                newFormats = formats.filter(f => f !== 'Virtual');
                                            } else {
                                                newFormats = [...formats, 'Virtual'];
                                            }
                                            handleChange('format', newFormats.join(', '));
                                        }}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="virtual" className="text-sm sm:text-base font-normal">Virtual</label>
                                </div>
                            </div>
                        </div>

                        {/* Type Selection (Workshop/Case Study) */}
                        <div className="text-sm sm:text-base text-black font-normal">
                            <p className='text-blue-700 font-normal text-sm sm:text-base'>Type</p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm sm:text-base text-gray-700">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="workshop"
                                        name="type"
                                        checked={formData.type === 'Workshop'}
                                        onChange={() => handleChange('type', 'Workshop')}
                                        disabled={isEditMode}
                                        className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <label htmlFor="workshop" className={`text-sm sm:text-base font-normal ${isEditMode ? 'text-gray-500' : ''}`}>Workshop</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="case-study"
                                        name="type"
                                        checked={formData.type === 'Casestudy'}
                                        onChange={() => handleChange('type', 'Casestudy')}
                                        disabled={isEditMode}
                                        className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <label htmlFor="case-study" className={`text-sm sm:text-base font-normal ${isEditMode ? 'text-gray-500' : ''}`}>Case Study</label>
                                </div>
                            </div>
                            {isEditMode && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    Type cannot be changed in edit mode
                                </p>
                            )}
                        </div>

                        {/* Save Button */}
                        <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg bg-gray-100 text-gray-700 text-sm sm:text-base font-normal px-4 sm:px-6 py-2 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!hasFormChanges}
                                className={`rounded-lg px-4 sm:px-6 py-2 text-sm sm:text-base font-normal transition-colors duration-200 ${hasFormChanges
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