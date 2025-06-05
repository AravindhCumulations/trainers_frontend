export interface Workshop {
    id: string;
    title: string;
    description: string;
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

// export interface WorkshopFormData {
//     id: string;
//     title: string;
//     description: string;
//     price: string;
//     targetAudience: string;
//     format: string;
//     image: string;
//     objectives?: string;
//     outcomes?: string;
//     handouts?: string;
//     programFlow?: string;
//     evaluation?: string;
//     isCaseStudy?: boolean;
// }

// export class WorkshopModel {
//     private data: WorkshopFormData;

//     constructor(data: WorkshopFormData) {
//         this.data = data;
//     }

//     validate(): string | null {
//         if (!this.data.title) {
//             return 'Title is required';
//         }
//         if (!this.data.description) {
//             return 'Description is required';
//         }
//         if (!this.data.price) {
//             return 'Price is required';
//         }
//         if (!this.data.targetAudience) {
//             return 'Target audience is required';
//         }
//         if (!this.data.format) {
//             return 'Format is required';
//         }
//         if (!this.data.image) {
//             return 'Image URL is required';
//         }
//         return null;
//     }

//     toJSON(): Workshop {
//         return {
//             id: this.data.id || Date.now().toString(),
//             title: this.data.title,
//             description: this.data.description,
//             price: parseFloat(this.data.price),
//             targetAudience: this.data.targetAudience,
//             format: this.data.format as 'virtual' | 'In-Person',
//             image: this.data.image,
//             objectives: this.data.objectives || this.data.description,
//             outcomes: this.data.outcomes || '',
//             handouts: this.data.handouts || '',
//             programFlow: this.data.programFlow || '',
//             evaluation: this.data.evaluation || '',
//             isCaseStudy: false
//         };
//     }
// } 