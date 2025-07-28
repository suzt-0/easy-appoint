import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome - Healthcare Appointments">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] p-6 text-[#1e293b] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-6xl">
                    <nav className="flex flex-col items-center gap-8 flex-wrap  lg:flex-row lg:justify-between  lg:gap-12">
                        <div className="flex items-center p-2 gap-2">
                            {/* <div className="w-8 h-8 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EA</span>
                            </div> */}
                            <span className="font-semibold text-lg text-[#1e293b] dark:text-[#f1f5f9]">Easy Appoint</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-4 align-center justify-center">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-full border border-[#e2e8f0] px-6 py-2 text-sm font-medium text-[#1e293b] bg-white shadow-sm hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all duration-200 dark:border-[#475569] dark:text-[#f1f5f9] dark:bg-[#334155] dark:hover:bg-[#475569]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('patient.user.loginForm')}
                                        className="inline-block rounded-full border border-[#e2e8f0] px-6 py-2 text-sm font-medium text-[#1e293b] bg-white shadow-sm hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all duration-200 dark:border-[#475569] dark:text-[#f1f5f9] dark:bg-[#334155] dark:hover:bg-[#475569]"
                                    >
                                        Patient Login
                                    </Link>
                                    <Link
                                        href={route('patient.user.create')}
                                        className="inline-block rounded-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] px-6 py-2 text-sm font-medium text-white shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-200 dark:from-[#3b82f6] dark:to-[#1d4ed8]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[1200px] flex-col lg:flex-row lg:max-w-6xl">
                        {/* Hero Section */}
                        <div className="flex-1 rounded-lg bg-white/90 p-12 pb-16 text-[16px] leading-[24px] shadow-xl backdrop-blur-sm w-full dark:bg-[#1e293b]/90 dark:text-[#f1f5f9] dark:shadow-[inset_0px_0px_0px_1px_#475569] mb-8 lg:mb-0">
                            
                            {/* Main Hero Content */}
                            <div className="text-center lg:text-left mb-12">
                                <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#3b82f6] dark:to-[#2563eb]">
                                    Your Health,<br />Our Priority
                                </h1>
                                <p className="mb-8 text-xl text-[#64748b] dark:text-[#cbd5e1] max-w-2xl mx-auto lg:mx-0">
                                    Experience seamless healthcare with our advanced online appointment booking system. 
                                    Connect with qualified healthcare professionals from the comfort of your home.
                                </p>
                                {!auth.user && ( 
                                    <Link
                                        href={route('appointment.create')}
                                        className="inline-block rounded-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-200 transform hover:scale-105"
                                    >
                                        Book Your Appointment
                                    </Link>
                                )}
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="text-center p-6 rounded-lg bg-[#f8fafc] dark:bg-[#334155] shadow-sm">
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-xl">🏥</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#1e293b] dark:text-[#f1f5f9]">Expert Care</h3>
                                    <p className="text-[#64748b] dark:text-[#cbd5e1] text-sm">Access to qualified healthcare professionals across multiple specialties</p>
                                </div>
                                <div className="text-center p-6 rounded-lg bg-[#f8fafc] dark:bg-[#334155] shadow-sm">
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-xl">⚡</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#1e293b] dark:text-[#f1f5f9]">Quick Booking</h3>
                                    <p className="text-[#64748b] dark:text-[#cbd5e1] text-sm">Schedule appointments in minutes with our streamlined booking process</p>
                                </div>
                                <div className="text-center p-6 rounded-lg bg-[#f8fafc] dark:bg-[#334155] shadow-sm">
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-xl">🔒</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#1e293b] dark:text-[#f1f5f9]">Secure & Private</h3>
                                    <p className="text-[#64748b] dark:text-[#cbd5e1] text-sm">Your health information is protected with industry-standard security</p>
                                </div>
                            </div>

                            {/* Services Section */}
                            <div className="border-t border-[#e2e8f0] dark:border-[#475569] pt-8">
                                <h2 className="text-2xl font-bold mb-6 text-center text-[#1e293b] dark:text-[#f1f5f9]">Our Services</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4">
                                        <div className="text-3xl mb-2">🫀</div>
                                        <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Cardiology</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-3xl mb-2">🧠</div>
                                        <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Neurology</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-3xl mb-2">🦴</div>
                                        <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Orthopedics</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-3xl mb-2">👶</div>
                                        <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Pediatrics</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-3xl mb-2">👁️</div>
                                        <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Ophthalmology</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-3xl mb-2">🦷</div>
                                        <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Dentistry</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-3xl mb-2">🩺</div>
                                        <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">General Medicine</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-3xl mb-2">🚨</div>
                                        <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Emergency Care</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
                
                {/* Staff Login Section */}
                {!auth.user && (
                    <div className="mt-12 mb-8 w-full max-w-2xl mx-auto">
                        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-6 shadow-sm text-center dark:bg-[#334155] dark:border-[#475569]">
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-[#64748b] mb-1 dark:text-[#cbd5e1]">Healthcare Staff</h3>
                                <p className="text-xs text-[#94a3b8] dark:text-[#94a3b8]">Administrative access for healthcare professionals</p>
                            </div>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-xs font-medium text-[#6b7280] shadow-sm hover:bg-[#f9fafb] hover:border-[#9ca3af] transition-all duration-200 dark:border-[#6b7280] dark:bg-[#475569] dark:text-[#d1d5db] dark:hover:bg-[#64748b]"
                            >
                                Staff Login
                            </Link>
                        </div>
                    </div>
                )}
                
                <footer className="mt-12 text-center">
                    <div className="max-w-4xl mx-auto border-t border-[#e2e8f0] dark:border-[#475569] pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                            <div>
                                <h3 className="font-semibold text-[#1e293b] dark:text-[#f1f5f9] mb-2">Contact Info</h3>
                                <p className="text-sm text-[#64748b] dark:text-[#cbd5e1]">📞 +1 (555) 123-4567</p>
                                <p className="text-sm text-[#64748b] dark:text-[#cbd5e1]">✉️ info@easyappoint.com</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1e293b] dark:text-[#f1f5f9] mb-2">Hours</h3>
                                <p className="text-sm text-[#64748b] dark:text-[#cbd5e1]">Mon-Fri: 8AM - 8PM</p>
                                <p className="text-sm text-[#64748b] dark:text-[#cbd5e1]">Sat-Sun: 9AM - 5PM</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1e293b] dark:text-[#f1f5f9] mb-2">Emergency</h3>
                                <p className="text-sm text-[#64748b] dark:text-[#cbd5e1]">🚨 24/7 Emergency Care</p>
                                <p className="text-sm text-[#64748b] dark:text-[#cbd5e1]">Call: +1 (555) 911-HELP</p>
                            </div>
                        </div>
                        <p className="text-xs text-[#64748b] dark:text-[#cbd5e1]">
                            &copy; {new Date().getFullYear()} Easy Appoint Healthcare. All rights reserved. | Licensed Healthcare Provider
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
