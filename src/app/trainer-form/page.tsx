'use client'

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import NavBar from '../../components/Navbar';
import { TrainerFormData, TrainerFormValidator, PersonalInfo, SocialMedia, Education, Certification, ProfessionalInfo, Testimonial } from '@/models/trainer.models';
import { useTheme } from '@/styles/ThemeProvider';
import Footer from '@/components/Footer';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import XIcon from '@mui/icons-material/X';
import {
    TextField,
    Grid,
    Box,
    Typography,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Button
} from '@mui/material';
import { Add, Delete, CalendarToday } from "@mui/icons-material";
import { indianCities } from "@/app/content/IndianCities";
import { languages } from "@/app/content/Languages";







export default function TrainerDetailsPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState(languages);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [form, setForm] = useState<TrainerFormData>({
        personalInfo: {
            bio: '',
            experience: 1,
            city: '',
            dob: ''
        },
        professionalInfo: {
            expertise: [],
            languages_known: "",
            hourly_rate: '',
            phone: '',
            email: ''

        },
        education: [{ course: '', institution: '', year: '' }],
        certifications: [{ name: '', issuer: '', year: '' }],
        socialMedia: {
            facebook: '',
            instagram: '',
            linkedin: '',
            twitter: '',
            website: ''
        },
        testimonials: [{ reviewer_name: '', reviewer_org: '', content: '' }]
    });

    const [errors, setErrors] = useState<string[]>([]);

    const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string | number) => {
        setForm({
            ...form,
            personalInfo: {
                ...form.personalInfo,
                [field]: value
            }
        });
    };

    const handleProfessionalInfoChange = (
        field: keyof ProfessionalInfo,
        value: string | number | string[] | number[]
    ) => {
        setForm((prevForm) => ({
            ...prevForm,
            professionalInfo: {
                ...prevForm.professionalInfo,
                [field]: value,
            },
        }));
    };


    const handleEducationChange = (index: number, field: keyof Education, value: string) => {
        const newEducation = [...form.education];
        newEducation[index] = {
            ...newEducation[index],
            [field]: value
        };
        setForm({
            ...form,
            education: newEducation
        });
    };

    const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
        const newCertifications = [...form.certifications];
        newCertifications[index] = {
            ...newCertifications[index],
            [field]: value
        };
        setForm({
            ...form,
            certifications: newCertifications
        });
    };

    const handleSocialMediaChange = (field: keyof SocialMedia, value: string) => {
        setForm({
            ...form,
            socialMedia: {
                ...form.socialMedia,
                [field]: value
            }
        });
    };
    // Testimonial handlers
    const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
        const updated = [...form.testimonials];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        setForm({ ...form, testimonials: updated });
    };

    const addTestimonial = () => {
        setForm({
            ...form,
            testimonials: [...form.testimonials, { reviewer_name: '', reviewer_org: '', content: '' }]
        });
    };

    const removeTestimonial = (index: number) => {
        const updated = [...form.testimonials];
        updated.splice(index, 1);
        setForm({ ...form, testimonials: updated });
    };
    const addEducation = () => {
        setForm({
            ...form,
            education: [...form.education, { course: '', institution: '', year: '' }]
        });
    };

    const removeEducation = (index: number) => {
        const newEducation = form.education.filter((_, i) => i !== index);
        setForm({
            ...form,
            education: newEducation
        });
    };

    const addCertification = () => {
        setForm({
            ...form,
            certifications: [...form.certifications, { name: '', issuer: '', year: '' }]
        });
    };

    const removeCertification = (index: number) => {
        const newCertifications = form.certifications.filter((_, i) => i !== index);
        setForm({
            ...form,
            certifications: newCertifications
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrors([])
        // Validate form
        const validationErrors = TrainerFormValidator.validateForm(form);


        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log(form);

        // window.location.href = "/trainer-details";
    };

    const handleLanguageSearch = (searchValue: string) => {
        setSearchTerm(searchValue);
        const filtered = languages.filter(lang =>
            lang.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredLanguages(filtered);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
            setSearchTerm('');
            setFilteredLanguages(languages);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isLanguageSelected = (lang: string) => {
        const selectedLanguages = form.professionalInfo.languages_known.split(',').map(l => l.trim());
        return selectedLanguages.includes(lang);
    };

    const handleLanguageClick = (lang: string) => {
        const selectedLanguages = form.professionalInfo.languages_known.split(',').map(l => l.trim());

        if (isLanguageSelected(lang)) {
            // Remove language if already selected
            const newLanguages = selectedLanguages.filter(l => l !== lang);
            handleProfessionalInfoChange('languages_known', newLanguages.join(', '));
        } else {
            // Add new language
            const newValue = form.professionalInfo.languages_known
                ? `${form.professionalInfo.languages_known}, ${lang}`
                : lang;
            handleProfessionalInfoChange('languages_known', newValue);
        }
    };

    return (
        <div className="min-h-screen"
            style={{ background: theme.gradients.primary }}>
            <NavBar />
            <div className="container mx-auto my-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden">
                    <div className="flex flex-col justify-center items-center text-white py-[16px]"
                        style={{ background: theme.gradients.header }}
                    >
                        <h1 className="tracking-normal text-center align-middle font-sans text-3xl font-bold text-[32px]">Complete Your Trainer Profile</h1>
                        <p>Share your expertise and credentials with potential clients</p>
                    </div>

                    {errors.length > 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
                            <ul className="list-disc list-inside text-red-600">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">


                        <div className="rounded-xl p-6 shadow-sm bg-white">
                            {/* Section Title */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Details</h3>

                            {/* Bio */}
                            <div className="mb-6">
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Your Bio
                                </label>
                                <textarea
                                    id="bio"
                                    value={form.personalInfo.bio}
                                    onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
                                    placeholder="Share your training philosophy and what makes you unique..."
                                    rows={6}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Grid Row for Experience, City, DOB */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        value={form.personalInfo.experience}
                                        onChange={(e) =>
                                            handlePersonalInfoChange('experience', Number(e.target.value))
                                        }
                                        placeholder="Your years of experience"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* City Dropdown */}
                                <div>
                                    <label
                                        htmlFor="city"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        City
                                    </label>
                                    <select
                                        id="city"
                                        value={form.personalInfo.city}
                                        onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition "
                                    >
                                        <option value="">Select your city</option>
                                        {indianCities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year of Birth */}
                                <div>
                                    <label
                                        htmlFor="dob"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Year of Birth
                                    </label>
                                    <input
                                        id="dob"
                                        type="date"
                                        max={new Date().toISOString().split('T')[0]}
                                        value={form.personalInfo.dob}
                                        onChange={(e) => handlePersonalInfoChange('dob', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Professrional Information */}
                        <div className="rounded-xl p-6 shadow-sm bg-white">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Professional Details</h3>

                            <div className="space-y-5">
                                {/* Expertise */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                                    <input
                                        type="text"
                                        value={form.professionalInfo.expertise.join(', ')}
                                        onChange={(e) => handleProfessionalInfoChange('expertise', e.target.value.split(',').map(item => item.trim()))}
                                        placeholder="Enter expertise comma seperated - ex. Management, Development.."
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Languages Known */}
                                <div className="relative" ref={dropdownRef}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages Known</label>
                                    <input
                                        type="text"
                                        value={form.professionalInfo.languages_known}
                                        readOnly
                                        placeholder="Select languages from dropdown"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        onFocus={() => setIsDropdownOpen(true)}
                                    />
                                    {isDropdownOpen && (
                                        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                            <input
                                                type="text"
                                                placeholder="Search languages..."
                                                className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none"
                                                value={searchTerm}
                                                onChange={(e) => handleLanguageSearch(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="max-h-48 overflow-y-auto">
                                                {filteredLanguages.map(lang => (
                                                    <div
                                                        key={lang}
                                                        className={`px-4 py-2 cursor-pointer flex items-center justify-between ${isLanguageSelected(lang)
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Hourly Rate */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                            <span className="text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                value={form.professionalInfo.hourly_rate}
                                                onChange={(e) => handleProfessionalInfoChange('hourly_rate', e.target.value)}
                                                placeholder="Enter hourly rate"
                                                className="w-full ml-2 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                            <span className="text-gray-500">+91</span>
                                            <input
                                                type="tel"
                                                value={form.professionalInfo.phone}
                                                onChange={(e) => handleProfessionalInfoChange('phone', e.target.value)}
                                                placeholder="Enter phone number"
                                                className="w-full ml-2 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Email ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                                        <div className="flex items-center border border-gray-300 rounded-md h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
                                            {/* Invisible prefix span to match ₹ and +91 spacing */}
                                            <span className="text-transparent select-none">--</span>
                                            <input
                                                type="email"
                                                value={form.professionalInfo.email}
                                                onChange={(e) => handleProfessionalInfoChange('email', e.target.value)}
                                                placeholder="Enter Mail ID"
                                                className="w-full ml-2 outline-none"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>





                        {/* Education & Certifications  */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Education & Certificates</h3>

                            {/* Education Section */}
                            <div className="mb-6">
                                <label className="block font-medium text-gray-700 mb-2">Education</label>

                                {form.education.map((edu, index) => (
                                    <div key={index} className="mb-6">
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

                                        <div className="flex gap-4 mt-3">
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder="Institution"
                                                value={edu.institution}
                                                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                                size="small"
                                            />
                                            <TextField
                                                variant="outlined"
                                                placeholder="Year"
                                                value={edu.year}
                                                onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <CalendarToday fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addEducation}
                                    className="flex items-center text-green-600 font-medium mt-2"
                                >
                                    <Add fontSize="small" className="mr-1" /> Add another Education
                                </button>
                            </div>

                            {/* Certificates Section */}
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Certificates</label>

                                {form.certifications.map((cert, index) => (
                                    <div key={index} className="mb-6">
                                        <div className="relative flex gap-2">
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder="Certificate Name"
                                                value={cert.name}
                                                onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                                                size="small"
                                            />
                                            {form.certifications.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeCertification(index)}
                                                    className="absolute top-0 right-0 text-red-600"
                                                    size="small"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            )}
                                        </div>

                                        <div className="flex gap-4 mt-3">
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder="Issuing Organization"
                                                value={cert.issuer}
                                                onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                                                size="small"
                                            />
                                            <TextField
                                                variant="outlined"
                                                placeholder="Year"
                                                value={cert.year}
                                                onChange={(e) => handleCertificationChange(index, "year", e.target.value)}
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <CalendarToday fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addCertification}
                                    className="flex items-center text-green-600 font-medium mt-2"
                                >
                                    <Add fontSize="small" className="mr-1" /> Add another Certificate
                                </button>
                            </div>
                        </div>

                        {/* Client Testimonials */}
                        <div className="max-w-4xl mx-auto space-y-10">
                            {/* ... other sections like PersonalInfo, Education, etc. */}

                            {/* Client Testimonials Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">Client Testimonials</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Share testimonials from your clients to build trust with potential new clients.
                                </p>

                                {form.testimonials.map((testimonial, index) => (
                                    <div key={index} className="mb-6">
                                        <div className="flex gap-4 mb-3">
                                            <TextField
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                placeholder="Reviewer Name"
                                                value={testimonial.reviewer_name}
                                                onChange={(e) => handleTestimonialChange(index, "reviewer_name", e.target.value)}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                placeholder="Organization/Company"
                                                value={testimonial.reviewer_org}
                                                onChange={(e) => handleTestimonialChange(index, "reviewer_org", e.target.value)}
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
                                                value={testimonial.content}
                                                onChange={(e) => handleTestimonialChange(index, "content", e.target.value)}
                                            />
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
                                    className="flex items-center text-green-600 font-medium mt-2"
                                >
                                    <Add fontSize="small" className="mr-1" /> Add another Testimonial
                                </button>
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Online Presence</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        value={form.socialMedia.facebook}
                                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
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
                                        value={form.socialMedia.instagram}
                                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
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
                                        value={form.socialMedia.linkedin}
                                        onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
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
                                        value={form.socialMedia.twitter}
                                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                                    />
                                </div>

                                {/* Website (Single full-width row) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <LanguageIcon className="text-gray-600 mr-2" fontSize="small" />
                                        Personal Website
                                    </label>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Your website URL (if available)"
                                        variant="outlined"
                                        value={form.socialMedia.website}
                                        onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>




                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg bg-primary hover:bg-primary-hover transition-colors"
                            // style={{ background: theme.button.primary }}
                            >
                                Complete Your Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
} 