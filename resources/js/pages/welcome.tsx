import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#fdf6e3] via-[#f5e8ff] to-[#e3f6fd] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-[#0a0a0a] dark:via-[#232323] dark:to-[#1a1a1a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-full border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] bg-white/70 shadow hover:bg-white hover:border-[#1915014a] transition dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:bg-[#232323]/70 dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-full border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] bg-gradient-to-r from-[#a7e9af] to-[#fbc2eb] shadow hover:from-[#fbc2eb] hover:to-[#a7e9af] transition dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:bg-gradient-to-r dark:from-[#232323] dark:to-[#3e3e3a] dark:hover:border-[#62605b]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('visit.type')}
                                    className="inline-block rounded-full border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] bg-gradient-to-r from-[#a7e9af] to-[#fbc2eb] shadow hover:from-[#fbc2eb] hover:to-[#a7e9af] transition dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:bg-gradient-to-r dark:from-[#232323] dark:to-[#3e3e3a] dark:hover:border-[#62605b]"
                                >
                                    Book an appointment
                                </Link> 
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[900px] flex-col lg:flex-row lg:max-w-4xl">
                        <div className="flex-1 rounded-lg bg-white/80 p-8 pb-12 text-[15px] leading-[22px] shadow-2xl backdrop-blur-md w-full dark:bg-[#161615]/80 dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d] flex flex-row items-stretch gap-8">
                           
                            {/* Text Content Section */}
                            <div className="w-1/2 flex flex-col justify-center">
                                <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#a7e9af] via-[#fbc2eb] to-[#f5e8ff] bg-clip-text text-transparent dark:from-[#a7e9af] dark:via-[#fbc2eb] dark:to-[#232323] text-left">
                                    Welcome to Easy Appoint!
                                </h1>
                                <p className="mb-6 text-lg text-[#444] dark:text-[#ccc] text-left">
                                    Effortlessly book appointments and manage your schedule with our modern, user-friendly platform.
                                </p>
                                <ul className="mb-8 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-[#a7e9af] rounded-full"></span>
                                        <span>Fast and secure booking</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-[#fbc2eb] rounded-full"></span>
                                        <span>Personalized dashboard</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-[#f5e8ff] rounded-full"></span>
                                        <span>24/7 access from any device</span>
                                    </li>
                                </ul>
                                {!auth.user && ( 
                                    <Link
                                        href={route('visit.type')}
                                        className="inline-block rounded-full bg-gradient-to-r from-[#a7e9af] to-[#fbc2eb] px-5 py-2 text-base font-semibold text-[#1b1b18] shadow-lg hover:from-[#fbc2eb] hover:to-[#a7e9af] transition dark:from-[#232323] dark:to-[#3e3e3a] dark:text-[#EDEDEC] text-center"
                                    >
                                        Book an appointment
                                    </Link>
                                )}
                            </div>

                             {/* Carousel Section */}
                            <div className="w-1/2 flex flex-col justify-center items-center">
                                {/* Simple Carousel */}
                                <Carousel />
                            </div>

                        </div>
                    </main>
                </div>
                <footer className="mt-8 text-xs text-[#888] dark:text-[#666]">
                    &copy; {new Date().getFullYear()} Easy Appoint. All rights reserved.
                </footer>
            </div>
            {/* Carousel Component */}
            {/* Place this at the bottom of the file or in a separate file and import it */}
            {/* Example Carousel implementation below */}
            {/* You can replace images and content as needed */}
            {/* --- Carousel Component --- */}
            {/* --- Start --- */}
            {/* 
                Example usage:
                <Carousel />
            */}
            {/* --- End --- */}
        </>
    );
}

// Simple Carousel Component

function Carousel() {
    const slides = [
        {
            title: "Book Instantly",
            desc: "Schedule appointments in seconds with just a few clicks.",
            color: "from-[#a7e9af] to-[#fbc2eb]",
        },
        {
            title: "Stay Organized",
            desc: "Keep track of all your bookings in one place.",
            color: "from-[#fbc2eb] to-[#f5e8ff]",
        },
        {
            title: "Access Anywhere",
            desc: "Manage your appointments from any device, anytime.",
            color: "from-[#f5e8ff] to-[#a7e9af]",
        },
    ];
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
    const next = () => setCurrent((current + 1) % slides.length);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prevCurrent) => (prevCurrent + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="w-full max-w-xs flex flex-col items-center">
            <div className={`rounded-xl p-6 mb-4 bg-gradient-to-br ${slides[current].color} shadow-lg transition-all duration-500`} style={{ minHeight: '220px', height: '260px' }}>
                <h2 className="text-2xl font-bold mb-2 text-[#1b1b18] dark:text-[#232323]">{slides[current].title}</h2>
                <p className="text-[#444] dark:text-[#232323]">{slides[current].desc}</p>
            </div>
            <div className="flex gap-2 items-center">
                <button onClick={prev} className="p-2 rounded-full bg-white/70 hover:bg-white shadow transition dark:bg-[#232323]/70">&lt;</button>
                {slides.map((_, idx) => (
                    <span
                        key={idx}
                        className={`inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-[#a7e9af]' : 'bg-[#e0e0e0]'}`}
                    ></span>
                ))}
                <button onClick={next} className="p-2 rounded-full bg-white/70 hover:bg-white shadow transition dark:bg-[#232323]/70">&gt;</button>
            </div>
        </div>
    );
}
