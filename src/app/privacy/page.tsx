'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigation } from "@/lib/hooks/useNavigation";

export default function PrivacyPage() {
    const { handleNavigation } = useNavigation();

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <Navbar />
            
            <main className="flex-1 py-8 px-4 md:px-8 lg:px-16">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-12">
                    <div className="mb-8">
                        <button
                            onClick={() => handleNavigation('/')}
                            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </button>
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                            Privacy Policy
                        </h2>
                        <p className="text-gray-600 mb-8">
                            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <div className="mb-6">
                            <p className="text-gray-700 mb-4">
                                <strong>Platform:</strong> Get Pros<br />
                                <strong>Website:</strong> trainersmart.com
                            </p>
                            <p className="text-gray-700">
                                Get Pros ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you use our platform.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
                                <p className="text-gray-700 mb-3">
                                    We collect the following personal information during the signup process:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Full Name</li>
                                    <li>Email Address</li>
                                    <li>Phone Number</li>
                                    <li>Company Name (if applicable)</li>
                                    <li>Address</li>
                                    <li>Payment Information (for credit purchases by corporates)</li>
                                    <li>Trainer's Profile</li>
                                    <li>Qualifications</li>
                                    <li>Certifications</li>
                                </ul>
                                <p className="text-gray-700 mt-3">
                                    We collect data solely for registration and operational purposes. No additional data is collected beyond what is required to access the platform.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
                                <p className="text-gray-700 mb-3">We use your information to:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Register and manage your account</li>
                                    <li>Facilitate connections between corporates and trainers</li>
                                    <li>Process payments and credit usage (for corporates)</li>
                                    <li>Communicate with you regarding updates, promotions, and marketing (you can opt out anytime)</li>
                                    <li>Provide customer support</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Data Sharing and Disclosure</h3>
                                <p className="text-gray-700">
                                    We do not share your personal information with any third parties for marketing or unrelated services. Your data is used only for the purposes stated in this policy.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies and Tracking</h3>
                                <p className="text-gray-700">
                                    Get Pros does not use cookies or other tracking technologies to collect data.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Data Storage and Security</h3>
                                <p className="text-gray-700">
                                    All personal information is stored securely on third-party servers with industry-standard protection mechanisms in place. We take appropriate measures to prevent unauthorized access, loss, misuse, or alteration of your data.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">6. User Rights: Access, Edit, and Deletion</h3>
                                <p className="text-gray-700">
                                    You can view, edit, or delete your personal information anytime through your account dashboard or by contacting us directly. We honor all user requests regarding data removal in compliance with applicable laws.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Marketing and Communication</h3>
                                <p className="text-gray-700">
                                    We may send occasional updates, promotional messages, and service-related communications. You can unsubscribe from marketing emails at any time using the "Unsubscribe" link in the email.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Children's Privacy</h3>
                                <p className="text-gray-700">
                                    Get Pros is not intended for individuals under the age of 18. We do not knowingly collect data from minors.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Policy Updates</h3>
                                <p className="text-gray-700">
                                    We may update this Privacy Policy occasionally. All changes will be posted on this page with a revised effective date. We encourage users to review the policy periodically.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h3>
                                <p className="text-gray-700">
                                    If you have any questions or concerns about this Privacy Policy or your data, please contact us at:
                                </p>
                                <p className="text-gray-700 mt-2">
                                    📧 Email: <a href="mailto:hi@thethoughtbulb.com" className="text-blue-600 hover:text-blue-800 underline">hi@thethoughtbulb.com</a>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
} 