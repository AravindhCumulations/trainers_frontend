"use client";

import { useState } from "react";
import { SquareMinus, SquarePlus, CreditCard, Coins, Info } from "lucide-react";
import NavBar from "../../components/Navbar";

export default function SubscriptionPlans() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("credits");

  const handleInput = () => {
    setInput((prevInput) => parseInt(prevInput || "0", 10) + 10);
  };

  const handleInputMinus = () => {
    if (parseInt(input, 10) > 10) {
      setInput((prevInput) => parseInt(prevInput || "0", 10) - 10);
    }
  };

  const handlePayment = () => {
    if (input) {
      fetch(
        `http://3.94.205.118:8000/api/method/trainer.api.create_checkout_session?amount=${input}`,
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
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      <NavBar bgColor="bg-white" />

      <div className="container mx-auto  rounded-2xl overflow-hidden flex-1 flex flex-col items-center justify-center bg-white my-12">
        {/* Page Header */}
        <div className="text-center text-white text-2xl w-full mx-auto bg-blue-700 py-8">
          <h1 className="text-4xl font-bold  bg-clip-text">
            Manage Your Credits
          </h1>
          <p className=" mt-4">
            Purchase credits to book sessions with trainers and unlock premium features
          </p>
        </div>

        <div className="w-full max-w-7xl">
          {/* Current Balance Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-16 w-16 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Coins className="text-white" size={32} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg text-gray-500 font-medium">Current Balance</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 text-transparent bg-clip-text">
                    300 Credits
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm transition">
                  View History
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Credits purchase card */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 h-20"></div>
            <div className="p-8 -mt-10">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Buy Credits</h3>
                  <div className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
                    Best Value
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Rate:</span>
                    <span className="font-medium">50 credits = $10</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-purple-500 w-3/4"></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-700 font-medium">Amount of Credits</label>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Info size={14} className="mr-1" />
                      Minimum 10 credits
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleInputMinus}
                      className={`bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-l-lg p-3 transition ${!input || parseInt(input, 10) <= 10
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                        }`}
                      disabled={!input || parseInt(input, 10) <= 10}
                    >
                      <SquareMinus size={20} />
                    </button>
                    <input
                      className="border-t border-b border-gray-200 p-3 text-center text-xl font-medium w-full focus:outline-none"
                      value={input}
                      placeholder="0"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setInput(value);
                        }
                      }}
                    />
                    <button
                      onClick={handleInput}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-r-lg p-3 transition"
                    >
                      <SquarePlus size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Total Price</p>
                    <p className="text-2xl font-bold">
                      ${input ? (parseInt(input, 10) / 5).toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Credits</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {input ? parseInt(input, 10) : 0}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!input}
                  className={`w-full py-4 rounded-xl flex items-center justify-center font-medium text-white transition ${input
                    ? "bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  <CreditCard size={20} className="mr-2" />
                  {input
                    ? `Pay $${(parseInt(input, 10) / 5).toFixed(2)} for ${input} credits`
                    : "Buy Credits"}
                </button>
              </div>

              {/* Package options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { credits: 50, price: 10, label: "Basic" },
                  { credits: 150, price: 30, label: "Popular", best: true },
                  { credits: 500, price: 100, label: "Power User" }
                ].map((pkg, index) => (
                  <div
                    key={index}
                    className={`bg-white border rounded-xl p-4 text-center hover:shadow-md transition cursor-pointer ${pkg.best ? "border-purple-500 shadow-md" : "border-gray-200"
                      }`}
                    onClick={() => setInput(pkg.credits.toString())}
                  >
                    {pkg.best && (
                      <div className="bg-purple-100 text-purple-600 text-xs rounded-full py-1 px-3 inline-block mb-2">
                        Most Popular
                      </div>
                    )}
                    <h4 className="font-medium text-gray-800">{pkg.label}</h4>
                    <p className="text-2xl font-bold my-2">{pkg.credits} credits</p>
                    <p className="text-gray-600">${pkg.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">How Credits Work</h3>
            <p className="text-gray-600 mb-6">
              Credits are the currency used on ThoughtBulb to book sessions with trainers.
              Different trainers may charge different amounts based on their expertise and session duration.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <div className="bg-orange-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-orange-600">1</span>
                </div>
                <h4 className="font-bold mb-2">Buy Credits</h4>
                <p className="text-gray-600 text-sm">Purchase credits through our secure payment system</p>
              </div>
              <div className="p-4">
                <div className="bg-purple-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-purple-600">2</span>
                </div>
                <h4 className="font-bold mb-2">Book Sessions</h4>
                <p className="text-gray-600 text-sm">Use your credits to book sessions with your preferred trainers</p>
              </div>
              <div className="p-4">
                <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-bold mb-2">Learn & Grow</h4>
                <p className="text-gray-600 text-sm">Attend your sessions and track your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}