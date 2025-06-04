//@Model
export interface TrainerCardModel {
    name: string;
    full_name: string;
    avg_rating: number;
    expertise_in: string;
    city: string;
    language: String;
    charge: number;
    profile_views: number;
    status: any;
    image: string;
    is_wishlisted: number;
}

export interface Expertise {
    expetrise: string;
}
export interface Languages {
    expetrise: string;
}


//@Types GridProps
export interface TrainerGridProps {
    trainers: TrainerCardModel[];
    limit?: number | 'all';
}




export interface TrainerCardProps {
    trainer: TrainerCardModel;
    onClick: (trainer: TrainerCardModel) => void;
    viewMode?: string;
}

export interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
} 