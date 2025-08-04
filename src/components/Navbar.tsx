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
                        {textColor === "text-white" ? 
                        <svg width="78" height="60" className="md:w-[120px] md:h-[92px]" viewBox="0 0 35 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.77734 17.3105V11.9053C2.77734 11.7705 2.73047 11.6562 2.63672 11.5625C2.54297 11.4629 2.42578 11.4131 2.28516 11.4131C2.15039 11.4131 2.03613 11.4629 1.94238 11.5625C1.84863 11.6562 1.80176 11.7705 1.80176 11.9053V17.3105C1.80176 17.4453 1.84863 17.5596 1.94238 17.6533C2.03613 17.7471 2.15039 17.7939 2.28516 17.7939C2.42578 17.7939 2.54297 17.7471 2.63672 17.6533C2.73047 17.5596 2.77734 17.4453 2.77734 17.3105ZM1.80176 21.2568V23.4893C1.80176 23.624 1.84863 23.7383 1.94238 23.832C2.03613 23.9258 2.15039 23.9727 2.28516 23.9727C2.42578 23.9727 2.54297 23.9258 2.63672 23.832C2.73047 23.7383 2.77734 23.624 2.77734 23.4893V21.2568C2.77734 21.1221 2.73047 21.0049 2.63672 20.9053C2.54297 20.8115 2.42578 20.7646 2.28516 20.7646C2.15039 20.7646 2.03613 20.8115 1.94238 20.9053C1.84863 21.0049 1.80176 21.1221 1.80176 21.2568ZM4.37695 10.3057V11.2637H4.10449C4.22168 11.5273 4.28027 11.7998 4.28027 12.0811V17.1348C4.28027 17.6797 4.08398 18.1484 3.69141 18.541C3.30469 18.9277 2.83594 19.1211 2.28516 19.1211C2.13281 19.1211 1.97754 19.1006 1.81934 19.0596C1.77246 19.0361 1.71973 19.0215 1.66113 19.0156C1.65527 19.0156 1.64355 19.0156 1.62598 19.0156C1.45605 19.0273 1.37109 19.0977 1.37109 19.2266C1.37109 19.373 1.68457 19.4463 2.31152 19.4463C2.85645 19.4463 3.31934 19.6426 3.7002 20.0352C4.08691 20.4219 4.28027 20.8877 4.28027 21.4326V23.3135C4.28027 23.8584 4.08398 24.3271 3.69141 24.7197C3.30469 25.1064 2.83594 25.2998 2.28516 25.2998C1.74023 25.2998 1.27441 25.1064 0.887695 24.7197C0.495117 24.3271 0.298828 23.8584 0.298828 23.3135V21.4326C0.298828 21.04 0.445313 20.6094 0.738281 20.1406C0.392578 19.877 0.225586 19.584 0.237305 19.2617C0.249023 18.9395 0.427734 18.6758 0.773438 18.4707C0.457031 17.9492 0.298828 17.5039 0.298828 17.1348V12.0811C0.298828 11.5303 0.495117 11.0615 0.887695 10.6748C1.27441 10.2881 1.74023 10.0947 2.28516 10.0947C2.60156 10.0947 2.90332 10.165 3.19043 10.3057H4.37695ZM6.31934 14.4893H7.30371V11.8965C7.30371 11.7617 7.25684 11.6475 7.16309 11.5537C7.06348 11.46 6.94629 11.4131 6.81152 11.4131C6.67676 11.4131 6.5625 11.46 6.46875 11.5537C6.36914 11.6475 6.31934 11.7617 6.31934 11.8965V14.4893ZM5.40527 10.666C5.79785 10.2793 6.2666 10.0859 6.81152 10.0859C7.3623 10.0859 7.83105 10.2793 8.21777 10.666C8.61035 11.0586 8.80664 11.5273 8.80664 12.0723V15.9658H6.31934V19.2705C6.31934 19.4053 6.36914 19.5195 6.46875 19.6133C6.5625 19.707 6.67676 19.7539 6.81152 19.7539C6.94629 19.7539 7.06348 19.707 7.16309 19.6133C7.25684 19.5195 7.30371 19.4053 7.30371 19.2705V16.6074H8.80664V19.0947C8.80664 19.6396 8.61035 20.1084 8.21777 20.501C7.83105 20.8877 7.3623 21.0811 6.81152 21.0811C6.2666 21.0811 5.79785 20.8877 5.40527 20.501C5.01855 20.1084 4.8252 19.6396 4.8252 19.0947V12.0723C4.8252 11.5273 5.01855 11.0586 5.40527 10.666ZM11.6191 10.2881V11.7559H11.127V20.8789H9.65039V11.7559H9.16699V10.2881H9.65039V7.33496H11.127V10.2881H11.6191ZM20.918 15.1572V9.45312C20.918 9.18945 20.833 9.00781 20.6631 8.9082C20.5811 8.86133 20.4961 8.84082 20.4082 8.84668H20.083V15.7637H20.4082C20.4961 15.7695 20.5811 15.749 20.6631 15.7021C20.833 15.6025 20.918 15.4209 20.918 15.1572ZM22.3682 9.22461V15.3857C22.3682 15.5498 22.3652 15.6904 22.3594 15.8076C22.3418 16.1182 22.3008 16.3672 22.2363 16.5547C22.0723 17.0352 21.7031 17.2754 21.1289 17.2754H20.083V20.8789H18.6064V7.33496H21.1289C21.7031 7.33496 22.0723 7.5752 22.2363 8.05566C22.3008 8.24902 22.3418 8.49805 22.3594 8.80273C22.3652 8.91992 22.3682 9.06055 22.3682 9.22461ZM25.2773 11.6416C25.2305 11.5596 25.0869 11.5186 24.8467 11.5186C24.7119 11.5186 24.5889 11.5654 24.4775 11.6592C24.3604 11.7588 24.3018 11.873 24.3018 12.002V20.8789H22.8076V10.2793H24.2842V10.6221C24.2783 10.6221 24.2812 10.6162 24.293 10.6045C24.3047 10.5928 24.3193 10.5781 24.3369 10.5605C24.3955 10.5137 24.46 10.4668 24.5303 10.4199C24.7588 10.2852 25.0078 10.209 25.2773 10.1914V11.6416ZM27.0439 11.8965V19.2705C27.0439 19.4053 27.0938 19.5195 27.1934 19.6133C27.2871 19.707 27.4014 19.7539 27.5361 19.7539C27.6709 19.7539 27.7881 19.707 27.8877 19.6133C27.9814 19.5195 28.0283 19.4053 28.0283 19.2705V11.8965C28.0283 11.7617 27.9814 11.6475 27.8877 11.5537C27.7881 11.46 27.6709 11.4131 27.5361 11.4131C27.4014 11.4131 27.2871 11.46 27.1934 11.5537C27.0938 11.6475 27.0439 11.7617 27.0439 11.8965ZM26.1299 10.666C26.5225 10.2793 26.9912 10.0859 27.5361 10.0859C28.0869 10.0859 28.5557 10.2793 28.9424 10.666C29.335 11.0586 29.5312 11.5273 29.5312 12.0723V19.0947C29.5312 19.6396 29.335 20.1084 28.9424 20.501C28.5557 20.8877 28.0869 21.0811 27.5361 21.0811C26.9912 21.0811 26.5225 20.8877 26.1299 20.501C25.7432 20.1084 25.5498 19.6396 25.5498 19.0947V12.0723C25.5498 11.5273 25.7432 11.0586 26.1299 10.666ZM30.5596 10.6924C30.9521 10.2998 31.4209 10.1035 31.9658 10.1035C32.5166 10.1035 32.9854 10.2998 33.3721 10.6924C33.7646 11.0791 33.9609 11.5479 33.9609 12.0986V14.1729H32.458V11.9229C32.458 11.7881 32.4111 11.6709 32.3174 11.5713C32.2178 11.4775 32.1006 11.4307 31.9658 11.4307C31.8311 11.4307 31.7168 11.4775 31.623 11.5713C31.5293 11.6709 31.4824 11.7881 31.4824 11.9229V14.2432C31.4824 14.3721 31.5205 14.4834 31.5967 14.5771C31.6846 14.6768 31.793 14.7266 31.9219 14.7266H32.2031C32.9648 14.7266 33.4863 15.0811 33.7676 15.79C33.8555 16.0127 33.9141 16.2588 33.9434 16.5283C33.9492 16.6104 33.9551 16.6895 33.9609 16.7656C33.9609 16.7891 33.9609 16.8125 33.9609 16.8359V19.2705V19.2793C33.9141 19.7891 33.7002 20.2168 33.3193 20.5625C32.9385 20.9082 32.4873 21.0811 31.9658 21.0811C31.4502 21.0811 31.002 20.9082 30.6211 20.5625C30.2402 20.2168 30.0264 19.792 29.9795 19.2881V17.0205H31.4824V19.2705C31.4824 19.4053 31.5293 19.5195 31.623 19.6133C31.7168 19.707 31.8311 19.7539 31.9658 19.7539C32.1006 19.7539 32.2178 19.707 32.3174 19.6133C32.4111 19.5195 32.458 19.4053 32.458 19.2705V16.8623C32.458 16.54 32.3115 16.3789 32.0186 16.3789H31.9219C31.3594 16.3789 30.8818 16.1592 30.4893 15.7197C30.1494 15.3389 29.9795 14.8965 29.9795 14.3926V12.0986C29.9795 11.5479 30.1729 11.0791 30.5596 10.6924Z" fill="white"/>
                        <path d="M17.5 13.4286L16.5625 12H13.4403L12.5 13.4286M17.5 13.4286L15 17M17.5 13.4286H12.5M15 17L12.5 13.4286M15 17L14.0625 13.4286M15 17L15.9375 13.4286" stroke="white" stroke-width="0.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        
                        :
                        <svg width="78" height="60" className="md:w-[120px] md:h-[92px]" viewBox="0 0 35 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.77734 17.3105V11.9053C2.77734 11.7705 2.73047 11.6562 2.63672 11.5625C2.54297 11.4629 2.42578 11.4131 2.28516 11.4131C2.15039 11.4131 2.03613 11.4629 1.94238 11.5625C1.84863 11.6562 1.80176 11.7705 1.80176 11.9053V17.3105C1.80176 17.4453 1.84863 17.5596 1.94238 17.6533C2.03613 17.7471 2.15039 17.7939 2.28516 17.7939C2.42578 17.7939 2.54297 17.7471 2.63672 17.6533C2.73047 17.5596 2.77734 17.4453 2.77734 17.3105ZM1.80176 21.2568V23.4893C1.80176 23.624 1.84863 23.7383 1.94238 23.832C2.03613 23.9258 2.15039 23.9727 2.28516 23.9727C2.42578 23.9727 2.54297 23.9258 2.63672 23.832C2.73047 23.7383 2.77734 23.624 2.77734 23.4893V21.2568C2.77734 21.1221 2.73047 21.0049 2.63672 20.9053C2.54297 20.8115 2.42578 20.7646 2.28516 20.7646C2.15039 20.7646 2.03613 20.8115 1.94238 20.9053C1.84863 21.0049 1.80176 21.1221 1.80176 21.2568ZM4.37695 10.3057V11.2637H4.10449C4.22168 11.5273 4.28027 11.7998 4.28027 12.0811V17.1348C4.28027 17.6797 4.08398 18.1484 3.69141 18.541C3.30469 18.9277 2.83594 19.1211 2.28516 19.1211C2.13281 19.1211 1.97754 19.1006 1.81934 19.0596C1.77246 19.0361 1.71973 19.0215 1.66113 19.0156C1.65527 19.0156 1.64355 19.0156 1.62598 19.0156C1.45605 19.0273 1.37109 19.0977 1.37109 19.2266C1.37109 19.373 1.68457 19.4463 2.31152 19.4463C2.85645 19.4463 3.31934 19.6426 3.7002 20.0352C4.08691 20.4219 4.28027 20.8877 4.28027 21.4326V23.3135C4.28027 23.8584 4.08398 24.3271 3.69141 24.7197C3.30469 25.1064 2.83594 25.2998 2.28516 25.2998C1.74023 25.2998 1.27441 25.1064 0.887695 24.7197C0.495117 24.3271 0.298828 23.8584 0.298828 23.3135V21.4326C0.298828 21.04 0.445313 20.6094 0.738281 20.1406C0.392578 19.877 0.225586 19.584 0.237305 19.2617C0.249023 18.9395 0.427734 18.6758 0.773438 18.4707C0.457031 17.9492 0.298828 17.5039 0.298828 17.1348V12.0811C0.298828 11.5303 0.495117 11.0615 0.887695 10.6748C1.27441 10.2881 1.74023 10.0947 2.28516 10.0947C2.60156 10.0947 2.90332 10.165 3.19043 10.3057H4.37695ZM6.31934 14.4893H7.30371V11.8965C7.30371 11.7617 7.25684 11.6475 7.16309 11.5537C7.06348 11.46 6.94629 11.4131 6.81152 11.4131C6.67676 11.4131 6.5625 11.46 6.46875 11.5537C6.36914 11.6475 6.31934 11.7617 6.31934 11.8965V14.4893ZM5.40527 10.666C5.79785 10.2793 6.2666 10.0859 6.81152 10.0859C7.3623 10.0859 7.83105 10.2793 8.21777 10.666C8.61035 11.0586 8.80664 11.5273 8.80664 12.0723V15.9658H6.31934V19.2705C6.31934 19.4053 6.36914 19.5195 6.46875 19.6133C6.5625 19.707 6.67676 19.7539 6.81152 19.7539C6.94629 19.7539 7.06348 19.707 7.16309 19.6133C7.25684 19.5195 7.30371 19.4053 7.30371 19.2705V16.6074H8.80664V19.0947C8.80664 19.6396 8.61035 20.1084 8.21777 20.501C7.83105 20.8877 7.3623 21.0811 6.81152 21.0811C6.2666 21.0811 5.79785 20.8877 5.40527 20.501C5.01855 20.1084 4.8252 19.6396 4.8252 19.0947V12.0723C4.8252 11.5273 5.01855 11.0586 5.40527 10.666ZM11.6191 10.2881V11.7559H11.127V20.8789H9.65039V11.7559H9.16699V10.2881H9.65039V7.33496H11.127V10.2881H11.6191ZM20.918 15.1572V9.45312C20.918 9.18945 20.833 9.00781 20.6631 8.9082C20.5811 8.86133 20.4961 8.84082 20.4082 8.84668H20.083V15.7637H20.4082C20.4961 15.7695 20.5811 15.749 20.6631 15.7021C20.833 15.6025 20.918 15.4209 20.918 15.1572ZM22.3682 9.22461V15.3857C22.3682 15.5498 22.3652 15.6904 22.3594 15.8076C22.3418 16.1182 22.3008 16.3672 22.2363 16.5547C22.0723 17.0352 21.7031 17.2754 21.1289 17.2754H20.083V20.8789H18.6064V7.33496H21.1289C21.7031 7.33496 22.0723 7.5752 22.2363 8.05566C22.3008 8.24902 22.3418 8.49805 22.3594 8.80273C22.3652 8.91992 22.3682 9.06055 22.3682 9.22461ZM25.2773 11.6416C25.2305 11.5596 25.0869 11.5186 24.8467 11.5186C24.7119 11.5186 24.5889 11.5654 24.4775 11.6592C24.3604 11.7588 24.3018 11.873 24.3018 12.002V20.8789H22.8076V10.2793H24.2842V10.6221C24.2783 10.6221 24.2812 10.6162 24.293 10.6045C24.3047 10.5928 24.3193 10.5781 24.3369 10.5605C24.3955 10.5137 24.46 10.4668 24.5303 10.4199C24.7588 10.2852 25.0078 10.209 25.2773 10.1914V11.6416ZM27.0439 11.8965V19.2705C27.0439 19.4053 27.0938 19.5195 27.1934 19.6133C27.2871 19.707 27.4014 19.7539 27.5361 19.7539C27.6709 19.7539 27.7881 19.707 27.8877 19.6133C27.9814 19.5195 28.0283 19.4053 28.0283 19.2705V11.8965C28.0283 11.7617 27.9814 11.6475 27.8877 11.5537C27.7881 11.46 27.6709 11.4131 27.5361 11.4131C27.4014 11.4131 27.2871 11.46 27.1934 11.5537C27.0938 11.6475 27.0439 11.7617 27.0439 11.8965ZM26.1299 10.666C26.5225 10.2793 26.9912 10.0859 27.5361 10.0859C28.0869 10.0859 28.5557 10.2793 28.9424 10.666C29.335 11.0586 29.5312 11.5273 29.5312 12.0723V19.0947C29.5312 19.6396 29.335 20.1084 28.9424 20.501C28.5557 20.8877 28.0869 21.0811 27.5361 21.0811C26.9912 21.0811 26.5225 20.8877 26.1299 20.501C25.7432 20.1084 25.5498 19.6396 25.5498 19.0947V12.0723C25.5498 11.5273 25.7432 11.0586 26.1299 10.666ZM30.5596 10.6924C30.9521 10.2998 31.4209 10.1035 31.9658 10.1035C32.5166 10.1035 32.9854 10.2998 33.3721 10.6924C33.7646 11.0791 33.9609 11.5479 33.9609 12.0986V14.1729H32.458V11.9229C32.458 11.7881 32.4111 11.6709 32.3174 11.5713C32.2178 11.4775 32.1006 11.4307 31.9658 11.4307C31.8311 11.4307 31.7168 11.4775 31.623 11.5713C31.5293 11.6709 31.4824 11.7881 31.4824 11.9229V14.2432C31.4824 14.3721 31.5205 14.4834 31.5967 14.5771C31.6846 14.6768 31.793 14.7266 31.9219 14.7266H32.2031C32.9648 14.7266 33.4863 15.0811 33.7676 15.79C33.8555 16.0127 33.9141 16.2588 33.9434 16.5283C33.9492 16.6104 33.9551 16.6895 33.9609 16.7656C33.9609 16.7891 33.9609 16.8125 33.9609 16.8359V19.2705V19.2793C33.9141 19.7891 33.7002 20.2168 33.3193 20.5625C32.9385 20.9082 32.4873 21.0811 31.9658 21.0811C31.4502 21.0811 31.002 20.9082 30.6211 20.5625C30.2402 20.2168 30.0264 19.792 29.9795 19.2881V17.0205H31.4824V19.2705C31.4824 19.4053 31.5293 19.5195 31.623 19.6133C31.7168 19.707 31.8311 19.7539 31.9658 19.7539C32.1006 19.7539 32.2178 19.707 32.3174 19.6133C32.4111 19.5195 32.458 19.4053 32.458 19.2705V16.8623C32.458 16.54 32.3115 16.3789 32.0186 16.3789H31.9219C31.3594 16.3789 30.8818 16.1592 30.4893 15.7197C30.1494 15.3389 29.9795 14.8965 29.9795 14.3926V12.0986C29.9795 11.5479 30.1729 11.0791 30.5596 10.6924Z" fill="#2563EB"/>
                        <path d="M17.5 13.4286L16.5625 12H13.4403L12.5 13.4286M17.5 13.4286L15 17M17.5 13.4286H12.5M15 17L12.5 13.4286M15 17L14.0625 13.4286M15 17L15.9375 13.4286" stroke="#2563EB" stroke-width="0.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        }
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
                        <h2 className="text-xl font-bold text-gray-800">Get Pros</h2>
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
