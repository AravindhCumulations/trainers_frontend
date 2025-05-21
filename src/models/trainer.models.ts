export interface Education {
    course: string;
    institution: string;
    year: string;
}

export interface Certification {
    name: string;
    issuer: string;
    year: string;
}

export interface PersonalInfo {
    bio: string;
    experience: number;
    location: string;
    charge: number;
    phone: string;
}

export interface SocialMedia {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    website: string;
}

export interface TrainerFormData {
    personalInfo: PersonalInfo;
    education: Education[];
    certifications: Certification[];
    socialMedia: SocialMedia;
}

export class TrainerFormValidator {
    static validatePersonalInfo(data: PersonalInfo): string[] {
        const errors: string[] = [];

        if (!data.bio.trim()) {
            errors.push('Bio is required');
        }

        if (!data.experience || data.experience <= 0) {
            errors.push('Experience must be greater than 0');
        }

        if (!data.location.trim()) {
            errors.push('Location is required');
        }

        if (!data.charge || data.charge <= 0) {
            errors.push('Hourly rate must be greater than 0');
        }

        if (!data.phone.trim()) {
            errors.push('Phone number is required');
        } else if (!/^\+?[\d\s-]{10,}$/.test(data.phone)) {
            errors.push('Invalid phone number format');
        }

        return errors;
    }

    static validateEducation(data: Education[]): string[] {
        const errors: string[] = [];

        if (!data || data.length === 0) {
            errors.push('At least one education entry is required');
            return errors;
        }

        data.forEach((edu, index) => {
            if (!edu.course.trim()) {
                errors.push(`Course is required for education entry ${index + 1}`);
            }
            if (!edu.institution.trim()) {
                errors.push(`Institution is required for education entry ${index + 1}`);
            }
            if (!edu.year.trim()) {
                errors.push(`Year is required for education entry ${index + 1}`);
            }
        });

        return errors;
    }

    static validateCertifications(data: Certification[]): string[] {
        const errors: string[] = [];

        if (!data || data.length === 0) {
            errors.push('At least one certification is required');
            return errors;
        }

        data.forEach((cert, index) => {
            if (!cert.name.trim()) {
                errors.push(`Certification name is required for entry ${index + 1}`);
            }
            if (!cert.issuer.trim()) {
                errors.push(`Issuing organization is required for certification ${index + 1}`);
            }
            if (!cert.year.trim()) {
                errors.push(`Year is required for certification ${index + 1}`);
            }
        });

        return errors;
    }

    static validateSocialMedia(data: SocialMedia): string[] {
        const errors: string[] = [];
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

        if (data.website && !urlPattern.test(data.website)) {
            errors.push('Invalid website URL format');
        }
        if (data.facebook && !urlPattern.test(data.facebook)) {
            errors.push('Invalid Facebook URL format');
        }
        if (data.instagram && !urlPattern.test(data.instagram)) {
            errors.push('Invalid Instagram URL format');
        }
        if (data.linkedin && !urlPattern.test(data.linkedin)) {
            errors.push('Invalid LinkedIn URL format');
        }
        if (data.twitter && !urlPattern.test(data.twitter)) {
            errors.push('Invalid Twitter URL format');
        }

        return errors;
    }

    static validateForm(data: TrainerFormData): string[] {
        const errors: string[] = [
            ...this.validatePersonalInfo(data.personalInfo),
            ...this.validateEducation(data.education),
            ...this.validateCertifications(data.certifications),
            ...this.validateSocialMedia(data.socialMedia)
        ];

        return errors;
    }
}

export class TrainerModel {
    private data: TrainerFormData;

    constructor(data: TrainerFormData) {
        this.data = data;
    }

    validate(): string | null {
        if (!this.data.bio) {
            return 'Bio is required';
        }
        if (!this.data.experience) {
            return 'Experience is required';
        }
        if (!this.data.location) {
            return 'Location is required';
        }
        if (!this.data.phone) {
            return 'Phone number is required';
        }
        if (!this.data.charge) {
            return 'Hourly rate is required';
        }
        if (this.data.education.length === 0) {
            return 'At least one education entry is required';
        }
        if (this.data.certificates.length === 0) {
            return 'At least one certificate is required';
        }
        return null;
    }

    toJSON(): TrainerFormData {
        return {
            ...this.data,
            experience: Number(this.data.experience),
            age: Number(this.data.age),
            charge: Number(this.data.charge)
        };
    }
} 