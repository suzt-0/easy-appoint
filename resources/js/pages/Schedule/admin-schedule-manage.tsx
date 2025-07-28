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
        title: 'Admin Schedule Management',
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

// Admin-only schedule management page

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

export default function AdminScheduleManagement() {
    // Configuration for admin cards
    const adminConfig: CardConfig = {
        title: "Schedule Administration",
        subtitle: "Administrative schedule management",
        colorScheme: {
            primary: "#3b82f6",
            secondary: "#1d4ed8",
            focus: "#3b82f6",
            hover: "#3b82f6",
            focusDark: "#60a5fa",
            hoverDark: "#60a5fa"
        },
        cards: [
            {
                title: 'Add Schedule',
                description: 'Create new schedules for practitioners and facilities',
                content: '📅 New Schedule',
                href: '/admin/schedule/selectpractitioner',
            },
            {
                title: 'List Schedules',
                description: 'View and manage all schedules across the system',
                content: '📋 All Schedules',
                href: '/admin/schedules',
            },
            // {
            //     title: 'Time Slots',
            //     description: 'Configure available time slots and durations',
            //     content: '⏰ Time Slots',
            //     href: '/admin/schedule/slots',
            // },
            // {
            //     title: 'Schedule Templates',
            //     description: 'Create and manage reusable schedule templates',
            //     content: '📝 Templates',
            //     href: '/admin/schedule/templates',
            // },
            // {
            //     title: 'Recurring Schedules',
            //     description: 'Set up recurring weekly or monthly schedules',
            //     content: '🔄 Recurring',
            //     href: '/admin/schedule/recurring',
            // },
            // {
            //     title: 'Schedule Conflicts',
            //     description: 'Monitor and resolve scheduling conflicts',
            //     content: '⚠️ Conflicts',
            //     href: '/admin/schedule/conflicts',
            // },
            // {
            //     title: 'Availability Calendar',
            //     description: 'Overview of practitioner availability across dates',
            //     content: '📅 Calendar',
            //     href: '/admin/schedule/calendar',
            // },
            // {
            //     title: 'Schedule Analytics',
            //     description: 'Analyze schedule utilization and efficiency',
            //     content: '📊 Analytics',
            //     href: '/admin/schedule/analytics',
            // },
            // {
            //     title: 'Holiday Management',
            //     description: 'Manage holidays and special date schedules',
            //     content: '🎄 Holidays',
            //     href: '/admin/schedule/holidays',
            // },
        ]    };

    return (        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Schedule Management" />
            <div className="space-y-6">
                {/* Welcome Header */}
                {/* <div className="glass glass-dark rounded-xl p-8 shadow-elegant">
                    <h1 className="text-gradient-blue text-3xl font-bold mb-2">
                        Schedule Management
                    </h1>
                    <p className="text-[#64748b] dark:text-[#cbd5e1] text-lg">
                        Efficiently manage schedules, appointments, and time slots
                    </p>
                </div> */}
                
                {/* Dashboard Cards */}
                <div className="glass glass-dark rounded-xl p-6 shadow-elegant">
                    <DashboardCards config={adminConfig} />
                </div>
            </div>
        </AppLayout>
    );
}
