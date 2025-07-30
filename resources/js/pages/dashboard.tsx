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

// Admin dashboard cards
const adminDashboardCards: DashboardCard[] = [
    {
        title: 'Users',
        description: 'Manage and monitor all users',
        content: '👥 User Management',
        href: '/dashboard/user/manage',
    },
    {
        title: 'Practitioners',
        description: 'Manage healthcare practitioners',
        content: '👨‍⚕️ Medical Staff',
        href: '/dashboard/practitioner/manage',
    },
    {
        title: 'Schedules',
        description: 'Manage practitioner schedules and availability',
        content: '📅 Schedules',
        href: '/admin/schedule/manage',
    },
    {
        title: 'Patients',
        description: 'Patient records and management',
        content: '🏥 Patient Care',
        href: '/dashboard/patient/manage',
    },
    {
        title: 'Appointments',
        description: 'Manage and monitor all appointments',
        content: '📅 Appointment System',
        href: '/admin/appointment/manage',
    },
];

// Patient dashboard cards
const patientDashboardCards: DashboardCard[] = [
    {
        title: 'Book Appointment',
        description: 'Schedule a new appointment with healthcare providers',
        content: '📅 New Booking',
        href: '/user/patient/appointment/select-schedule',
    },
    {
        title: 'My Appointments',
        description: 'View and manage your upcoming appointments',
        content: '🗓️ My Schedule',
        href: '/user/patient/appointments',
    },
    // {
    //     title: 'Reports',
    //     description: 'Access your medical reports',
    //     content: '📋 Reports',
    //     href: '/patient/records',
    // },
    // {
    //     title: 'Prescriptions',
    //     description: 'View current and past prescriptions',
    //     content: '💊 Medications',
    //     href: '/patient/prescriptions',
    // },
    // {
    //     title: 'Profile Settings',
    //     description: 'Update your personal and contact information',
    //     content: '⚙️ Account Settings',
    //     href: '/patient/profile',
    // },
    // {
    //     title: 'Emergency Contact',
    //     description: '24/7 emergency healthcare services',
    //     content: '🚨 Emergency Care',
    //     href: '/emergency',
    // },
];

// Receptionist dashboard cards
const receptionistDashboardCards: DashboardCard[] = [
    {
         title: 'Book Appointment',
        description: 'Create a new appointment',
        content: '📅 New Appointment',
        href: '/appointment/select-schedule',
    },
    {
         title: 'Appointment',
        description: 'List of appointments',
        content: '📅 Appointments',
        href: '/admin/appointments',
    },
    {
        title: 'Patients',
        description: 'Patient records and management',
        content: '🏥 Patient Care',
        href: '/patients',
    },
    {
        title: 'Practitioners',
        description: 'List of practitioners',
        content: '👨‍⚕️ Practitioners',
        href: '/admin/practitioners',
    },
    
    // {
    //     title: 'Patient Check-in',
    //     description: 'Process patient arrivals and check-ins',
    //     content: '✅ Check-in',
    //     href: '/receptionist/checkin',
    // },
    // {
    //     title: 'Patient Registry',
    //     description: 'Register new patients and update records',
    //     content: '📝 Registration',
    //     href: '/dashboard/patient/manage',
    // },
    // {
    //     title: 'Daily Schedule',
    //     description: 'View and manage daily appointment schedule',
    //     content: '🗓️ Today\'s Schedule',
    //     href: '/receptionist/schedule',
    // },
    // {
    //     title: 'Billing Support',
    //     description: 'Assist with billing and payment processing',
    //     content: '💳 Billing',
    //     href: '/receptionist/billing',
    // },
    // {
    //     title: 'Reports',
    //     description: 'Generate daily and weekly reports',
    //     content: '📊 Reports',
    //     href: '/receptionist/reports',
    // },
];

// Practitioner dashboard cards
const practitionerDashboardCards: DashboardCard[] = [
    {
        title: "Today's Schedule",
        description: 'View today\'s appointments and schedule details',
        content: '📋 Today',
        href: '/user/practitioner/schedule',
    },
    {
        title: 'My Schedules',
        description: 'View and manage your appointment schedules',
        content: '📅 Schedules',
        href: '/user/practitioner/schedules',
    },
    {
        title: 'Patient Appointments',
        description: 'View and manage patient appointments',
        content: '🗓️ Appointments',
        href: '/user/practitioner/appointments',
    },
    // {
    //     title: 'Patient Records',
    //     description: 'Access and update patient medical records',
    //     content: '📋 Medical Records',
    //     href: '/practitioner/patients',
    // },
    // {
    //     title: 'Consultation Notes',
    //     description: 'Add and review consultation notes',
    //     content: '📝 Notes',
    //     href: '/practitioner/notes',
    // },
    // {
    //     title: 'Prescriptions',
    //     description: 'Manage and create patient prescriptions',
    //     content: '💊 Prescriptions',
    //     href: '/practitioner/prescriptions',
    // },
    // {
    //     title: 'Reports',
    //     description: 'Generate patient and appointment reports',
    //     content: '📊 Reports',
    //     href: '/practitioner/reports',
    // },
];

// Guest dashboard cards
const guestDashboardCards: DashboardCard[] = [
    // {
    //     title: 'Book Appointment',
    //     description: 'Schedule your first appointment with us',
    //     content: '📅 Get Started',
    //     href: '/appointment/create',
    // },
    // {
    //     title: 'Our Services',
    //     description: 'Explore our healthcare services and specialties',
    //     content: '🏥 Medical Services',
    //     href: '/services',
    // },
    // {
    //     title: 'Find a Doctor',
    //     description: 'Browse our qualified healthcare professionals',
    //     content: '👨‍⚕️ Find Doctors',
    //     href: '/doctors',
    // },
    // {
    //     title: 'Emergency Care',
    //     description: '24/7 emergency healthcare services',
    //     content: '🚨 Emergency',
    //     href: '/emergency',
    // },
    // {
    //     title: 'Health Resources',
    //     description: 'Access health tips and educational content',
    //     content: '📚 Learn More',
    //     href: '/resources',
    // },
    // {
    //     title: 'Contact Us',
    //     description: 'Get in touch with our healthcare team',
    //     content: '📞 Contact',
    //     href: '/contact',
    // },
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
                                : (auth.user.role === 'doctor') ?
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
                Admin Dashboard
            </h2>
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
                Patient Dashboard
            </h2>
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
                Receptionist Dashboard
            </h2>
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
                Practitioner Dashboard
            </h2>
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
                Welcome to Easy Appoint
            </h2>
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
