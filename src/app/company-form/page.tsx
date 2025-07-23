'use client'

import { useState, useEffect } from 'react';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {getCategories} from '../content/categories';
import { getCurrentUserFullName, getCurrentUserMail } from '@/lib/utils/auth.utils';
import { authApis } from '@/lib/apis/auth.apis';
import { trainerApis } from '@/lib/apis/trainer.apis';
import { useNavigation } from '@/lib/hooks/useNavigation';

interface CompanyFormData {
  companyName: string;
  companyEmail: string;
  businessAddress: string;
  contactPersonName: string;
  officialEmail: string;
  mobileNumber: string;
  companyWebsite: string;
  natureOfBusiness: string;
  numberOfEmployees: string;
  trainingNeeds: string[];
  billingDetails: string;
  companyLogo: File | null;
}

export default function CompanyFormPage() {
  const { handleNavigation } = useNavigation();
  
  const [form, setForm] = useState<CompanyFormData>({
    companyName: '',
    companyEmail: '',
    businessAddress: '',
    contactPersonName: '',
    officialEmail: '',
    mobileNumber: '',
    companyWebsite: '',
    natureOfBusiness: '',
    numberOfEmployees: '',
    trainingNeeds: [],
    billingDetails: '',
    companyLogo: null
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasLogoChanged, setHasLogoChanged] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    mobileNumber?: string;
    officialEmail?: string;
  }>({});

  // Load company name and email from local storage on component mount
  useEffect(() => {
    const companyName = getCurrentUserFullName();
    const companyEmail = getCurrentUserMail();
    
    if (companyName) {
      setForm(prev => ({
        ...prev,
        companyName: companyName
      }));
    }
    
    if (companyEmail) {
      setForm(prev => ({
        ...prev,
        companyEmail: companyEmail
      }));
    }
  }, []);

  // Validation functions
  const validateMobileNumber = (value: string): string | null => {
    if (!value.trim()) return null; // Let required validation handle empty fields
    if (!/^\d{10}$/.test(value)) {
      return 'Mobile number must be exactly 10 digits';
    }
    return null;
  };

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) return null; // Let required validation handle empty fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleInputChange = (field: keyof CompanyFormData, value: string | string[] | File | null) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field errors when user starts typing
    if (field === 'mobileNumber' || field === 'officialEmail') {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    handleInputChange('mobileNumber', numericValue);
  };

  const handleFieldBlur = (field: 'mobileNumber' | 'officialEmail', value: string) => {
    let error: string | null = null;
    
    if (field === 'mobileNumber') {
      error = validateMobileNumber(value);
    } else if (field === 'officialEmail') {
      error = validateEmail(value);
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  };

  const handleTrainingNeedToggle = (need: string) => {
    setForm(prev => ({
      ...prev,
      trainingNeeds: prev.trainingNeeds.includes(need)
        ? prev.trainingNeeds.filter(item => item !== need)
        : [...prev.trainingNeeds, need]
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      
      if (file.size > maxSize) {
        setErrors(['Logo file size must be less than 10MB. Please select a smaller image.']);
        // Clear the file input
        e.target.value = '';
        return;
      }

      setHasLogoChanged(true);
      // Remove spaces from the file name
      const sanitizedFileName = file.name.replace(/\s+/g, '');
      const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });
      setForm(prev => ({ ...prev, companyLogo: sanitizedFile }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(sanitizedFile);
      
      // Clear any previous errors
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    // Scroll to top to show errors
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Basic validation
    const newErrors: string[] = [];
    if (!form.companyName.trim()) newErrors.push('Company name is required');
    if (!form.companyEmail.trim()) newErrors.push('Company email is required');
    if (!form.businessAddress.trim()) newErrors.push('Business address is required');
    if (!form.contactPersonName.trim()) newErrors.push('Contact person name is required');
    if (!form.officialEmail.trim()) newErrors.push('Official email is required');
    if (!form.mobileNumber.trim()) newErrors.push('Mobile number is required');
    if (!form.natureOfBusiness.trim()) newErrors.push('Nature of business is required');
    if (!form.numberOfEmployees.trim()) newErrors.push('Number of employees is required');
    if (form.trainingNeeds.length === 0) newErrors.push('Please select at least one training need');
    if (!form.billingDetails.trim()) newErrors.push('Billing details are required');

    // Field-specific validations
    const mobileError = validateMobileNumber(form.mobileNumber);
    const emailError = validateEmail(form.officialEmail);
    
    if (mobileError) newErrors.push(mobileError);
    if (emailError) newErrors.push(emailError);

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return; // Don't redirect, just show errors
    }

    try {
      let logoUrl = ''; // Default empty logo URL

      // Upload logo if a new file was selected
      if (form.companyLogo && hasLogoChanged) {
        const uploadResponse = await trainerApis.fileUpload.uploadProfilePicture(form.companyLogo);
        logoUrl = uploadResponse.message.file_url;
      }

      // Prepare data for API with +91 appended to mobile number
      const companyData = {
        company_email: form.companyEmail,
        address: form.businessAddress,
        primary_contact_person: form.contactPersonName,
        official_email: form.officialEmail,
        contact_number: `+91-${form.mobileNumber}`,
        nature_of_business: form.natureOfBusiness,
        company_website: form.companyWebsite,
        number_of_employees: parseInt(form.numberOfEmployees) || 0,
        tarining_needs: form.trainingNeeds.join(', '),
        gst_number: form.billingDetails,
        company_logo: logoUrl || undefined
      };

      const response = await authApis.registerCompany(companyData);
      console.log('Company registered successfully:', response);
      
      // Handle success
      setIsSuccess(true);
      setErrors([]);
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        handleNavigation('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error registering company:', error);
      setErrors(['Failed to register company. Please try again.']);
      
      // Redirect to home page after 3 seconds on error
      setTimeout(() => {
        handleNavigation('/');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme">
      <NavBar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6 lg:my-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden">
          <div className="flex flex-col justify-center items-center text-center text-white py-3 sm:py-4 lg:py-[16px] bg-theme-header">
            <h1 className="tracking-normal text-center align-middle font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-[clamp(18px,4vw,32px)]">Company Registration Form</h1>
            <p className='px-3 sm:px-4 text-sm sm:text-base'>Please provide your company details to get started</p>
          </div>

          {/* Form Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <ul className="list-disc list-inside text-red-600">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800 font-medium">Company registered successfully! Redirecting to home page...</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={`space-y-6 ${isSuccess ? 'pointer-events-none opacity-50' : ''}`}>
              
              {/* Company Logo Upload - At the top of the form */}
              <div className="rounded-xl p-4 sm:p-6 shadow-sm bg-white">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Company Logo</h3>
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-200">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs sm:text-sm">No logo</span>
                      </div>
                    )}
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm(prev => ({ ...prev, companyLogo: null }));
                          setLogoPreview('');
                          setHasLogoChanged(false);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    id="companyLogo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('companyLogo')?.click()}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    {form.companyLogo ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Maximum file size: 10MB. Supported formats: PNG, JPG, JPEG, GIF, WebP
                  </p>
                </div>
              </div>
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>

              {/* Company Email */}
              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email *
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  value={form.companyEmail}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  placeholder="Company email from signup"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">This email is pre-filled from your signup and cannot be changed</p>
              </div>

              {/* Business Address */}
              <div>
                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Registered Business Address *
                </label>
                <textarea
                  id="businessAddress"
                  value={form.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your complete business address"
                />
              </div>

              {/* Contact Person Name */}
              <div>
                <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Contact Person Name *
                </label>
                <input
                  type="text"
                  id="contactPersonName"
                  value={form.contactPersonName}
                  onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter contact person's full name"
                />
              </div>

              {/* Official Email */}
              <div>
                <label htmlFor="officialEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Official Email ID *
                </label>
                <input
                  type="email"
                  id="officialEmail"
                  value={form.officialEmail}
                  onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                  onBlur={(e) => handleFieldBlur('officialEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter official email address"
                />
                {fieldErrors.officialEmail && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.officialEmail}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-600 text-sm font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    id="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleMobileNumberChange}
                    onBlur={(e) => handleFieldBlur('mobileNumber', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                {fieldErrors.mobileNumber && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.mobileNumber}</p>
                )}
              </div>

              {/* Company Website */}
              <div>
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website (if any)
                </label>
                <input
                  type="url"
                  id="companyWebsite"
                  value={form.companyWebsite}
                  onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.yourcompany.com"
                />
              </div>

              {/* Nature of Business */}
              <div>
                <label htmlFor="natureOfBusiness" className="block text-sm font-medium text-gray-700 mb-2">
                  Nature of Business *
                </label>
                <input
                  type="text"
                  id="natureOfBusiness"
                  value={form.natureOfBusiness}
                  onChange={(e) => handleInputChange('natureOfBusiness', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Technology, Manufacturing, Services, etc."
                />
              </div>

              {/* Number of Employees */}
              <div>
                <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Employees *
                </label>
                <input
                  type="number"
                  id="numberOfEmployees"
                  value={form.numberOfEmployees}
                  onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter number of employees"
                />
              </div>

              {/* Training Needs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Needs * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getCategories('white').map((option) => (
                    <label key={option.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.trainingNeeds.includes(option.name)}
                        onChange={() => handleTrainingNeedToggle(option.name)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Billing Details */}
              <div>
                <label htmlFor="billingDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Details *
                </label>
                <textarea
                  id="billingDetails"
                  value={form.billingDetails}
                  onChange={(e) => handleInputChange('billingDetails', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter billing address and GST details"
                />
              </div>



              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    isSuccess
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : isSubmitting 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
                  disabled={isSubmitting || isSuccess}
                >
                  {isSuccess ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Submitted Successfully
                    </div>
                  ) : isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
