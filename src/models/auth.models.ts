export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData {
    role: 'trainer' | 'company';
    companyName: string;
    email: string;
    password: string;
    rePassword: string;
}

export interface User {
    role: 'trainer' | 'company';
    companyName: string;
    email: string;
    isFirstLogin: boolean;
}

export class LoginModel {
    private email: string;
    private password: string;

    constructor(data: LoginFormData) {
        this.email = data.email;
        this.password = data.password;
    }

    validate(): string | null {
        if (!this.email) {
            return 'Email is required';
        }
        if (!this.email.includes('@')) {
            return 'Invalid email format';
        }
        if (!this.password) {
            return 'Password is required';
        }
        return null;
    }

    toJSON(): LoginFormData {
        return {
            email: this.email,
            password: this.password
        };
    }
}

export class SignupModel {
    private role: 'trainer' | 'company';
    private companyName: string;
    private email: string;
    private password: string;
    private rePassword: string;

    constructor(data: SignupFormData) {
        this.role = data.role;
        this.companyName = data.companyName;
        this.email = data.email;
        this.password = data.password;
        this.rePassword = data.rePassword;
    }

    validate(): string | null {
        if (!this.companyName) {
            return 'Name is required';
        }
        if (!this.email) {
            return 'Email is required';
        }
        if (!this.email.includes('@')) {
            return 'Invalid email format';
        }
        if (!this.password) {
            return 'Password is required';
        }
        if (this.password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (this.password !== this.rePassword) {
            return 'Passwords do not match';
        }
        return null;
    }

    toJSON(): Omit<SignupFormData, 'rePassword'> {
        return {
            role: this.role,
            companyName: this.companyName,
            email: this.email,
            password: this.password
        };
    }

    static createUser(data: SignupFormData): User {
        return {
            role: data.role,
            companyName: data.companyName,
            email: data.email,
            isFirstLogin: true
        };
    }
} 