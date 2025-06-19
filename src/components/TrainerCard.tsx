import { memo, useState } from 'react';
import { TrainerCardProps } from '../models/trainerCard.model';
import { trainerApis } from '../lib/apis/trainer.apis';
import Image from 'next/image';
import { usePopup } from '@/lib/hooks/usePopup';
import { useUser } from '@/context/UserContext';
// import { useNavigation } from '@/lib/hooks/useNavigation';

const TrainerCard = memo(({ trainer, onClick, viewMode, onWishlistUpdate, callLogin }: TrainerCardProps) => {
    const [isWishlisted, setIsWishlisted] = useState(trainer.is_wishlisted === 1 || viewMode === "wishlisted");
    const { toastSuccess, toastError } = usePopup();
    const { user } = useUser();
    // const { handleNavigation } = useNavigation();

    const handleWishlist = async (name: string, is_wishlisted: number) => {
        if (!user.isLoggedIn || user.role === 'guest') {
            console.log("1->");

            if (callLogin) {
                console.log("2->");

                callLogin();
            }
            return;
        }

        try {
            if (is_wishlisted === 1 || viewMode === "wishlisted") {
                await trainerApis.wishlist.removeFromWishlist(name);
                setIsWishlisted(false);
                onWishlistUpdate?.(trainer, false);
                toastSuccess('Trainer removed from wishlist');
            } else {
                await trainerApis.wishlist.addToWishlist(name);
                setIsWishlisted(true);
                onWishlistUpdate?.(trainer, true);
                toastSuccess('Trainer added to wishlist');
            }
        } catch (error) {
            console.error('Error handling wishlist:', error);
            // Revert the state if the API call fails
            setIsWishlisted(is_wishlisted === 1 || viewMode === "wishlisted");
            toastError('Failed to update wishlist. Please try again.');
        }
    };

    return (
        <div
            className="trainer-card-cont"
            onClick={() => onClick(trainer)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onClick(trainer)}
        >
            {/* Trainer image */}
            <div className="trainer-card-image">
                <div className="w-full h-full overflow-hidden relative">
                    <Image
                        src={trainer.image || '/default_trainer.png'}
                        alt={`${trainer.full_name}'s profile picture`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover hover:scale-110 transition-all duration-300 ease-in-out"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleWishlist(trainer.name, trainer.is_wishlisted);
                    }}
                    className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-white/80 rounded-full p-1 shadow hover:bg-red-100 transition trainer-card-fav-btn"
                    aria-label="Add to wishlist"
                >
                    <svg
                        width="16"
                        height="16"
                        fill={isWishlisted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className={`${isWishlisted ? "text-red-500" : "text-gray-500"} sm:w-5 sm:h-5`}
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </div>

            {/* Trainer info */}
            <div className="text-left w-full flex-grow">
                <span className="block text-base sm:text-lg lg:text-[18px] flex gap-1 sm:gap-2 font-bold text-[#111827] leading-tight sm:leading-snug lg:leading-[28px] mb-1 sm:mb-0.5 trainer-card-name">
                    {trainer.full_name}
                    <svg width="20" height="21" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6 lg:w-6 lg:h-6 flex-shrink-0">
                        <path d="M3.84922 9.1201C3.70326 8.46262 3.72567 7.77894 3.91437 7.13244C4.10308 6.48593 4.45196 5.89754 4.92868 5.42182C5.40541 4.9461 5.99453 4.59844 6.64142 4.41109C7.28832 4.22374 7.97205 4.20276 8.62922 4.3501C8.99093 3.7844 9.48922 3.31886 10.0782 2.99638C10.6671 2.67391 11.3278 2.50488 11.9992 2.50488C12.6707 2.50488 13.3313 2.67391 13.9203 2.99638C14.5092 3.31886 15.0075 3.7844 15.3692 4.3501C16.0274 4.20212 16.7123 4.22301 17.3602 4.41081C18.0081 4.59862 18.598 4.94724 19.0751 5.42425C19.5521 5.90126 19.9007 6.49117 20.0885 7.1391C20.2763 7.78703 20.2972 8.47193 20.1492 9.1301C20.7149 9.49181 21.1805 9.9901 21.5029 10.579C21.8254 11.168 21.9944 11.8286 21.9944 12.5001C21.9944 13.1715 21.8254 13.8322 21.5029 14.4211C21.1805 15.0101 20.7149 15.5084 20.1492 15.8701C20.2966 16.5273 20.2756 17.211 20.0882 17.8579C19.9009 18.5048 19.5532 19.0939 19.0775 19.5706C18.6018 20.0473 18.0134 20.3962 17.3669 20.5849C16.7204 20.7736 16.0367 20.7961 15.3792 20.6501C15.018 21.218 14.5193 21.6855 13.9293 22.0094C13.3394 22.3333 12.6772 22.5032 12.0042 22.5032C11.3312 22.5032 10.669 22.3333 10.0791 22.0094C9.48914 21.6855 8.99045 21.218 8.62922 20.6501C7.97205 20.7974 7.28832 20.7765 6.64142 20.5891C5.99453 20.4018 5.40541 20.0541 4.92868 19.5784C4.45196 19.1027 4.10308 18.5143 3.91437 17.8678C3.72567 17.2213 3.70326 16.5376 3.84922 15.8801C3.27917 15.5193 2.80963 15.0203 2.48426 14.4293C2.1589 13.8384 1.98828 13.1747 1.98828 12.5001C1.98828 11.8255 2.1589 11.1618 2.48426 10.5709C2.80963 9.97992 3.27917 9.48085 3.84922 9.1201Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 12.5L11 14.5L15 10.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>

                <span className="block text-[#EAB308] text-sm sm:text-base" aria-label={`${trainer.avg_rating} out of 5 stars`}>
                    {'★'.repeat(Math.round(trainer.avg_rating))}{'☆'.repeat(5 - Math.round(trainer.avg_rating))}
                </span>

                <div className="text-[#4B5563]">
                    <span className="block text-xs sm:text-sm font-normal leading-tight sm:leading-[20px] mb-1 flex items-center gap-1 trainer-card-skills line-clamp-2">
                        {(trainer.expertise_in)
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean)
                            .slice(0, 5)
                            .join(", ")}{" "}
                    </span>

                    <span className="block text-xs sm:text-sm font-normal leading-tight sm:leading-[20px] mb-1 trainer-card-exp line-clamp-1">
                        {trainer.experience} years   • {trainer.city}
                    </span>

                    <span className="block text-xs sm:text-sm font-normal leading-tight sm:leading-[20px] mb-1 trainer-card-lang line-clamp-1">
                        {trainer.language}
                    </span>
                </div>
            </div>

            {/* Trainer bottom info */}
            <div className="flex items-center w-full justify-between mt-auto trainer-card-bottom h-6 sm:h-7 lg:h-[30px]">
                <span className="text-xs sm:text-sm font-semibold text-[#111827] leading-tight sm:leading-[20px] trainer-card-price">
                    ₹{trainer.charge}/hour
                </span>
                <span className="flex items-center text-xs sm:text-sm font-normal text-[#6B7280] leading-tight sm:leading-[20px] trainer-card-views justify-between gap-1 sm:gap-[4px] text-center">
                    <svg width="14" height="13" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex items-center sm:w-4 sm:h-4 lg:w-[17px] lg:h-4">
                        <path d="M1.9323 8.23224C1.87673 8.08256 1.87673 7.91792 1.9323 7.76824C2.47343 6.45614 3.39197 5.33427 4.57148 4.54484C5.75098 3.75541 7.13832 3.33398 8.55763 3.33398C9.97693 3.33398 11.3643 3.75541 12.5438 4.54484C13.7233 5.33427 14.6418 6.45614 15.183 7.76824C15.2385 7.91792 15.2385 8.08256 15.183 8.23224C14.6418 9.54434 13.7233 10.6662 12.5438 11.4556C11.3643 12.2451 9.97693 12.6665 8.55763 12.6665C7.13832 12.6665 5.75098 12.2451 4.57148 11.4556C3.39197 10.6662 2.47343 9.54434 1.9323 8.23224Z" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.55859 10C9.66316 10 10.5586 9.10457 10.5586 8C10.5586 6.89543 9.66316 6 8.55859 6C7.45402 6 6.55859 6.89543 6.55859 8C6.55859 9.10457 7.45402 10 8.55859 10Z" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {trainer.profile_views}
                </span>
            </div>
        </div>
    );
});

TrainerCard.displayName = 'TrainerCard';

export default TrainerCard; 