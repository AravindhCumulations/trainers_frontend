import { TrainerDetailsModel } from "@/models/trainerDetails.model";
import { Workshop } from "@/models/workshop.models";

export const initialWorkshops: Workshop[] = [
    {
        idx: '1',
        title: 'Fitness Fundamentals',
        price: 99.99,
        target_audience: 'Beginners',
        format: 'Virtual',
        image: '/assets/w1.jpg',

        objectives: 'Introduce participants to foundational fitness principles, correct form, and safe workout practices.',
        outcomes: 'Participants will gain a strong understanding of workout basics, improved posture, and a personalized beginner routine.',
        handouts: 'Beginner workout guide PDF, Nutrition basics cheat sheet, Weekly planner template.',
        evaluation: 'Pre- and post-session self-assessment, interactive quiz, and live Q&A participation.',
        program_flow: `
          1. Welcome and Introduction
          2. Understanding Fitness & Goal Setting
          3. Basic Movement Patterns (with live demos)
          4. Building a Routine: Cardio, Strength & Flexibility
          5. Nutrition 101 for Beginners
          6. Q&A and Wrap-Up
        `
    },

    {
        idx: '2',
        title: 'Advanced Nutrition Masterclass',

        price: 149.99,
        target_audience: 'Intermediate',
        format: 'In-Person',
        image: '/assets/w2.jpg',
        objectives: 'dsometing ',
        outcomes: 'dsometing ',
        handouts: 'dsometing ',
        evaluation: 'dsometing ',
        program_flow: 'dsomething',


    },
    {
        idx: '3',
        title: 'Mental Wellness Workshop',

        price: 129.99,
        target_audience: 'All Levels',
        format: 'virtual',
        image: '/assets/w3.jpg',
        objectives: 'dsometing ',
        outcomes: 'dsometing ',
        handouts: 'dsometing ',
        evaluation: 'dsometing ',
        program_flow: 'dsomething',
    },
    {
        idx: '4',
        title: 'High-Intensity Training Program',

        price: 199.99,
        target_audience: 'Advanced',
        format: 'In-Person',
        image: '/assets/w2.jpg',
        objectives: 'dsometing ',
        outcomes: 'dsometing ',
        handouts: 'dsometing ',
        evaluation: 'dsometing ',
        program_flow: 'dsomething',


    }
];


export const dummyTrainerDetails: TrainerDetailsModel = {
    bio_line: "Helping people unlock their true potential through mindful leadership.",
    training_approach: "My sessions are interactive, story-driven, and focused on experiential learning.",
    experience: 8,
    city: "Bangalore",
    dob: "1990-05-15",

    expertise_in: "Leadership, Development, Skills",
    language: "English, Hindi",
    charge: 3500,
    phone: "+91-9876543210",

    education: [
        {
            course: "MBA in Human Resource Management",
            institution: "IIM Bangalore",
            year: "2014",
        },
        {
            course: "B.Sc Psychology",
            institution: "Delhi University",
            year: "2011",
        },
    ],

    certificates: [
        {
            certificate_name: "Certified NLP Practitioner",
            issued_by: "International NLP Board",
            issued_date: "2017",
            certificate_url: "some"
        },
        {
            certificate_name: "Train the Trainer",
            issued_by: "Dale Carnegie",
            issued_date: "2016",
            certificate_url: "some"

        },
    ],

    facebook: "https://facebook.com/trainer.surya",
    instagram: "https://instagram.com/surya.trains",
    linkedin: "https://linkedin.com/in/suryatrainer",
    twitter: "https://twitter.com/surya_trains",
    personal_website: "https://www.suryatrains.com",

    testimonials: [
        {
            client_name: "Rohit Verma",
            company: "Wipro",
            testimonials: "Surya’s leadership workshop helped us break silos and build strong cross-functional teams. Very impactful!"
        },
        {
            client_name: "Neha Sharma",
            company: "Cognizant",
            testimonials: "The program was engaging and relevant. Our managers found immediate value in the communication tools introduced."
        },
        {
            client_name: "Aarav Desai",
            company: "Capgemini",
            testimonials: "Excellent delivery, customized content, and great interaction throughout. Surya truly understands corporate training needs."
        }
    ],


    reviews: [
        {
            user_name: "Anjali Rao",
            rating: 4.8,
            review: "Surya’s session on Emotional Intelligence was eye-opening and practical.",
            creation: "2025-03-20T12:15:00Z"
        },
        {
            user_name: "Karthik Menon",
            rating: 4.6,
            review: "Highly interactive and personalized learning experience. Would recommend!",
            creation: "2025-04-10T09:45:00Z"
        }
    ],

    workshop: [
        {
            idx: 1,
            title: "Strategic Communication for Leaders",
            objectives: "Enhance clarity and influence in leadership communication.",
            price: 4999,
            target_audience: "Mid-level Managers",
            format: "In-person",
            image: "",
            outcomes: "Improved team alignment and communication efficiency.",
            handouts: "Workshop workbook, communication toolkit",
            program_flow: "Icebreakers → Case Studies → Group Exercises → Wrap-up",
            evaluation: "Post-workshop feedback form + quiz"
        }
    ],

    casestudy: [
        {
            idx: 1,
            title: "Driving Innovation Culture at FinTech Co.",
            objectives: "Help the client foster an innovation-led mindset.",
            price: 0, // assuming case studies are not priced
            target_audience: "Leadership and Innovation Teams",
            format: "Consulting & Coaching",
            image: "",
            outcomes: "Idea generation increased by 60% in Q2.",
            handouts: "Innovation Playbook, Success Stories",
            program_flow: "Stakeholder Interviews → Strategy Sessions → Implementation",
            evaluation: "ROI assessment and employee feedback"
        }
    ],

    client_worked: [
        {
            idx: 1,
            company: "Infosys"
        },
        {
            idx: 2,
            company: "Mindtree"
        }
    ],

    creation: "2024-10-10T10:20:30Z",
    docstatus: 1,
    avg_rating: 4.8,
    doctype: "Trainer Profile",
    full_name: "Surya Mehta",
    idx: 1,
    image: "",
    modified: "2025-05-01T09:10:00Z",
    modified_by: "admin@example.com",
    name: "TRN-001",
    owner: "admin@example.com",
    profile_views: 325,
    table_ftex: [
        { topic: "Emotional Intelligence", score: 87, certified: true },
        { topic: "Agile Leadership", score: 92, certified: false },
    ],
    trainer: "TRN-001",
    total_reviews: 24,
    clients: ["Infosys", "TCS", "Mindtree"],

    is_unlocked: true,
};
