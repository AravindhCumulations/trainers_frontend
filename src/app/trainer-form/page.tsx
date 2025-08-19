'use client'

import { useState, useMemo, useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import dynamic from 'next/dynamic';

import NavBar from '../../components/Navbar';
import { Education, Certification, Testimonial, TrainerFormValidator } from '@/models/trainerDetails.model';
import Footer from '@/components/Footer';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import XIcon from '@mui/icons-material/X';
import {
    TextField,
    IconButton,
    Chip,
} from '@mui/material';
import { Add, Delete } from "@mui/icons-material";
import { indianCities } from "@/app/content/IndianCities";
import { languages } from "@/app/content/Languages";
import { trainerApis } from "@/lib/apis/trainer.apis";
import { useLoading } from '@/context/LoadingContext';
import { useNavigation as useNavigationBase } from "@/lib/hooks/useNavigation";
import { getCurrentUserMail, getCurrentUserName, setCurrentUserName } from '@/lib/utils/auth.utils';
import { TrainerFormDto } from '@/models/trainerDetails.model';
import { expertise_in } from '@/app/content/ExpertiseIN';
import { useUser } from '@/context/UserContext';
import { authApis } from '@/lib/apis/auth.apis';
import { usePopup } from '@/lib/hooks/usePopup';
import Popup from '@/components/Popup';
import { Eye } from 'lucide-react';
import TrainerProfilePreview from '@/components/TrainerProfilePreview';

// Add type for tracking modified fields
type ModifiedTrainerFields = Partial<TrainerFormDto>;

// Dynamically import reCAPTCHA to avoid SSR issues
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });

export default function TrainerDetailsPage() {


    const { setName } = useUser();
    const errorContainerRef = useRef<HTMLDivElement>(null);


    // edit mode
    const [isEdit, setIsEdit] = useState(false);
    const [modifiedFields, setModifiedFields] = useState<ModifiedTrainerFields>({});


    // dropDowns
    const [searchTerm, setSearchTerm] = useState('');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [languageSearchTerm, setLanguageSearchTerm] = useState('');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    // loaders and Navigations
    const { showLoader, hideLoader } = useLoading();
    const { popupState, showConfirmation, hidePopup } = usePopup();

    // content
    const [filteredLanguages, setFilteredLanguages] = useState(languages);
    const [filteredCities, setFilteredCities] = useState(indianCities);

    // elemRefs

    const cityDropdownRef = useRef<HTMLDivElement>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const companyInputRef = useRef<HTMLInputElement>(null);

    //form
    const [form, setForm] = useState<TrainerFormDto>({
        // personalInfo
        first_name: '',
        last_name: '',
        bio_line: '',
        training_approach: '',
        experience: 1,
        city: '',
        dob: '',


        // professionalInfo
        expertise_in: '',
        language: '',
        charge: 0,
        phone: '',
        // email: '',
        trainer: '',
        image: '',

        // education
        education: [{ course: '', institution: '', year: '' }],
        // certifications
        certificates: [{ certificate_name: '', issued_by: '', issued_date: '', certificate_url: '' }],

        // social media links
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        personal_website: '',

        // testimonials
        testimonials: [{ client_name: '', company: '', testimonials: '' }],

        client_worked: [{ company: '', idx: 0 }],
    });

    // Add initial state reference
    const initialFormState = useRef<TrainerFormDto>({ ...form });

    // Add initializeFormData method
    const initializeFormData = (trainerData: any) => {
        console.log("initializeFormData called with:", trainerData);
        
        // Get first_name and last_name from localStorage
        const userDetails = JSON.parse(localStorage.getItem("user_details") || "{}");
        
        const formData = {
            first_name: userDetails.first_name ?? '',
            last_name: userDetails.last_name ?? '',
            bio_line: trainerData.bio_line ?? '',
            training_approach: trainerData.training_approach ?? '',
            experience: trainerData.experience ?? 1,
            city: trainerData.city ?? '',
            dob: trainerData.dob ?? '',
            expertise_in: trainerData.expertise_in ?? '',
            language: trainerData.language ?? '',
            charge: trainerData.charge ?? 0,
            phone: trainerData.phone?.trim() ?? '',
            email: trainerData.email ?? '',
            trainer: trainerData.email ?? '',
            image: trainerData.image ?? '', // Keep the existing image URL
            education: trainerData.education ?? [{ course: '', institution: '', year: '' }],
            certificates: trainerData.certificates ?? [{ certificate_name: '', issued_by: '', issued_date: '', certificate_url: '' }],
            testimonials: trainerData.testimonials ?? [{ client_name: '', company: '', testimonials: '' }],
            facebook: trainerData.facebook ?? '',
            instagram: trainerData.instagram ?? '',
            linkedin: trainerData.linkedin ?? '',
            twitter: trainerData.twitter ?? '',
            personal_website: trainerData.personal_website ?? '',
            client_worked: trainerData.client_worked ?? [],
        };

        // Set both form and initial form state
        console.log("Setting form data:", formData);
        setForm(formData);
        initialFormState.current = { ...formData };
        console.log("Initial form state set:", initialFormState.current);
    };

    // 




    // Function to check if form has changes

    // erros
    const [errors, setErrors] = useState<string[]>([]);

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasImageChanged, setHasImageChanged] = useState(false);

    // Function to check if form has changes
    const hasFormChanges = useMemo(() => {
        if (!isEdit) return true; // Always enable submit for new forms

        // For edit mode, check if any field is different from initial state using deep comparison
        const hasFormDataChanges = Object.keys(modifiedFields).some(key => {
            const currentValue = form[key as keyof TrainerFormDto];
            const initialValue = initialFormState.current[key as keyof TrainerFormDto];
            return !isEqual(currentValue, initialValue);
        });

        // In edit mode, we need either form changes OR image changes
        return hasFormDataChanges || hasImageChanged;
    }, [modifiedFields, isEdit, form, hasImageChanged]);



    // Add new state for expertise dropdown
    const [isExpertiseDropdownOpen, setIsExpertiseDropdownOpen] = useState(false);
    const expertiseDropdownRef = useRef<HTMLDivElement>(null);

    // Add filtered expertise state
    const [filteredExpertise, setFilteredExpertise] = useState(expertise_in);

    // Add preview state for trainer profile
    const [previewState, setPreviewState] = useState<{
        isOpen: boolean;
    }>({
        isOpen: false
    });

    // Track form submission state to prevent navigation blocking during submit
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to handle changes with deep comparison
    const handleChanges = (field: keyof TrainerFormDto, value: string | number) => {
        setForm(prev => ({
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

    // Add expertise search handler
    const handleExpertiseSearch = (searchValue: string) => {
        setSearchTerm(searchValue);
        if (!searchValue.trim()) {
            setFilteredExpertise(expertise_in); // Reset to all options if search is empty
            return;
        }
        const filtered = expertise_in.filter(exp =>
            exp.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredExpertise(filtered);
    };

    // Add expertise selection handler
    const isExpertiseSelected = (exp: string) => {
        const selectedExpertise = form.expertise_in.split(',').map(e => e.trim());
        return selectedExpertise.includes(exp);
    };

    const handleExpertiseClick = (exp: string) => {
        const selectedExpertise = form.expertise_in.split(',').map(e => e.trim()).filter(e => e !== '');

        let newExpertise: string[];
        if (isExpertiseSelected(exp)) {
            // Remove expertise if already selected
            newExpertise = selectedExpertise.filter(e => e !== exp);
        } else {
            // Add new expertise (no limit)
            newExpertise = [...selectedExpertise, exp];
        }
        handleChanges('expertise_in', newExpertise.join(', '));

        // Clear search and reset dropdown list to all options
        setSearchTerm('');
        setFilteredExpertise(expertise_in);

        // Keep dropdown open for continued selection
    };

    // Cleanup effect to reset submission state on unmount
    useEffect(() => {
        return () => {
            setIsSubmitting(false);
        };
    }, []);

    // Add useEffect to fetch trainer data
    useEffect(() => {
        const fetchTrainerData = async () => {
            try {
                showLoader();
                const searchParams = new URLSearchParams(window.location.search);
                
                const trainerParam = searchParams.get('trainerData');
                const trainerName = searchParams.get('trainer')

                // case routing from trainer-details

                if (trainerParam) {
                    setIsEdit(true);
                    const trainerData = JSON.parse(decodeURIComponent(trainerParam));

                    console.log("get by trainer param " + JSON.stringify(trainerData));
                    

                    // Set the existing image URL as preview if available
                    if (trainerData.image) {
                        setProfileImagePreview(trainerData.image);
                    }

                    // Initialize form data using the new method
                    console.log("About to initialize form data with:", trainerData);
                    initializeFormData(trainerData);
                    console.log("Form initialized, current form state:", form);
                } else if (trainerName) {


                    console.log("get by trainer name " + trainerName);
                    
                    // Get trainer data using API
                    const response = await trainerApis.getTrainerByName(trainerName);


                    if (response.data) {
                        setIsEdit(true);
                        // Set the existing image URL as preview if available
                        if (response.data.image) {
                            setProfileImagePreview(response.data.image);
                        }
                        // Initialize form data using the new method
                        console.log("About to initialize form data with API response:", response.data);
                        initializeFormData(response.data);
                        console.log("Form initialized from API, current form state:", form);
                    }

                }



            } catch (error) {
                console.error('Error fetching trainer data:', error);
            } finally {
                hideLoader();
            }
        };

        fetchTrainerData();
    }, []);

    // Populate first_name and last_name from localStorage for signup mode
    useEffect(() => {
        if (!isEdit) {
            try {
                const userDetails = JSON.parse(localStorage.getItem("user_details") || "{}");
                if (userDetails.first_name || userDetails.last_name) {
                    setForm(prev => ({
                        ...prev,
                        first_name: userDetails.first_name || '',
                        last_name: userDetails.last_name || ''
                    }));
                    
                    // Update initial form state to include the populated values
                    initialFormState.current = {
                        ...initialFormState.current,
                        first_name: userDetails.first_name || '',
                        last_name: userDetails.last_name || ''
                    };
                }
            } catch (error) {
                console.error('Error parsing user_details from localStorage:', error);
            }
        }
    }, [isEdit]);



    const handleEducationChange = (index: number, field: keyof Education, value: string) => {
        const updatedEducation = [...form.education];
        updatedEducation[index] = {
            ...updatedEducation[index],
            [field]: value
        };
        setForm(prev => ({
            ...prev,
            education: updatedEducation
        }));

        // Track modified education using deep comparison
        if (!isEqual(updatedEducation, initialFormState.current.education)) {
            setModifiedFields(prev => ({
                ...prev,
                education: updatedEducation
            }));
        } else {
            setModifiedFields(prev => {
                const newModifiedFields = { ...prev };
                delete newModifiedFields.education;
                return newModifiedFields;
            });
        }
    };

    const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
        const updatedCertificates = [...form.certificates];
        updatedCertificates[index] = {
            ...updatedCertificates[index],
            [field]: value
        };
        setForm(prev => ({
            ...prev,
            certificates: updatedCertificates
        }));

        // Track modified certificates using deep comparison
        if (!isEqual(updatedCertificates, initialFormState.current.certificates)) {
            setModifiedFields(prev => ({
                ...prev,
                certificates: updatedCertificates
            }));
        } else {
            setModifiedFields(prev => {
                const newModifiedFields = { ...prev };
                delete newModifiedFields.certificates;
                return newModifiedFields;
            });
        }
    };

    const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
        const updatedTestimonials = [...form.testimonials];
        updatedTestimonials[index] = {
            ...updatedTestimonials[index],
            [field]: value
        };
        setForm(prev => ({
            ...prev,
            testimonials: updatedTestimonials
        }));

        // Track modified testimonials using deep comparison
        if (!isEqual(updatedTestimonials, initialFormState.current.testimonials)) {
            setModifiedFields(prev => ({
                ...prev,
                testimonials: updatedTestimonials
            }));
        } else {
            setModifiedFields(prev => {
                const newModifiedFields = { ...prev };
                delete newModifiedFields.testimonials;
                return newModifiedFields;
            });
        }
    };

    const addEducation = () => {
        const newEducation = [...form.education, { course: '', institution: '', year: '' }];
        setForm(prev => ({
            ...prev,
            education: newEducation
        }));
        // Track modified education using deep comparison
        if (!isEqual(newEducation, initialFormState.current.education)) {
            setModifiedFields(prev => ({
                ...prev,
                education: newEducation
            }));
        }
    };

    const removeEducation = (index: number) => {
        const newEducation = form.education.filter((_, i) => i !== index);
        setForm(prev => ({
            ...prev,
            education: newEducation
        }));
        // Track modified education using deep comparison
        if (!isEqual(newEducation, initialFormState.current.education)) {
            setModifiedFields(prev => ({
                ...prev,
                education: newEducation
            }));
        }
    };

    const addCertification = () => {
        const newCertificates = [...form.certificates, { certificate_name: '', issued_by: '', issued_date: '', certificate_url: '' }];
        setForm(prev => ({
            ...prev,
            certificates: newCertificates
        }));
        // Track modified certificates using deep comparison
        if (!isEqual(newCertificates, initialFormState.current.certificates)) {
            setModifiedFields(prev => ({
                ...prev,
                certificates: newCertificates
            }));
        }
    };

    const removeCertification = (index: number) => {
        const newCertifications = form.certificates.filter((_, i) => i !== index);
        setForm(prev => ({
            ...prev,
            certificates: newCertifications
        }));
        // Track modified certificates using deep comparison
        if (!isEqual(newCertifications, initialFormState.current.certificates)) {
            setModifiedFields(prev => ({
                ...prev,
                certificates: newCertifications
            }));
        }
    };

    const addTestimonial = () => {
        const newTestimonials = [...form.testimonials, { client_name: '', company: '', testimonials: '' }];
        setForm(prev => ({
            ...prev,
            testimonials: newTestimonials
        }));
        // Track modified testimonials using deep comparison
        if (!isEqual(newTestimonials, initialFormState.current.testimonials)) {
            setModifiedFields(prev => ({
                ...prev,
                testimonials: newTestimonials
            }));
        }
    };

    const removeTestimonial = (index: number) => {
        const updated = form.testimonials.filter((_, i) => i !== index);
        setForm(prev => ({
            ...prev,
            testimonials: updated
        }));
        // Track modified testimonials using deep comparison
        if (!isEqual(updated, initialFormState.current.testimonials)) {
            setModifiedFields(prev => ({
                ...prev,
                testimonials: updated
            }));
        }
    };

    const addCompany = (companyName: string) => {
        const company = companyName.trim();
        if (company && !form.client_worked.some(client => client.company === company)) {
            const newClient = {
                company,
                idx: form.client_worked.length + 1
            };
            const newClients = [...form.client_worked, newClient];
            setForm(prev => ({
                ...prev,
                client_worked: newClients
            }));
            if (!isEqual(newClients, initialFormState.current.client_worked)) {
                setModifiedFields(prev => ({
                    ...prev,
                    client_worked: newClients
                }));
            }
            return true; // Return true if company was added
        }
        return false; // Return false if company was not added
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (10MB = 10 * 1024 * 1024 bytes)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            
            if (file.size > maxSize) {
                setErrors(['Profile picture file size must be less than 10MB. Please select a smaller image.']);
                // Clear the file input
                e.target.value = '';
                return;
            }

            setHasImageChanged(true);
            // Remove spaces from the file name
            const sanitizedFileName = file.name.replace(/\s+/g, '');
            const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });
            setProfileImage(sanitizedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result as string);
            };
            reader.readAsDataURL(sanitizedFile);
            
            // Clear any previous errors
            setErrors([]);
        }
    };

    // Add state for captcha
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Set submitting state to prevent navigation blocking
        setIsSubmitting(true);
        e.currentTarget.setAttribute('data-submitting', 'true');

        setErrors([]);
        setCaptchaError('');
        // Require captcha only in create mode

        // Validate form before submission
        const validationErrors = TrainerFormValidator.validateForm(form);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            // Scroll to error container and focus it
            setTimeout(() => {
                errorContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorContainerRef.current?.focus();
            }, 100);
            return;
        }

        try {
            showLoader();

            let imageUrl = form.image; // Keep existing image URL by default

            // Only upload new image if a new file was selected
            if (profileImage) {
                const uploadResponse = await trainerApis.fileUpload.uploadProfilePicture(profileImage);
                imageUrl = uploadResponse.message.file_url;
            }

            // Clean client_worked before submission
            const cleanedClientWorked = form.client_worked.filter(client => client.company && client.company.trim() !== '');

            // Update User first_name and last_name if changed
            const userEmail = getCurrentUserMail();
            if (modifiedFields.first_name || modifiedFields.last_name) {
                try {
                    await trainerApis.updateUserNames(
                        userEmail,
                        form.first_name || '',
                        form.last_name || ''
                    );
                    
                    // Update localStorage with new first_name and last_name
                    const userDetails = JSON.parse(localStorage.getItem("user_details") || "{}");
                    const updatedUserDetails = {
                        ...userDetails,
                        ...(modifiedFields.first_name && { first_name: form.first_name }),
                        ...(modifiedFields.last_name && { last_name: form.last_name })
                    };
                    localStorage.setItem("user_details", JSON.stringify(updatedUserDetails));
                    
                } catch (error) {
                    console.error('Error updating user name:', error);
                    // Continue with trainer form submission even if user update fails
                }
            }

            let response;
            if (isEdit) {
                const submitData = {
                    ...modifiedFields,
                    ...(hasImageChanged && { image: imageUrl }), // Only include image if it was changed
                    client_worked: cleanedClientWorked,
                };
                if (modifiedFields.phone) {
                    const phone = `+91-${modifiedFields.phone.replace(/^\+91-/, '')}`;
                    submitData.phone = phone; // ✅ Plain object assignment
                }

                response = await trainerApis.trainerForm.editFormData(submitData);
            } else {

                if (!captchaToken) {
                    setCaptchaError('Please complete the captcha to continue.');
                    setTimeout(() => {
                        errorContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        errorContainerRef.current?.focus();
                    }, 100);
                    return;
                }
                // Backend verification
                try {
                    showLoader();
                    
                    const verifyRes = await authApis.captcha.verifyCaptcha(captchaToken);
                    if (!verifyRes.data || !verifyRes.data.success) {
                        setCaptchaError('Captcha verification failed. Please try again.');
                        hideLoader();
                        return;
                    }
                } catch (err) {
                    setCaptchaError('Captcha verification failed. Please try again.');
                    hideLoader();
                    return;
                }


                form.trainer = getCurrentUserMail();

                const submitData = {
                    ...form,
                    ...(hasImageChanged && { image: imageUrl }), // Only include image if it was changed
                    phone: form.phone ? `+91-${form.phone.replace(/^\+91-/, '')}` : '', // Ensure phone has +91- prefix
                    client_worked: cleanedClientWorked,
                };
                if (form.phone) {
                    const phone = `+91-${form.phone.replace(/^\+91-/, '')}`;
                    submitData.phone = phone; // ✅ Plain object assignment
                }

                response = await trainerApis.trainerForm.createFormData(submitData);

                const responseName = response.data.name

                // updating username in both localStorage & userContext
                setCurrentUserName(responseName)
                setName(responseName)
            }

            // Reset image change state after successful submission
            setHasImageChanged(false);
            
            // Clear modified fields to prevent popup
            setModifiedFields({});
            
            // Hide loader before navigation to prevent stuck state
            hideLoader();
            
            // Use setTimeout to ensure state updates are processed before navigation
            setTimeout(async () => {
                try {
                    await handleNavigation('/trainer-details', { 'trainer': getCurrentUserName() });
                } catch (navError) {
                    console.error('Navigation error:', navError);
                    // Fallback navigation
                    window.location.href = `/trainer-details?trainer=${getCurrentUserName()}`;
                }
            }, 100);
        } catch (error: any) {
            console.error('Submission error:', error);

            // Handle API error response
            if (error.response?.data?._server_messages) {
                try {
                    const serverMessages = JSON.parse(error.response.data._server_messages);
                    const parsedMessage = JSON.parse(serverMessages[0]);
                    setErrors([parsedMessage.message]);
                } catch (parseError) {
                    // If parsing fails, use the exception message
                    setErrors([error.response.data.exception ?? "An error occurred during submission"]);
                }
            } else {
                setErrors(["An error occurred during submission"]);
            }
            // Scroll to error container for API errors as well
            setTimeout(() => {
                errorContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorContainerRef.current?.focus();
            }, 100);
        } finally {
            hideLoader();
            // Reset submitting state and remove attribute to re-enable navigation blocking
            setIsSubmitting(false);
            const form = document.querySelector('form');
            if (form) {
                form.removeAttribute('data-submitting');
            }
        }
    };

    const handleCitySearch = (searchValue: string) => {
        setSearchTerm(searchValue);
        if (!searchValue.trim()) {
            setFilteredCities(indianCities);
            return;
        }
        const filtered = indianCities.filter(city =>
            city.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredCities(filtered);
    };

    // Update handleClickOutside to include language dropdown
    const handleClickOutside = (event: MouseEvent) => {
        if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
            setIsLanguageDropdownOpen(false);
            setLanguageSearchTerm('');
            setFilteredLanguages(languages);
        }
        if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
            setIsCityDropdownOpen(false);
            setSearchTerm('');
            setFilteredCities(indianCities);
        }
        if (expertiseDropdownRef.current && !expertiseDropdownRef.current.contains(event.target as Node)) {
            setIsExpertiseDropdownOpen(false);
            setSearchTerm('');
            setFilteredExpertise(expertise_in);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isLanguageSelected = (lang: string) => {
        const selectedLanguages = form.language.split(',').map(l => l.trim()).filter(l => l !== '');
        return selectedLanguages.includes(lang);
    };

    const handleLanguageClick = (lang: string) => {
        const selectedLanguages = form.language.split(',').map(l => l.trim()).filter(l => l !== '');
        let newLanguages: string[];
        if (isLanguageSelected(lang)) {
            // Remove language if already selected
            newLanguages = selectedLanguages.filter(l => l !== lang);
        } else {
            // Add new language
            newLanguages = [...selectedLanguages, lang];
        }
        handleChanges('language', newLanguages.join(', '));
        // Do not close dropdown after selection
        setLanguageSearchTerm('');
        setFilteredLanguages(languages);
    };

    const handleLanguageSearch = (searchValue: string) => {
        setLanguageSearchTerm(searchValue);
        if (!searchValue.trim()) {
            setFilteredLanguages(languages);
            return;
        }
        const filtered = languages.filter(lang =>
            lang.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredLanguages(filtered);
    };

    // Add state for testimonial errors
    const [testimonialErrors, setTestimonialErrors] = useState<string[]>([]);

    // Add state for bio and training approach errors
    const [bioError, setBioError] = useState('');
    const [trainingApproachError, setTrainingApproachError] = useState('');

    // Block navigation if there are unsaved changes in create mode
    const blockNavigation = () => {
        // Don't block navigation during form submission
        if (isSubmitting) {
            return true; // Allow navigation during submission
        }
        
        // Only show confirmation for unsaved changes when NOT submitting
        if (!isEdit && hasFormChanges) {
            return new Promise<boolean>((resolve) => {
                showConfirmation(
                    'Your profile is incomplete. Are you sure you want to leave without completing your profile?',
                    () => resolve(true),
                    {
                        title: 'Complete Your Profile',
                        confirmText: 'Leave',
                        cancelText: 'Stay',
                    }
                );
            });
        }
        return true;
    };

    // Use enhanced navigation hook
    const { handleNavigation } = useNavigationBase(blockNavigation);

    return (

        <div className="min-h-screen bg-theme">
            <NavBar handleNavigation={handleNavigation} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6 lg:my-8">

                {/* Preview Button - Outside the form container */}
                {!isEdit && (
                <div className="flex justify-center my-6 sm:mt-8">
                    <button
                        onClick={() => setPreviewState({ isOpen: true })}
                        className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition text-base font-medium shadow-lg hover:shadow-xl"
                    >
                        <Eye className="w-5 h-5" />
                        Sample Trainer Profile
                    </button>
                </div>
                )}

                <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden">
                    <div className="flex flex-col justify-center items-center text-center text-white py-3 sm:py-4 lg:py-[16px] bg-theme-header"
                    >
                        <h1 className="tracking-normal text-center align-middle font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-[clamp(18px,4vw,32px)]">Complete Your Trainer Profile</h1>
                        <p className='px-3 sm:px-4 text-sm sm:text-base'>Share your expertise and credentials with potential clients</p>
                    </div>

                    {errors.length > 0 && (
                        <div
                            ref={errorContainerRef}
                            tabIndex={-1}
                            className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg m-3 sm:m-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <ul className="list-disc list-inside text-red-600 text-sm sm:text-base">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

                        {/* Profile Picture Upload */}
                        <div className="rounded-xl p-4 sm:p-6 shadow-sm bg-white">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Profile Picture</h3>
                            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-200">
                                    {profileImagePreview ? (
                                        <img
                                            src={profileImagePreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-gray-400 text-xs sm:text-sm">No image</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                                >
                                    {profileImage ? 'Change Picture' : 'Upload Picture'}
                                </button>
                                <p className="text-xs text-gray-500 text-center">
                                    Maximum file size: 10MB. Supported formats: PNG, JPG, JPEG, GIF, WebP
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl p-4 sm:p-6 shadow-sm bg-white">
                            {/* Section Title */}
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Personal Details</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        value={form.first_name}
                                        onChange={e => handleChanges('first_name', e.target.value)}
                                        placeholder="Enter first name"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        id="last_name"
                                        type="text"
                                        value={form.last_name}
                                        onChange={e => handleChanges('last_name', e.target.value)}
                                        placeholder="Enter last name"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mb-4 sm:mb-6">
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Your Bio
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="bio"
                                        value={form.bio_line}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 500) {
                                                handleChanges('bio_line', value);
                                                setBioError('');
                                            } else {
                                                setBioError('Only 500 characters are allowed. Please shorten your input.');
                                            }
                                        }}
                                        placeholder="Share your training philosophy and what makes you unique..."
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        <div>
                                            {bioError && (
                                                <span className="text-xs text-red-500">{bioError}</span>
                                            )}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            {form.bio_line.length}/500
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* TrainerApproch */}
                            <div className="mb-4 sm:mb-6">
                                <label
                                    htmlFor="trainerApproch"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Training Approch
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="trainerApproch"
                                        value={form.training_approach}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 500) {
                                                handleChanges('training_approach', value);
                                                setTrainingApproachError('');
                                            } else {
                                                setTrainingApproachError('Only 500 characters are allowed. Please shorten your input.');
                                            }
                                        }}
                                        placeholder="Share your approch strategy"
                                        rows={3}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        <div>
                                            {trainingApproachError && (
                                                <span className="text-xs text-red-500">{trainingApproachError}</span>
                                            )}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            {form.training_approach.length}/500
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Row for Experience, City, DOB */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {/* Years of Experience */}
                                <div>
                                    <label
                                        htmlFor="experience"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Years of Experience
                                    </label>
                                    <input
                                        id="experience"
                                        type="number"
                                        value={form.experience}
                                        onChange={(e) =>
                                            handleChanges('experience', Number(e.target.value))
                                        }
                                        placeholder="Your years of experience"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                    />
                                </div>

                                {/* City Dropdown */}
                                <div className="relative" ref={cityDropdownRef}>
                                    <label
                                        htmlFor="city"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        City
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={form.city}
                                            readOnly
                                            placeholder="Select your city"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                            onClick={() => setIsCityDropdownOpen(true)}
                                        />
                                        {isCityDropdownOpen && (
                                            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                <input
                                                    type="text"
                                                    placeholder="Search cities..."
                                                    className="w-full px-3 sm:px-4 py-2 border-b border-gray-300 focus:outline-none text-sm sm:text-base"
                                                    value={searchTerm}
                                                    onChange={(e) => handleCitySearch(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="max-h-48 overflow-y-auto">
                                                    {filteredCities.map(city => (
                                                        <div
                                                            key={city}
                                                            className={`px-3 sm:px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm sm:text-base ${form.city === city ? 'bg-blue-50' : ''
                                                                }`}
                                                            onClick={() => {
                                                                handleChanges('city', city);
                                                                setIsCityDropdownOpen(false);
                                                                setSearchTerm('');
                                                                setFilteredCities(indianCities);
                                                            }}
                                                        >
                                                            {city}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Year of Birth */}
                                <div>
                                    <label
                                        htmlFor="dob"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Year of Birth
                                    </label>
                                    <select
                                        id="dob"
                                        value={form.dob}
                                        onChange={(e) => handleChanges('dob', e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 h-[42px] sm:h-[46px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                    >
                                        <option value="" >Select Year</option>
                                        {Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Professrional Information */}
                        <div className="rounded-xl p-4 sm:p-6 shadow-sm bg-white">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Professional Details</h3>

                            <div className="space-y-4 sm:space-y-5">
                                {/* Expertise */}
                                <div className="relative" ref={expertiseDropdownRef}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expertise / tags
                                    </label>
                                    <input
                                        type="text"
                                        value={form.expertise_in}
                                        readOnly
                                        placeholder="Select expertise from dropdown"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                        onFocus={() => setIsExpertiseDropdownOpen(true)}
                                    />
                                    {isExpertiseDropdownOpen && (
                                        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                            <input
                                                type="text"
                                                placeholder="Search expertise..."
                                                className="w-full px-3 sm:px-4 py-2 border-b border-gray-300 focus:outline-none text-sm sm:text-base"
                                                value={searchTerm}
                                                onChange={(e) => handleExpertiseSearch(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="max-h-48 overflow-y-auto">
                                                {filteredExpertise.map(exp => {
                                                    return (
                                                        <div
                                                            key={exp}
                                                            className={`px-3 sm:px-4 py-2 cursor-pointer flex items-center justify-between text-sm sm:text-base
                                                                ${isExpertiseSelected(exp)
                                                                    ? 'bg-blue-50 hover:bg-blue-100'
                                                                    : 'hover:bg-gray-100'
                                                                }`}
                                                            onClick={() => handleExpertiseClick(exp)}
                                                        >
                                                            <span>{exp}</span>
                                                            {isExpertiseSelected(exp) && (
                                                                <span className="text-xs text-blue-600">
                                                                    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
                                                                        <circle cx="8" cy="8" r="8" fill="currentColor" />
                                                                        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Languages Known */}
                                <div className="relative" ref={languageDropdownRef}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages Known</label>
                                    <input
                                        type="text"
                                        value={form.language}
                                        readOnly
                                        placeholder="Select languages from dropdown"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                        onFocus={() => setIsLanguageDropdownOpen(true)}
                                    />
                                    {isLanguageDropdownOpen && (
                                        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                            <input
                                                type="text"
                                                placeholder="Search languages..."
                                                className="w-full px-3 sm:px-4 py-2 border-b border-gray-300 focus:outline-none text-sm sm:text-base"
                                                value={languageSearchTerm}
                                                onChange={(e) => handleLanguageSearch(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="max-h-48 overflow-y-auto">
                                                {filteredLanguages.map(lang => (
                                                    <div
                                                        key={lang}
                                                        className={`px-3 sm:px-4 py-2 cursor-pointer flex items-center justify-between text-sm sm:text-base ${isLanguageSelected(lang)
                                                            ? 'bg-blue-50 hover:bg-blue-100'
                                                            : 'hover:bg-gray-100'
                                                            }`}
                                                        onClick={() => handleLanguageClick(lang)}
                                                    >
                                                        <span>{lang}</span>
                                                        {isLanguageSelected(lang) && (
                                                            <span className="text-xs text-blue-600">
                                                                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
                                                                    <circle cx="8" cy="8" r="8" fill="currentColor" />
                                                                    <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Horizontal Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {/* Hourly Rate */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;Price (per session for 50 pax)</label>
                                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                            <span className="text-gray-500 text-sm sm:text-base">₹</span>
                                            <input
                                                type="number"
                                                value={form.charge}
                                                onChange={(e) => handleChanges('charge', e.target.value)}
                                                placeholder="Enter hourly rate"
                                                className="w-full ml-2 outline-none text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                            <span className="text-gray-500 text-sm sm:text-base">+91</span>
                                            <input
                                                type="tel"
                                                value={form.phone.replace(/^\+91-/, '')}
                                                onChange={(e) => {
                                                    // Remove any existing +91- prefix and any non-digit characters, then limit to 10 digits
                                                    const cleanNumber = e.target.value.replace(/^\+91-/, '').replace(/\D/g, '').slice(0, 10);
                                                    handleChanges('phone', cleanNumber);
                                                }}
                                                placeholder="Enter phone number"
                                                className="w-full ml-2 outline-none text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>

                                    {/* Email ID */}
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                                        <div className="flex items-center border border-gray-300 rounded-md h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
                                            <span className="text-transparent select-none">--</span>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => handleChanges('email', e.target.value)}
                                                placeholder="Enter Mail ID"
                                                className="w-full ml-2 outline-none"
                                            />
                                        </div>
                                    </div> */}

                                </div>

                                {/* Clients Worked */}
                                <div className="mb-4 sm:mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Companies Worked With
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {form.client_worked.filter(client => client.company.trim() !== '').map((client, index) => (
                                            <Chip
                                                key={index}
                                                label={client.company}
                                                onDelete={() => {
                                                    const newClients = form.client_worked.filter((_, i) => i !== index);
                                                    setForm(prev => ({
                                                        ...prev,
                                                        client_worked: newClients
                                                    }));
                                                    if (!isEqual(newClients, initialFormState.current.client_worked)) {
                                                        setModifiedFields(prev => ({
                                                            ...prev,
                                                            client_worked: newClients
                                                        }));
                                                    }
                                                }}
                                                className="bg-blue-100 text-blue-800 text-xs sm:text-sm"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Type company name and press Enter or click Add"
                                            variant="outlined"
                                            inputRef={companyInputRef}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const input = e.target as HTMLInputElement;
                                                    const company = input.value.trim();
                                                    if (addCompany(company)) {
                                                        input.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (companyInputRef.current) {
                                                    const company = companyInputRef.current.value.trim();
                                                    if (addCompany(company)) {
                                                        companyInputRef.current.value = '';
                                                    }
                                                }
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Education & Certifications  */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Education & Certificates</h3>

                            {/* Education Section */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block font-medium text-gray-700 mb-2">Education</label>

                                {form.education.map((edu, index) => (
                                    <div key={index} className="mb-4 sm:mb-6">
                                        <div className="relative flex gap-2">
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder="Course"
                                                value={edu.course}
                                                onChange={(e) => handleEducationChange(index, "course", e.target.value)}
                                                size="small"
                                            />
                                            {form.education.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeEducation(index)}
                                                    className="absolute top-0 right-0 text-red-600"
                                                    size="small"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
                                            <div className="w-full sm:w-[70%]">
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    placeholder="Institution"
                                                    value={edu.institution}
                                                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                                    size="small"
                                                />
                                            </div>
                                            <div className="w-full sm:w-[30%]">
                                                <select
                                                    value={edu.year}
                                                    onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 h-[42px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                                >
                                                    <option value="">Select Year</option>
                                                    {Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => {
                                                        const year = new Date().getFullYear() - i;
                                                        return (
                                                            <option key={year} value={year}>
                                                                {year}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>


                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addEducation}
                                    // disabled={form.education.length >= 3}
                                    className={`flex items-center font-medium mt-2 text-sm sm:text-base text-green-600`}
                                >
                                    <Add fontSize="small" className="mr-1" /> Add another Education
                                </button>
                            </div>

                            {/* Certificates Section */}
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Certificates</label>

                                {form.certificates.map((cert, index) => (
                                    <div key={index} className="mb-4 sm:mb-6">
                                        <div className="relative flex gap-2">
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder="Certificate Name"
                                                value={cert.certificate_name}
                                                onChange={(e) => handleCertificationChange(index, "certificate_name", e.target.value)}
                                                size="small"
                                            />
                                            {form.certificates.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeCertification(index)}
                                                    className="absolute top-0 right-0 text-red-600"
                                                    size="small"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
                                            <div className="w-full sm:w-[70%]">
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    placeholder="Issuing Organization"
                                                    value={cert.issued_by}
                                                    onChange={(e) => handleCertificationChange(index, "issued_by", e.target.value)}
                                                    size="small"
                                                />
                                            </div>
                                            <div className="w-full sm:w-[30%]">
                                                <select
                                                    value={cert.issued_date}
                                                    onChange={(e) => handleCertificationChange(index, "issued_date", e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 h-[42px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                                                >
                                                    <option value="">Select Year</option>
                                                    {Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => {
                                                        const year = new Date().getFullYear() - i;
                                                        return (
                                                            <option key={year} value={year}>
                                                                {year}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>


                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addCertification}
                                    // disabled={form.certificates.length >= 3}
                                    className={`flex items-center font-medium mt-2 text-sm sm:text-base text-green-600`}
                                >
                                    <Add fontSize="small" className="mr-1" /> Add another Certificate
                                </button>
                            </div>
                        </div>

                        {/* Client Testimonials */}
                        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
                            {/* ... other sections like PersonalInfo, Education, etc. */}

                            {/* Client Testimonials Section */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">Client Testimonials</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                                    Share testimonials from your clients to build trust with potential new clients.
                                </p>

                                {form.testimonials.map((testimonial, index) => (
                                    <div key={index} className="mb-4 sm:mb-6">
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3">
                                            <TextField
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                placeholder="Reviewer Name"
                                                value={testimonial.client_name}
                                                onChange={(e) => handleTestimonialChange(index, "client_name", e.target.value)}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                placeholder="Organization/Company"
                                                value={testimonial.company}
                                                onChange={(e) => handleTestimonialChange(index, "company", e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <TextField
                                                fullWidth
                                                multiline
                                                minRows={3}
                                                size="small"
                                                variant="outlined"
                                                placeholder="Client testimonial (e.g., 'Working with this trainer has transformed my fitness journey. I've lost 20 pounds and gained confidence.')"
                                                value={testimonial.testimonials}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    let errors = [...testimonialErrors];
                                                    if (value.length > 200) {
                                                        errors[index] = "Only 200 characters are allowed. Please shorten your input.";
                                                    } else {
                                                        errors[index] = "";
                                                        handleTestimonialChange(index, "testimonials", value);
                                                    }
                                                    setTestimonialErrors(errors);
                                                }}
                                            />
                                            <div className="flex justify-between items-center mt-1">
                                                <div>
                                                    {testimonialErrors[index] && (
                                                        <span className="text-xs text-red-500">{testimonialErrors[index]}</span>
                                                    )}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-500">
                                                    {testimonial.testimonials.length}/200
                                                </div>
                                            </div>
                                            {form.testimonials.length > 1 && (
                                                <IconButton
                                                    className="absolute top-0 right-0 text-red-500"
                                                    onClick={() => removeTestimonial(index)}
                                                    size="small"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addTestimonial}
                                    disabled={form.testimonials.length >= 3}
                                    className={`flex items-center font-medium mt-2 text-sm sm:text-base ${form.testimonials.length >= 3 ? 'text-gray-400 cursor-not-allowed' : 'text-green-600'}`}
                                >
                                    <Add fontSize="small" className="mr-1" /> Add another Testimonial
                                </button>
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Online Presence</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Facebook */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <FacebookIcon className="text-[#1877F2] mr-2" fontSize="small" />
                                        Facebook Profile
                                    </label>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Your Facebook profile URL"
                                        variant="outlined"
                                        value={form.facebook}
                                        onChange={(e) => handleChanges('facebook', e.target.value)}
                                    />
                                </div>

                                {/* Instagram */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <InstagramIcon className="text-pink-500 mr-2" fontSize="small" />
                                        Instagram Profile
                                    </label>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Your Instagram profile URL"
                                        variant="outlined"
                                        value={form.instagram}
                                        onChange={(e) => handleChanges('instagram', e.target.value)}
                                    />
                                </div>

                                {/* LinkedIn */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <LinkedInIcon className="text-[#0077B5] mr-2" fontSize="small" />
                                        LinkedIn Profile
                                    </label>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Your LinkedIn profile URL"
                                        variant="outlined"
                                        value={form.linkedin}
                                        onChange={(e) => handleChanges('linkedin', e.target.value)}
                                    />
                                </div>

                                {/* Twitter/X */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <XIcon className="text-black mr-2" fontSize="small" />
                                        Twitter/X Profile
                                    </label>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Your Twitter/X profile URL"
                                        variant="outlined"
                                        value={form.twitter}
                                        onChange={(e) => handleChanges('twitter', e.target.value)}
                                    />
                                </div>

                                {/* Website (Single full-width row) */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <LanguageIcon className="text-gray-600 mr-2" fontSize="small" />
                                        Personal Website
                                    </label>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Your website URL (if available)"
                                        variant="outlined"
                                        value={form.personal_website}
                                        onChange={(e) => handleChanges('personal_website', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Captcha Section */}
                        {!isEdit && (
                            <div className="flex flex-col items-center">
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                                    onChange={token => {
                                        setCaptchaToken(token);
                                        console.log('reCAPTCHA token:', token);
                                    }}
                                />
                                {captchaError && (
                                    <span className="text-xs text-red-500 mt-2">{captchaError}</span>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:gap-4">
                            {isEdit && (
                                <button
                                    type="button"
                                    onClick={() => handleNavigation('/trainer-details', { 'trainer': getCurrentUserName() })}
                                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={!hasFormChanges}
                                className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 text-white rounded-lg text-sm sm:text-base ${hasFormChanges
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    } transition-colors`}
                            >
                                {isEdit ? 'Update Profile' : 'Create Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                
            </div>

            {/* Preview Overlay */}
            <TrainerProfilePreview
                isOpen={previewState.isOpen}
                onClose={() => setPreviewState({ isOpen: false })}
            />

            <Footer />
            {/* Global Popup for confirmations and alerts */}
            <Popup
                isOpen={popupState.isOpen}
                type={popupState.type}
                message={popupState.message}
                title={popupState.title}
                onClose={hidePopup}
                onConfirm={popupState.onConfirm}
                confirmText={popupState.confirmText}
                cancelText={popupState.cancelText}
            />
        </div>
    );
} 