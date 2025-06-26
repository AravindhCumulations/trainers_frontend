'use client';

import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import { FaWallet, FaPlus, FaMinus, FaHistory, FaCoins } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import { creditsApis } from '@/lib/apis/credits.apis';
import { usePopup } from '@/lib/hooks/usePopup';
import Popup from '@/components/Popup';

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

const ManageCredits = () => {
    const [buyAmount, setBuyAmount] = useState(10);
    const { user, updateCredits } = useUser();
    const [credits, setCredits] = useState(0);
    const { toastSuccess, toastError, popupState, hidePopup } = usePopup();
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Synchronize credits with user?.credits whenever user changes
    useEffect(() => {
        if (user?.credits !== undefined) {
            setCredits(user.credits);
        }
    }, [user]);

    const handleBuyAmountChange = (amount: number) => {
        setBuyAmount(Math.max(10, buyAmount + amount));
        console.log(buyAmount);
    };

    const totalPrice = buyAmount * 5;

    const loadRazorpayScript = () => {
        return new Promise(resolve => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            alert("Razorpay SDK failed to load.");
            return;
        }

        try {
            const username = user?.email

            console.log("Creating order for user:", username, "with total price:", totalPrice);

            const orderRes = await creditsApis.createOrder(username, totalPrice);

            const { order_id, amount, currency } = orderRes.message;

            console.log("Order created:", order_id, amount, currency);

            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKey) {
                toastError("Razorpay configuration is missing");
                return;
            }

            const options = {
                key: razorpayKey,
                amount: amount.toString(),
                currency: currency,
                name: "Trainer Credits",
                description: `${buyAmount} Credits Purchase`,
                order_id: order_id,
                handler: async function (response: RazorpayResponse) {
                    toastSuccess(`Payment successful!`);
                    console.log("Payment ID:", response.razorpay_payment_id);
                    console.log("Order ID:", response.razorpay_order_id);
                    console.log("Signature:", response.razorpay_signature);

                    try {
                        const verifyRes = await creditsApis.verifyPaymentAndUpdateCredits(
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            response.razorpay_signature
                        );

                        if (verifyRes.message.status === 'success') {
                            console.log("Payment verified and credits updated:", verifyRes.message.credits);
                            try {
                                await updateCredits(); // Handle this separately
                            } catch (creditUpdateErr) {
                                console.error("Failed to update credits:", creditUpdateErr);
                                toastError("Failed to update your credits.");
                            }
                            toastSuccess(`Successfully purchased ${buyAmount} credits!`);
                        } else {
                            alert("Failed to update credits.");
                            toastError(`Failed to update credits.`);
                        }
                    }
                    catch (error) {
                        toastError(`An error occurred while verifying payment.`);
                    }
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            toastError(`Error creating Razorpay order.`);
        }
    };

    const handleShowHistory = async () => {
        if (!showHistory) { // Only fetch if opening
            setLoadingHistory(true);
            try {
                const res = await creditsApis.getCreditTransactionHistory();
                setHistory(res.data || []);
            } catch (err) {
                toastError("Failed to load credit history.");
            }
            setLoadingHistory(false);
        }
        setShowHistory(!showHistory);
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
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
            <NavBar bgColor="bg-white" />

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Manage Your
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Credits</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Purchase credits to book sessions with trainers and unlock premium features
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl my-2 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Balance & Purchase */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Current Balance Card */}
                        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="relative p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Current Balance</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                                <FaCoins className="text-white text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold text-gray-900">{credits}</p>
                                                <p className="text-sm text-gray-500">Credits Available</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className={`px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center ${showHistory ? 'ring-2 ring-blue-400' : ''}`}
                                        onClick={handleShowHistory}
                                    >
                                        <FaHistory className="mr-2 inline" />
                                        {showHistory ? 'Hide History' : 'View History'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Expandable Credit History Tab */}
                        <div
                            className={`transition-all duration-300 overflow-hidden ${showHistory ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'} bg-white rounded-2xl shadow border border-gray-100`}
                            style={{ minHeight: showHistory ? '120px' : '0px' }}
                        >
                            <div className="p-2">
                                <h2 className="text-xl font-bold mb-4 flex items-center">
                                    <FaHistory className="mr-2" /> Credit History
                                </h2>
                                {loadingHistory ? (
                                    <div className="text-center py-8">Loading...</div>
                                ) : history.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">No history found.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="py-2 px-4 text-left">Type</th>
                                                    <th className="py-2 px-4 text-left">Credits</th>
                                                    <th className="py-2 px-4 text-left">Amount</th>
                                                    <th className="py-2 px-4 text-left">Reference Trainer</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {history.map((item, idx) => (
                                                    <tr key={idx} className="border-b last:border-none">
                                                        <td className="py-2 px-4">{item.transaction_type}</td>
                                                        <td className="py-2 px-4">{item.credits}</td>
                                                        <td className="py-2 px-4">₹{item.amount}</td>
                                                        <td className="py-2 px-4">{item.reference_trainer || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Purchase Credits Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Buy Credits</h2>
                                <p className="text-blue-100">Invest in your learning journey</p>
                            </div>

                            <div className="p-8">
                                {/* Pricing Info */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Exchange Rate</p>
                                            <p className="text-2xl font-bold text-gray-900">50 Credits = ₹10</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                            <span className="mr-1">🔥</span>
                                            Best Value
                                        </div>
                                    </div>
                                </div>

                                {/* Credit Amount Selector */}
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-sm font-medium text-gray-700">Amount of Credits</label>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Min. 10 credits</span>
                                    </div>

                                    <div className="flex items-center bg-gray-50 rounded-2xl p-2">
                                        <button
                                            className="w-12 h-12 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                            onClick={() => handleBuyAmountChange(-10)}
                                            disabled={buyAmount <= 10}
                                        >
                                            <FaMinus className="text-gray-600" />
                                        </button>
                                        <div className="flex-1 text-center">
                                            <span className="text-3xl font-bold text-gray-900">{buyAmount}</span>
                                            <p className="text-xs text-gray-500">Credits</p>
                                        </div>
                                        <button
                                            className="w-12 h-12 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center hover:scale-105"
                                            onClick={() => handleBuyAmountChange(10)}
                                        >
                                            <FaPlus className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Select Options */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <button
                                        className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 hover:scale-105"
                                        onClick={() => setBuyAmount(50)}
                                    >
                                        <p className="font-bold text-blue-600">50</p>
                                        <p className="text-xs text-blue-500">Credits</p>
                                    </button>
                                    <button
                                        className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-200 hover:scale-105"
                                        onClick={() => setBuyAmount(100)}
                                    >
                                        <p className="font-bold text-purple-600">100</p>
                                        <p className="text-xs text-purple-500">Credits</p>
                                    </button>
                                    <button
                                        className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-xl transition-all duration-200 hover:scale-105"
                                        onClick={() => setBuyAmount(200)}
                                    >
                                        <p className="font-bold text-pink-600">200</p>
                                        <p className="text-xs text-pink-500">Credits</p>
                                    </button>
                                </div>

                                {/* Purchase Summary */}
                                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600">Total Credits:</span>
                                        <span className="font-bold text-blue-600">{buyAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Price:</span>
                                        <span className="text-2xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Purchase Button */}
                                <button
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    onClick={handlePayment}
                                    disabled={buyAmount < 10}
                                >
                                    <FaWallet className="mr-2 inline" />
                                    Buy Credits
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - How It Works */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Buy Credits</h4>
                                        <p className="text-sm text-gray-600">Purchase credits through our secure payment system</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Unlock Access</h4>
                                        <p className="text-sm text-gray-600">View trainer contact details instantly with your credits</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Learn & Grow</h4>
                                        <p className="text-sm text-gray-600">Discover workshops and upskill with top trainers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ManageCredits;