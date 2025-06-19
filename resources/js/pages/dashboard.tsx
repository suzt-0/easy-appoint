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
    href: string; // href is now always defined
};

const role = 'admin'; //hardcoded for testing purposes

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
               {(role=== 'admin')?
               <AdminCard />
               :(role=== 'patient')?
               <PatientCard />
               :(role=== 'receptionist')?
               <ReceptitionistCard />
               :<GuestCard />}
            </div>
        </AppLayout>
    );
}


function AdminCard() {
    const adminDashboardCards: DashboardCard[] = [
        {
            title: 'Add Users',
            description: 'Add User Account',
            content: 'No. of users: 5',
            href: '/admin/user/create',  
        },
        {
            title: 'List Users',
            description: 'List all User Accounts',
            content: 'No. of users: 5',
            href: '/admin/users',  
        },
        // Add more cards as needed
    ];

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {adminDashboardCards.map((card, idx) => (
            <a
            key={idx}
            href={card.href}
            className=" py-16 border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary hover:bg-primary/15"
            tabIndex={0}
            >
            <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
            <p>{card.content}</p>
            </CardContent>
            </a>
            ))}
        </div>
    );
}

function PatientCard() {
    const adminDashboardCards: DashboardCard[] = [
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        // Add more cards as needed
    ];

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {adminDashboardCards.map((card, idx) => (
                        <a
                            key={idx}
                            href={card.href}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            tabIndex={0}
                        >
                            <CardHeader>
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription>{card.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{card.content}</p>
                            </CardContent>
                        </a>
                    ))}
        </div>
    );
}

function ReceptitionistCard() {
    const adminDashboardCards: DashboardCard[] = [
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        // Add more cards as needed
    ];

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {adminDashboardCards.map((card, idx) => (
                        <a
                            key={idx}
                            href={card.href}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            tabIndex={0}
                        >
                            <CardHeader>
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription>{card.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{card.content}</p>
                            </CardContent>
                        </a>
                    ))}
        </div>
    );
}
function GuestCard() {
    const adminDashboardCards: DashboardCard[] = [
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        {
            title: 'Admin Dashboard',
            description: 'Manage your application settings and users.',
            content: 'Admin specific content',
            href: '/dashboard',
        },
        // Add more cards as needed
    ];

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {adminDashboardCards.map((card, idx) => (
                        <a
                            key={idx}
                            href={card.href}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            tabIndex={0}
                        >
                            <CardHeader>
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription>{card.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{card.content}</p>
                            </CardContent>
                        </a>
                    ))}
        </div>
    );
}
