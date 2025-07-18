'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigation } from "@/lib/hooks/useNavigation";

export default function TermsPage() {
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
                            Terms and Conditions
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
                                These Terms and Conditions ("Terms") govern your use of the Get Pros platform, operated by THOUGHT BULB RESEARCH AND DEVELOPMENT LLP. By registering as a trainer or corporate user, you agree to these terms. Please read them carefully.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Platform Overview</h3>
                                <p className="text-gray-700">
                                    Get Pros is a matchmaking platform that connects corporates with professional trainers for learning and development needs. We do not participate in the actual training delivery. Our role is limited to facilitating connections.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Services Provided</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li><strong>For Corporates:</strong> Access to a curated database of trainers for various training domains using a credit-based system.</li>
                                    <li><strong>For Trainers:</strong> A free platform to showcase profiles and connect with potential corporate clients.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Credit System (Corporates)</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Corporates purchase credits which are used to access trainer contact details and initiate communication.</li>
                                    <li>Credits are non-transferable and subject to a validity period (as specified at the time of purchase).</li>
                                    <li>No refunds are issued for unused or expired credits.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Trainer Responsibilities</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Trainers must respond to corporate leads within 18 hours or as soon as possible.</li>
                                    <li>Trainers are expected to maintain professional conduct, clear communication, and formal behavior.</li>
                                    <li>Failure to comply may result in suspension or removal from the platform.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Code of Conduct</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Misconduct, abuse, or unprofessional behavior from either corporates or trainers will not be tolerated.</li>
                                    <li>Get Pros reserves the right to suspend or permanently remove any user violating the code of conduct.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Dispute Resolution</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>In the event of disputes regarding service quality, fraud, or unprofessional conduct, users may contact our support team.</li>
                                    <li>Get Pros will investigate and attempt to resolve issues fairly. Decisions made by the platform are final.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Limitations of Liability</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Get Pros is not responsible for the outcome, quality, or execution of training services.</li>
                                    <li>All transactions, pricing, and engagements post-matching are solely between the trainer and corporate.</li>
                                    <li>We make no guarantees about results, compatibility, or availability.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Account Termination</h3>
                                <p className="text-gray-700 mb-3">
                                    Get Pros reserves the right to suspend or terminate user accounts (corporate or trainer) without prior notice in cases of:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Misuse of the platform</li>
                                    <li>Fraud or misrepresentation</li>
                                    <li>Breach of terms</li>
                                    <li>Repeated negative feedback or complaints</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h3>
                                <p className="text-gray-700">
                                    We may revise these terms from time to time. Any changes will be updated on this page with a new effective date. Continued use of the platform after changes implies acceptance.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Governing Law</h3>
                                <p className="text-gray-700">
                                    These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Mumbai.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h3>
                                <p className="text-gray-700">
                                    For any questions or concerns, reach out to us at:
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