'use client'

import { useState } from 'react';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface CompanyFormData {
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

const trainingOptions = [
  'Leadership',
  'Sales',
  'POSH',
  'Customer Service',
  'Communication',
  'Team Building',
  'Conflict Resolution',
  'Time Management',
  'Project Management',
  'Digital Marketing'
];

export default function CompanyFormPage() {
  const [form, setForm] = useState<CompanyFormData>({
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

  const handleInputChange = (field: keyof CompanyFormData, value: string | string[] | File | null) => {
    setForm(prev => ({
      ...prev,
      [field]: value
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
      setForm(prev => ({ ...prev, companyLogo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    // Basic validation
    const newErrors: string[] = [];
    if (!form.businessAddress.trim()) newErrors.push('Business address is required');
    if (!form.contactPersonName.trim()) newErrors.push('Contact person name is required');
    if (!form.officialEmail.trim()) newErrors.push('Official email is required');
    if (!form.mobileNumber.trim()) newErrors.push('Mobile number is required');
    if (!form.natureOfBusiness.trim()) newErrors.push('Nature of business is required');
    if (!form.numberOfEmployees.trim()) newErrors.push('Number of employees is required');
    if (form.trainingNeeds.length === 0) newErrors.push('Please select at least one training need');
    if (!form.billingDetails.trim()) newErrors.push('Billing details are required');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission here
    console.log('Form submitted:', form);
    // Add your API call here
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter official email address"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  value={form.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter mobile number"
                />
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
                <select
                  id="numberOfEmployees"
                  value={form.numberOfEmployees}
                  onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select number of employees</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-100">51-100</option>
                  <option value="101-500">101-500</option>
                  <option value="501-1000">501-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>

              {/* Training Needs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Needs * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {trainingOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.trainingNeeds.includes(option)}
                        onChange={() => handleTrainingNeedToggle(option)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
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

              {/* Company Logo */}
              <div>
                <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="companyLogo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {logoPreview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Submit
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
