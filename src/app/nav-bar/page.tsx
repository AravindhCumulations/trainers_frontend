"use client"

import { useEffect, useState } from "react";
import { ChevronDownIcon, LogOutIcon, UserIcon, WalletIcon } from "lucide-react";
import { style } from "framer-motion/client";

interface NavBarProps {
    bgColor?: string;
}

const NavBar = ({ bgColor = "bg-white" }: NavBarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [credit, setCredit] = useState(0);
    const [logged_in, setLogged_in] = useState(false);
    const url = "http://3.94.205.118:8000";

    useEffect(() => {
        // Check if user is logged in on component mount
        const userDetails = localStorage.getItem("user_details");
        const isUserLoggedIn = !!userDetails;
        setLogged_in(isUserLoggedIn);

        // Only fetch credits if user is logged in
        if (isUserLoggedIn) {
            credits();
        }
    }, []);

    const handleSubscription = () => {
        window.location.href = "/subscription"
    }

    const handleLogin = () => {
        window.location.href = "/login";
    }

    const handleSignup = () => {
        window.location.href = "/signup";
    }

    const handleLogout = () => {
        localStorage.removeItem('user_details');
        localStorage.removeItem('auth');
        setLogged_in(false);
        window.location.href = '/';
    };

    const handleProfile = () => {
        window.location.href = "/profile";
    }

    const credits = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user_details") || '{}');
            if (!user || !user.email) return;

            fetch(`/api/resource/Credits?fields=["credits"]&filters=${encodeURIComponent(JSON.stringify({ "user": user.email }))}`, {
                method: 'GET',
                headers: {
                    'Authorization': `token a6d10becfd9dfd8:e0881f66419822c`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data && data.data && data.data.length > 0) {
                        setCredit(data.data[0].credits);
                    }
                })
                .catch(error => {
                    console.error('Error fetching credits:', error);
                });
        } catch (error) {
            console.error('Error parsing user details:', error);
        }
    }

    const handleHome = () => {
        if (!logged_in) {
            window.location.href = '/';
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("user_details") || '{}');
            if (user && user.user_type === "Trainer") {
                window.location.href = '/details-page';
            } else {
                window.location.href = '/afterlogin';
            }
        } catch (error) {
            console.error('Error parsing user details:', error);
            window.location.href = '/';
        }
    }

    return (
        <>
            {/* Navbar */}
            <header className={`w-full mx-auto text-white px-0 flex flex-col items-center relative z-10 ${bgColor}`}>
                <nav className="w-full max-w-[calc(100%-172px)] mx-auto flex items-center justify-between py-4 px-6 text-blue-600">
                    <div className="text-[24px] font-extrabold tracking-tight">Trainer's Mart</div>
                    {!logged_in ? (
                        <div className="flex items-center gap-4">
                            <button className="font-medium text-base cursor-pointer" onClick={handleLogin}>Login</button>
                            <button className="bg-blue-600 text-white px-5 py-1.5 rounded-full font-semibold text-base shadow-sm hover:bg-blue-50 transition cursor-pointer">Sign Up</button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex items-start gap-2">
                                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 19.7116L0.25 14.8558V5.14433L9 0.288574L17.75 5.14433V14.8558L9 19.7116ZM6.148 7.55783C6.51217 7.14499 6.941 6.82383 7.4345 6.59433C7.92817 6.36483 8.45 6.25008 9 6.25008C9.55 6.25008 10.0718 6.36483 10.5655 6.59433C11.059 6.82383 11.4878 7.14499 11.852 7.55783L15.4098 5.57508L9 2.01158L2.59025 5.57508L6.148 7.55783ZM8.25 17.5731V13.6828C7.36917 13.4878 6.649 13.0481 6.0895 12.3636C5.52983 11.6789 5.25 10.8911 5.25 10.0001C5.25 9.79757 5.26317 9.60749 5.2895 9.42983C5.31567 9.25233 5.36017 9.07058 5.423 8.88458L1.75 6.82708V13.9693L8.25 17.5731ZM9 12.2501C9.627 12.2501 10.1588 12.0318 10.5953 11.5953C11.0317 11.1588 11.25 10.6271 11.25 10.0001C11.25 9.37308 11.0317 8.84132 10.5953 8.40483C10.1588 7.96833 9.627 7.75008 9 7.75008C8.373 7.75008 7.84125 7.96833 7.40475 8.40483C6.96825 8.84132 6.75 9.37308 6.75 10.0001C6.75 10.6271 6.96825 11.1588 7.40475 11.5953C7.84125 12.0318 8.373 12.2501 9 12.2501ZM9.75 17.5731L16.25 13.9693V6.82708L12.577 8.88458C12.6398 9.07058 12.6843 9.25233 12.7105 9.42983C12.7368 9.60749 12.75 9.79757 12.75 10.0001C12.75 10.8911 12.4702 11.6789 11.9105 12.3636C11.351 13.0481 10.6308 13.4878 9.75 13.6828V17.5731Z" fill="#5F8AFA" />
                                </svg>

                                <p>30 Credits Available</p>
                            </div>
                            <div className="rounded-4xl flex border-1 border-blue-500 px-[8px] py-[4px] gap-[4px] justify-center items-center">
                                <div className="rounded-full w-[36px] h-[36px]">
                                    <img src="assets/prof-1.jpeg" alt="" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="w-[24px] h-[24px]">
                                    <img src="assets/keyboard_arrow_down.png" alt="" />
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </header>
        </>
    );
}

export default NavBar; 