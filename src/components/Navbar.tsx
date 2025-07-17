"use client";

import { useEffect, useState } from "react";

import { useNavigation } from "@/lib/hooks/useNavigation";
import Image from 'next/image';
import { creditsApis } from "@/lib/apis/credits.apis";

import { LogOutIcon, Menu } from "lucide-react";
import { authApis } from "@/lib/apis/auth.apis";
import { useUser } from '@/context/UserContext';
import { getCurrentUserName, getCurrentUserFullName } from "@/lib/utils/auth.utils";
import { usePopup } from "@/lib/hooks/usePopup";
import Popup from "./Popup";
import { getIsFirstLogin } from "@/lib/utils/auth.utils";


interface NavBarProps {
    bgColor?: string;
    handleNavigation?: (page: string, params?: Record<string, string>) => void;
}

export default function Page({ bgColor = "bg-white", handleNavigation }: NavBarProps) {

    const [credit, setCredit] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { handleNavigation: navigationHandle } = useNavigation();
    const { resetUser, user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const { toastError, showConfirmation, popupState, hidePopup } = usePopup();

    const navHandler = handleNavigation || navigationHandle;

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
            if (isLoggedIn) {
                try {
                    const response = await creditsApis.getUserCredits();
                    if (response && response.data && response.data.length > 0) {
                        setCredit(response.data[0].credits);
                    }
                } catch (error) {
                    toastError("Unalble to fetch user Credits")
                    console.error("Error fetching credits:", error);
                }
            }
        };

        fetchCredits();
    }, [isLoggedIn]);

    // Add effect to handle body scroll
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to ensure scroll is re-enabled when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    // Determine text and border color based on background color
    const textColor = bgColor === "bg-white" ? "text-blue-600" : "text-white";
    const borderColor = bgColor === "bg-white" ? "border-blue-600" : "border-white";
    const hoverColor = bgColor === "bg-white" ? "bg-blue-100" : "bg-white/20";


    const handleLogin = (): void => {
        navHandler("/login");
    };

    const handleSignup = (): void => {
        navHandler("/signup");
    };

    const handleLogout = async (): Promise<void> => {


        try {
            // First call the logout API
            await authApis.logout();

            // Then clear all storage synchronously
            localStorage.removeItem("user_details");
            localStorage.removeItem("auth");
            document.cookie = "user_details=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

            // Reset user state
            resetUser();

            // Finally navigate to home page
            // Use window.location.href for a hard redirect to ensure clean state
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout API fails, still try to clear local state and redirect
            localStorage.removeItem("user_details");
            localStorage.removeItem("auth");
            document.cookie = "user_details=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            resetUser();
            window.location.href = '/';
        }
    };



    const handleCredits = (): void => {
        navHandler("/manage-credits");
    }

    const handleDrawerClose = (): void => {
        setIsDrawerOpen(false);
    };

    const handleDrawerItemClick = (path: string): void => {
        navHandler(path);
        setIsDrawerOpen(false);
    };

    const handleLogoutClick = () => {
        showConfirmation(
            "Are you sure you want to logout?",
            handleLogout,
            {
                title: "Confirm Logout",
                confirmText: "Logout",
                cancelText: "Cancel"
            }
        );
    };

    // Utility to get initials from full name
    const getInitials = (fullName: string): string => {
        if (!fullName) return "";
        const names = fullName.trim().split(/\s+/);
        if (names.length === 1) return names[0][0]?.toUpperCase() || "";
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };



    const handleProfileClick = () => {
        if (getIsFirstLogin()) {
            navHandler(`/trainer-form`);
        }
        else {
            navHandler(`/trainer-details?trainer=${getCurrentUserName()}`);
        }
    };

    return (
        <>


            {/* Navbar */}
            <header
                className={`w-full mx-auto  flex flex-col items-center relative z-50 px-0 md:px-2 lg:px-4 ${bgColor} ${textColor} transition-colors duration-200`}
            >
                <nav className="w-full max-w-9xl mx-auto flex items-center justify-start md:justify-between  py-4">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsDrawerOpen(true)}
                    >
                        <Menu className={`w-6 h-6 ${textColor}`} />
                    </button>

                    {/* <Link href="/" className={`text-2xl font-extrabold tracking-tight ${textColor} transition-colors duration-200`}>
                        Trainer&apos;s Mart
                    </Link> */}
                    <button
                        className={`text-2xl font-extrabold tracking-tight ${textColor} transition-colors duration-200 bg-transparent border-none p-0 m-0 cursor-pointer`}
                        onClick={() => navHandler('/')} 
                    >
                        <svg width="78" height="60" viewBox="0 0 78 60"  fill={textColor === "text-white" ? "white" : "#2563eb"} xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.1895 38.4678V26.4562C6.1895 26.1567 6.08505 25.9027 5.87612 25.6945C5.66719 25.4731 5.40602 25.3625 5.09264 25.3625C4.7923 25.3625 4.53766 25.4731 4.32873 25.6945C4.1198 25.9027 4.01535 26.1567 4.01535 26.4562V38.4678C4.01535 38.7673 4.1198 39.0213 4.32873 39.2296C4.53766 39.438 4.7923 39.542 5.09264 39.542C5.40602 39.542 5.66719 39.438 5.87612 39.2296C6.08505 39.0213 6.1895 38.7673 6.1895 38.4678ZM4.01535 47.2374V52.1985C4.01535 52.4978 4.1198 52.7518 4.32873 52.96C4.53766 53.1685 4.7923 53.2727 5.09264 53.2727C5.40602 53.2727 5.66719 53.1685 5.87612 52.96C6.08505 52.7518 6.1895 52.4978 6.1895 52.1985V47.2374C6.1895 46.938 6.08505 46.6776 5.87612 46.4562C5.66719 46.2478 5.40602 46.1436 5.09264 46.1436C4.7923 46.1436 4.53766 46.2478 4.32873 46.4562C4.1198 46.6776 4.01535 46.938 4.01535 47.2374ZM9.75434 22.9016V25.0305H9.14715C9.40831 25.6162 9.53889 26.2218 9.53889 26.8469V38.0774C9.53889 39.2882 9.10144 40.3298 8.22657 41.2022C7.36474 42.0616 6.32009 42.4913 5.09264 42.4913C4.75312 42.4913 4.40709 42.4458 4.05453 42.3547C3.95005 42.3025 3.83254 42.27 3.70195 42.2569C3.68889 42.2569 3.66277 42.2569 3.62361 42.2569C3.24491 42.2829 3.05557 42.4394 3.05557 42.7258C3.05557 43.0511 3.75418 43.214 5.15139 43.214C6.3658 43.214 7.39738 43.6502 8.24616 44.5227C9.10797 45.382 9.53889 46.4171 9.53889 47.628V51.8078C9.53889 53.0187 9.10144 54.0602 8.22657 54.9327C7.36474 55.792 6.32009 56.2218 5.09264 56.2218C3.87823 56.2218 2.84011 55.792 1.97829 54.9327C1.1034 54.0602 0.665958 53.0187 0.665958 51.8078V47.628C0.665958 46.7556 0.99241 45.7987 1.64531 44.7569C0.874886 44.1711 0.502733 43.52 0.528849 42.8038C0.554964 42.0878 0.953234 41.5018 1.72366 41.046C1.01852 39.8871 0.665958 38.8976 0.665958 38.0774V26.8469C0.665958 25.6229 1.1034 24.5811 1.97829 23.7218C2.84011 22.8625 3.87823 22.4327 5.09264 22.4327C5.79776 22.4327 6.47025 22.5889 7.1101 22.9016H9.75434ZM14.0831 32.1985H16.2768V26.4367C16.2768 26.1371 16.1724 25.8834 15.9635 25.6749C15.7415 25.4667 15.4803 25.3625 15.18 25.3625C14.8796 25.3625 14.625 25.4667 14.4161 25.6749C14.1941 25.8834 14.0831 26.1371 14.0831 26.4367V32.1985ZM12.046 23.7022C12.9209 22.8429 13.9656 22.4131 15.18 22.4131C16.4074 22.4131 17.4521 22.8429 18.3139 23.7022C19.1888 24.5747 19.6262 25.6162 19.6262 26.8273V35.4796H14.0831V42.8234C14.0831 43.1229 14.1941 43.3767 14.4161 43.5851C14.625 43.7934 14.8796 43.8976 15.18 43.8976C15.4803 43.8976 15.7415 43.7934 15.9635 43.5851C16.1724 43.3767 16.2768 43.1229 16.2768 42.8234V36.9054H19.6262V42.4327C19.6262 43.6436 19.1888 44.6853 18.3139 45.5578C17.4521 46.4171 16.4074 46.8469 15.18 46.8469C13.9656 46.8469 12.9209 46.4171 12.046 45.5578C11.1842 44.6853 10.7533 43.6436 10.7533 42.4327V26.8273C10.7533 25.6162 11.1842 24.5747 12.046 23.7022ZM25.894 22.8625V26.1242H24.7973V46.3976H21.5066V26.1242H20.4293V22.8625H21.5066V16.2999H24.7973V22.8625H25.894ZM46.6173 33.6827V21.0069C46.6173 20.421 46.4278 20.0174 46.0492 19.796C45.8664 19.6919 45.677 19.6463 45.4811 19.6593H44.7564V35.0305H45.4811C45.677 35.0433 45.8664 34.9978 46.0492 34.8936C46.4278 34.6722 46.6173 34.2687 46.6173 33.6827ZM49.8491 20.4991V34.1905C49.8491 34.5551 49.8424 34.8676 49.8295 35.128C49.7903 35.8182 49.6989 36.3716 49.5552 36.7882C49.1897 37.856 48.3669 38.3898 47.0873 38.3898H44.7564V46.3976H41.4657V16.2999H47.0873C48.3669 16.2999 49.1897 16.8338 49.5552 17.9015C49.6989 18.3312 49.7903 18.8846 49.8295 19.5616C49.8424 19.8221 49.8491 20.1346 49.8491 20.4991ZM56.3323 25.8702C56.228 25.688 55.9079 25.5969 55.3726 25.5969C55.0722 25.5969 54.7981 25.7009 54.5499 25.9093C54.2889 26.1307 54.1583 26.3845 54.1583 26.6711V46.3976H50.8284V22.8429H54.1191V23.6047C54.1059 23.6047 54.1124 23.5916 54.1387 23.5656C54.1648 23.5396 54.1973 23.5069 54.2365 23.4678C54.3671 23.3638 54.5109 23.2596 54.6675 23.1553C55.1768 22.856 55.7317 22.6867 56.3323 22.6476V25.8702ZM60.2693 26.4367V42.8234C60.2693 43.1229 60.3805 43.3767 60.6024 43.5851C60.8112 43.7934 61.066 43.8976 61.3662 43.8976C61.6666 43.8976 61.9278 43.7934 62.1497 43.5851C62.3585 43.3767 62.4631 43.1229 62.4631 42.8234V26.4367C62.4631 26.1371 62.3585 25.8834 62.1497 25.6749C61.9278 25.4667 61.6666 25.3625 61.3662 25.3625C61.066 25.3625 60.8112 25.4667 60.6024 25.6749C60.3805 25.8834 60.2693 26.1371 60.2693 26.4367ZM58.2323 23.7022C59.1073 22.8429 60.1518 22.4131 61.3662 22.4131C62.5937 22.4131 63.6384 22.8429 64.5002 23.7022C65.3751 24.5747 65.8124 25.6162 65.8124 26.8273V42.4327C65.8124 43.6436 65.3751 44.6853 64.5002 45.5578C63.6384 46.4171 62.5937 46.8469 61.3662 46.8469C60.1518 46.8469 59.1073 46.4171 58.2323 45.5578C57.3706 44.6853 56.9396 43.6436 56.9396 42.4327V26.8273C56.9396 25.6162 57.3706 24.5747 58.2323 23.7022ZM68.1042 23.7609C68.979 22.8885 70.0237 22.4522 71.2381 22.4522C72.4656 22.4522 73.5103 22.8885 74.3721 23.7609C75.2468 24.6202 75.6843 25.662 75.6843 26.8858V31.4953H72.335V26.4953C72.335 26.1958 72.2305 25.9353 72.0216 25.714C71.7997 25.5056 71.5385 25.4016 71.2381 25.4016C70.9379 25.4016 70.6832 25.5056 70.4741 25.714C70.2653 25.9353 70.1608 26.1958 70.1608 26.4953V31.6516C70.1608 31.938 70.2457 32.1853 70.4155 32.3936C70.6114 32.6151 70.853 32.7258 71.1402 32.7258H71.7669C73.4644 32.7258 74.6266 33.5136 75.2535 35.0889C75.4494 35.5838 75.58 36.1307 75.6453 36.7296C75.6582 36.912 75.6714 37.0878 75.6843 37.2569C75.6843 37.3091 75.6843 37.3611 75.6843 37.4131V42.8234V42.8429C75.58 43.9758 75.1033 44.9262 74.2544 45.6945C73.4058 46.4627 72.4003 46.8469 71.2381 46.8469C70.089 46.8469 69.0902 46.4627 68.2413 45.6945C67.3924 44.9262 66.916 43.9822 66.8115 42.8625V37.8234H70.1608V42.8234C70.1608 43.1229 70.2653 43.3767 70.4741 43.5851C70.6832 43.7934 70.9379 43.8976 71.2381 43.8976C71.5385 43.8976 71.7997 43.7934 72.0216 43.5851C72.2305 43.3767 72.335 43.1229 72.335 42.8234V37.4718C72.335 36.7556 72.0085 36.3976 71.3557 36.3976H71.1402C69.8867 36.3976 68.8223 35.9093 67.9476 34.9327C67.1901 34.0865 66.8115 33.1033 66.8115 31.9836V26.8858C66.8115 25.662 67.2425 24.6202 68.1042 23.7609Z" fill={textColor === "text-white" ? "white" : "#2563eb"}/>
                        <path d="M37.8857 31.1111L36.2143 28.8889H30.6478L28.9714 31.1111M37.8857 31.1111L33.4286 36.6667M37.8857 31.1111H28.9714M28.9714 31.1111L33.4286 36.6667M33.4286 36.6667L31.7571 31.1111M33.4286 36.6667L35.1 31.1111" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>


                    <div className="hidden md:block">
                        {!isLoading && (
                            isLoggedIn ? (
                                <div className="relative flex justify-center items-center gap-[20px]">

                                    <div onClick={handleCredits} className={`group h-[44px] p-1 px-2 flex  justify-around items-center hover:cursor-pointer hover:${hoverColor} rounded-[36px] transition-colors duration-200 relative`}>
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
                                        <div className="font-bold text-base flex p-2">{user.credits ?? credit} Credits</div>
                                        {/* Tooltip for credits */}
                                        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-64 px-3 py-2 rounded bg-gray-900 text-white text-xs text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                                            Spend your credits to unlock this trainer&apos;s full details.
                                        </div>
                                    </div>


                                    <div
                                        className={`w-[80px] h-[44px] rounded-[36px] border-2 ${borderColor} flex justify-center items-center gap-[4px] cursor-pointer`}
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <div className="trainer-profile w-[36px] h-[36px] rounded-full bg-gray-200 flex items-center justify-center relative">
                                            {user.profilePic ? (
                                                <Image
                                                    src={user.profilePic}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover rounded-full"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                                />
                                            ) : (

                                                <span className="text-lg font-bold text-blue-600">
                                                    {getInitials(getCurrentUserFullName())}
                                                </span>

                                            )}
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
                                        <div className="absolute top-11 right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-1 border-gray-200">
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <p className="text-base font-semibold text-gray-900 line-clamp-1" title={getCurrentUserFullName()}>
                                                    {getCurrentUserFullName()}
                                                </p>
                                                <p className="text-sm text-gray-600 line-clamp-1">{user.email}</p>
                                            </div>
                                            {isTrainer && (
                                                <button
                                                    onClick={handleProfileClick}
                                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                    My Profile
                                                </button>
                                            )}

                                            <button
                                                onClick={handleLogoutClick}
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
                                        className="font-semibold text-[16px] leading-[24px] tracking-[0%] align-middle cursor-pointer"
                                        onClick={handleLogin}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className={`${bgColor === "bg-white"
                                            ? "bg-[#2563EB] text-white"
                                            : "bg-white text-[#2563EB]"
                                            } h-[37.2px] rounded-full px-4 py-[6.6px] flex items-center justify-center cursor-pointer hover:scale-105 transition`}
                                        onClick={handleSignup}
                                    >
                                        <span className="font-semibold text-[16px] leading-[24px] tracking-[0%] align-middle">Sign Up</span>
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </nav>
            </header>

            {/* Mobile Side Drawer */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={handleDrawerClose}
            >
                <div
                    className={`fixed left-0 z-50 top-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Trainer&apos;s Mart</h2>
                    </div>

                    <div className="p-4">
                        {!isLoading && (
                            isLoggedIn ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-2">
                                        <div>
                                            <p className="text-base font-semibold text-gray-900" title={getCurrentUserFullName()}>
                                                {getCurrentUserFullName()}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">{user.email}</p>

                                        </div>
                                    </div>


                                    <button
                                        onClick={() => handleDrawerItemClick("/manage-credits")}
                                        className="w-full px-2 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="fill-current text-gray-600"
                                        >
                                            <path d="M12 21.7116L3.25 16.8558V7.14433L12 2.28857L20.75 7.14433V16.8558L12 21.7116Z" />
                                        </svg>
                                        Manage Credits
                                    </button>


                                    {isTrainer && (
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full px-2 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                            My Profile
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full px-2 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <LogOutIcon className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleDrawerItemClick("/login")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => handleDrawerItemClick("/signup")}
                                        className="w-full px-4 py-2 text-left bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Global Popup for confirmations and alerts */}
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
        </>
    );
}
