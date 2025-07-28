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
    {
        title: 'Patient Management',
        href: '#',
    },
];

type DashboardCard = {
    title: string;
    description: string;
    content: string;
    href: string;
};

type CardConfig = {
    title: string;
    subtitle: string;
    cards: DashboardCard[];
    colorScheme: {
        primary: string;
        secondary: string;
        focus: string;
        hover: string;
        focusDark: string;
        hoverDark: string;
    };
};

// Admin-only patient management page

// Shared card rendering component
function DashboardCards({ config }: { config: CardConfig }) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-6">
                {config.title}
            </h2>
            <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3">
                {config.cards.map((card, idx) => (
                    <a
                        key={idx}
                        href={card.href}
                        className={`group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border border-[#e2e8f0]/50 p-6 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-elegant hover:bg-gradient-to-br hover:from-[#f8fafc] hover:to-white focus:outline-none focus:ring-2 focus:ring-[${config.colorScheme.focus}] focus:ring-offset-2 dark:bg-[#1e293b]/90 dark:border-[#475569]/50 dark:hover:bg-gradient-to-br dark:hover:from-[#334155] dark:hover:to-[#1e293b]`}
                        tabIndex={0}
                    >
                        {/* Gradient accent */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[${config.colorScheme.primary}] to-[${config.colorScheme.secondary}]`}></div>

                        {/* Icon area */}
                        <div className="mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r from-[${config.colorScheme.primary}] to-[${config.colorScheme.secondary}] rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-200`}>
                                {card.content.split(' ')[0]}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className={`text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9] group-hover:text-[${config.colorScheme.hover}] dark:group-hover:text-[${config.colorScheme.hoverDark}] transition-colors`}>
                                {card.title}
                            </h3>
                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1] leading-relaxed">
                                {card.description}
                            </p>
                            <div className={`pt-2 text-xs font-medium text-[${config.colorScheme.hover}] dark:text-[${config.colorScheme.hoverDark}]`}>
                                {card.content.substring(card.content.indexOf(' ') + 1)}
                            </div>
                        </div>

                        {/* Hover arrow */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg className={`w-5 h-5 text-[${config.colorScheme.hover}] dark:text-[${config.colorScheme.hoverDark}]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default function PatientManagement() {
    // Configuration for patient management cards
    const patientConfig: CardConfig = {
        title: "Patient Administration",
        subtitle: "Comprehensive patient management system",
        colorScheme: {
            primary: "#10b981",
            secondary: "#059669",
            focus: "#10b981",
            hover: "#10b981",
            focusDark: "#34d399",
            hoverDark: "#34d399"
        },
        cards: [
            // {
            //     title: 'Add Patient',
            //     description: 'Register new patients and create their medical profiles',
            //     content: '👤 New Patient',
            //     href: '/patient/create',
            // },
            {
                title: 'List Patients',
                description: 'View, search, and manage all registered patients',
                content: '📋 All Patients',
                href: '/patients',
            },
            // {
            //     title: 'Patient Search',
            //     description: 'Advanced search and filtering for patient records',
            //     content: '🔍 Search',
            //     href: '/patients?search=1',
            // },
            // {
            //     title: 'Patient Records',
            //     description: 'Access comprehensive patient medical records and history',
            //     content: '📄 Records',
            //     href: '/patients?view=records',
            // },
            // {
            //     title: 'Patient Analytics',
            //     description: 'View patient demographics and registration statistics',
            //     content: '📊 Analytics',
            //     href: '/patients?view=analytics',
            // },
            // {
            //     title: 'Emergency Contacts',
            //     description: 'Manage patient emergency contact information',
            //     content: '🚨 Emergency',
            //     href: '/patients?view=contacts',
            // },
            // {
            //     title: 'Patient Communication',
            //     description: 'Send notifications and messages to patients',
            //     content: '📧 Messages',
            //     href: '/patients?view=communication',
            // },
            // {
            //     title: 'Insurance Management',
            //     description: 'Manage patient insurance information and claims',
            //     content: '💳 Insurance',
            //     href: '/patients?view=insurance',
            // },
            // {
            //     title: 'Patient Import/Export',
            //     description: 'Bulk import or export patient data and records',
            //     content: '📥 Import/Export',
            //     href: '/patients?view=import-export',
            // },
        ]
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Management" />
            <div className="space-y-6">
                {/* Welcome Header */}
                {/* <div className="glass glass-dark rounded-xl p-8 shadow-elegant">
                    <h1 className="text-gradient-green text-3xl font-bold mb-2">
                        Patient Management
                    </h1>
                    <p className="text-[#64748b] dark:text-[#cbd5e1] text-lg">
                        Comprehensive patient registration, management, and record keeping
                    </p>
                </div> */}

                {/* Dashboard Cards */}
                <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                    <DashboardCards config={patientConfig} />
                </div>

                {/* Quick Stats Section */}
                
                
                {/* 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                    <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Total Patients</p>
                                <p className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9]">2,847</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center text-white text-xl">
                                👥
                            </div>
                        </div>
                        <p className="text-xs text-[#10b981] mt-2">+12% from last month</p>
                    </div>

                    <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">New Registrations</p>
                                <p className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9]">157</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center text-white text-xl">
                                📝
                            </div>
                        </div>
                        <p className="text-xs text-[#3b82f6] mt-2">This month</p>
                    </div>

                    <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Active Records</p>
                                <p className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9]">2,698</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center text-white text-xl">
                                ✅
                            </div>
                        </div>
                        <p className="text-xs text-[#f59e0b] mt-2">94.8% active rate</p>
                    </div>

                    <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1]">Pending Reviews</p>
                                <p className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9]">23</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-lg flex items-center justify-center text-white text-xl">
                                ⏳
                            </div>
                        </div>
                        <p className="text-xs text-[#ef4444] mt-2">Requires attention</p>
                    </div>
                </div>
                */}



                {/* Recent Activity Section */}

                {/* 
                <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                    <h3 className="text-xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-4">
                        Recent Patient Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#f8fafc] dark:bg-[#334155] rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white text-sm">
                                    +
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                        New patient registered: Sarah Johnson
                                    </p>
                                    <p className="text-xs text-[#64748b] dark:text-[#cbd5e1]">2 minutes ago</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-[#f8fafc] dark:bg-[#334155] rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center text-white text-sm">
                                    ✏️
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                        Patient record updated: Michael Chen
                                    </p>
                                    <p className="text-xs text-[#64748b] dark:text-[#cbd5e1]">15 minutes ago</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-[#f8fafc] dark:bg-[#334155] rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-[#f59e0b] rounded-full flex items-center justify-center text-white text-sm">
                                    📧
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                        Email sent to 45 patients: Appointment reminders
                                    </p>
                                    <p className="text-xs text-[#64748b] dark:text-[#cbd5e1]">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 */}
            </div>
        </AppLayout>
    );
}
