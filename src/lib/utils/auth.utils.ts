import { details } from "framer-motion/client";

export const getAuthHeaders = () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return {
        'Authorization': `token ${auth.api_key}:${auth.api_secret}`,
        'Content-Type': 'application/json'
    };
};

export const getAuthToken = () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return "token " + auth.api_key + ":" + auth.api_secret;

}

export const getUserDetails = () => {
    return JSON.parse(localStorage.getItem("user_details") || "{}");
};

export const getCurrentUserRole = (): string => {
    try {
        const raw = localStorage.getItem("user_details");
        if (!raw) return "";

        const userDetails = JSON.parse(raw);

        if (userDetails && typeof userDetails === "object" && 'role_user' in userDetails) {
            return userDetails.role_user;
        }

        return "";
    } catch (error) {
        console.error("Failed to parse user_details from localStorage:", error);
        return "";
    }
};
export const getCurrentUserName = (): string => {
    try {
        const raw = localStorage.getItem("user_details");
        if (!raw) return "";

        const userDetails = JSON.parse(raw);

        if (userDetails && typeof userDetails === "object" && 'name' in userDetails) {
            return userDetails.name;
        }

        return "";
    } catch (error) {
        console.error("Failed to parse user_details from localStorage:", error);
        return "";
    }
};

export const setUserDetailsToLocalStore = (data: any): boolean => {
    try {
        if (data.user_details && data.key_details) {
            const userDetails = data.user_details;
            const keyDetails = data.key_details;

            const details = {
                name: userDetails.name ?? "",
                first_name: userDetails.first_name ?? "",
                last_name: userDetails.last_name ?? "",
                email: userDetails.email ?? "",
                role_user: userDetails.role_user ?? "",
                last_login: userDetails.last_login ?? null,
            };

            console.log("user_details here");
            console.log(details);



            const keys = {

                api_key: keyDetails.api_key ?? "",
                api_secret: keyDetails.api_secret ?? "",
            }
            console.log("key_details here");
            console.log(keys);



            localStorage.setItem("user_details", JSON.stringify(details));
            localStorage.setItem("auth", JSON.stringify(keys));
            return true;
        }
    } catch (error) {
        console.error("Error setting user details:", error);
        return false;
    }
    return false;
};

export const setKeyDetailsToLocalStore = (data: any): boolean => {
    try {
        if (data.user_details && data.key_details) {
            const userDetails = data.user_details;
            const keyDetails = data.key_details;

            const details = {
                name: userDetails.name ?? "",
                first_name: userDetails.first_name ?? "",
                last_name: userDetails.last_name ?? "",
                email: userDetails.email ?? "",
                role_user: userDetails.role_user ?? "",
                last_login: userDetails.last_login ?? null,
            };


            localStorage.setItem("user_details", JSON.stringify(details));
            return true;
        }
    } catch (error) {
        console.error("Error setting user details:", error);
        return false;
    }
    return false;
};




