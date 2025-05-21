'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import NavBar from '../../components/Navbar';
import { TrainerFormData, TrainerFormValidator, PersonalInfo, SocialMedia, Education, Certification } from '@/models/trainer.models';

export default function TrainerDetailsPage() {
    const router = useRouter();
    const [form, setForm] = useState<TrainerFormData>({
        personalInfo: {
            bio: '',
            experience: 0,
            location: '',
            charge: 0,
            phone: ''
        },
        education: [{ course: '', institution: '', year: '' }],
        certifications: [{ name: '', issuer: '', year: '' }],
        socialMedia: {
            facebook: '',
            instagram: '',
            linkedin: '',
            twitter: '',
            website: ''
        }
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

        // Validate form
        const validationErrors = TrainerFormValidator.validateForm(form);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log(form);

        window.location.href = "/trainer-details";


        // try {
        //     // Mock API call
        //     const response = await axios.post('https://api.example.com/trainer', form, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });

        //     if (response.data) {
        //         // Store the response data if needed
        //         localStorage.setItem('trainer_details', JSON.stringify(response.data));
        //         router.push('/trainer-dashboard');
        //     }
        // } catch (error) {
        //     console.error('Error submitting form:', error);
        //     setErrors(['Failed to submit form. Please try again.']);
        // }
    };

    return (
        <div className="min-h-screen bg-blue-100">
            <NavBar />
            <div className="container mx-auto my-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden">
                    <div className="flex flex-col justify-center items-center bg-blue-400 text-white py-[16px]">
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
                        {/* Personal Information Section */}
                        <div className="rounded-xl p-6 shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Your Bio</label>
                                    <textarea
                                        value={form.personalInfo.bio}
                                        onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
                                        placeholder="Share your training philosophy and what makes you unique..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 transition duration-200"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
                                        <input
                                            type="number"
                                            value={form.personalInfo.experience}
                                            onChange={(e) => handlePersonalInfoChange('experience', Number(e.target.value))}
                                            placeholder="Your years of experience"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Location</label>
                                        <input
                                            type="text"
                                            value={form.personalInfo.location}
                                            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                                            placeholder="Your city and country"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Hourly Rate ($)</label>
                                        <input
                                            type="number"
                                            value={form.personalInfo.charge}
                                            onChange={(e) => handlePersonalInfoChange('charge', Number(e.target.value))}
                                            placeholder="Your hourly rate"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={form.personalInfo.phone}
                                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                                            placeholder="Your contact number"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="rounded-xl p-6 shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Education</h3>
                            <div className="space-y-6">
                                {form.education.map((edu, index) => (
                                    <div key={index} className="mb-6 relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-lg font-medium text-gray-700">Education {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeEducation(index)}
                                                className="px-3 py-1 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={edu.course}
                                            onChange={(e) => handleEducationChange(index, 'course', e.target.value)}
                                            placeholder="Course"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                            placeholder="Institution"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={edu.year}
                                            onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                            placeholder="Year"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                        {index < form.education.length - 1 && (
                                            <div className="absolute bottom-[-1.5rem] left-0 right-0 h-px bg-gray-200"></div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addEducation}
                                    className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    + Add Education
                                </button>
                            </div>
                        </div>

                        {/* Certifications Section */}
                        <div className="rounded-xl p-6 shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Certifications</h3>
                            <div className="space-y-6">
                                {form.certifications.map((cert, index) => (
                                    <div key={index} className="mb-6 relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-lg font-medium text-gray-700">Certification {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeCertification(index)}
                                                className="px-3 py-1 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={cert.name}
                                            onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                            placeholder="Certification Name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={cert.issuer}
                                            onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                                            placeholder="Issuing Organization"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={cert.year}
                                            onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                                            placeholder="Year"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                        {index < form.certifications.length - 1 && (
                                            <div className="absolute bottom-[-1.5rem] left-0 right-0 h-px bg-gray-200"></div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addCertification}
                                    className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    + Add Certification
                                </button>
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="rounded-xl p-6 shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Social Media Profiles</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 rounded text-white flex items-center justify-center mr-2 text-sm bg-blue-600">f</span>
                                            Facebook Profile
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.socialMedia.facebook}
                                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                                        placeholder="Your Facebook profile URL"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 rounded text-white flex items-center justify-center mr-2 text-sm">In</span>
                                            Instagram Profile
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.socialMedia.instagram}
                                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                                        placeholder="Your Instagram profile URL"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 rounded text-white flex items-center justify-center mr-2 text-sm bg-blue-700">in</span>
                                            LinkedIn Profile
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.socialMedia.linkedin}
                                        onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                                        placeholder="Your LinkedIn profile URL"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 rounded text-white flex items-center justify-center mr-2 text-sm bg-blue-400">t</span>
                                            Twitter Profile
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.socialMedia.twitter}
                                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                                        placeholder="Your Twitter profile URL"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 rounded text-white flex items-center justify-center mr-2 text-sm bg-gray-600">W</span>
                                            Website
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.socialMedia.website}
                                        onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                                        placeholder="Your personal website URL"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Complete Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 