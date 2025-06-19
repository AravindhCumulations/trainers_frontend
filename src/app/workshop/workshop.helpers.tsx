import { TrainerFormDto } from "@/models/trainerDetails.model";
import { Workshop } from "@/models/workshop.models"; //update moel

export const constructWorkshopPayload = (workshops: Workshop[], caseStudies: Workshop[], trainerId: string, isCaseStudy: boolean): Partial<TrainerFormDto> => {
    const basePayload = {
        name: trainerId
    };

    if (isCaseStudy) {
        const payload = {
            ...basePayload,
            casestudy: caseStudies.map(caseStudy => ({
                title: caseStudy.title,
                objectives: caseStudy.objectives,
                price: caseStudy.price,
                target_audience: caseStudy.targetAudience,
                format: caseStudy.format,
                image: caseStudy.image,
                outcomes: caseStudy.outcomes,
                handouts: caseStudy.handouts,
                program_flow: caseStudy.programFlow,
                evaluation: caseStudy.evaluation
            }))
        } as any;
        console.log('Constructed Case Study Payload:', payload);
        return payload;
    }

    const payload = {
        ...basePayload,
        workshop: workshops.map(workshop => ({
            title: workshop.title,
            objectives: workshop.objectives,
            price: workshop.price,
            target_audience: workshop.targetAudience,
            format: workshop.format,
            image: workshop.image,
            outcomes: workshop.outcomes,
            handouts: workshop.handouts,
            program_flow: workshop.programFlow,
            evaluation: workshop.evaluation
        }))
    } as any;
    console.log('Constructed Workshop Payload:', payload);
    return payload;
};

export const addWorkshop = (workshops: Workshop[], caseStudies: Workshop[], newWorkshop: Workshop, isCaseStudy: boolean) => {
    console.log('Adding new item:', { newWorkshop, isCaseStudy });
    if (isCaseStudy) {
        return {
            workshops: [...workshops],
            caseStudies: [...caseStudies, newWorkshop]
        };
    }
    return {
        workshops: [...workshops, newWorkshop],
        caseStudies: [...caseStudies]
    };
};

export const updateWorkshop = (workshops: Workshop[], caseStudies: Workshop[], updatedWorkshop: Workshop, isCaseStudy: boolean) => {
    console.log('Updating item:', { updatedWorkshop, isCaseStudy });
    if (isCaseStudy) {
        return {
            workshops: [...workshops],
            caseStudies: caseStudies.map(workshop =>
                workshop.idx === updatedWorkshop.idx ? updatedWorkshop : workshop
            )
        };
    }
    return {
        workshops: workshops.map(workshop =>
            workshop.idx === updatedWorkshop.idx ? updatedWorkshop : workshop
        ),
        caseStudies: [...caseStudies]
    };
};

export const deleteWorkshop = (workshops: Workshop[], caseStudies: Workshop[], idx: string, isCaseStudy: boolean) => {
    console.log('Deleting item:', { idx, isCaseStudy });
    if (isCaseStudy) {
        return {
            workshops: [...workshops],
            caseStudies: caseStudies.filter(workshop => workshop.idx !== idx)
        };
    }
    return {
        workshops: workshops.filter(workshop => workshop.idx !== idx),
        caseStudies: [...caseStudies]
    };
};