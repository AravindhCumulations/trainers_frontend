'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBar from '../../components/Navbar';

export default function TrainerDetailsPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        bio: '',
        experience: 0,
        expertise: [''],
        certifications: [''],
        location: '',
        languages: [''],
        workshops: [''],
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        website: '',
        age: 0,
        charge: 0,
        phone: '',
        // New fields
        clients: [''],
        certificates: [''],
        education: [{ course: '', institution: '', year: '' }]
    });

    const handleChange = (index, field, value, subfield = null) => {
        if (field === 'education' && subfield) {
            const newValues = [...form.education];
            newValues[index][subfield] = value;
            setForm({ ...form, education: newValues });
        } else {
            const newValues = [...form[field]];
            newValues[index] = value;
            setForm({ ...form, [field]: newValues });
        }
    };

    const addField = (field) => {
        setForm({
            ...form,
            [field]: [
                ...form[field],
                field === 'education' ? { course: '', institution: '', year: '' } : ''
            ]
        });
    };

    const removeField = (field, index) => {
        const newValues = form[field].filter((_, i) => i !== index);
        setForm({
            ...form,
            [field]: newValues
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        router.push('/trainer-dashboard');
    };

    return (
        <div className="bg-blue-100 ">
            <NavBar bgColor="bg-white" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-5xl mx-auto py-8 "
            >
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8" style={{ backgroundColor: "#3B82F6" }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white text-center" >Complete Your Trainer Profile</h2>
                        <p className="text-white/80 text-center mt-2">Share your expertise and credentials with potential clients</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                        {/* Bio Section */}
                        <div className=" rounded-xl p-6 shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                Personal Information
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Your Bio</label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                        placeholder="Share your training philosophy and what makes you unique..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 transition duration-200"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={form.experience}
                                            onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                            placeholder="Years of experience"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">City</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={form.location}
                                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            placeholder="Select your city"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={form.age}
                                            onChange={(e) => setForm({ ...form, age: e.target.value })}
                                            placeholder="Your age"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Section */}
                        <div className="rounded-xl p-6 shadow-sm Professional-details">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                Professional Details
                            </h3>

                            <div className="space-y-6">
                                {["expertise", "languages"].map(field => (
                                    <div key={field} className="mb-6">
                                        <label className="block text-gray-700 font-medium mb-2 capitalize">{field}</label>
                                        {form[field].map((item, index) => (
                                            <div key={index} className="flex gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => handleChange(index, field, e.target.value)}
                                                    placeholder={`Enter ${field}`}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}



                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Hourly Rate ($)</label>
                                        <input
                                            type="number"
                                            name="charge"
                                            value={form.charge}
                                            onChange={(e) => setForm({ ...form, charge: e.target.value })}
                                            placeholder="Your hourly rate"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="Your contact number"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Education Section - NEW */}
                        <div className=" rounded-xl p-6 shadow-sm education">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                Education & Certificates
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Education</label>
                                    {form.education.map((edu, index) => (
                                        <div key={index} className="mb-3">
                                            <input
                                                type="text"
                                                value={edu.course}
                                                onChange={(e) => handleChange(index, 'education', e.target.value, 'course')}
                                                placeholder="Course"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-2"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={edu.institution}
                                                    onChange={(e) => handleChange(index, 'education', e.target.value, 'institution')}
                                                    placeholder="Institution"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                />
                                                <div className="relative w-1/3">
                                                    <input
                                                        type="text"
                                                        value={edu.year}
                                                        onChange={(e) => handleChange(index, 'education', e.target.value, 'year')}
                                                        placeholder="Year"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-10"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a.75.75 0 00.75-.75V7.5a.75.75 0 00-.75-.75h-15a.75.75 0 00-.75.75v12.75c0 .414.336.75.75.75z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeField('education', index)}
                                                        className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => addField('education')}
                                        className="flex gap-1 justify-center items-center w-[max-content] hover:cursor-pointer mt-2"
                                    >
                                        <p className="w-4 h-4 flex gap-1 bg-green-500 rounded-full text-center p-1 text-white font-bold text-sm justify-center items-center">
                                            +
                                        </p>
                                        <p className="text-green-500 font-normal"> Add another Education </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Certificates</label>
                                    {form.certificates.map((cert, index) => (
                                        <div key={index} className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={cert}
                                                onChange={(e) => handleChange(index, 'certificates', e.target.value)}
                                                placeholder="Certificate name, Issuing organization, Year (e.g., NASM CPT, National Academy of Sports Medicine, 2019)"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeField('certificates', index)}
                                                    className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => addField('certificates')}
                                        className="flex gap-1 justify-center items-center w-[max-content] hover:cursor-pointer mt-2"
                                    >
                                        <p className="w-4 h-4 flex gap-1 bg-green-500 rounded-full text-center p-1 text-white font-bold text-sm justify-center items-center cursor-pointer">
                                            +
                                        </p>
                                        <p className="text-green-500 font-normal"> Add another Certificate </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client Testimonials Section - NEW */}
                        <div className="rounded-xl p-6 shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                Client Testimonials
                            </h3>

                            <div className="space-y-4">
                                <p className="text-gray-600">Share testimonials from your clients to build trust with potential new clients.</p>

                                {form.clients.map((client, index) => (
                                    <div key={index} className="flex flex-col gap-2 mb-3">
                                        <div className="flex gap-2">
                                            <textarea
                                                value={client}
                                                onChange={(e) => handleChange(index, 'clients', e.target.value)}
                                                placeholder="Client name and testimonial (e.g., 'John D. - Working with this trainer has transformed my fitness journey. I've lost 20 pounds and gained confidence.')"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 transition duration-200"
                                            ></textarea>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeField('clients', index)}
                                                    className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors h-fit"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div
                                    onClick={() => addField('clients')}
                                    className="flex gap-1 justify-center items-center w-[max-content] hover:cursor-pointer mt-2"
                                >
                                    <p className="w-4 h-4 flex gap-1 bg-green-500 rounded-full text-center p-1 text-white font-bold text-sm justify-center items-center cursor-pointer">
                                        +
                                    </p>
                                    <p className="text-green-500 font-normal"> Add another Testimonial </p>
                                </div>

                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="rounded-xl p-6 shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                Online Presence
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center mr-2 text-sm">f</span>
                                            Facebook Profile
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.facebook}
                                        onChange={(e) => setForm({ ...form, facebook: e.target.value })}
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
                                        value={form.instagram}
                                        onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                                        placeholder="Your Instagram profile URL"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 bg-blue-700 rounded text-white flex items-center justify-center mr-2 text-sm">in</span>
                                            LinkedIn Profile
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.linkedin}
                                        onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                                        placeholder="Your LinkedIn profile URL"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 bg-black rounded text-white flex items-center justify-center mr-2 text-sm">X</span>
                                            Twitter/X Profile
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.twitter}
                                        onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                                        placeholder="Your Twitter/X profile URL"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <span className="flex items-center">
                                            <span className="w-6 h-6 bg-gray-700 rounded text-white flex items-center justify-center mr-2 text-sm">🌐</span>
                                            Personal Website
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.website}
                                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                                        placeholder="Your website URL (if available)"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full text-white text-lg font-semibold px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                style={{ backgroundColor: "#3B82F6" }}

                            >
                                Complete Your Profile
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}