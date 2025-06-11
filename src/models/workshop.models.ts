export interface Workshop {
    idx: string;
    title: string;
    price: number;
    targetAudience: string;
    format: 'virtual' | 'In-Person';
    image: string;
    objectives: string;
    outcomes: string;
    handouts: string;
    programFlow: string;
    evaluation: string;
    isCaseStudy?: boolean;
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
        if (!this.data.targetAudience) {
            return 'Target audience is required';
        }
        if (!this.data.format) {
            return 'Format is required';
        }
        if (!this.data.isCaseStudy) {
            return 'Type is required';
        }
        if (!this.data.outcomes) {
            return 'Outcomes is required';
        }
        if (!this.data.handouts) {
            return 'Handouts is required';
        }
        if (!this.data.programFlow) {
            return 'ProgramFlow is required';
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
            targetAudience: this.data.targetAudience,
            format: this.data.format as 'virtual' | 'In-Person',
            image: this.data.image,
            objectives: this.data.objectives,
            outcomes: this.data.outcomes || '',
            handouts: this.data.handouts || '',
            programFlow: this.data.programFlow || '',
            evaluation: this.data.evaluation || '',
            isCaseStudy: false
        };
    }
} 