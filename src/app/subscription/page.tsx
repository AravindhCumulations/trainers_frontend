'use client';

import { useState } from "react";
import { SquareMinus, SquarePlus, CreditCard, Coins, Info } from "lucide-react";
import NavBar from "../../components/Navbar";
import { SubscriptionModel, SubscriptionPackage } from "../../models/subscription.models";

const showToast = (title: string, message: string, type: 'success' | 'error') => {
    alert(`${title}: ${message}`);
};

export default function SubscriptionPlans() {
    const [input, setInput] = useState("");
    const [activeTab, setActiveTab] = useState("credits");
    const subscriptionModel = new SubscriptionModel({ input });

    const handleInput = () => {
        setInput((prevInput) => (parseInt(prevInput || "0", 10) + 10).toString());
    };

    const handleInputMinus = () => {
        if (parseInt(input, 10) > 10) {
            setInput((prevInput) => (parseInt(prevInput || "0", 10) - 10).toString());
        }
    };

    const handlePayment = () => {
        const error = subscriptionModel.validate();
        if (error) {
            alert(error);
            return;
        }

        const { amount } = subscriptionModel.toJSON();
        fetch(
            `http://3.94.205.118:8000/api/method/trainer.api.create_checkout_session?amount=${amount}`,
            {
                method: "POST",
                headers: {
                    Authorization: `token a6d10becfd9dfd8:e0881f66419822c`,
                    "Content-Type": "application/json",
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.message.session_id && data.message.redirect_url) {
                    window.location.href = data.message.redirect_url;
                } else {
                    showToast(
                        "Error",
                        "Failed to create payment session: " +
                        (data.message.error || "Unknown error"),
                        "error"
                    );
                }
                setInput("");
            })
            .catch((error) => {
                console.error("Error creating payment session:", error);
                showToast("Error", "Failed to create payment session", "error");
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Choose Your Plan
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Select the perfect plan for your training needs
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-3">
                    {/* Basic Plan */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-8">
                            <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                            <p className="mt-4 text-gray-600">Perfect for individual trainers</p>
                            <p className="mt-8">
                                <span className="text-4xl font-bold text-gray-900">$29</span>
                                <span className="text-gray-600">/month</span>
                            </p>
                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">5 Profile Views</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Basic Analytics</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Email Support</span>
                                </li>
                            </ul>
                            <button className="mt-8 w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light transition">
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-primary">
                        <div className="px-6 py-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">Popular</span>
                            </div>
                            <p className="mt-4 text-gray-600">Best for growing trainers</p>
                            <p className="mt-8">
                                <span className="text-4xl font-bold text-gray-900">$79</span>
                                <span className="text-gray-600">/month</span>
                            </p>
                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Unlimited Profile Views</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Advanced Analytics</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Priority Support</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Custom Branding</span>
                                </li>
                            </ul>
                            <button className="mt-8 w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light transition">
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-8">
                            <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
                            <p className="mt-4 text-gray-600">For large organizations</p>
                            <p className="mt-8">
                                <span className="text-4xl font-bold text-gray-900">$299</span>
                                <span className="text-gray-600">/month</span>
                            </p>
                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Everything in Pro</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Dedicated Account Manager</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">Custom Integrations</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-3 text-gray-600">SLA Guarantee</span>
                                </li>
                            </ul>
                            <button className="mt-8 w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light transition">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 