import Image from "next/image";
import { motion } from "framer-motion";
import { Workshop } from "@/models/workshop.models";
import { getPlainText } from "@/utils/common.utils";

interface WorkshopCardProps {
    workshop: Workshop;
    onClick: () => void;
    tag: string;
}

const WorkshopCard = ({ workshop, onClick, tag = "workshop" }: WorkshopCardProps) => {
    // Determine appropriate dimensions and text sizes based on isSmall prop
    const cardClasses = `bg-white border-2 rounded-lg shadow-lg overflow-hidden max-w-lg cursor-pointer h-[300px] w-[320px]`;
    const imageClasses = `relative h-32`;
    const titleClasses = `text-md font-semibold mb-1 line-clamp-1 py-1`;
    const descriptionClasses = `text-sm text-gray-600 mb-4 line-clamp-2`;
    const priceClasses = `text-green-600 font-bold text-sm pl-2 py-2`;
    const audienceFormatClasses = `text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded `;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cardClasses}
            onClick={onClick}
        >
            <div className={imageClasses}>
                <Image
                    src={workshop.image}
                    alt={workshop.title}
                    fill
                    className="object-cover z-0"
                />
                <div className="absolute z-2 w-[max-content] top-0 left-0 rounded-br-md bg-white px-2 py-1.5 mb-1">
                    <p className="text-semibold text-sm text-blue-600">{tag}</p>
                </div>
            </div>
            <div className="p-2 px-3">
                {" "}
                {/* Reduced padding */}

                <h2 className={titleClasses}>{workshop.title}</h2>
                <p className={descriptionClasses}>{getPlainText(workshop.description)}</p>
                <div className="flex flex-col justify-between items-start">
                    <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
                        {workshop.targetAudience?.split(',').map((audience, index) => (
                            <span key={index} className={`${audienceFormatClasses}`}>{audience.trim()}</span>
                        ))}
                    </div>
                    <span className={priceClasses}>
                        ₹ {workshop.price.toFixed(2)}
                    </span>

                </div>
            </div>
        </motion.div>
    );
};

export default WorkshopCard; 