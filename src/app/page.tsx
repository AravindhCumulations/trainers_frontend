"use client";

import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleTrainerClick = (trainerId: number) => {
    router.push(`/trainer-details?id=${trainerId}`);
  };

  const locations = [
    { name: 'Hyderabad', image: 'assets/hydrabad.jpg' },
    { name: 'Bangalore', image: 'assets/Bangalore.jpg' },
    { name: 'Delhi', image: 'assets/delhi.jpg' },
    { name: 'Chennai', image: 'assets/chennai.jpg' },
    { name: 'Kochi', image: 'assets/kochi.jpg' },
    { name: 'Mumbai', image: 'assets/mumbai.jpg' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header & Hero Section (overlapping) */}
      <section className="relative w-full mx-auto flex flex-col items-center header-hero-section">
        <div className="w-full bg-gradient-to-b  from-blue-400 to-blue-600 text-white pb-10 px-0 flex flex-col items-center rounded-b-[40px] relative z-10 header-hero-bg">
          {/* Header */}
          <Navbar bgColor="transparent" />
          {/* Hero Content */}
          <div className="flex flex-col gap-3 items-center h-[40vh] w-full  mt-6 px-4 hero-content">
            <h1 className=" text-5xl font-extrabold mb-2 text-center leading-tight hero-title">Find & Hire Soft Skills Trainers</h1>
            <p className="mb-5 text-center max-w-2xl text-[18px] font-normal font-medium hero-desc">Instantly Connect with Verified Trainers Across the Country</p>
            <div className=" w-[60%] max-w-2xl  flex flex-row items-center gap-2 bg-white/30 rounded-full p-1.5 shadow-md backdrop-blur-md mb-5 hero-search-bar">
              <input
                type="text"
                placeholder="Search by trainer name, skill, or city..."
                className="flex-1 px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-[16px] font-normal hero-search-input"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-base shadow hover:bg-blue-50 transition hero-search-btn">Search</button>
            </div>
            {/* Filter Categories Row */}
            <div className="max-w-6xl flex items-center gap-2 mt-0 justify-center bg-white/20 rounded-full py-4 px-3 shadow-md backdrop-blur-md hero-categories" style={{ minHeight: '54px' }}>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-xl font-bold hover:bg-white/50 transition hero-categories-left">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M560-267.69 347.69-480 560-692.31 588.31-664l-184 184 184 184L560-267.69Z" /></svg>
              </button>
              <div className="flex gap-10 overflow-x-auto overflow-x-hidden scrollbar-hide hero-categories-list">
                {/* Example icons as emoji, replace with SVGs if needed */}
                <div className="flex flex-col items-center min-w-[70px] hero-category">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-160q75 0 127.5-52.5T660-340q0-75-52.5-127.5T480-520q-75 0-127.5 52.5T300-340q0 75 52.5 127.5T480-160ZM364.54-526.62q19.23-12.53 40.96-20.19 21.73-7.65 44.73-11.19l-91-180.46h-100l105.31 211.84Zm230.92 0 106.31-211.84h-101l-87.31 173.07 4.39 8.77q20.92 4 40.46 11.2 19.54 7.19 37.15 18.8Zm-306.38 324q.69-6.69 3.11-14.8 2.42-8.12 7.04-17.2-18.46-29.84-26.65-64.5-8.2-34.65-4.27-71.34 0-30 10.38-56.92 10.39-26.93 28.85-48.47-14.31 2.47-25.16 10.27-10.84 7.81-15.46 18.66-44.61 10.84-69.54 50.19-24.92 39.35-15.23 87.19 0 44.62 31.16 75.77 31.15 31.15 75.77 31.15Zm381.84 0q54.31-3.23 91.7-42.57Q800-284.54 800-340t-37.38-94.81q-37.39-39.34-91.7-42.57-4.61 0-9.23.38-4.61.38-9.23 1.15 22.39 28.23 34.96 62.89Q700-378.31 700-340q0 38.31-12.58 72.96-12.57 34.66-34.96 62.89 4.62.77 9.23 1.15 4.62.38 9.23.38ZM480-120q-38.46 0-72.65-11.88-34.2-11.89-62.12-34.2-10.54 3.54-22.23 4.81-11.69 1.27-24 1.27-74.08 0-126.54-52.46Q120-264.92 120-339q0-73.15 51.08-125.15 51.07-52 123.77-53.62 8.46 0 16.15 1.15 7.69 1.16 15.38 2.7L193.85-778.46h190.77L480-587.69l95.38-190.77h190.77L635.38-516.69q6.93-1.54 14.24-2.31 7.3-.77 15-.77 73.46 1.85 124.42 53.85Q840-413.92 840-340q0 75.08-52.46 127.54Q735.08-160 660-160q-12.08 0-23.5-1.27t-21.96-4.81q-27.92 21.54-62 33.81Q518.46-120 480-120Zm0-220ZM364.54-526.62 259.23-738.46l105.31 211.84Zm230.92 0 106.31-211.84-106.31 211.84ZM417.54-248.46l23.38-77.16-62.46-44.53h77.16L480-451.54l24.38 81.39h77.16l-62.46 44.53 23.38 77.16L480-296l-62.46 47.54Z" /></svg>
                  <span className="text-xs font-medium">Motivation</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] hero-category">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M746.15-612.31q-50.47 0-87.65-32.46-37.19-32.46-44.27-81.38H344.77q-6.39 43.53-36.89 74.42-30.5 30.88-74.03 37.27v268.69q48.92 7.08 81.38 44.27 32.46 37.18 32.46 87.65 0 56-38.92 94.93Q269.85-80 213.85-80t-94.93-38.92Q80-157.85 80-213.85q0-50.47 32.46-87.65 32.46-37.19 81.39-44.27v-268.69q-48.93-7.08-81.39-44.08T80-746.15q0-56 39.09-94.93Q158.18-880 213.08-880q50.61 0 87.61 32.46t44.08 81.39h269.46q7.08-48.93 44.27-81.39Q695.68-880 746.15-880q55.22 0 94.53 39.32Q880-801.37 880-746.15q0 56-39.32 94.92-39.31 38.92-94.53 38.92ZM213.36-119.23q39.64 0 66.99-27.85 27.34-27.84 27.34-66.28 0-39.64-27.34-66.99-27.35-27.34-66.99-27.34-38.44 0-66.28 27.34-27.85 27.35-27.85 66.99 0 38.44 27.85 66.28 27.84 27.85 66.28 27.85Zm0-532.31q39.64 0 66.99-27.82 27.34-27.82 27.34-66.88 0-39.07-27.34-66.41Q253-840 213.36-840q-38.44 0-66.28 27.35-27.85 27.34-27.85 66.41 0 39.06 27.85 66.88 27.84 27.82 66.28 27.82ZM746.15-80q-56 0-94.92-38.92-38.92-38.93-38.92-94.37 0-55.44 38.92-94.92 38.92-39.48 94.92-39.48t94.93 39.48Q880-268.73 880-213.29q0 55.44-38.92 94.37Q802.15-80 746.15-80Zm.09-39.23q39.07 0 66.41-27.85Q840-174.92 840-213.36q0-39.64-27.35-66.99-27.34-27.34-66.41-27.34-39.06 0-66.88 27.34-27.82 27.35-27.82 66.99 0 38.44 27.82 66.28 27.82 27.85 66.88 27.85Zm0-532.31q39.07 0 66.41-27.82Q840-707.18 840-746.24q0-39.07-27.35-66.41Q785.31-840 746.24-840q-39.06 0-66.88 27.35-27.82 27.34-27.82 66.41 0 39.06 27.82 66.88 27.82 27.82 66.88 27.82ZM213.85-213.85Zm0-532.3Zm532.3 532.3Zm0-532.3Z" /></svg>
                  <span className="text-xs font-medium">Marketing</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] hero-category">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M390-152.31q-44.85 0-76.85-30.88-32-30.89-33.92-75.5-50-8.77-83.08-47.62-33.07-38.84-33.07-90.61 0-18.38 4.73-36.32 4.73-17.93 14.19-33.68-13.31-17.23-19.96-38.23-6.66-20.99-6.66-44.08 0-54.12 35.77-93.6T279.77-688q-.77-3.08-.77-6.15v-6.93q.69-45.61 32.92-76.88 32.23-31.27 78.08-31.27 29.08 0 49.65 11.54 20.58 11.54 40.35 33.92 20.31-22.38 40.23-33.92 19.92-11.54 49.77-11.54 44.76 0 77.03 31.54 32.28 31.54 32.97 76.38v6.93q0 3.07-.77 6.15 52.85 5.69 89.12 44.92 36.27 39.23 36.27 94.08 0 23.09-7.04 44.08-7.04 21-20.35 38.23 9.46 15.69 14.58 33.65 5.11 17.95 5.11 36.35 0 52.77-33.19 91.5t-83.96 46.73q-1.92 44.61-33.42 75.5-31.5 30.88-76.35 30.88-30.38 0-50.04-11.42-19.65-11.42-39.96-34.58-20.54 23.16-40.46 34.58-19.92 11.42-49.54 11.42Zm110-546.92v436.92q0 29.4 20.4 49.7 20.39 20.3 49.93 20.3 28.13 0 48.02-19.84Q638.23-232 640-259.69q-29.46-2.62-54.65-16.89-25.2-14.27-42.27-38.65-5.39-7.08-4.1-14.87 1.28-7.8 8.48-12.67 7.08-5.38 15.17-4.1 8.08 1.29 13.14 8.49 13.82 20.1 35.18 30.78t45.97 10.68q42.23 0 71.12-28.89 28.88-28.88 28.88-71.11 0-10.13-2.42-20.26t-6.73-19.74q-17 13.07-38.5 20.38-21.5 7.31-44.65 7.31-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73q42.23 0 71.11-28.89 28.89-28.88 28.89-71.11 0-41.03-28.12-69.63-28.12-28.6-68.81-30.37-9.46 18.77-25.42 32.65-15.96 13.89-36.19 21.89-7.54 2.92-14.96-.49-7.42-3.41-9.89-11.2-2.69-7.54.35-15.24 3.04-7.69 11.34-10.38 21.16-7.31 34.12-25.69Q640-676.08 640-699.62q0-29.07-20.31-49.34-20.32-20.27-49.73-20.27-29.42 0-49.69 20.3-20.27 20.3-20.27 49.7Zm-40 436.92v-436.92q0-29.4-20.31-49.7-20.32-20.3-49.73-20.3-29.42 0-49.69 20.3-20.27 20.3-20.27 49.7 0 22.92 12.85 41.42 12.84 18.5 34 25.81 7.53 2.69 11.46 10 3.92 7.31 1.36 15.01-3.07 7.71-10.76 11.08-7.68 3.37-15.99.45-20.23-8-36.19-21.5-15.96-13.5-25.42-32.27-39.69 1.77-67.81 30.65-28.12 28.89-28.12 69.6 0 41.98 28.89 70.86 28.88 28.89 71.11 28.89 8.5 0 14.25 5.76 5.75 5.75 5.75 14.27 0 8.51-5.75 14.24t-14.25 5.73q-23.15 0-44.65-7.31t-38.5-20.38q-4.31 9.61-6.73 19.74-2.42 10.13-2.42 20.26 0 42.23 28.88 71.11 28.89 28.89 71.12 28.89 24.84 0 45.96-10.81 21.11-10.81 35.19-30.65 5.06-7.2 13.14-8.49 8.09-1.28 15.17 3.72t8.42 12.92q1.35 7.92-4.04 15-17.84 24.38-43.15 38.77-25.31 14.38-54.77 17 1.77 27.69 22.15 47.42 20.39 19.73 48.52 19.73 29.54 0 49.93-20.3 20.4-20.3 20.4-49.7Zm20-218.46Z" /></svg>
                  <span className="text-xs font-medium">Mindfullness</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] hero-category">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-160v-100l528.54-528.31q6.61-6.61 13.92-9.15t14.62-2.54q7.54 0 15.11 2.54 7.58 2.54 13.19 9.15l42.93 42.93q6.61 5.61 9.15 13.19 2.54 7.57 2.54 15.11 0 7.31-2.54 14.62t-9.15 13.92L300-160H200Zm40-40h42.92l422.23-422-21.07-22.08L662-665.15 240-242.92V-200Zm560-516.85L756.85-760 800-716.85Zm-115.92 72.77L662-665.15 705.15-622l-21.07-22.08ZM570.77-160q66.31 0 123.15-31.62 56.85-31.61 56.85-88.38 0-34.46-23.23-61.23Q704.31-368 660-385.46l-30.54 30.54q38.39 13.07 59.85 32.38 21.46 19.31 21.46 42.54 0 33.77-41.5 56.88-41.5 23.12-98.5 23.12-8.54 0-14.27 5.73T550.77-180q0 8.54 5.73 14.27t14.27 5.73ZM224.54-419.08l29.23-30q-26.92-11.84-40.35-24.57Q200-486.38 200-500q0-18.15 22.23-35.54 22.23-17.38 84.08-43.92 78.77-33.39 106.23-60.16Q440-666.38 440-700q0-43.46-39-71.73Q362-800 300-800q-37.31 0-70.88 13.69-33.58 13.69-48.74 33.62-5.61 6.84-4.76 14.77.84 7.92 7.69 13.3 6.84 4.85 14.38 4 7.54-.84 13.16-6.46 16.3-16.3 38.69-24.61Q271.92-760 300-760q47.15 0 73.58 17.77Q400-724.46 400-700q0 20.92-22.12 37.81-22.11 16.88-87.42 45.88-74.61 32.69-102.54 57.73Q160-533.54 160-500q0 24.31 16.62 44.5 16.61 20.19 47.92 36.42Z" /></svg>
                  <span className="text-xs font-medium">Writing</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] hero-category">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M320-267.69 107.69-480 320-692.31l28.54 28.54-184 184L348.31-296 320-267.69Zm320 0-28.54-28.54 184-184L611.69-664 640-692.31 852.31-480 640-267.69Z" /></svg>
                  <span className="text-xs font-medium">Tech Skills</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] hero-category">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M366.92-92.23q-46 0-80.57-27.85-34.58-27.84-47.66-71.38-12.15 20.23-33.57 30.96-21.43 10.73-45.12 10.73-41.77 0-70.88-29.17Q60-208.1 60-249.77q0-36.85 25.69-67.11 25.69-30.27 64.85-30.66-20.16-18.46-31.89-44.42T106.92-446q0-33.29 16.27-62.41 16.27-29.13 45.58-48.05 2.73 8.85 7.36 18.92 4.64 10.08 9.49 18.16-18.62 14.07-28.16 33.55-9.54 19.47-9.54 40.83 0 62.15 46 80.15 46 18 94.7 27.54l9 15.85q-11 32-17.85 54.11-6.85 22.12-6.85 40.89 0 37.38 27.09 65.42T366.15-133q42.62 0 69.93-32.08 27.3-32.07 44.84-76.15 17.54-44.08 27.2-90.69 9.65-46.62 16.19-76.23l39.54 11q-8.23 39.61-19.7 92.23-11.46 52.61-32.65 99.73-21.19 47.11-55.61 80.04-34.43 32.92-88.97 32.92ZM160-189.77q24.69 0 42.35-17.65Q220-225.08 220-249.77t-17.65-42.35q-17.66-17.65-42.35-17.65t-42.35 17.65Q100-274.46 100-249.77t17.65 42.35q17.66 17.65 42.35 17.65Zm243.23-164.92q-40.61-36.39-74.27-68.04-33.65-31.65-58.15-62.08-24.5-30.42-37.65-60.84Q220-576.08 220-609q0-56.56 38.72-95.28T354-743q10.92 0 19.69 1.27 8.77 1.27 16.62 3.58-4.77-9.23-7.54-18.99-2.77-9.75-2.77-20.48 0-41.66 29.14-70.83t70.77-29.17q41.63 0 70.86 29.17Q580-819.28 580-777.62q0 11-2.77 20.5t-7.54 18.74q7.85-2.31 16.62-3.47Q595.08-743 606-743q45.38 0 79.31 25.81 33.92 25.81 46.54 65.88-9.43-1.46-21.22-1.46-11.78 0-21.55 1.23-10.85-23-32.81-37.23Q634.31-703 606.34-703q-37.65 0-59.84 19.35-22.19 19.34-57.73 60.65h-18.54q-36.54-42.54-58.73-61.27Q389.31-703 354-703q-40.65 0-67.32 26.68Q260-649.65 260-609q0 23.25 11.85 48.01 11.84 24.76 34.07 52.26 22.24 27.5 53.93 58.5t71.92 67l-28.54 28.54ZM480-717.62q24.69 0 42.35-17.65Q540-752.92 540-777.62q0-24.69-17.65-42.34-17.66-17.66-42.35-17.66t-42.35 17.66Q420-802.31 420-777.62q0 24.7 17.65 42.35 17.66 17.65 42.35 17.65ZM590.54-91.46q-14.24 0-28.15-3.05-13.91-3.04-26.85-9.64 5.56-7.19 11.12-16.95 5.56-9.76 10.11-17.98 8.88 3.69 17.77 5.27 8.88 1.58 17.77 1.58 38.92 0 66.57-27.97 27.66-27.96 27.66-66.49 0-18.77-6.85-40.5-6.84-21.73-17.84-53.73l9.77-15.85q49.69-9.54 95.19-27.92 45.5-18.39 45.5-80.54 0-48.46-34.12-71.85-34.11-23.38-76.81-23.38-40.32 0-94.08 13.69t-124.15 37.15l-11-39.53q68.77-21.93 123.81-37.39Q650.99-582 697-582q60.54 0 107.92 35.62 47.39 35.61 47.39 101.15 0 27.75-11.35 52.72-11.34 24.97-31.5 44.97 39.16 1.16 64.85 30.66Q900-287.38 900-249.77q0 40.77-29.12 70.39-29.11 29.61-70.88 29.61-23.69 0-45.12-10.73-21.42-10.73-33.57-30.96-13.08 43.54-48.43 71.77-35.34 28.23-82.34 28.23ZM801-189.77q24.69 0 41.85-17.65Q860-225.08 860-249.77t-17.65-42.85q-17.66-18.15-42.35-18.15t-42.35 17.65Q740-275.46 740-250.77t18.15 42.85q18.16 18.15 42.85 18.15Zm-641-60Zm320-527.85Zm320 526.85Z" /></svg>
                  <span className="text-xs font-medium">Team Building</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] hero-category">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m776-585-27.54-27.54 19.23-20.23q7.69-7.69 7.69-17.31 0-9.61-7.69-17.3L667.38-767.69q-7.69-7.69-17.3-7.69-9.62 0-17.31 7.69l-20.23 19.23L584-777l22.31-23.31q17.61-17.61 43.15-17.11t43.16 18.11l106.69 106.69q17.61 17.62 17.61 42.66 0 25.04-17.61 42.65L776-585ZM353.69-161.69q-17.61 17.61-42.65 17.61t-42.66-17.61L164.77-265.31q-18.39-18.38-18.39-45.73 0-27.34 18.39-45.73L184-376l28.54 28.54-19.46 19.23q-7.7 7.69-7.7 17.31 0 9.61 7.7 17.3l100.54 100.54q7.69 7.7 17.3 7.7 9.62 0 17.31-7.7l19.23-19.46L376-184l-22.31 22.31ZM743-433.85l45.46-45.46q7.69-7.69 7.69-17.69t-7.69-17.69L514.69-788.46q-7.69-7.69-17.69-7.69t-17.69 7.69L433.85-743q-7.7 7.69-7.7 17.31 0 9.61 7.7 17.31l274.53 274.53q7.7 7.7 17.31 7.7 9.62 0 17.31-7.7ZM480.69-171.54l45.46-45.69q7.7-7.69 7.7-17.31 0-9.61-7.7-17.31l-274.3-274.3q-7.7-7.7-17.31-7.7-9.62 0-17.31 7.7l-45.69 45.46q-7.69 7.69-7.69 17.69t7.69 17.69l273.77 273.77q7.69 7.69 17.69 7.69t17.69-7.69Zm-28.31-210.92 125.39-125.16-70.15-70.15-125.16 125.39 69.92 69.92Zm56.08 239.23q-18.38 18.38-45.46 18.38-27.08 0-45.46-18.38L143.23-417.54q-18.38-18.38-18.38-45.46 0-27.08 18.38-45.46l45.46-46.23q18.39-18.39 45.73-18.39 27.35 0 45.73 18.39l73.77 73.77 125.39-125.39-73.77-73.54q-18.39-18.38-18.39-45.84 0-27.46 18.39-45.85l46.23-46.23q18.38-18.38 45.73-18.38 27.35 0 45.73 18.38l274.54 274.54q18.38 18.38 18.38 45.73 0 27.35-18.38 45.73l-46.23 46.23q-18.39 18.39-45.85 18.39t-45.84-18.39l-73.54-73.77-125.39 125.39 73.77 73.77q18.39 18.38 18.39 45.73 0 27.34-18.39 45.73l-46.23 45.46Z" /></svg>
                  <span className="text-xs font-medium">Fitness & Yoga</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] hero-category">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M460-620v-120H340v-40h120v-120h40v120h120v40H500v120h-40ZM292.31-115.38q-25.31 0-42.66-17.35-17.34-17.35-17.34-42.65 0-25.31 17.34-42.66 17.35-17.34 42.66-17.34 25.31 0 42.65 17.34 17.35 17.35 17.35 42.66 0 25.3-17.35 42.65-17.34 17.35-42.65 17.35Zm375.38 0q-25.31 0-42.65-17.35-17.35-17.35-17.35-42.65 0-25.31 17.35-42.66 17.34-17.34 42.65-17.34t42.66 17.34q17.34 17.35 17.34 42.66 0 25.3-17.34 42.65-17.35 17.35-42.66 17.35ZM80-820v-40h97.92l163.85 344.62h265.38q6.93 0 12.31-3.47 5.39-3.46 9.23-9.61L768.54-780h45.61L662.77-506.62q-8.69 14.62-22.61 22.93t-30.47 8.31H324l-48.62 89.23q-6.15 9.23-.38 20 5.77 10.77 17.31 10.77h435.38v40H292.31q-35 0-52.35-29.39-17.34-29.38-.73-59.38l60.15-107.23L152.31-820H80Z" /></svg>
                  <span className="text-xs font-medium">Sales Skills</span>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-xl font-bold hover:bg-white/50 transition hero-categories-right">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m531.69-480-184-184L376-692.31 588.31-480 376-267.69 347.69-296l184-184Z" /></svg>
              </button>
            </div>
          </div>
        </div>
        {/* Are you a Trainer? Section - overlapping upward */}
        <section className="relative -top-[50px] w-[100%]  z-1 are-you-a-trainer-section">
          <div className="relative w-full h-[390px] flex items-center justify-start overflow-hidden are-you-a-trainer-bg shadow-lg">
            <img
              src="/assets/hero.jpg"
              alt="Trainer background"
              className="absolute inset-0 w-full h-full object-cover object-top z-0 are-you-a-trainer-img"
            />

            <div className="absolute inset-0 bg-black/40 h-[220px] z-10 are-you-a-trainer-overlay flex flex-row justify-around px-[100px] items-center  self-end">


              <div className="flex flex-col w-[50%] text-white">
                <div className="font-arial font-bold text-[36px] leading-[54px] tracking-[0] are-you-a-trainer-title">Are you a Trainer?</div>
                <div className="font-arial font-normal text-[32px] leading-[48px] tracking-[0]">Make your FREE Profile and get discovered by Corporate Businesse</div>

              </div>
              <button className="w-fit h-[60px] border border-white text-white px-6 py-2 rounded-2xl font-semibold text-base bg-transparent hover:bg-white hover:text-blue-700 text-lg transition are-you-a-trainer-btn">Create a Profile</button>


            </div>

          </div>

        </section>
      </section>

      {/* Popular Trainers Section */}
      <section className="w-full max-w-[1352px] mx-auto flex flex-col mx-auto px-4 py-10 trainer-list-section">
        <h2 className="text-[30px] font-bold mb-6 text-gray-800 trainer-list-title">Discover Our Popular Trainers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 trainer-list-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex flex-col items-center min-h-[320px] max-w-[300px] mx-auto trainer-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTrainerClick(i)}
            >
              {/* Trainer image with heart button overlay */}
              <div className="rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-gray-100 relative  min-h-[230px]  max-w-[260px] trainer-card-avatar">
                <img
                  src={`/assets/trainer${((i - 1) % 4) + 1}.jpg`}
                  alt="Trainer"
                  className="object-cover w-full h-full"
                />

                <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-red-100 transition trainer-card-fav-btn">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                </button>
              </div>
              <div className="text-left">
                <span className="text-[18px] flex gap-2 font-bold text-gray-900 mb-0.5 trainer-card-name">{i === 1 ? 'Sanya Gupta' : i === 2 ? 'Rahul Verma' : i === 3 ? 'Anjali Mehta' : i === 4 ? 'Kiran Rao' : i === 5 ? 'Sanya Gupta' : i === 6 ? 'Rahul Verma' : i === 7 ? 'Anjali Mehta' : 'Kiran Rao'}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.84922 8.6201C3.70326 7.96262 3.72567 7.27894 3.91437 6.63244C4.10308 5.98593 4.45196 5.39754 4.92868 4.92182C5.40541 4.4461 5.99453 4.09844 6.64142 3.91109C7.28832 3.72374 7.97205 3.70276 8.62922 3.8501C8.99093 3.2844 9.48922 2.81886 10.0782 2.49638C10.6671 2.17391 11.3278 2.00488 11.9992 2.00488C12.6707 2.00488 13.3313 2.17391 13.9203 2.49638C14.5092 2.81886 15.0075 3.2844 15.3692 3.8501C16.0274 3.70212 16.7123 3.72301 17.3602 3.91081C18.0081 4.09862 18.598 4.44724 19.0751 4.92425C19.5521 5.40126 19.9007 5.99117 20.0885 6.6391C20.2763 7.28703 20.2972 7.97193 20.1492 8.6301C20.7149 8.99181 21.1805 9.4901 21.5029 10.079C21.8254 10.668 21.9944 11.3286 21.9944 12.0001C21.9944 12.6715 21.8254 13.3322 21.5029 13.9211C21.1805 14.5101 20.7149 15.0084 20.1492 15.3701C20.2966 16.0273 20.2756 16.711 20.0882 17.3579C19.9009 18.0048 19.5532 18.5939 19.0775 19.0706C18.6018 19.5473 18.0134 19.8962 17.3669 20.0849C16.7204 20.2736 16.0367 20.2961 15.3792 20.1501C15.018 20.718 14.5193 21.1855 13.9293 21.5094C13.3394 21.8333 12.6772 22.0032 12.0042 22.0032C11.3312 22.0032 10.669 21.8333 10.0791 21.5094C9.48914 21.1855 8.99045 20.718 8.62922 20.1501C7.97205 20.2974 7.28832 20.2765 6.64142 20.0891C5.99453 19.9018 5.40541 19.5541 4.92868 19.0784C4.45196 18.6027 4.10308 18.0143 3.91437 17.3678C3.72567 16.7213 3.70326 16.0376 3.84922 15.3801C3.27917 15.0193 2.80963 14.5203 2.48426 13.9293C2.1589 13.3384 1.98828 12.6747 1.98828 12.0001C1.98828 11.3255 2.1589 10.6618 2.48426 10.0709C2.80963 9.47992 3.27917 8.98085 3.84922 8.6201Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12L11 14L15 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                </span>
                <span className="text-[#EAB308]">★★★★☆</span>
                <span className="text-[14px] font-semibold text-gray-600 mb-0.5 flex items-center gap-1 trainer-card-skills">{i === 1 ? 'Conflict Resolution, Team Building' : i === 2 ? 'Public Speaking, Leadership' : i === 3 ? 'Emotional Intelligence, Life Coaching' : i === 4 ? 'Time Management, Career Growth' : i === 5 ? 'Conflict Resolution, Team Building' : i === 6 ? 'Public Speaking, Leadership' : i === 7 ? 'Emotional Intelligence, Life Coaching' : 'Time Management, Career Growth'}</span>
                <span className="text-xs text-gray-500 mb-0.5 trainer-card-exp">{i === 1 ? '12 years • Pune' : i === 2 ? '10 years • Delhi' : i === 3 ? '8 years • Mumbai' : i === 4 ? '6 years • Bengaluru' : i === 5 ? '12 years • Pune' : i === 6 ? '10 years • Delhi' : i === 7 ? '8 years • Mumbai' : '6 years • Bengaluru'}</span>
                <span className="text-xs text-gray-500 mb-0.5 trainer-card-lang">Languages spoken: English, Hindi, Tamil</span>

              </div>

              <div className="flex items-center w-full justify-between mt-1 pt-1 border-t border-gray-100 trainer-card-bottom">
                <span className="text-[14px] font-semibold trainer-card-price">{i === 1 ? '₹1800/hour' : i === 2 ? '₹2500/hour' : i === 3 ? '₹2200/hour' : i === 4 ? '₹1800/hour' : i === 5 ? '₹1800/hour' : i === 6 ? '₹2500/hour' : i === 7 ? '₹2200/hour' : '₹1800/hour'}</span>
                <span className="flex items-center text-xs text-gray-400 trainer-card-views"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>1.2k</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8 trainer-list-viewall">
          <a href="#" className="text-blue-600 font-semibold hover:underline">View All Profiles</a>
        </div>
      </section>

      {/* Hire Trainers in Single Click Section - 3 cards, fixed size, exact spacing */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-4 gap-6">
          <div className="flex flex-col justify-between py-10">
            <p className="text-[30px] font-bold mb-4 ">Hire Trainers in 3 simple Steps </p>
            <p className=" text-[16px] font-normal  mb-2">Hiring soft skills trainers is quick and hassle-free. Simply share your requirements, review curated trainer profiles and make your choice with ease--all in just three simple steps.</p>
            <p className="font-semibold text-[16px]">it's that Easy</p>
          </div>
          <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl text-center gap-2 py-6">

            <div className="w-[200px] h-[200px]"><img src="assets/Profiling-pana 1.png" alt="" /></div>
            <p className="text-[24px] font-normal"><span className="font-semibold">Browse</span> trainers profiles from across India</p>
          </div>
          <div className="flex flex-col justify-center items-center  bg-blue-50 rounded-2xl text-center gap-2 py-6">
            <div className="w-[200px] h-[200px]"><img src="assets/Key-pana 1.png" alt="" /></div>

            <p className="text-[24px] font-normal"><span className="font-semibold">Unlock</span> contact details using credits. </p>
          </div>
          <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl text-center gap-2 py-6">
            <div className="w-[200px] h-[200px]"><img src="assets/Calling-pana 1.png" alt="" /></div>
            <p className="text-[24px] font-normal"><span className="font-semibold">Connect directly--</span>no commisions, no hassle!</p>
          </div>

        </div>
      </section>

      {/* Browse Trainers by Location Section - 2 rows, 3 columns, fixed size */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10">
        <p className="text-[30px] font-bold mb-4">Browse Trainers by Locations</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {locations.map((city, index) => (
            <div key={index} className="flex flex-col relative max-w-[424px] h-[300px] px-1">
              <img
                src={city.image}
                alt={city.name}
                className="rounded-2xl w-full h-full object-cover object-top"
              />
              <div className="text-2xl font-light absolute bottom-0 left-0 text-white bg-black/50 px-6 py-4 w-full rounded-t-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-[24px] font-semibold">{city.name}</p>
                  <p className="text-xs">424 trainers available</p>
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

      {/* Info Section with Blue Background - 1 row, 2 columns, left text, right 3 cards */}
      <section className="w-full max-w-7xl mx-auto  rounded-2xl bg-blue-50 p-4 ">
        <div className="max-w-7xl mx-auto flex flex-row items-center ">
          <div className="flex-1 min-w-[320px]">
            <h2 className="text-[30px] font-bold mb-2">No Middlemen, No Commission!</h2>
            <p className="text-[24px] font-normal text-gray-700 ">Our platform lets corporate clients connect directly with experienced soft skills trainers. No intermediaries—just access trainer contact details and hire on your terms!. Trainers get an opportunity to get discovered by Corporate Clients in no time. More project, more training assignments and better earning.</p>
          </div>
        </div>
      </section>

      {/* Hire Trainers in 3 simple Steps Section - 1 row, 2 columns, left text, right 3 cards */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-4 gap-6">
          <div className="flex flex-col justify-between items-start py-10">
            <p className="text-[30px] font-bold mb-4 ">Trainers Get Discovered & Land Corporate Clients </p>
            <p className="text-[16px] font-normal mb-2">🎯 Showcase Your Expertise to Leading Companies</p>
            <button className="bg-blue-600 rounded-xl text-white px-4 py-2">Create your free profile</button>
          </div>
          <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl text-center gap-2 py-6">

            <div className="w-[200px] h-[200px]"><img src="assets/Checklist-pana 1.png" alt="" /></div>
            <p className="text-[24px] font-normal"><span className="font-semibold">List your profile</span> with expertise and experience</p>
          </div>
          <div className="flex flex-col justify-center items-center  bg-blue-50 rounded-2xl text-center gap-2 py-6">
            <div className="w-[200px] h-[200px]"><img src="assets/Calling-pana 1.png" alt="" /></div>

            <p className="text-[24px] font-normal"><span className="font-semibold">Get contacted</span>directly by potential clients</p>
          </div>
          <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl text-center gap-2 py-6">
            <div className="w-[200px] h-[200px]"><img src="assets/Mobile Marketing-pana 1.png" alt="" /></div>
            <p className="text-[24px] font-normal"><span className="font-semibold">Gain visibility </span>among people looking for trainers.</p>
          </div>

        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto ">
        <div className="flex items-center gap-5">
          <p className="text-blue-500">👥 Join the Netwoek & Grow you training Buisness 👉 </p>
          <button className="bg-blue-600 rounded-xl text-white px-4 py-2">Sign Up as a Trainer</button>
        </div>
      </section>

      {/* How it Works Section - 2 columns, left stepper, right image */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-row gap-20 items-start">
          {/* Left Column */}
          <div className="flex-1">
            <h2 className="text-[30px] font-bold mb-8">How it Works</h2>
            <div className="flex max-w-7xl mx-auto">
              <div className="relative space-y-16">
                {/* Vertical dashed line */}
                <div className="absolute left-4 top-10 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 z-0"></div>

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
                    <p className="text-gray-600">Assess trainers' portfolios and workshop details.</p>
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
                <div className="rounded-2xl overflow-hidden w-[80%] aspect-[4/3]">
                  <img src="assets/howitwork.jpg" alt="" className="object-cover w-full h-full" />
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
      <footer className="w-full bg-blue-700 text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between px-4 gap-4">
          <div className="text-sm"> <span className="font-semibold text-lg">Trainer's Mart.</span> <br /> Bridging the gap between talent and opportunities.</div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms and Conditions</a>
            <a href="#" className="hover:underline">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
