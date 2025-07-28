import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Calendar, User, Clock, Edit, History, X, House } from 'lucide-react';

export default function AppointmentSuccess() {
    return (
        <>
            <Head title="Appointment Confirmed - Easy Appoint">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] p-6 text-[#1e293b] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
                {/* Header */}
                <header className="mb-3 w-full max-w-[335px] text-sm lg:max-w-6xl">
                    <nav className="flex items-center justify-between">
                        {/* <Link href={route('home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EA</span>
                            </div>
                            <span className="font-semibold text-lg text-[#1e293b] dark:text-[#f1f5f9]">Easy Appoint</span>
                        </Link> */}
                        {/* <div className="flex items-center gap-4">
                            <Link
                                href={route('patient.user.login')}
                                className="inline-block rounded-full border border-[#e2e8f0] px-6 py-2 text-sm font-medium text-[#1e293b] bg-white shadow-sm hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all duration-200 dark:border-[#475569] dark:text-[#f1f5f9] dark:bg-[#334155] dark:hover:bg-[#475569]"
                            >
                                Log in
                            </Link>
                            </div> */}
                            <Link
                                href={route('home')}
                                className="inline-block rounded-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] px-6 py-2 text-sm font-medium text-white shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-200"
                            >
                                <div 
                                className='flex items-center gap-2'
                                >
                               <House/> 
                               <p>Back to Home</p>
                                </div>
                            </Link>
                    </nav>
                </header>                
                {/* Main Content */}
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750">
                    <main className="w-full max-w-6xl">
                        <div className="rounded-lg bg-white/90 pb-2 pt-4 px-4 lg:pt-6 lg:px-6 shadow-xl backdrop-blur-sm dark:bg-[#1e293b]/90 dark:shadow-[inset_0px_0px_0px_1px_#475569]">
                            {/* Success Header */}
                            <div className="flex items-center justify-center gap-2 mb-5">
                                <div className="inline-flex items-center justify-center w-10 h-10 lg:w-20 lg:h-20 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full mb-6">
                                    <CheckCircle className="lg:h-10 lg:w-10 text-white" />
                                </div>
                                <h1 className="text-xl lg:text-2xl font-bold mb-4 bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] bg-clip-text text-transparent dark:from-[#34d399] dark:via-[#10b981] dark:to-[#059669]">
                                    Appointment Confirmed!
                                </h1>
                                {/* <p className="text-[#64748b] dark:text-[#cbd5e1] text-lg lg:text-xl mb-2">
                                    Your appointment has been successfully booked.
                                </p> */}
                                
                            </div>

                            {/* Two Column Layout for Better Landscape View */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                {/* Registration CTA - Takes 2/3 of space on large screens */}
                                <div className="lg:col-span-2 bg-gradient-to-r from-[#3b82f6]/10 to-[#1d4ed8]/10 dark:from-[#3b82f6]/20 dark:to-[#1d4ed8]/20 rounded-lg p-6 lg:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-[#1e293b] dark:text-[#f1f5f9]">
                                            Take Control of Your Healthcare
                                        </h2>
                                        <p className="text-[#64748b] dark:text-[#cbd5e1] text-lg">
                                            Create an account to unlock powerful features and manage your appointments with ease.
                                        </p>
                                    </div>
                                    
                                    {/* Benefits Grid - More compact for landscape */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                        <div className="flex flex-col items-center text-center p-4 bg-white/50 dark:bg-[#334155]/50 rounded-lg">
                                            <div className="w-12 h-12 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center mb-3">
                                                <Edit className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-[#1e293b] dark:text-[#f1f5f9] mb-1 text-sm">Edit Appointments</h3>
                                            <p className="text-xs text-[#64748b] dark:text-[#cbd5e1]">Reschedule or modify anytime</p>
                                        </div>
                                        
                                        <div className="flex flex-col items-center text-center p-4 bg-white/50 dark:bg-[#334155]/50 rounded-lg">
                                            <div className="w-12 h-12 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-lg flex items-center justify-center mb-3">
                                                <X className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-[#1e293b] dark:text-[#f1f5f9] mb-1 text-sm">Cancel Appointments</h3>
                                            <p className="text-xs text-[#64748b] dark:text-[#cbd5e1]">Cancel when plans change</p>
                                        </div>
                                        
                                        <div className="flex flex-col items-center text-center p-4 bg-white/50 dark:bg-[#334155]/50 rounded-lg">
                                            <div className="w-12 h-12 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-lg flex items-center justify-center mb-3">
                                                <History className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-[#1e293b] dark:text-[#f1f5f9] mb-1 text-sm">Appointment History</h3>
                                            <p className="text-xs text-[#64748b] dark:text-[#cbd5e1]">View past & upcoming</p>
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link
                                            href={route('patient.user.create')}
                                            className="flex-1 inline-block text-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-200 transform hover:scale-105"
                                        >
                                            Create Free Account
                                        </Link>
                                        <Link
                                            href={route('patient.user.login')}
                                            className="flex-1 inline-block text-center rounded-full border-2 border-[#3b82f6] px-6 py-3 text-lg font-semibold text-[#3b82f6] bg-transparent hover:bg-[#3b82f6] hover:text-white transition-all duration-200 dark:border-[#60a5fa] dark:text-[#60a5fa] dark:hover:bg-[#60a5fa] dark:hover:text-[#1e293b]"
                                        >
                                            Already have an account?
                                        </Link>
                                    </div>
                                </div>

                                {/* What's Next Section - Takes 1/3 of space */}
                                <div className="bg-[#f8fafc] dark:bg-[#334155] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-[#1e293b] dark:text-[#f1f5f9] flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded flex items-center justify-center">
                                            <span className="text-white text-xs">ℹ️</span>
                                        </div>
                                        What's Next?
                                    </h3>
                                    <ul className="space-y-3 text-[#64748b] dark:text-[#cbd5e1]">
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-[#10b981] rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="text-sm">Check your email for appointment confirmation details</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-[#10b981] rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="text-sm">You'll receive a reminder 24 hours before your appointment</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-[#10b981] rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="text-sm">Arrive 15 minutes early for check-in procedures</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-[#10b981] rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="text-sm">Bring valid ID and insurance information</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>                            {/* Action Buttons - Horizontal layout */}
                            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Link
                                    href={route('appointment.create')}
                                    className="inline-block text-center rounded-full border border-[#e2e8f0] px-6 py-3 font-medium text-[#1e293b] bg-white shadow-sm hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all duration-200 dark:border-[#475569] dark:text-[#f1f5f9] dark:bg-[#334155] dark:hover:bg-[#475569]"
                                >
                                    Book Another Appointment
                                </Link>
                                <Link
                                    href={route('home')}
                                    className="inline-block text-center rounded-full bg-gradient-to-r from-[#64748b] to-[#475569] px-6 py-3 font-medium text-white shadow-sm hover:from-[#475569] hover:to-[#334155] transition-all duration-200"
                                >
                                    Back to Home
                                </Link>
                                <div className="sm:col-span-2 lg:col-span-1 flex justify-center">
                                    <Link
                                        href={route('patient.user.create')}
                                        className="inline-block text-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] px-6 py-3 font-medium text-white shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-200"
                                    >
                                        Quick Register
                                    </Link>
                                </div>
                            </div> */}
                        </div>
                    </main>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center max-w-4xl">
                    <div className="border-t border-[#e2e8f0] dark:border-[#475569] pt-6">
                        <p className="text-sm text-[#64748b] dark:text-[#cbd5e1]">
                            Need help? Contact us at <a href="mailto:info@easyappoint.com" className="text-[#3b82f6] hover:text-[#2563eb] dark:text-[#60a5fa] dark:hover:text-[#3b82f6] transition-colors">random@easyappoint.com</a> or call <a href="tel:+9779849123456" className="text-[#3b82f6] hover:text-[#2563eb] dark:text-[#60a5fa] dark:hover:text-[#3b82f6] transition-colors">+977 9849123456</a>
                        </p>
                        <p className="text-xs text-[#64748b] dark:text-[#cbd5e1] mt-2">
                            &copy; {new Date().getFullYear()} Easy Appoint Healthcare. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
