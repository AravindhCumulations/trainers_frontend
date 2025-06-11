import Image from "next/image";
import { motion } from "framer-motion";
import { Workshop } from "@/models/workshop.models";

interface WorkshopCardProps {
    workshop: Workshop;
    onClick: () => void;
    tag: string;
}

const WorkshopCard = ({ workshop, onClick, tag = "workshop" }: WorkshopCardProps) => {
    // Determine appropriate dimensions and text sizes based on isSmall prop
    const cardClasses = `bg-white border-2 rounded-lg shadow-lg overflow-hidden max-w-lg cursor-pointer h-[300px] w-[320px] flex flex-col`;
    const imageClasses = `relative h-32 flex-shrink-0`;
    const titleClasses = `text-md font-semibold mb-1 line-clamp-1 py-1`;
    const descriptionClasses = `text-sm text-gray-600 line-clamp-3 overflow-hidden`;
    const priceClasses = `text-green-600 font-bold text-sm pl-2 py-2`;

    console.log(workshop);


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
            </div>
            <div className="p-2 px-3 flex flex-col flex-grow">
                {" "}
                {/* Reduced padding */}

                <h2 className={titleClasses}>{workshop.title}</h2>
                <div className="flex flex-row flex-grow overflow-hidden">
                    <div className="h-[4.5rem] overflow-hidden">
                        <p className={descriptionClasses}>{workshop.objectives}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-auto">
                    <span className={priceClasses}>
                        ₹ {workshop.price.toFixed(2)}
                    </span>
                    <div className=" bg-blue-100 px-2 py-1 rounded-md shadow-sm ">
                        <p className="text-semibold text-sm text-blue-600">{tag}</p>
                    </div>

                </div>
            </div>

        </motion.div>
    );
};

export default WorkshopCard; 