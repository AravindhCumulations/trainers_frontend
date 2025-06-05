import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#3B82F6] text-white py-6 px-[80px]">
            <div className="mx-auto flex flex-row items-start justify-between px-4 gap-4">
                <div className="text-sm">
                    <span className="font-semibold text-lg">Trainer&apos;s Mart.</span> <br />
                    Bridging the gap between talent and opportunities.
                </div>
                <div className="flex gap-6 text-sm">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms and Conditions</a>
                    <a href="#" className="hover:underline">Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 