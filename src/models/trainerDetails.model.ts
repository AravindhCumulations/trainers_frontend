import { Certification, Education, Testimonial, Client, Workshop, CaseStudy } from "@/models/trainer.models";
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
    website: string;

    // testimonials
    testimonilas: Testimonial[];
    workshop: Workshop[];
    casestudy: CaseStudy[];

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
    table_ftex: any[];
    trainer: string;
    total_reviews: number;
    reviews: string[];
    clients: string[];
    client_worked: Client[];
    is_unlocked?: boolean;
}


export interface TrainerFormDto {
    // personalInfo


    // image: string;
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
    email: string;
    trainer: string;

    image: string;

    // education
    education: Education[];

    // certifications
    certificates: Certification[];

    //social media links
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    website: string;

    // testimonials
    testimonilas: Testimonial[];

}


