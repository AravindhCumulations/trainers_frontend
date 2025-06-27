import { TrainerFormDto } from "@/models/trainerDetails.model";
import { Workshop } from "@/models/workshop.models";

export const constructWorkshopPayload = (workshops: Workshop[], trainerId: string): Partial<TrainerFormDto> => {
    const basePayload = {
        name: trainerId
    };






    // Split workshops by type for payload
    const workshopList = workshops.map(workshop => ({
        title: workshop.title,
        objectives: workshop.objectives,
        price: workshop.price,
        target_audience: workshop.target_audience,
        format: workshop.format,
        image: workshop.image,
        outcomes: workshop.outcomes,
        handouts: workshop.handouts,
        program_flow: workshop.program_flow,
        evaluation: workshop.evaluation,
        type: workshop.type
    }));


    const payload = {
        ...basePayload,
        workshop: workshopList,
    } as any;

    return payload;
};

export const addWorkshop = (workshops: Workshop[], newWorkshop: Workshop) => {
    return [...workshops, newWorkshop];
};

export const updateWorkshop = (workshops: Workshop[], updatedWorkshop: Workshop) => {
    return workshops.map(workshop =>
        workshop.idx === updatedWorkshop.idx ? updatedWorkshop : workshop
    );
};

export const deleteWorkshop = (workshops: Workshop[], idx: string) => {
    return workshops.filter(workshop => workshop.idx !== idx);
};