import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#3B82F6] text-white py-6">
            <div className="max-w-9xl mx-auto flex flex-col flex-col-reverse md:flex-row items-start justify-between gap-4 px-4">
                <div className="w-full text-sm text-center md:text-left">
                    <span className="font-semibold text-lg">Get Pros.</span> <br />
                    Bridging the gap between talent and opportunities.
                </div>
                <div className="w-full flex flex-col gap-2 justify-center items-center md:flex-row md:gap-6 md:justify-end text-sm">
                    <a href="/privacy" className=" underline md:no-underline md:hover:underline">Privacy Policy</a>
                    <a href="/terms" className="underline md:no-underline md:hover:underline">Terms and Conditions</a>
                    <a href="#" className="underline md:no-underline md:hover:underline">Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 