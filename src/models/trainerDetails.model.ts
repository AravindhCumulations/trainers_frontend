export interface Education {
    course: string;
    institution: string;
    year: string;
}

export interface Certification {
    certificate_name: string;
    issued_by: string;
    issued_date: string;
    certificate_url: string;

}

export interface Testimonial {
    client_name: string;
    company: string;
    testimonials: string;
}

export interface Review {
    user_name: string;
    rating: number;
    review: string;
    creation: string;

}

export interface Workshop {

    idx: number,
    title: string,
    objectives: string,
    price: number,
    target_audience: string,
    format: string,
    image: string,
    outcomes: string;
    handouts: string;
    program_flow: string;
    evaluation: string;

}

export interface CaseStudy {

    idx: number,
    title: string,
    objectives: string,
    price: number,
    target_audience: string,
    format: string,
    image: string,
    outcomes: string;
    handouts: string;
    program_flow: string;
    evaluation: string;

}

export interface Client {
    idx: number,
    company: string,

}

export interface TrainerDetailsModel {
    // personalInfo

    bio_line: string;
    trainers_approach: string
    experience: number;
    city: string;
    dob: string;

    // professionalInfo
    expertise_in: string;
    language: string;
    charge: number;
    phone: string;
    // mail:string;

    // education
    education: Education[];

    // certifications
    certificates: Certification[];

    //social media links
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    personal_website: string;

    // testimonials
    testimonilas: Testimonial[];
    workshop: Workshop[];
    casestudy: CaseStudy[];
    reviews: Review[];

    creation: string;
    docstatus: number;
    avg_rating: number;
    doctype: string;
    full_name: string;
    idx: number;
    image: string;
    modified: string;
    modified_by: string;
    name: string;
    owner: string;
    profile_views: number;
    table_ftex: { [key: string]: string | number | boolean }[];
    trainer: string;
    total_reviews: number;
    clients: string[];
    client_worked: Client[];
    is_unlocked?: boolean;
}

export interface TrainerFormDto {
    // personalInfo
    image: string;
    bio_line: string;
    trainers_approach: string
    experience: number;
    city: string;
    dob: string;



    // professionalInfo
    expertise_in: string;
    language: string;
    charge: number;
    phone: string;
    // email: string;
    trainer: string;


    // education
    education: Education[];

    // certifications
    certificates: Certification[];

    //social media links
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    personal_website: string;

    // testimonials
    testimonilas: Testimonial[];

    // clients worked
    client_worked: Client[];
}

// export class TrainerFormValidator {

//     static validateCertifications(data: Certification[]): string[] {
//         const errors: string[] = [];

//         if (!data || data.length === 0) {
//             errors.push('At least one certification is required');
//             return errors;
//         }
//         if (!data || data.length > 3) {
//             errors.push('Only 3 certificates can be Added');
//             return errors;
//         }

//         data.forEach((cert, index) => {
//             if (!cert.certificate_name.trim()) {
//                 errors.push(`Certification name is required for entry ${index + 1}`);
//             }
//             if (!cert.issued_by.trim()) {
//                 errors.push(`Issuing organization is required for certification ${index + 1}`);
//             }
//             if (!cert.issued_date.trim()) {
//                 errors.push(`Year is required for certification ${index + 1}`);
//             }
//         });

//         return errors;
//     }

//     static validateEducation(data: Education[]): string[] {
//         const errors: string[] = [];

//         if (!data || data.length === 0) {
//             errors.push('At least one education entry is required');
//             return errors;
//         }

//         if (data.length > 3) {
//             errors.push('At max three testimonial can be added');
//             return errors;
//         }

//         data.forEach((edu, index) => {
//             if (!edu.course.trim()) {
//                 errors.push(`Course is required for education entry ${index + 1}`);
//             }
//             if (!edu.institution.trim()) {
//                 errors.push(`Institution is required for education entry ${index + 1}`);
//             }
//             if (!edu.year.trim()) {
//                 errors.push(`Year is required for education entry ${index + 1}`);
//             }
//         });

//         return errors;
//     }

//     static validateTestimonials(data: Testimonial[]): string[] {
//         const errors: string[] = [];

//         if (!data || data.length === 0) {
//             errors.push('At least one testimonial is required');
//             return errors;
//         }

//         if (data.length > 3) {
//             errors.push('At max three testimonial can be added');
//             return errors;
//         }

//         data.forEach((testimonial, index) => {
//             if (!testimonial.client_name?.trim()) {
//                 errors.push(`Client name is required for testimonial ${index + 1}`);
//             }
//             if (!testimonial.company?.trim()) {
//                 errors.push(`Company name is required for testimonial ${index + 1}`);
//             }
//             if (!testimonial.testimonials?.trim()) {
//                 errors.push(`Testimonial text is required for entry ${index + 1}`);
//             } else if (testimonial.testimonials.length > 200) {
//                 errors.push(`Testimonial text must be less than 200 characters for entry ${index + 1}`);
//             }
//         });

//         return errors;
//     }

//     static validateClients(data: Client[]): string[] {
//         const errors: string[] = [];

//         if (!data || data.length === 0) {
//             errors.push('At least one company is required');
//             return errors;
//         }

//         if (data.length > 15) {
//             errors.push('Maximum 15 companies can be added');
//             return errors;
//         }

//         data.forEach((client, index) => {
//             if (!client.company?.trim()) {
//                 errors.push(`Company name is required for entry ${index + 1}`);
//             }
//         });

//         return errors;
//     }

//     static validateForm(data: TrainerFormDto): string[] {
//         const errors: string[] = [];

//         // Validate personal info
//         if (!data.bio_line?.trim()) {
//             errors.push('Bio line is required');
//         } else if (data.bio_line.length > 499) {
//             errors.push('Bio line must be less than 500 characters');
//         }

//         if (!data.trainers_approach?.trim()) {
//             errors.push('Trainer approach is required');
//         }
//         else if (data.trainers_approach.length > 499) {
//             errors.push('Trainer approach must be less than 500 characters');
//         }

//         if (!data.experience || data.experience <= 0) {
//             errors.push('Experience must be greater than 0');
//         }

//         if (!data.city?.trim()) {
//             errors.push('City is required');
//         }

//         if (!data.dob?.trim()) {
//             errors.push('Date of birth is required');
//         }

//         // Validate professional info
//         if (!data.expertise_in?.trim()) {
//             errors.push('Expertise is required');
//         }

//         if (!data.language?.trim()) {
//             errors.push('Language is required');
//         }

//         if (!data.charge || data.charge <= 0) {
//             errors.push('Charge must be greater than 0');
//         }



//         // if (!data.email?.trim()) {
//         //     errors.push('Email is required');
//         // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//         //     errors.push('Invalid email format');
//         // }

//         // Validate social media links
//         const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

//         if (data.personal_website && !urlPattern.test(data.personal_website)) {
//             errors.push('Invalid website URL format');
//         }
//         if (data.facebook && !urlPattern.test(data.facebook)) {
//             errors.push('Invalid Facebook URL format');
//         }
//         if (data.instagram && !urlPattern.test(data.instagram)) {
//             errors.push('Invalid Instagram URL format');
//         }
//         if (data.linkedin && !urlPattern.test(data.linkedin)) {
//             errors.push('Invalid LinkedIn URL format');
//         }
//         if (data.twitter && !urlPattern.test(data.twitter)) {
//             errors.push('Invalid Twitter URL format');
//         }

//         // Validate education, certifications and testimonials using existing methods
//         const educationErrors = this.validateEducation(data.education);
//         const certificationErrors = this.validateCertifications(data.certificates);
//         const testimonialErrors = this.validateTestimonials(data.testimonilas);
//         const clientErrors = this.validateClients(data.client_worked);

//         return [...errors, ...educationErrors, ...certificationErrors, ...testimonialErrors, ...clientErrors];
//     }

//     static validatePhoneNumber(phone: string) {
//         const errors: string[] = [];
//         if (!phone?.trim()) {
//             errors.push('Phone number is required');
//         } else if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) {
//             errors.push('Invalid phone number format');
//         }
//         return errors;
//     }

//     static validateWorkshopsOrCaseStudies(workshop: Workshop) {
//         const errors: string[] = [];

//         if (!workshop.title.trim()) {
//             errors.push('Title is Required');
//         }
//         if (!workshop.objectives.trim()) {
//             errors.push('Description is Required');
//         }
//         if (workshop.objectives.length > 200) {
//             errors.push('Description should be between < 200 characters');
//         }
//         if (workshop.price === 0) {
//             errors.push('Price should be > 0');
//         }
//         if (!workshop.target_audience.trim()) {
//             errors.push('Target Audience is Required');
//         }
//         if (!workshop.outcomes.trim()) {
//             errors.push('Outcomes is Required');
//         }
//         if (!workshop.handouts.trim()) {
//             errors.push('Handouts is Required');
//         }
//         if (!workshop.program_flow.trim()) {
//             errors.push('Program Flow is Required');
//         }
//         if (!workshop.evaluation.trim()) {
//             errors.push('Evaluation is Required');
//         }


//         return errors;
//     }

// }
export class TrainerFormValidator {
    static validateForm(data: TrainerFormDto): string[] {
        return [
            ...this.validatePersonalInfo(data),
            ...this.validateProfessionalInfo(data),
            ...this.validateSocialLinks(data),
            ...this.validateEducation(data.education),
            ...this.validateCertifications(data.certificates),
            ...this.validateTestimonials(data.testimonilas),
            ...this.validateClients(data.client_worked)
        ];
    }

    static validateCertifications(data: Certification[]): string[] {
        const errors: string[] = [];

        if (!data || data.length === 0) {
            errors.push('At least one certification is required');
            return errors;
        }
        if (!data || data.length > 3) {
            errors.push('Only 3 certificates can be Added');
            return errors;
        }

        data.forEach((cert, index) => {
            if (!cert.certificate_name.trim()) {
                errors.push(`Certification name is required for entry ${index + 1}`);
            }
            if (!cert.issued_by.trim()) {
                errors.push(`Issuing organization is required for certification ${index + 1}`);
            }
            if (!cert.issued_date.trim()) {
                errors.push(`Year is required for certification ${index + 1}`);
            }
        });

        return errors;
    }

    static validateEducation(data: Education[]): string[] {
        const errors: string[] = [];

        if (!data || data.length === 0) {
            errors.push('At least one education entry is required');
            return errors;
        }

        if (data.length > 3) {
            errors.push('At max three testimonial can be added');
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

    static validateTestimonials(data: Testimonial[]): string[] {
        const errors: string[] = [];

        if (!data || data.length === 0) {
            errors.push('At least one testimonial is required');
            return errors;
        }

        if (data.length > 3) {
            errors.push('At max three testimonial can be added');
            return errors;
        }

        data.forEach((testimonial, index) => {
            if (!testimonial.client_name?.trim()) {
                errors.push(`Client name is required for testimonial ${index + 1}`);
            }
            if (!testimonial.company?.trim()) {
                errors.push(`Company name is required for testimonial ${index + 1}`);
            }
            if (!testimonial.testimonials?.trim()) {
                errors.push(`Testimonial text is required for entry ${index + 1}`);
            } else if (testimonial.testimonials.length > 200) {
                errors.push(`Testimonial text must be less than 200 characters for entry ${index + 1}`);
            }
        });

        return errors;
    }

    static validateClients(data: Client[]): string[] {
        const errors: string[] = [];

        if (!data || data.length === 0) {
            errors.push('At least one company is required');
            return errors;
        }

        if (data.length > 15) {
            errors.push('Maximum 15 companies can be added');
            return errors;
        }

        data.forEach((client, index) => {
            if (!client.company?.trim()) {
                errors.push(`Company name is required for entry ${index + 1}`);
            }
        });

        return errors;
    }

    private static validatePersonalInfo(data: TrainerFormDto): string[] {
        const errors: string[] = [];

        if (!this.hasValue(data.bio_line)) {
            errors.push('Bio line is required');
        } else if (data.bio_line.length > 499) {
            errors.push('Bio line must be less than 500 characters');
        }

        if (!this.hasValue(data.trainers_approach)) {
            errors.push('Trainer approach is required');
        } else if (data.trainers_approach.length > 499) {
            errors.push('Trainer approach must be less than 500 characters');
        }

        if (!data.experience || data.experience <= 0) {
            errors.push('Experience must be greater than 0');
        }

        if (!this.hasValue(data.city)) {
            errors.push('City is required');
        }

        if (!this.hasValue(data.dob)) {
            errors.push('Date of birth is required');
        }

        return errors;
    }

    private static validateProfessionalInfo(data: TrainerFormDto): string[] {
        const errors: string[] = [];

        if (!this.hasValue(data.expertise_in)) {
            errors.push('Expertise is required');
        }

        if (!this.hasValue(data.language)) {
            errors.push('Language is required');
        }

        if (!data.charge || data.charge <= 0) {
            errors.push('Charge must be greater than 0');
        }

        return errors;
    }

    private static validateSocialLinks(data: TrainerFormDto): string[] {
        const errors: string[] = [];
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

        const links = [
            { field: data.personal_website, label: 'website' },
            { field: data.facebook, label: 'Facebook' },
            { field: data.instagram, label: 'Instagram' },
            { field: data.linkedin, label: 'LinkedIn' },
            { field: data.twitter, label: 'Twitter' },
        ];

        links.forEach(link => {
            if (link.field && !urlPattern.test(link.field)) {
                errors.push(`Invalid ${link.label} URL format`);
            }
        });

        return errors;
    }

    private static hasValue(value: string | undefined | null): boolean {
        return !!value?.trim();
    }

    static validatePhoneNumber(phone: string) {
        const errors: string[] = [];
        if (!phone?.trim()) {
            errors.push('Phone number is required');
        } else if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) {
            errors.push('Invalid phone number format');
        }
        return errors;
    }
}


