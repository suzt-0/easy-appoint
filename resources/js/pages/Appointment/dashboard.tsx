import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Link } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardCard = {
    title: string;
    description: string;
    content: string;
    href: string;
};

// Admin dashboard cards - Appointment Management Focus
const adminDashboardCards: DashboardCard[] = [
    {
        title: 'All Appointments',
        description: 'View and manage all appointments in the system',
        content: '� Complete Overview',
        href: '/admin/appointments',
    },
    {
        title: 'Create Appointment',
        description: 'Schedule new appointments for patients',
        content: '➕ New Booking',
        href: '/appointment/select-schedule',
    },
    // {
    //     title: 'Schedule Management',
    //     description: 'Manage practitioner schedules and availability',
    //     content: '�️ Schedules',
    //     href: '/admin/schedule/manage',
    // },
    // {
    //     title: 'Patient Registry',
    //     description: 'Patient records and contact management',
    //     content: '👥 Patient Database',
    //     href: '/dashboard/patient/manage',
    // },
    // {
    //     title: 'Practitioners',
    //     description: 'Manage healthcare practitioners and their profiles',
    //     content: '👨‍⚕️ Medical Staff',
    //     href: '/dashboard/practitioner/manage',
    // },
    // {
    //     title: 'System Users',
    //     description: 'User account management and roles',
    //     content: '⚙️ User Management',
    //     href: '/dashboard/user/manage',
    // },
];

// Patient dashboard cards - Appointment Focus
const patientDashboardCards: DashboardCard[] = [
    {
        title: 'Book New Appointment',
        description: 'Schedule a new appointment with healthcare providers',
        content: '📅 New Booking',
        href: '/appointment/select-schedule',
    },
    {
        title: 'My Appointments',
        description: 'View and manage your upcoming and past appointments',
        content: '🗓️ My Schedule',
        href: '/patient/appointments',
    },
    {
        title: 'Appointment History',
        description: 'Review your medical appointment history and notes',
        content: '📋 History',
        href: '/patient/appointment-history',
    },
    {
        title: 'Reschedule/Cancel',
        description: 'Modify or cancel existing appointments',
        content: '� Manage Bookings',
        href: '/patient/manage-appointments',
    },
    // {
    //     title: 'Find Doctors',
    //     description: 'Browse available healthcare professionals',
    //     content: '👨‍⚕️ Find Practitioners',
    //     href: '/doctors',
    // },
    // {
    //     title: 'Emergency Contact',
    //     description: '24/7 emergency healthcare services',
    //     content: '🚨 Emergency Care',
    //     href: '/emergency',
    // },
];

// Receptionist dashboard cards - Appointment Operations Focus
const receptionistDashboardCards: DashboardCard[] = [
    {
        title: 'Book Appointment',
        description: 'Create a new appointment',
        content: '📅 New Appointment',
        href: '/appointment/select-schedule',
    },
    // {
    //     title: 'Schedule New Appointment',
    //     description: 'Book appointments for patients calling in',
    //     content: '📞 Phone Booking',
    //     href: '/appointment/select-schedule',
    // },
    // {
    //     title: 'Patient Check-in',
    //     description: 'Process patient arrivals and check-ins',
    //     content: '✅ Check-in',
    //     href: '/receptionist/checkin',
    // },
    // {
    //     title: 'Daily Schedule View',
    //     description: 'View today\'s appointments and practitioner schedules',
    //     content: '� Today\'s Schedule',
    //     href: '/receptionist/daily-schedule',
    // },
    // {
    //     title: 'Patient Registration',
    //     description: 'Register new patients and update existing records',
    //     content: '� Registration',
    //     href: '/dashboard/patient/manage',
    // },
    // {
    //     title: 'Appointment Reports',
    //     description: 'Generate appointment statistics and reports',
    //     content: '📊 Reports',
    //     href: '/receptionist/appointment-reports',
    // },
];

// Practitioner dashboard cards - Appointment & Patient Focus
const practitionerDashboardCards: DashboardCard[] = [
    {
        title: 'My Appointments',
        description: 'View and manage your scheduled appointments',
        content: '📅 My Schedule',
        href: '/practitioner/appointments',
    },
    {
        title: 'Today\'s Patients',
        description: 'Quick access to today\'s appointment list',
        content: '🗓️ Today\'s List',
        href: '/practitioner/today-appointments',
    },
    {
        title: 'Appointment History',
        description: 'Review past appointments and patient interactions',
        content: '📋 History',
        href: '/practitioner/appointment-history',
    },
    {
        title: 'Schedule Management',
        description: 'Update your availability and working hours',
        content: '⏰ My Schedule',
        href: '/practitioner/schedule',
    },
    {
        title: 'Patient Records',
        description: 'Access patient medical records and notes',
        content: '� Patient Files',
        href: '/practitioner/patients',
    },
    {
        title: 'Consultation Notes',
        description: 'Add notes and follow-ups from appointments',
        content: '� Notes',
        href: '/practitioner/notes',
    },
];

// Guest dashboard cards - Appointment Booking Focus
const guestDashboardCards: DashboardCard[] = [
    {
        title: 'Book Your First Appointment',
        description: 'Schedule your first appointment with our healthcare team',
        content: '📅 Get Started',
        href: '/appointment/select-schedule',
    },
    {
        title: 'Find a Doctor',
        description: 'Browse our qualified healthcare professionals',
        content: '👨‍⚕️ Browse Doctors',
        href: '/doctors',
    },
    {
        title: 'Available Services',
        description: 'Explore our healthcare services and specialties',
        content: '🏥 Our Services',
        href: '/services',
    },
    {
        title: 'Appointment Process',
        description: 'Learn how our appointment booking system works',
        content: '❓ How It Works',
        href: '/how-to-book',
    },
    {
        title: 'Emergency Care',
        description: '24/7 emergency healthcare services',
        content: '� Emergency',
        href: '/emergency',
    },
    {
        title: 'Contact Us',
        description: 'Get in touch with our healthcare team',
        content: '📞 Contact',
        href: '/contact',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Dashboard Cards */}
                <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                    {(auth.user.role === 'admin') ?
                        <AdminCard />
                        : (auth.user.role === 'patient') ?
                            <PatientCard />
                            : (auth.user.role === 'frontdesk') ?
                                <ReceptitionistCard />
                                : (auth.user.role === 'doctor' || auth.user.role === 'practitioner') ?
                                    <PractitionerCard />
                                    : <GuestCard />}
                </div>
            </div>
        </AppLayout>
    );
}

function AdminCard() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-6">
                Appointment Management Dashboard
            </h2>
            {/* <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Admin Overview:</strong> Complete control over the appointment system - manage schedules, 
                    book appointments, oversee practitioners, and maintain patient records.
                </p>
            </div> */}
            <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3">
                {adminDashboardCards.map((card, idx) => (
                    <a
                        key={idx}
                        href={card.href}
                        className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border border-[#e2e8f0]/50 p-6 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-elegant hover:bg-gradient-to-br hover:from-[#f8fafc] hover:to-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 dark:bg-[#1e293b]/90 dark:border-[#475569]/50 dark:hover:bg-gradient-to-br dark:hover:from-[#334155] dark:hover:to-[#1e293b]"
                        tabIndex={0}
                    >
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8]"></div>
                        
                        {/* Icon area */}
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-200">
                                {card.content.split(' ')[0]}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9] group-hover:text-[#3b82f6] dark:group-hover:text-[#60a5fa] transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1] leading-relaxed">
                                {card.description}
                            </p>
                            <div className="pt-2 text-xs font-medium text-[#3b82f6] dark:text-[#60a5fa]">
                                {card.content.substring(card.content.indexOf(' ') + 1)}
                            </div>
                        </div>
                        
                        {/* Hover arrow */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg className="w-5 h-5 text-[#3b82f6] dark:text-[#60a5fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

function PatientCard() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-6">
                Patient Appointment Portal
            </h2>
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Welcome!</strong> Easily book appointments, manage your schedule, 
                    and access your appointment history all in one place.
                </p>
            </div>
            <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3">
                {patientDashboardCards.map((card, idx) => (
                    <a
                        key={idx}
                        href={card.href}
                        className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border border-[#e2e8f0]/50 p-6 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-elegant hover:bg-gradient-to-br hover:from-[#f8fafc] hover:to-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 dark:bg-[#1e293b]/90 dark:border-[#475569]/50 dark:hover:bg-gradient-to-br dark:hover:from-[#334155] dark:hover:to-[#1e293b]"
                        tabIndex={0}
                    >
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10b981] to-[#059669]"></div>
                        
                        {/* Icon area */}
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-200">
                                {card.content.split(' ')[0]}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9] group-hover:text-[#10b981] dark:group-hover:text-[#34d399] transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1] leading-relaxed">
                                {card.description}
                            </p>
                            <div className="pt-2 text-xs font-medium text-[#10b981] dark:text-[#34d399]">
                                {card.content.substring(card.content.indexOf(' ') + 1)}
                            </div>
                        </div>
                        
                        {/* Hover arrow */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg className="w-5 h-5 text-[#10b981] dark:text-[#34d399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

function ReceptitionistCard() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-6">
                Receptionist Operations Center
            </h2>
            {/* <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                    <strong>Front Desk Control:</strong> Handle appointment bookings, patient check-ins, 
                    registration, and daily scheduling operations efficiently.
                </p>
            </div> */}
            <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3">
                {receptionistDashboardCards.map((card, idx) => (
                    <a
                        key={idx}
                        href={card.href}
                        className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border border-[#e2e8f0]/50 p-6 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-elegant hover:bg-gradient-to-br hover:from-[#f8fafc] hover:to-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 dark:bg-[#1e293b]/90 dark:border-[#475569]/50 dark:hover:bg-gradient-to-br dark:hover:from-[#334155] dark:hover:to-[#1e293b]"
                        tabIndex={0}
                    >
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]"></div>
                        
                        {/* Icon area */}
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-200">
                                {card.content.split(' ')[0]}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9] group-hover:text-[#8b5cf6] dark:group-hover:text-[#a78bfa] transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1] leading-relaxed">
                                {card.description}
                            </p>
                            <div className="pt-2 text-xs font-medium text-[#8b5cf6] dark:text-[#a78bfa]">
                                {card.content.substring(card.content.indexOf(' ') + 1)}
                            </div>
                        </div>
                        
                        {/* Hover arrow */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg className="w-5 h-5 text-[#8b5cf6] dark:text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

function PractitionerCard() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-6">
                Practitioner Appointment Hub
            </h2>
            <div className="mb-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
                <p className="text-sm text-cyan-800 dark:text-cyan-200">
                    <strong>Clinical Dashboard:</strong> Manage your appointments, access patient records, 
                    update consultation notes, and maintain your schedule.
                </p>
            </div>
            <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3">
                {practitionerDashboardCards.map((card, idx) => (
                    <a
                        key={idx}
                        href={card.href}
                        className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border border-[#e2e8f0]/50 p-6 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-elegant hover:bg-gradient-to-br hover:from-[#f8fafc] hover:to-white focus:outline-none focus:ring-2 focus:ring-[#06b6d4] focus:ring-offset-2 dark:bg-[#1e293b]/90 dark:border-[#475569]/50 dark:hover:bg-gradient-to-br dark:hover:from-[#334155] dark:hover:to-[#1e293b]"
                        tabIndex={0}
                    >
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#06b6d4] to-[#0891b2]"></div>
                        
                        {/* Icon area */}
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-200">
                                {card.content.split(' ')[0]}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9] group-hover:text-[#06b6d4] dark:group-hover:text-[#22d3ee] transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1] leading-relaxed">
                                {card.description}
                            </p>
                            <div className="pt-2 text-xs font-medium text-[#06b6d4] dark:text-[#22d3ee]">
                                {card.content.substring(card.content.indexOf(' ') + 1)}
                            </div>
                        </div>
                        
                        {/* Hover arrow */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg className="w-5 h-5 text-[#06b6d4] dark:text-[#22d3ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

function GuestCard() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-6">
                Welcome to Easy Appoint - Book Your Healthcare
            </h2>
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Get Started:</strong> Book your first appointment with our healthcare professionals. 
                    Easy scheduling, qualified doctors, and comprehensive care await you.
                </p>
            </div>
            <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3">
                {guestDashboardCards.map((card, idx) => (
                    <a
                        key={idx}
                        href={card.href}
                        className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border border-[#e2e8f0]/50 p-6 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-elegant hover:bg-gradient-to-br hover:from-[#f8fafc] hover:to-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:ring-offset-2 dark:bg-[#1e293b]/90 dark:border-[#475569]/50 dark:hover:bg-gradient-to-br dark:hover:from-[#334155] dark:hover:to-[#1e293b]"
                        tabIndex={0}
                    >
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f59e0b] to-[#d97706]"></div>
                        
                        {/* Icon area */}
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-200">
                                {card.content.split(' ')[0]}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9] group-hover:text-[#f59e0b] dark:group-hover:text-[#fbbf24] transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1] leading-relaxed">
                                {card.description}
                            </p>
                            <div className="pt-2 text-xs font-medium text-[#f59e0b] dark:text-[#fbbf24]">
                                {card.content.substring(card.content.indexOf(' ') + 1)}
                            </div>
                        </div>
                        
                        {/* Hover arrow */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg className="w-5 h-5 text-[#f59e0b] dark:text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
