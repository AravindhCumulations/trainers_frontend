'use client';

import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import { FaWallet, FaPlus, FaMinus } from 'react-icons/fa';
import { useTheme } from '@/styles/ThemeProvider';
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
    const { theme } = useTheme();
    const [buyAmount, setBuyAmount] = useState(10);
    const { user,updateCredits } = useUser();
    const [credits, setCredits] = useState(0); // Initialize with 0
    const { toastSuccess, toastError, popupState, hidePopup } = usePopup();
    

    // Synchronize credits with user?.credits whenever user changes
    useEffect(() => {
        if (user?.credits !== undefined) {
            setCredits(user.credits);
        }
    }, [user]);

    const handleBuyAmountChange = (amount: number) => {
        
        
        setBuyAmount(Math.max(0, buyAmount + amount));
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
          // Send amount to backend to create Razorpay order

          const username = user?.email 

          console.log("Creating order for user:", username, "with total price:", totalPrice);
          
          const orderRes = await creditsApis.createOrder(username,totalPrice); 
    
          const { order_id, amount, currency } = orderRes.message;

          console.log("Order created:", order_id, amount, currency);
          
    
          const options = {
            key: "rzp_test_vDdkzfTjLyxvam", // Replace with your Razorpay key_id
            amount: amount.toString(),
            currency: currency,
            name: "Trainer Credits",
            description: `${credits} Credits Purchase`,
            order_id: order_id,
            handler: async function (response: RazorpayResponse) {
              toastSuccess(`Payment successful!`);
              console.log("Payment ID:", response.razorpay_payment_id);
              console.log("Order ID:", response.razorpay_order_id);
              console.log("Signature:", response.razorpay_signature);

                // Call your backend to verify payment and update user credits
                try {
                    const verifyRes = await creditsApis.verifyPaymentAndUpdateCredits(
                        response.razorpay_payment_id,
                        response.razorpay_order_id,
                        response.razorpay_signature
                    );

                    if (verifyRes.message.status === 'success') {
                        console.log("Payment verified and credits updated:", verifyRes.message.credits);
                        updateCredits()
                        toastSuccess(`Successfully purchased ${buyAmount} credits!`);
                    } else {
                        alert("Failed to update credits.");
                        toastError(`Failed to update credits.`);
                    }
                }
                catch (error) {
                    toastError(`An error occurred while verifying payment.`);

                }
    
              // TODO: Call your backend to verify payment and update user credits
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

    

    return (
        <div className="bg-[#F0F4F8] min-h-screen font-sans">
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

            <div className="bg-blue-100 py-4">
                <div className="w-[1024px] mx-auto bg-white my-4 rounded-2xl overflow-hidden">
                    <div
                        className="bg-gradient-to-r text-white py-4 px-6 text-center"
                        style={{ background: theme.gradients.header }}
                    >
                        <h1 className="text-[32px] font-bold mb-2">Manage Your Credits</h1>
                        <p className="text-[16px] text-white/90">
                            Purchase credits to book sessions with trainers and unlock premium features
                        </p>
                    </div>

                    <div className="max-w-[900px] mx-auto relative p-8">
                        {/* Balance */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[14px] text-[#6B7280] mb-2">Current Balance</p>
                                    <div className="flex items-center gap-[12px]">
                                        <svg width="30" height="33" viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.9993 32.4864L0.416016 24.3935V8.20767L14.9993 0.114746L29.5827 8.20767V24.3935L14.9993 32.4864ZM10.246 12.2302C10.853 11.5421 11.5677 11.0068 12.3902 10.6243C13.213 10.2418 14.0827 10.0506 14.9993 10.0506C15.916 10.0506 16.7857 10.2418 17.6085 10.6243C18.431 11.0068 19.1457 11.5421 19.7527 12.2302L25.6823 8.92558L14.9993 2.98641L4.31643 8.92558L10.246 12.2302ZM13.7493 28.9222V22.4385C12.2813 22.1135 11.081 21.3806 10.1485 20.2397C9.21574 19.0986 8.74935 17.7856 8.74935 16.3006C8.74935 15.9631 8.77129 15.6463 8.81518 15.3502C8.85879 15.0543 8.93296 14.7514 9.03768 14.4414L2.91602 11.0122V22.916L13.7493 28.9222ZM14.9993 20.0506C16.0443 20.0506 16.9306 19.6868 17.6581 18.9593C18.3856 18.2318 18.7493 17.3456 18.7493 16.3006C18.7493 15.2556 18.3856 14.3693 17.6581 13.6418C16.9306 12.9143 16.0443 12.5506 14.9993 12.5506C13.9543 12.5506 13.0681 12.9143 12.3406 13.6418C11.6131 14.3693 11.2493 15.2556 11.2493 16.3006C11.2493 17.3456 11.6131 18.2318 12.3406 18.9593C13.0681 19.6868 13.9543 20.0506 14.9993 20.0506ZM16.2493 28.9222L27.0827 22.916V11.0122L20.961 14.4414C21.0657 14.7514 21.1399 15.0543 21.1835 15.3502C21.2274 15.6463 21.2493 15.9631 21.2493 16.3006C21.2493 17.7856 20.783 19.0986 19.8502 20.2397C18.9177 21.3806 17.7174 22.1135 16.2493 22.4385V28.9222Z" fill="#3B82F6" />
                                        </svg>
                                        <p className="text-[24px] font-semibold text-[#4F80FF]">{credits} Credits</p>
                                    </div>
                                </div>
                                <button className="text-sm px-4 py-2 rounded-md shadow bg-gray-100 hover:bg-gray-200">
                                    View History
                                </button>
                            </div>
                        </div>

                        {/* Buy Section */}
                        <div className="p-4 pb-6">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h2 className="text-[20px] font-semibold text-[#1F2937] mb-6">Buy Credits</h2>

                                {/* Rate Info */}
                                <div className="mb-8">
                                    <p className="text-[14px] text-[#1F2937] mb-3">Rate:</p>
                                    <div className="relative mb-4">
                                        <div className="h-1 bg-[#E5E7EB] rounded-full">
                                            <div className="h-1 bg-[#4F80FF] rounded-full w-1/3"></div>
                                        </div>
                                        <span className="absolute -top-20 right-0 text-[12px] font-medium text-[#4F80FF] bg-[#E0E7FF] px-2 py-0.5 rounded-full">Best Value</span>
                                        <span className="absolute -top-8 right-0 text-[14px] text-[#1F2937]">50 credits = ₹10</span>
                                    </div>
                                </div>

                                {/* Input */}
                                <div className="flex flex-col justify-between items-center mb-6">
                                    <div className='w-full'>
                                        <div className="flex justify-between items-end">
                                            <p className="text-[14px] text-[#1F2937] mb-2">Amount of Credits</p>
                                            <div className="text-[14px] text-[#6B7280] mt-6">Minimum 10 credits</div>
                                        </div>
                                        <div className="flex items-center border border-[#E5E7EB] rounded-md overflow-hidden w-full">
                                            <button
                                                className="p-3 hover:bg-[#F3F4F6] disabled:opacity-50"
                                                onClick={() => handleBuyAmountChange(-10)}
                                                disabled={buyAmount <= 0}
                                            >
                                                <FaMinus className="text-[#4B5563]" />
                                            </button>
                                            <div className="flex-grow text-center text-[20px] font-medium text-[#1F2937] px-4">{buyAmount}</div>
                                            <button
                                                className="p-3 hover:bg-[#F3F4F6]"
                                                onClick={() => handleBuyAmountChange(10)}
                                            >
                                                <FaPlus className="text-[#4B5563]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-[14px] text-[#1F2937]">Total Price</p>
                                        <p className="text-[24px] font-semibold text-[#1F2937]">₹{totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[14px] text-[#1F2937]">Total Credits</p>
                                        <p className="text-[24px] font-semibold text-[#4F80FF]">{buyAmount}</p>
                                    </div>
                                </div>

                                {/* Razorpay Button */}
                                <button
                                    className="w-full bg-[#4F80FF] hover:bg-[#3b65cc] text-white py-3 rounded-lg text-[16px] font-medium flex items-center justify-center transition-colors"
                                    onClick={handlePayment}
                                    disabled={buyAmount < 10}
                                >
                                    <FaWallet className="mr-2" />
                                    Buy Credits
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <section className="w-full bg-white py-16 px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How Credits Work</h2>
                <p className="text-gray-600 max-w-3xl mx-auto mb-12 text-base md:text-lg">
                    Credits are the currency used on ThoughtBulb to book sessions with trainers. Different trainers may charge
                    different amounts based on their expertise and session duration.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-10">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center max-w-xs">
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-lg font-bold mb-4">1</div>
                        <h3 className="font-bold text-lg mb-1">Buy Credits</h3>
                        <p className="text-gray-600 text-sm">Purchase credits through our secure payment system</p>
                    </div>
                    {/* Step 2 */}
                    <div className="flex flex-col items-center max-w-xs">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-lg font-bold mb-4">2</div>
                        <h3 className="font-bold text-lg mb-1">Book Sessions</h3>
                        <p className="text-gray-600 text-sm">Use your credits to book sessions with your preferred trainers</p>
                    </div>
                    {/* Step 3 */}
                    <div className="flex flex-col items-center max-w-xs">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg font-bold mb-4">3</div>
                        <h3 className="font-bold text-lg mb-1">Learn & Grow</h3>
                        <p className="text-gray-600 text-sm">Attend your sessions and track your progress</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ManageCredits;
