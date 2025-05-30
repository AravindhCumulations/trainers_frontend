import { Certification,Education,Testimonial } from "@/models/trainer.models";
export interface TrainerDetailsModel {
    avg_rating: number;
    bio_line: string;
    charge: number;
    creation: string;
    docstatus: number;
    doctype: string;
    experience: number;
    expertise_in: string;
    full_name: string;
    idx: number;
    image: string;
    language: string; // replace with a specific type if known
    modified: string;
    modified_by: string;
    name: string;
    owner: string;
    profile_views: number;
    table_ftex: any[];
    trainer: string;


    education: Education[]; // replace with a specific type if known
    certifications : Certification[];
    reviews: string[];
    clients:string[];
    testimonials:Testimonial[];
}

