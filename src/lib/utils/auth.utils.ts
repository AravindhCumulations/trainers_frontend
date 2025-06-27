// Auth Utilities

export const getAuthHeaders = (contentType: string = 'application/json') => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return {
        'Authorization': `token ${auth.api_key}:${auth.api_secret}`,
        'Content-Type': contentType
    };
};


export const getAuthToken = () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return "token " + auth.api_key + ":" + auth.api_secret;

};

// User Details utilities

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

export const getCurrentUserMail = (): string => {
    try {
        const raw = localStorage.getItem("user_details");
        if (!raw) return "";

        const userDetails = JSON.parse(raw);

        if (userDetails && typeof userDetails === "object" && 'email' in userDetails) {
            return userDetails.email;
        }

        return "";
    } catch (error) {
        console.error("Failed to parse user_details from localStorage:", error);
        return "";
    }
};

export const getCurrentUserFullName = (): string => {
    try {
        const raw = localStorage.getItem("user_details");
        if (!raw) return "";

        const userDetails = JSON.parse(raw);

        if (userDetails && typeof userDetails === "object" && 'first_name' in userDetails && typeof userDetails === "object" && 'last_name' in userDetails) {
            return userDetails.first_name + userDetails.last_name;
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
            return userDetails.name || "guest";
        }

        return "guest";
    } catch (error) {
        console.error("Failed to parse user_details from localStorage:", error);
        return "guest";
    }
};

export const setCurrentUserName = (name: string): string => {
    try {
        const raw = localStorage.getItem("user_details");
        if (!raw) return "";

        const userDetails = JSON.parse(raw);

        if (userDetails && typeof userDetails === "object") {
            userDetails.name = name;
            localStorage.setItem("user_details", JSON.stringify(userDetails));
            return name;
        }

        return "";
    } catch (error) {
        console.error("Failed to set user name in localStorage:", error);
        return "";
    }
};

// local storage utilities

export const setUserDetailsToLocalStore = (data: {
    user_details: {
        name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        role_user?: string;
        last_login?: string | null;
    };
    key_details: {
        api_key?: string;
        api_secret?: string;
    };
}): boolean => {
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

            const keys = {
                api_key: keyDetails.api_key ?? "",
                api_secret: keyDetails.api_secret ?? "",
            };

            // Store in localStorage
            localStorage.setItem("user_details", JSON.stringify(details));
            localStorage.setItem("auth", JSON.stringify(keys));

            // Store in cookies for middleware access
            document.cookie = `user_details=${JSON.stringify(details)}; path=/; max-age=86400`; // 24 hours
            document.cookie = `auth=${JSON.stringify(keys)}; path=/; max-age=86400`; // 24 hours

            return true;
        }
    } catch (error) {
        console.error("Error setting user details:", error);
        return false;
    }
    return false;
};

export const setKeyDetailsToLocalStore = (data: {
    user_details: {
        name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        role_user?: string;
        last_login?: string | null;
    };
    key_details: {
        api_key?: string;
        api_secret?: string;
    };
}): boolean => {
    try {
        if (data.user_details && data.key_details) {
            const userDetails = data.user_details;

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




