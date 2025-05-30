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
    city: string;
    dob: string;
}
export interface ProfessionalInfo {
    expertise: string[];
    languages_known: string;
    hourly_rate: string;
    phone: string;
    email: string;
}

export interface SocialMedia {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    website: string;
}

export interface Testimonial {
    reviewer_name: string;
    reviewer_org: string
    content: string;
}

export interface TrainerFormData {
    personalInfo: PersonalInfo;
    professionalInfo: ProfessionalInfo;
    education: Education[];
    certifications: Certification[];
    socialMedia: SocialMedia;
    testimonials: Testimonial[]; // ← added

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

        if (!data.city.trim()) {
            errors.push('Location is required');
        }
        if (!data.dob.trim()) {
            errors.push('Date of birth is required');
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
            // if (!cert.issuer.trim()) {
            //     errors.push(`Issuing organization is required for certification ${index + 1}`);
            // }
            // if (!cert.year.trim()) {
            //     errors.push(`Year is required for certification ${index + 1}`);
            // }
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


