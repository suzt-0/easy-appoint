import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Practitioner Management',
        href: '/dashboard/practitioner/manage',
    },
];

type DashboardCard = {
    title: string;
    description: string;
    content: string;
    href: string;
};

export default function practitionerDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Practitioner Management" />
            <div className="space-y-6">
                {/* Dashboard Cards */}
                <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                    <AdminCard />
                </div>
            </div>
        </AppLayout>
    );
}


function AdminCard() {
    const adminDashboardCards: DashboardCard[] = [
        {
            title: 'Add Practitioner',
            description: 'Register new healthcare practitioners',
            content: '👨‍⚕️ New Doctor',
            href: '/admin/users/select-practitioner',
        },
        {
            title: 'List Practitioners',
            description: 'View and manage all healthcare practitioners',
            content: '📋 All Doctors',
            href: '/admin/practitioners',
        },
        // {
        //     title: 'Specializations',
        //     description: 'Manage medical specializations and departments',
        //     content: '🏥 Specialties',
        //     href: '/admin/specializations',
        // },
        // {
        //     title: 'Schedules',
        //     description: 'Manage practitioner schedules and availability',
        //     content: '📅 Schedules',
        //     href: '/admin/practitioner/schedules',
        // },
        // {
        //     title: 'Qualifications',
        //     description: 'Verify and manage practitioner qualifications',
        //     content: '🎓 Credentials',
        //     href: '/admin/practitioner/qualifications',
        // },
        // {
        //     title: 'Performance Reports',
        //     description: 'View practitioner performance and analytics',
        //     content: '📊 Analytics',
        //     href: '/admin/practitioner/reports',
        // },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-6">
                Practitioner Administration
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
            </div>        </div>
    );
}
