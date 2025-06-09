"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

import { getCurrentUserRole } from "@/lib/utils/auth.utils";
import { useNavigation } from "@/lib/hooks/useNavigation";
import Image from 'next/image';
import { creditsApis } from "@/lib/apis/credits.apis";

import { LogOutIcon, UserIcon } from "lucide-react";
import { authApis } from "@/lib/apis/auth.apis";
import { useUser } from '@/context/UserContext';


interface NavBarProps {
    bgColor?: string;
}

export default function Page({ bgColor = "bg-white" }: NavBarProps) {

    const [credit, setCredit] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation();
    const { resetUser, user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    // Remove redundant state variables that can be derived from user context
    const isLoggedIn = user.isLoggedIn;
    const isTrainer = user.role === 'Trainer';

    // Add effect to handle initial loading state
    useEffect(() => {
        // Check if user data is available in localStorage
        const userDetails = localStorage.getItem("user_details");
        if (userDetails) {
            try {
                const parsed = JSON.parse(userDetails);
                if (parsed && parsed.role_user) {
                    // If we have user data in localStorage, we can show the correct UI immediately
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error parsing user details:", error);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchCredits = async () => {
            if (isLoggedIn && !isTrainer) {
                try {
                    const response = await creditsApis.getUserCredits();
                    if (response && response.data && response.data.length > 0) {
                        setCredit(response.data[0].credits);
                    }
                } catch (error) {
                    console.error("Error fetching credits:", error);
                }
            }
        };

        fetchCredits();
    }, [isLoggedIn, isTrainer]);

    // Determine text and border color based on background color
    const textColor = bgColor === "bg-white" ? "text-blue-600" : "text-white";
    const borderColor = bgColor === "bg-white" ? "border-blue-600" : "border-white";
    const hoverColor = bgColor === "bg-white" ? "bg-blue-100" : "bg-white/20";


    const handleLogin = () => {
        handleNavigation("/login");
    };

    const handleSignup = () => {
        handleNavigation("/signup");
    };

    const handleLogout = () => {
        authApis.logout();
        // Clear localStorage
        localStorage.removeItem("user_details");
        localStorage.removeItem("auth");
        // Clear cookies
        document.cookie = "user_details=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        resetUser();
        handleNavigation("/");
    };

    const handleCredits = () => {
        handleNavigation("/manage-credits");
    }

    const handleProfile = () => {
        handleNavigation("/profile");
    };

    return (
        <>
            {/* Navbar */}
            <header
                className={`w-full mx-auto px-4 sm:px-6 lg:px-20 flex flex-col items-center relative z-10 ${bgColor} ${textColor} transition-colors duration-200`}
            >
                <nav className="w-full mx-auto flex items-center justify-between py-4">
                    <Link href="/" className={`text-2xl font-extrabold tracking-tight ${textColor} transition-colors duration-200`}>
                        Trainer&apos;s Mart
                    </Link>

                    <div className="hidden md:block">
                        {!isLoading && (
                            isLoggedIn ? (
                                <div className="relative flex justify-center items-center gap-[20px]">
                                    {!isTrainer &&
                                        (
                                            <div onClick={handleCredits} className={` h-[44px] p-1 px-2 flex  justify-around items-center hover:cursor-pointer hover:${hoverColor} rounded-[36px] transition-colors duration-200`}>
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`fill-current ${textColor} transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                                >
                                                    <mask id="mask0_171_5475" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                        <rect width="24" height="24" fill="#D9D9D9" />
                                                    </mask>
                                                    <g mask="url(#mask0_171_5475)">
                                                        <path d="M12 21.7116L3.25 16.8558V7.14433L12 2.28857L20.75 7.14433V16.8558L12 21.7116ZM9.148 9.55783C9.51217 9.14499 9.941 8.82383 10.4345 8.59433C10.9282 8.36483 11.45 8.25008 12 8.25008C12.55 8.25008 13.0718 8.36483 13.5655 8.59433C14.059 8.82383 14.4878 9.14499 14.852 9.55783L18.4098 7.57508L12 4.01158L5.59025 7.57508L9.148 9.55783ZM11.25 19.5731V15.6828C10.3692 15.4878 9.649 15.0481 9.0895 14.3636C8.52983 13.6789 8.25 12.8911 8.25 12.0001C8.25 11.7976 8.26317 11.6075 8.2895 11.4298C8.31567 11.2523 8.36017 11.0706 8.423 10.8846L4.75 8.82708V15.9693L11.25 19.5731ZM12 14.2501C12.627 14.2501 13.1588 14.0318 13.5953 13.5953C14.0317 13.1588 14.25 12.6271 14.25 12.0001C14.25 11.3731 14.0317 10.8413 13.5953 10.4048C13.1588 9.96833 12.627 9.75008 12 9.75008C11.373 9.75008 10.8413 9.96833 10.4048 10.4048C9.96825 10.8413 9.75 11.3731 9.75 12.0001C9.75 12.6271 9.96825 13.1588 10.4048 13.5953C10.8413 14.0318 11.373 14.2501 12 14.2501ZM12.75 19.5731L19.25 15.9693V8.82708L15.577 10.8846C15.6398 11.0706 15.6843 11.2523 15.7105 11.4298C15.7368 11.6075 15.75 11.7976 15.75 12.0001C15.75 12.8911 15.4702 13.6789 14.9105 14.3636C14.351 15.0481 13.6308 15.4878 12.75 15.6828V19.5731Z"
                                                            fill="currentColor" />
                                                    </g>
                                                </svg>
                                                <div className="font-bold text-base flex p-2">{user.credits || credit} Credits</div>
                                            </div>
                                        )}

                                    <div
                                        className={`w-[80px] h-[44px] rounded-[36px] border-2 ${borderColor} flex justify-center items-center gap-[4px] cursor-pointer`}
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <div className="trainer-profile w-[36px] h-[36px] rounded-full bg-gray-200 flex items-center justify-center relative">
                                            <Image
                                                src={(user.profilePic ? user.profilePic : '/assets/prof-1.jpeg')}
                                                alt="Profile"
                                                fill
                                                className="object-cover rounded-full"
                                                placeholder="blur"
                                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                            />
                                        </div>
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`fill-current ${textColor} transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                        >
                                            <mask
                                                id="mask0_171_5481"
                                                style={{ maskType: "alpha" }}
                                                maskUnits="userSpaceOnUse"
                                                x="0"
                                                y="0"
                                                width="24"
                                                height="24"
                                            >
                                                <rect width="24" height="24" fill="#D9D9D9" />
                                            </mask>
                                            <g mask="url(#mask0_171_5481)">
                                                <path
                                                    d="M12.0092 15.0527L6.35547 9.39897L7.40922 8.34521L12.0092 12.9452L16.6092 8.34521L17.663 9.39897L12.0092 15.0527Z"
                                                    fill="currentColor"
                                                />
                                            </g>
                                        </svg>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {showDropdown && (
                                        <div className="absolute top-11 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                            <button
                                                onClick={handleProfile}
                                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <LogOutIcon className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <button
                                        className={`font-medium text-base cursor-pointer ${textColor}`}
                                        onClick={handleLogin}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className={`${bgColor === "bg-white"
                                            ? "bg-primary text-white"
                                            : "bg-white text-primary"
                                            } px-5 py-1.5 rounded-full font-semibold text-base shadow-sm hover:bg-primary-light transition cursor-pointer hover:scale-105`}
                                        onClick={handleSignup}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
}
