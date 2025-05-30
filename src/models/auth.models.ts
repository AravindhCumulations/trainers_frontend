export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData {
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    roles: string[];
}

export interface User {
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    roles: string[];
    // rePassword: string;
    // name: string,


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
    private roles: string[];
    private first_name: string;
    private last_name: string;
    private email: string;
    private password: string;

    constructor(data: User) {
        this.roles = data.roles;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.password = data.password;
    }

    validate(): string | null {
        if (!this.first_name) {
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

        return null;
    }

    // toJSON(): Omit<SignupFormData,''> {
    //     return {
    //         roles: this.roles,
    //         name: this.name,
    //         email: this.email,
    //         password: this.password
    //     };
    // }

    static createUser(data: User): User {
        return {
            first_name: data.first_name,
            email: data.email,
            last_name: data.last_name,
            password: data.password,
            roles: data.roles

        };
    }
} 