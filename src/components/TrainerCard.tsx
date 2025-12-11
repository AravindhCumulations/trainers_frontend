import { memo, useState, useEffect } from 'react';
import { TrainerCardProps } from '../models/trainerCard.model';
import { trainerApis } from '../lib/apis/trainer.apis';
import Image from 'next/image';
import { usePopup } from '@/lib/hooks/usePopup';
import { useUser } from '@/context/UserContext';
// import { useNavigation } from '@/lib/hooks/useNavigation';

const TrainerCard = memo(({ trainer, onClick, viewMode, onWishlistUpdate, callLogin }: TrainerCardProps) => {
    const [isWishlisted, setIsWishlisted] = useState(trainer.is_wishlisted === 1 || viewMode === "wishlisted");
    const { toastSuccess, toastError, showConfirmation } = usePopup();
    const { user } = useUser();
    // const { handleNavigation } = useNavigation();

    useEffect(() => {
        setIsWishlisted(trainer.is_wishlisted === 1 || viewMode === "wishlisted");
    }, [trainer.is_wishlisted, viewMode]);

    const handleWishlist = async (name: string, is_wishlisted: number) => {
        if (!user.isLoggedIn || user.role === 'guest') {
            if (callLogin) {
                callLogin();
            } else if (showConfirmation) {
                showConfirmation(
                    'You need to be logged in to access this feature. Would you like to proceed to the login page?',
                    () => {
                        window.location.href = '/login';
                    },
                    {
                        title: 'Login Required',
                        confirmText: 'Proceed to Login',
                        cancelText: 'Stay Here'
                    }
                );
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
                        alt={`${trainer.first_name}'s profile picture`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover hover:scale-110 transition-all duration-300 ease-in-out"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
                <div className="flex justify-between items-start mb-1 sm:mb-0.5">
                    <span className="block text-base sm:text-lg lg:text-[18px] flex gap-1 sm:gap-2 font-bold text-[#111827] leading-tight sm:leading-snug lg:leading-[28px] trainer-card-name">
                        {trainer.full_name}
                        <svg width="20" height="21" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6 lg:w-6 lg:h-6 flex-shrink-0">
                            <path d="M3.84922 9.1201C3.70326 8.46262 3.72567 7.77894 3.91437 7.13244C4.10308 6.48593 4.45196 5.89754 4.92868 5.42182C5.40541 4.9461 5.99453 4.59844 6.64142 4.41109C7.28832 4.22374 7.97205 4.20276 8.62922 4.3501C8.99093 3.7844 9.48922 3.31886 10.0782 2.99638C10.6671 2.67391 11.3278 2.50488 11.9992 2.50488C12.6707 2.50488 13.3313 2.67391 13.9203 2.99638C14.5092 3.31886 15.0075 3.7844 15.3692 4.3501C16.0274 4.20212 16.7123 4.22301 17.3602 4.41081C18.0081 4.59862 18.598 4.94724 19.0751 5.42425C19.5521 5.90126 19.9007 6.49117 20.0885 7.1391C20.2763 7.78703 20.2972 8.47193 20.1492 9.1301C20.7149 9.49181 21.1805 9.9901 21.5029 10.579C21.8254 11.168 21.9944 11.8286 21.9944 12.5001C21.9944 13.1715 21.8254 13.8322 21.5029 14.4211C21.1805 15.0101 20.7149 15.5084 20.1492 15.8701C20.2966 16.5273 20.2756 17.211 20.0882 17.8579C19.9009 18.5048 19.5532 19.0939 19.0775 19.5706C18.6018 20.0473 18.0134 20.3962 17.3669 20.5849C16.7204 20.7736 16.0367 20.7961 15.3792 20.6501C15.018 21.218 14.5193 21.6855 13.9293 22.0094C13.3394 22.3333 12.6772 22.5032 12.0042 22.5032C11.3312 22.5032 10.669 22.3333 10.0791 22.0094C9.48914 21.6855 8.99045 21.218 8.62922 20.6501C7.97205 20.7974 7.28832 20.7765 6.64142 20.5891C5.99453 20.4018 5.40541 20.0541 4.92868 19.5784C4.45196 19.1027 4.10308 18.5143 3.91437 17.8678C3.72567 17.2213 3.70326 16.5376 3.84922 15.8801C3.27917 15.5193 2.80963 15.0203 2.48426 14.4293C2.1589 13.8384 1.98828 13.1747 1.98828 12.5001C1.98828 11.8255 2.1589 11.1618 2.48426 10.5709C2.80963 9.97992 3.27917 9.48085 3.84922 9.1201Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 12.5L11 14.5L15 10.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    
                    {trainer.is_unlocked === 1 && (
                        <svg width="20" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6 lg:w-6 lg:h-6 flex-shrink-0">
                            <mask id="mask0_29_19" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                <rect width="24" height="24" fill="#D9D9D9"/>
                            </mask>
                            <g mask="url(#mask0_29_19)">
                                <path d="M6.30775 8.5H15V6.5C15 5.66667 14.7083 4.95833 14.125 4.375C13.5417 3.79167 12.8333 3.5 12 3.5C11.1667 3.5 10.4583 3.79167 9.875 4.375C9.29167 4.95833 9 5.66667 9 6.5H7.5C7.5 5.25133 7.93783 4.18917 8.8135 3.3135C9.68917 2.43783 10.7513 2 12 2C13.2487 2 14.3108 2.43783 15.1865 3.3135C16.0622 4.18917 16.5 5.25133 16.5 6.5V8.5H17.6923C18.1909 8.5 18.6169 8.67658 18.9703 9.02975C19.3234 9.38308 19.5 9.80908 19.5 10.3077V19.6923C19.5 20.1909 19.3234 20.6169 18.9703 20.9703C18.6169 21.3234 18.1909 21.5 17.6923 21.5H6.30775C5.80908 21.5 5.38308 21.3234 5.02975 20.9703C4.67658 20.6169 4.5 20.1909 4.5 19.6923V10.3077C4.5 9.80908 4.67658 9.38308 5.02975 9.02975C5.38308 8.67658 5.80908 8.5 6.30775 8.5ZM6.30775 20H17.6923C17.7821 20 17.8558 19.9712 17.9135 19.9135C17.9712 19.8558 18 19.7821 18 19.6923V10.3077C18 10.2179 17.9712 10.1442 17.9135 10.0865C17.8558 10.0288 17.7821 10 17.6923 10H6.30775C6.21792 10 6.14417 10.0288 6.0865 10.0865C6.02883 10.1442 6 10.2179 6 10.3077V19.6923C6 19.7821 6.02883 19.8558 6.0865 19.9135C6.14417 19.9712 6.21792 20 6.30775 20ZM12 16.75C12.4858 16.75 12.899 16.5798 13.2395 16.2395C13.5798 15.899 13.75 15.4858 13.75 15C13.75 14.5142 13.5798 14.101 13.2395 13.7605C12.899 13.4202 12.4858 13.25 12 13.25C11.5142 13.25 11.101 13.4202 10.7605 13.7605C10.4202 14.101 10.25 14.5142 10.25 15C10.25 15.4858 10.4202 15.899 10.7605 16.2395C11.101 16.5798 11.5142 16.75 12 16.75Z" fill="#1C1B1F"/>
                            </g>
                        </svg>
                    )}
                </div>

                <span className="block text-[#EAB308] text-sm sm:text-base" aria-label={`${trainer.avg_rating} out of 5 stars`}>
                    {'★'.repeat(Math.round(trainer.avg_rating))}{'☆'.repeat(5 - Math.round(trainer.avg_rating))} <span className="text-black">({trainer.avg_rating})</span>
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

                    <span
                        className="block text-xs sm:text-sm font-normal leading-tight sm:leading-[20px] mb-1 trainer-card-lang line-clamp-1"
                        title={String(trainer.language || '')}
                    >
                        {(() => {
                            const langs = (trainer.language || '').split(',').map(l => l.trim()).filter(Boolean);
                            const maxToShow = 2;
                            if (langs.length <= maxToShow) {
                                return langs.join(', ');
                            } else {
                                return `${langs.slice(0, maxToShow).join(', ')}, +${langs.length - maxToShow}`;
                            }
                        })()}
                    </span>
                </div>
            </div>

            {/* Trainer bottom info */}
            <div className="flex items-center w-full justify-between mt-auto trainer-card-bottom h-6 sm:h-7 lg:h-[30px]">
                <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-semibold text-[#111827] leading-tight sm:leading-[20px] trainer-card-price">
                        ₹{trainer.charge}
                    </span>
                    <span
                        className="text-blue-600 text-sm cursor-pointer"
                        title={`₹${trainer.charge} per session for 50 pax`}
                    >
                        ⓘ
                    </span>
                </div>

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