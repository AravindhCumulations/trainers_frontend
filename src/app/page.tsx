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
  useEffect(() => {
    setIsLoggedIn(user.isLoggedIn);
    setIsCompany(user.role === 'user_role');
    const initializeData = async () => {
      try {
        const userName = user.name;
        showLoader();
        setIsLoading(true);
        await fetchAllTrainers(userName);



        if (user.role === 'user_role') {
          await fetchCompanyTrainers(userName);
        }
      } catch (error) {
        console.error("Failed to initialize data:", error);
      } finally {
        hideLoader();
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user, user.isLoggedIn]);


  const [searchText, setSearchText] = useState(''); // global search


  // custom methods 

  const fetchAllTrainers = async (userName: string) => {

    try {
      const allTrainersData = await trainerApis.getAllTrainers(userName, 1, 8);
      setTrainers(allTrainersData.All_trainers);
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">

      {/* Header & Hero Section (overlapping) */}
      <section className="relative w-full mx-auto flex flex-col items-center header-hero-section">
        <div className="w-full bg-gradient-to-b  from-blue-400 to-blue-600 text-white pb-10 px-0 flex flex-col items-center rounded-b-[40px] relative z-10 header-hero-bg">
          {/* Header */}
          <Navbar bgColor="transparent" />
          {/* Hero Content */}
          <div className="flex flex-col gap-3 items-center h-[40vh] w-full mt-6 px-4 hero-content">
            <h1 className="text-[clamp(2.5rem,5vw+1rem,3rem)] font-extrabold mb-2 text-center leading-tight hero-title">
              Find & Hire Soft Skills Trainers
            </h1>
            <p className="mb-5 text-center max-w-2xl text-[18px] font-normal font-medium hero-desc">
              Instantly Connect with Verified Trainers Across the Country
            </p>
            <div className="w-[60%] max-w-2xl flex flex-row items-center gap-2 bg-white/30 rounded-full p-1.5 shadow-md backdrop-blur-md mb-5 hero-search-bar">
              <input
                type="text"
                placeholder="Search by trainer name, skill, or city..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-[16px] font-normal hero-search-input"
              />
              {searchText && (
                <button
                  onClick={handleClearSearch}
                  className="text-white hover:text-gray-200 px-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleSearch}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-base shadow hover:bg-blue-50 transition hero-search-btn hover:scale-105"
              >
                Search
              </button>
            </div>
            {/* Search Categories Row */}
            <SearchCategoriesRow onCategoryClick={handleCategoryClick} />
          </div>
        </div>


        {/* Are you a Trainer? Section - overlapping upward */}
        {
          !isLoggedIn && (
            <section className="relative -top-[50px] w-[100%]  z-1 are-you-a-trainer-section">
              <div className="relative w-full h-[390px] flex items-center justify-start overflow-hidden are-you-a-trainer-bg shadow-lg">
                <Image
                  src="/assets/hero.jpg"
                  alt="Trainer background"
                  fill
                  priority
                  className="absolute inset-0 w-full h-full object-cover object-top z-0 are-you-a-trainer-img"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />

                <div className="absolute inset-0 bg-black/40 h-[220px] z-10 are-you-a-trainer-overlay flex flex-row justify-around px-[100px] items-center  self-end">


                  <div className="flex flex-col w-[50%] text-white">
                    <div className="font-arial font-bold text-[36px] leading-[54px] tracking-[0] are-you-a-trainer-title">Are you a Trainer?</div>
                    <div className="font-arial font-normal text-[32px] leading-[48px] tracking-[0]">Make your FREE Profile and get discovered by Corporate Business</div>

                  </div>
                  <button
                    className="w-fit h-[60px] border border-white text-white px-6 py-2 rounded-2xl font-semibold text-base bg-transparent hover:bg-white hover:text-blue-700 text-lg transition are-you-a-trainer-btn"
                    onClick={() => handleNavigation('/trainer-form')}
                  >
                    Create a Profile
                  </button>


                </div>

              </div>

            </section>
          )
        }
      </section>

      {/* Popular Trainers Section */}
      {isCompany ? (
        <div className="flex space-x-6 border-b border-gray-200 my-6 w-full">
          <div className="flex flex-col max-w-7xl mx-auto items-center">
            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-lg font-medium w-[200px] ${activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="trainer-list min-h-[350px] flex flex-col items-center justify-between">
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
        </div>
      ) : (
        <section className="w-full max-w-7xl mx-auto px-4 py-10 trainer-list-section">
          <h2 className="text-[30px] font-bold mb-6 text-gray-800 trainer-list-title">Discover Our Popular Trainers</h2>
          {/* <TrainerGrid trainers={dummyTrainers} limit={8} /> */}
          <TrainerGrid
            trainers={trainers}
            paginationMode="client"
            paginationConfig={{ page: 1, pageSize: 12 }}
            pageLocked={true}
            isLoading={isLoading}
          />
        </section>
      )}



      {/* Hire Trainers in Single Click Section - 3 cards, fixed size, exact spacing */}
      {
        !isLoggedIn && (
          <section className="w-full max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-4 gap-6">
              <div className="flex flex-col justify-between py-10">
                <p className="text-[30px] font-bold mb-4 ">Hire Trainers in 3 simple Steps </p>
                <p className=" text-[16px] font-normal  mb-2">Hiring soft skills trainers is quick and hassle-free. Simply share your requirements, review curated trainer profiles and make your choice with ease--all in just three simple steps.</p>
                <p className="font-semibold text-[16px]">it&apos;s that Easy</p>
              </div>
              <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl text-center gap-2 py-6">

                <div className="w-[200px] h-[200px] relative">
                  <Image
                    src="/assets/Profiling-pana 1.png"
                    alt="Browse trainers"
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
                <p className="text-[24px] font-normal"><span className="font-semibold">Browse</span> trainers profiles from across India</p>
              </div>
              <div className="flex flex-col justify-center items-center  bg-blue-50 rounded-2xl text-center gap-2 py-6">
                <div className="w-[200px] h-[200px] relative">
                  <Image
                    src="/assets/Key-pana 1.png"
                    alt="Unlock contact details"
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>

                <p className="text-[24px] font-normal"><span className="font-semibold">Unlock</span> contact details using credits. </p>
              </div>
              <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl text-center gap-2 py-6">
                <div className="w-[200px] h-[200px] relative">
                  <Image
                    src="/assets/Calling-pana 1.png"
                    alt="Connect directly"
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
                <p className="text-[24px] font-normal"><span className="font-semibold">Connect directly--</span>no commisions, no hassle!</p>
              </div>

            </div>
          </section>
        )
      }

      {/* Browse Trainers by Location Section - 2 rows, 3 columns, fixed size */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10">
        <p className="text-[30px] font-bold mb-4">Browse Trainers by Locations</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {locations.map((city, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center relative max-w-[424px] h-[300px]  hover:px-0 cursor-pointer"
              onClick={() => handleNavigation('/trainers-page', { 'city': city.name })}
            >
              <div className="w-[calc(100%-10px)] hover:w-[100%] h-full relative">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="rounded-2xl w-full h-full object-cover  "
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
              <div className="text-2xl font-light absolute bottom-0 left-0 text-white bg-black/50 px-6 py-4 w-full rounded-t-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-[24px] font-semibold">{city.name}</p>
                  {/* <p className="text-xs">424 trainers available</p> */}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#fff"
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
            {/* Hire Trainers in 3 simple Steps Section - 1 row, 2 columns, left text, right 3 cards */}

            <section className="w-full max-w-7xl mx-auto px-4 py-10">
              <div className="grid grid-cols-4 gap-6">
                <div className="flex flex-col justify-between items-start py-10">
                  <p className="text-[30px] font-bold mb-4 ">Trainers Get Discovered & Land Corporate Clients </p>
                  <p className="text-[16px] font-normal mb-2">🎯 Showcase Your Expertise to Leading Companies</p>
                  <button className="bg-blue-600 rounded-xl text-white px-4 py-2"
                    onClick={() => handleNavigation('/signup')}
                  >Create your free profile</button>
                </div>
                <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl text-center gap-2 py-6">

                  <div className="w-[200px] h-[200px] relative">
                    <Image
                      src="/assets/Checklist-pana 1.png"
                      alt="List your profile"
                      fill
                      className="object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <p className="text-[24px] font-normal"><span className="font-semibold">List your profile</span> with expertise and experience</p>
                </div>
                <div className="flex flex-col justify-center items-center  bg-blue-50 rounded-2xl text-center gap-2 py-6">
                  <div className="w-[200px] h-[200px] relative">
                    <Image
                      src="/assets/Calling-pana 1.png"
                      alt="Get contacted"
                      fill
                      className="object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>

                  <p className="text-[24px] font-normal"><span className="font-semibold">Get contacted</span>directly by potential clients</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl text-center gap-2 py-6">
                  <div className="w-[200px] h-[200px] relative">
                    <Image
                      src="/assets/Mobile Marketing-pana 1.png"
                      alt="Gain visibility"
                      fill
                      className="object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+ODhAQEA4QEBAPj4+ODg4ODg4ODg4ODj/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <p className="text-[24px] font-normal"><span className="font-semibold">Gain visibility </span>among people looking for trainers.</p>
                </div>

              </div>
            </section>
            {/* Info Section with Blue Background - 1 row, 2 columns, left text, right 3 cards */}
            <section className="w-full max-w-7xl mx-auto  rounded-2xl bg-blue-50 p-4 ">
              <div className="max-w-7xl mx-auto flex flex-row items-center ">
                <div className="flex-1 min-w-[320px]">
                  <h2 className="text-[30px] font-bold mb-2">No Middlemen, No Commission!</h2>
                  <p className="text-[24px] font-normal text-gray-700 ">Our platform lets corporate clients connect directly with experienced soft skills trainers. No intermediaries—just access trainer contact details and hire on your terms!. Trainers get an opportunity to get discovered by Corporate Clients in no time. More project, more training assignments and better earning.</p>
                </div>
              </div>
            </section>
            <section className="w-full max-w-7xl mx-auto ">
              <div className="flex items-center gap-5">
                <p className="text-blue-500">👥 Join the Netwoek & Grow you training Buisness 👉 </p>
                <button className="bg-blue-600 rounded-xl text-white px-4 py-2"
                  onClick={() => handleNavigation('/signup')}
                >Sign Up as a Trainer</button>
              </div>
            </section>
          </>
        )
      }

      {/* How it Works Section - 2 columns, left stepper, right image */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-row gap-20 items-start">
          {/* Left Column */}
          <div className="flex-1">
            <h2 className="text-[30px] font-bold mb-8">How it Works</h2>
            <div className="flex max-w-7xl mx-auto">
              <div className="relative h-[max-content] flex flex-col gap-[80px]">
                {/* Vertical dashed line */}
                <div className="absolute left-4 top-10 bottom-8 w-0.5 border-l-2 border-dashed border-gray-300 z-0 "></div>

                {/* Step 1 */}
                <div className="flex items-start gap-6 relative">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold z-10">1</span>
                  <div>
                    <h3 className="font-semibold text-[24px] mb-1">Search & Filter</h3>
                    <p className="text-gray-600">Find trainers by location, expertise, and experience.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-6 relative">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold z-10">2</span>
                  <div>
                    <h3 className="font-semibold text-[24px] mb-1">View Profiles & Programs</h3>
                    <p className="text-gray-600">Assess trainers portfolios and workshop details.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-6 relative">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold z-10">3</span>
                  <div>
                    <h3 className="font-semibold text-[24px] mb-1">Unlock Contact Details</h3>
                    <p className="text-gray-600">Use credits to access direct trainer contacts.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-6 relative">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold z-10">4</span>
                  <div>
                    <h3 className="font-semibold text-[24px] mb-1">Connect & Hire</h3>
                    <p className="text-gray-600">Contact trainers directly to negotiate rates and finalize engagements.</p>
                  </div>
                </div>
              </div>
              {/* Right Column: Placeholder Image */}
              <div className="flex-1 flex justify-center items-start w-[40%] image-container">
                <div className="rounded-2xl overflow-hidden w-[80%] aspect-[4/3] relative">
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
      <section className="w-full max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">FAQ – Everything You Need to Know</h2>
        <div className="space-y-6 max-w-3xl">
          <div>
            <h3 className="font-semibold text-lg mb-2">How do I hire a trainer?</h3>
            <p className="text-gray-600">Simply search trainers, review their profile, and unlock contact details using credits.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Do I need a subscription?</h3>
            <p className="text-gray-600">No! Just buy credits as needed—no recurring fees.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Are the trainers verified?</h3>
            <p className="text-gray-600">Yes, we onboard only experienced professionals with proven expertise.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Can trainers list their services for free?</h3>
            <p className="text-gray-600">Yes! Trainers can create a profile for free and receive direct client inquiries.</p>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <span className="text-sm text-blue-600">Still have questions?</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Contact Us</button>
          </div>
        </div>
      </section>

      <p className="text-center font-semibold text-3xl underline text-blue-500">Get Started Today!</p>


      {/* Footer - 3 columns, fixed height, exact spacing */}
      <Footer />
    </div>
  );
}
