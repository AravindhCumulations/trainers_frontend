"use client";

import Navbar from '@/components/Navbar';
import TrainerGrid from '@/components/TrainerGrid';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import SearchCategoriesRow from '@/components/SearchCategoriesRow';
import { trainerApis } from '@/lib/apis/trainer.apis';
import { useLoading } from '@/context/LoadingContext';
import { getCurrentUserName } from "@/lib/utils//auth.utils";
import { useNavigation } from "@/lib/hooks/useNavigation";
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { TrainerCardModel } from '@/models/trainerCard.model';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { expertise_in } from './content/ExpertiseIN';
import { dummyTrainers } from './content/DummyTrainers';


export default function Home() {

  // loaders and Navigations
  const { showLoader, hideLoader } = useLoading();
  const { handleNavigation } = useNavigation();
  const { user } = useUser();



  const locations = [
    { name: 'Hyderabad', image: '/assets/hydrabad.jpg' },
    { name: 'Bengaluru', image: '/assets/Bangalore.jpg' },
    { name: 'Delhi', image: '/assets/delhi.jpg' },
    { name: 'Chennai', image: '/assets/chennai.jpg' },
    { name: 'Kochi', image: '/assets/kochi.jpg' },
    { name: 'Mumbai', image: '/assets/mumbai.jpg' },
  ];

  // tabs
  const tabs = ['Featured', 'Unlocked', 'Wish listed'];
  const [activeTab, setActiveTab] = useState('Featured');

  // trainers list
  const [trainers, setTrainers] = useState<TrainerCardModel[]>([]);
  const [unlockedTrainers, setUnlockedTrainers] = useState<TrainerCardModel[]>([]);
  const [wishlistedTrainers, setWishlistedTrainers] = useState<TrainerCardModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // helper variables
  const [isCompany, setIsCompany] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update isLoggedIn and isCompany when user context changes
  // useEffect(() => {
  //   setIsLoggedIn(user.isLoggedIn);
  //   setIsCompany(user.role === 'user_role');
  //   const initializeData = async () => {
  //     try {
  //       const userName = user.name;
  //       showLoader();
  //       setIsLoading(true);
  //       await fetchAllTrainers(userName);



  //       if (user.role === 'user_role') {
  //         await fetchCompanyTrainers(userName);
  //       }
  //     } catch (error) {
  //       console.error("Failed to initialize data:", error);
  //     } finally {
  //       hideLoader();
  //       setIsLoading(false);
  //     }
  //   };

  //   initializeData();
  // }, [user, user.isLoggedIn]);


  const [searchText, setSearchText] = useState(''); // global search


  // custom methods 

  const fetchAllTrainers = async (userName: string) => {

    try {
      const allTrainersData = await trainerApis.getAllTrainers(userName, 1, 8);
      setTrainers(allTrainersData.All_trainers || []);
    }
    catch (error) {
      console.error('Error fetching trainers:', error);

    }

  };

  const fetchCompanyTrainers = async (userName: string) => {



    if (!userName) {
      return;
    }
    showLoader();

    try {
      const companyTrainersData = await trainerApis.getComapanyTrainers(userName);

      setUnlockedTrainers(companyTrainersData.unlocked_trainers || []);
      setWishlistedTrainers(companyTrainersData.wishlist_trainers || []);

    }
    catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };


  // handles

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    showLoader();


    try {
      await handleNavigation('/trainers-page', { 'search_text': searchText });
    } catch (error) {
      console.error('Error routing to search:', error);
    } finally {
      hideLoader();
    }
  };

  const handleClearSearch = async () => {

    setSearchText('');
    showLoader();
    try {
      const response = await trainerApis.searchTrainers(getCurrentUserName());
      if (response.message) {
        setTrainers(response.message);
      }
    } catch (error) {
      console.error('Error loading all trainers:', error);
    } finally {
      hideLoader();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = async (categoryName: string) => {
    showLoader();
    try {
      await handleNavigation('/trainers-page', { 'search_text': categoryName });
    } catch (error) {
      console.error('Error routing to category:', error);
    } finally {
      hideLoader();
    }
  };

  const handleWishlistUpdate = (trainer: TrainerCardModel, isWishlisted: boolean) => {
    // Update the trainer in the main trainers list
    setTrainers(prevTrainers =>
      prevTrainers.map(t =>
        t.name === trainer.name
          ? { ...t, is_wishlisted: isWishlisted ? 1 : 0 }
          : t
      )
    );

    // Update wishlisted trainers list
    if (isWishlisted) {
      setWishlistedTrainers(prev => [...prev, { ...trainer, is_wishlisted: 1 }]);
    } else {
      setWishlistedTrainers(prev => prev.filter(t => t.name !== trainer.name));
    }
  };

  const typingText = useTypingEffect([
    ...expertise_in,
    'trainer name',
    'skill',
    'city',
    'Negotiation',
    'Communication',
    'Leadership'
  ], 100, 50, 2000);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">

      {/* Header & Hero Section (overlapping) */}
      <section className="relative w-full mx-auto flex flex-col items-center header-hero-section bg-theme-header rounded-b-[40px] z-10">
        {/* Header */}
        <Navbar bgColor="transparent" />
        <div className="w-full  text-white pb-6 md:pb-32 px-4 md:px-4 lg:px-0 flex flex-col items-center  relative  header-hero-bg">

          {/* Hero Content */}
          <div className="flex flex-col gap-2 md:gap-3 items-center w-full mt-4 md:mt-6 px-4 md:px-8 lg:px-4 hero-content">
            <h1 className="font-bold mb-1 md:mb-2 text-center text-2xl md:text-4xl lg:heading-2xl hero-title" aria-label="Hero Title">
              Find & Hire Soft Skills Trainers
            </h1>
            <p className="mb-3 md:mb-5 text-center max-w-2xl text-base md:text-[18px] font-normal font-medium hero-desc" aria-label="Hero Description">
              Instantly Connect with Verified Trainers Across the Country
            </p>
            <div className="w-[350px] md:w-[60%] max-w-2xl flex flex-row items-center gap-2 bg-white/30 rounded-full p-1 md:p-1.5 shadow-md backdrop-blur-md mb-3 md:mb-5 hero-search-bar">
              <input
                type="text"
                placeholder={`Search by ${typingText}...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 md:px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-sm md:text-[16px] font-normal hero-search-input"
                aria-label="Search Input"
              />
              {searchText && (
                <button
                  onClick={handleClearSearch}
                  className="text-white hover:text-gray-200 px-1 md:px-2"
                  aria-label="Clear Search Button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="currentColor" className="md:h-5 md:w-5">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleSearch}
                disabled={!searchText.trim()}
                className={`bg-white text-blue-600 px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow transition hero-search-btn hover:scale-105 ${!searchText.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-50'
                  }`}
                aria-label="Search Button"
              >
                Search
              </button>
            </div>
            {/* Search Categories Row */}
            <SearchCategoriesRow onCategoryClick={handleCategoryClick} />
          </div>
        </div>



      </section>
      {/* Are you a Trainer? Section - overlapping upward */}
      {
        !isLoggedIn && (
          <section className="relative -mt-[30px]  md:-mt-[50px]  z-1 w-full are-you-a-trainer-section">
            <div className="z-1 relative w-full h-[250px] md:h-[390px] flex items-center justify-start overflow-hidden are-you-a-trainer-bg shadow-lg">
              <Image
                src="/assets/hero.jpg"
                alt="Trainer background"
                fill
                priority
                className="absolute inset-0 w-full h-full object-cover object-top  are-you-a-trainer-img"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />

              <div className="absolute inset-0 bg-black/40 h-[180px] md:h-[220px] z-2 are-you-a-trainer-overlay flex flex-col md:flex-row justify-around px-4 md:px-8 lg:px-16 items-center self-end">
                <div className="flex flex-col w-full md:w-[60%] text-white mb-4 md:mb-0">
                  <div className="font-arial font-bold text-2xl md:text-[36px] leading-tight md:leading-[54px] tracking-[0] are-you-a-trainer-title break-words">Are you a Trainer?</div>
                  <div className="font-arial font-normal text-lg md:text-[32px] leading-tight md:leading-[48px] tracking-[0] break-words">Make your FREE Profile and get discovered by Corporate Business</div>
                </div>
                <button
                  className="w-full md:w-fit h-[50px] md:h-[60px] border border-white text-white px-4 md:px-6 py-2 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base bg-transparent hover:bg-white hover:text-blue-700 text-base transition are-you-a-trainer-btn whitespace-nowrap"
                  onClick={() => handleNavigation('/trainer-form')}
                >
                  Create a Profile
                </button>
              </div>
            </div>
          </section>
        )
      }


      {/* Popular Trainers Section */}
      {isCompany ? (
        <div className="flex flex-col w-full lg:max-w-7xl mx-auto mt-[40px]  items-center">
          <div className="tabs mb-[20px] overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex min-w-max">
              {tabs.map((tab) => {
                const isDisabled =
                  (tab === 'Featured' && (!trainers || trainers.length === 0)) ||
                  (tab === 'Wish listed' && (!wishlistedTrainers || wishlistedTrainers.length === 0)) ||
                  (tab === 'Unlocked' && (!unlockedTrainers || unlockedTrainers.length === 0));

                return (
                  <button
                    key={tab}
                    onClick={() => !isDisabled && setActiveTab(tab)}
                    disabled={isDisabled}
                    className={`pb-2 text-lg font-medium px-4 ${isDisabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : activeTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-blue-600'
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="trainer-list min-h-[350px] flex flex-col md:px-8 lg:px-0 items-center justify-between">
            {activeTab === 'Featured' && <TrainerGrid
              trainers={trainers}
              paginationMode="client"
              paginationConfig={{ page: 1, pageSize: 8 }}
              pageLocked={true}
              onWishlistUpdate={handleWishlistUpdate}
              isLoading={isLoading}
            />}

            {activeTab === 'Wish listed' && <TrainerGrid
              trainers={wishlistedTrainers}
              paginationMode="client"
              paginationConfig={{ page: 1, pageSize: 8 }}
              onWishlistUpdate={handleWishlistUpdate}
              isLoading={isLoading}
            />}

            {activeTab === 'Unlocked' && <TrainerGrid
              trainers={unlockedTrainers}
              paginationMode="client"
              paginationConfig={{ page: 1, pageSize: 8 }}
              onWishlistUpdate={handleWishlistUpdate}
              isLoading={isLoading}
            />}
          </div>
        </div>
      ) : (
        <section className="section-cont md:px-8 lg:px-4 px-4  trainer-list-section">
          <h2 className="section-title">Discover Our Popular Trainers</h2>
          <TrainerGrid
            // trainers={trainers}
            trainers={dummyTrainers}
            paginationMode="client"
            paginationConfig={{ page: 1, pageSize: 12 }}
            pageLocked={true}
          // isLoading={isLoading}
          />
        </section>
      )}



      {/* Hire Trainers in Single Click Section - 3 cards, fixed size, exact spacing */}
      {
        !isLoggedIn && (
          <section className="section-cont ">
            <div className="grid grid-cols-1 md:grid-cols-2 md:px-8 lg:px-0 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="flex flex-col justify-between py-6 md:py-10">
                <p style={{ fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 700, lineHeight: '1.5', color: '#111827' }} className="mb-6 text-center lg:text-start">Hire Trainers in 3 Simple Steps </p>
                <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 400, lineHeight: '1.5', color: '#111827' }} className="mb-6 text-center lg:text-start">Hiring soft skills trainers is quick and hassle-free. Simply share your requirements, review curated trainer profiles and make your choice with ease--all in just three simple steps.</p>
                <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600, lineHeight: '1.5', color: '#111827' }} className="mb-6 text-center lg:text-start">it&apos;s that Easy</p>
              </div>
              <div className="flex flex-col justify-center items-center bg-[#F4FCFF] rounded-xl md:rounded-2xl text-center gap-2 py-4 md:py-6">
                <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] relative">
                  <Image
                    src="/assets/Profiling-pana 1.png"
                    alt="Browse trainers"
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
                <p className="text-lg md:text-[24px] font-normal leading-relaxed md:leading-[36px] text-gray-900"><span className="font-semibold">Browse</span> trainers profiles from across India</p>
              </div>
              <div className="flex flex-col justify-center items-center bg-[#F4FCFF] rounded-xl md:rounded-2xl text-center gap-2 py-4 md:py-6">
                <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] relative">
                  <Image
                    src="/assets/Key-pana 1.png"
                    alt="Unlock contact details"
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
                <p className="text-lg md:text-[24px] font-normal leading-relaxed md:leading-[36px] text-gray-900"><span className="font-semibold">Unlock</span> contact details using credits. </p>
              </div>
              <div className="flex flex-col justify-center items-center bg-[#F4FCFF] rounded-xl md:rounded-2xl text-center gap-2 py-4 md:py-6">
                <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] relative">
                  <Image
                    src="/assets/Calling-pana 1.png"
                    alt="Connect directly"
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
                <p className="text-lg md:text-[24px] font-normal leading-relaxed md:leading-[36px] text-gray-900"><span className="font-semibold">Connect directly--</span>no commisions, no hassle!</p>
              </div>
            </div>
          </section>
        )
      }

      {/* Browse Trainers by Location Section - 2 rows, 3 columns, fixed size */}
      <section className="section-cont">
        <p className="section-title" aria-label="Browse Trainers by Locations Title">
          Browse Trainers by Locations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:px-8 lg:px-0 lg:grid-cols-3 gap-4 md:gap-6">
          {locations.map((city, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center relative max-w-full h-[200px] md:h-[300px] hover:px-0 cursor-pointer"
              onClick={() => handleNavigation('/trainers-page', { 'city': city.name })}
            >
              <div className="w-[calc(100%-10px)] hover:w-[100%] h-full relative">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="rounded-xl md:rounded-2xl w-full h-full object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
              <div className="text-lg md:text-2xl font-light absolute bottom-0 left-0 text-white bg-black/50 px-4 md:px-6 py-3 md:py-4 w-full rounded-t-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-xl md:text-[24px] font-semibold">{city.name}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30"
                  width="30"
                  viewBox="0 -960 960 960"
                  fill="#fff"
                  className="md:h-10 md:w-10"
                >
                  <path d="M480-329.33 630.67-480 480-630.67 433.33-584 504-513.33H326.67v66.66H504L433.33-376 480-329.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {
        !isLoggedIn && (
          <>
            {/* No Middlemen, No Commission!  1 row, 2 columns, left text, right 3 cards */}
            <section className="w-full max-w-7xl mx-auto rounded-2xl p-5 rounded-[20px] my-10" style={{ background: '#F4FCFF' }}>
              <div className="max-w-7xl mx-auto flex flex-row items-center md:px-8 lg:px-0">
                <div className="flex-1 min-w-[320px]">
                  <h2 className="mb-2 text-[clamp(28px, 5vw, 32px)]" style={{ fontSize: '30px', fontWeight: 700, lineHeight: '36px', color: '#111827', fontFamily: 'Arial, sans-serif' }}>No Middlemen, No Commission!</h2>
                  <p className="text-[clamp(16px, 5vw, 24px)]" style={{ fontSize: '24px', fontWeight: 400, lineHeight: '32px', color: '#111827', fontFamily: 'Arial, sans-serif' }}>Our platform lets corporate clients connect directly with experienced soft skills trainers. No intermediaries—just access trainer contact details and hire on your terms!. Trainers get an opportunity to get discovered by Corporate Clients in no time. More project, more training assignments and better earning.</p>
                </div>
              </div>
            </section>


            {/* Hire Trainers in 3 simple Steps Section - 1 row, 2 columns, left text, right 3 cards */}

            <section className="section-cont ">
              <div className="grid grid-cols-1 md:grid-cols-2 md:px-8 lg:px-0 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="flex flex-col justify-between items-center lg:items-start py-6 md:py-10">
                  <p style={{ fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 700, lineHeight: '1.5', color: '#111827' }} className="mb-6 text-center lg:text-start">Trainers Get Discovered & Land Corporate Clients</p>
                  <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 400, lineHeight: '1.5', color: '#111827' }} className="mb-6 text-center lg:text-start">🎯 Showcase Your Expertise to Leading Companies</p>
                  <button
                    style={{ fontWeight: 600, fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: '24px', letterSpacing: 0, textAlign: 'center' }}
                    className="bg-[#3B82F6] rounded-xl text-white px-4 py-2 hover:scale-105 transition-all"
                    onClick={() => handleNavigation('/signup')}
                  >Create your free profile</button>
                </div>
                <div className="flex flex-col justify-center items-center bg-[#F4FCFF] rounded-2xl text-center gap-2 py-4 md:py-6">
                  <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] relative">
                    <Image
                      src="/assets/Checklist-pana 1.png"
                      alt="List your profile"
                      fill
                      className="object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 400, lineHeight: '1.5', color: '#111827' }}>
                    <span style={{ fontWeight: 600 }}>List your profile</span> with expertise and experience
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center bg-[#F4FCFF] rounded-2xl text-center gap-2 py-4 md:py-6">
                  <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] relative">
                    <Image
                      src="/assets/Calling-pana 1.png"
                      alt="Get contacted"
                      fill
                      className="object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>

                  <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 400, lineHeight: '1.5', color: '#111827' }}>
                    <span style={{ fontWeight: 600 }}>Get contacted</span> directly by potential clients
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center bg-[#F4FCFF] rounded-2xl text-center gap-2 py-4 md:py-6">
                  <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] relative">
                    <Image
                      src="/assets/Mobile Marketing-pana 1.png"
                      alt="Gain visibility"
                      fill
                      className="object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 400, lineHeight: '1.5', color: '#111827' }}>
                    <span style={{ fontWeight: 600 }}>Gain visibility</span> among people looking for trainers.
                  </p>
                </div>

              </div>
            </section>



            {/* cta */}
            <section className="section-cont">
              <div className="flex items-center gap-5">
                <p className="text-[18px] font-medium leading-[26px] text-blue-600 md:px-8 lg:px-0" aria-label="Join Network Text">👥 Join the Network & Grow your training Business 👉 </p>
                <button className="bg-[#3B82F6]  h-13 md:h-10 rounded-xl text-white px-3 py-2 flex items-center justify-center gap-[10px] hover:bg-blue-700 transition-colors hover:scale-105 transition-all"
                  onClick={() => handleNavigation('/signup')}
                  aria-label="Sign Up as Trainer Button"
                >
                  <span className="text-[16px] font-semibold leading-[24px] tracking-[0%] text-center text-white ">Sign Up as a Trainer</span>
                </button>
              </div>
            </section>
          </>
        )
      }

      {/* How it Works Section - 2 columns, left stepper, right image */}
      <section className="section-cont ">
        <div className=" w-full flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">
          {/* Left Column */}
          <div className="flex-1 w-full">
            <h2 className="section-title" aria-label="How it Works Title">
              How it Works
            </h2>
            <div className="flex flex-col max-w-7xl mx-auto gap-8 md:px-8 lg:px-0 lg:flex-row lg:gap-[55px]">
              <div className="relative h-[max-content] flex flex-col gap-12 md:gap-[80px]">
                {/* Vertical dashed line */}
                <div className="hiw-dashed-line "></div>

                {/* Step 1 */}
                <div className="hiw-card ">
                  <span className="hiw-step-count">1</span>
                  <div>
                    <h3 className="hiw-step-title">Search & Filter</h3>
                    <p className="hiw-step-desc">Find trainers by location, expertise, and experience.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="hiw-card ">
                  <span className="hiw-step-count">2</span>
                  <div>
                    <h3 className="hiw-step-title">View Profiles & Programs</h3>
                    <p className="hiw-step-desc">Assess trainers portfolios and workshop details.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="hiw-card ">
                  <span className="hiw-step-count">3</span>
                  <div>
                    <h3 className="hiw-step-title">Unlock Contact Details</h3>
                    <p className="hiw-step-desc">Use credits to access direct trainer contacts.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="hiw-card ">
                  <span className="hiw-step-count">4</span>
                  <div>
                    <h3 className="hiw-step-title">Connect & Hire</h3>
                    <p className="hiw-step-desc">Contact trainers directly to negotiate rates and finalize engagements.</p>
                  </div>
                </div>
              </div>
              {/* Right Column: Placeholder Image */}
              <div className="flex-1 flex justify-center items-start w-full h-auto md:w-full lg:w-[40%] lg:h-[match-parent] image-container">
                <div className="rounded-xl md:rounded-2xl overflow-hidden bg-blue-500 h-full w-full aspect-[4/3] relative">
                  <Image
                    src="/assets/howitwork.jpg"
                    alt="How it works"
                    fill
                    className="object-cover w-full h-full"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>




      {/* FAQ Section */}
      <section className="section-cont ">
        <h2 className="section-title">FAQ – Everything You Need to Know</h2>
        <div className="space-y-4 md:space-y-6 w-full px-4 md:px-8 lg:px-0 flex flex-col">
          <div className='faq-card'>
            <h3 className="faq-question" aria-label="FAQ Question 1">How do I hire a trainer?</h3>
            <p className="faq-answer" aria-label="FAQ Answer 1">Simply search trainers, review their profile, and unlock contact details using credits.</p>
          </div>
          <div className='faq-card'>
            <h3 className="faq-question" aria-label="FAQ Question 2">Do I need a subscription?</h3>
            <p className="faq-answer" aria-label="FAQ Answer 2">No! Just buy credits as needed—no recurring fees.</p>
          </div>
          <div className='faq-card'>
            <h3 className="faq-question" aria-label="FAQ Question 3">Are the trainers verified?</h3>
            <p className="faq-answer" aria-label="FAQ Answer 3">Yes, we onboard only experienced professionals with proven expertise.</p>
          </div>
          <div className='faq-card'>
            <h3 className="faq-question" aria-label="FAQ Question 4">Can trainers list their services for free?</h3>
            <p className="faq-answer" aria-label="FAQ Answer 4">Yes! Trainers can create a profile for free and receive direct client inquiries. </p>
          </div>


          <div className="flex flex-col sm:flex-row items-center gap-2 pt-4">
            <span className="text-sm text-blue-600 px-4">📩 Still have questions?</span>
            <button
              onClick={() => window.location.href = 'mailto:customer.support@trainersmart.com'}
              className="bg-[#3B82F6] hover:scale-105 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <p className="text-center font-semibold text-2xl md:text-3xl underline text-blue-500 px-4  " aria-label="Get Started Today Text">Get Started Today!</p>


      {/* Footer - 3 columns, fixed height, exact spacing */}
      <Footer />
    </div>
  );
}
