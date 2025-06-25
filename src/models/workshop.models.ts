export interface Workshop {
    idx: string;
    title: string;
    objectives: string,
    price: number;
    target_audience: string;
    format: string;
    image: string;
    outcomes: string;
    handouts: string;
    program_flow: string;
    evaluation: string;
    type: 'Workshop' | 'CaseStudy';
}

export class WorkshopModel {
    private data: Workshop;

    constructor(data: Workshop) {
        this.data = data;
    }

    validate(): string | null {
        if (!this.data.title) {
            return 'Title is required';
        }
        if (!this.data.objectives) {
            return 'Objectives is required';
        }
        if (!this.data.price) {
            return 'Price is required';
        }
        if (!this.data.target_audience) {
            return 'Target audience is required';
        }
        if (!this.data.format) {
            return 'Format is required';
        }
        if (!this.data.type) {
            return 'Type is required';
        }
        if (!this.data.outcomes) {
            return 'Outcomes is required';
        }
        if (!this.data.handouts) {
            return 'Handouts is required';
        }
        if (!this.data.program_flow) {
            return 'program_flow is required';
        }
        if (!this.data.evaluation) {
            return 'Evaluation is required';
        }

        // if (!this.data.image) {
        //     return 'Image URL is required';
        // }
        return null;
    }

    toJSON(): Workshop {
        return {
            idx: this.data.idx || Date.now().toString(),
            title: this.data.title,
            price: this.data.price,
            target_audience: this.data.target_audience,
            format: this.data.format as 'virtual' | 'In-Person',
            image: this.data.image,
            objectives: this.data.objectives,
            outcomes: this.data.outcomes || '',
            handouts: this.data.handouts || '',
            program_flow: this.data.program_flow || '',
            evaluation: this.data.evaluation || '',
            type: this.data.type
        };
    }
} 