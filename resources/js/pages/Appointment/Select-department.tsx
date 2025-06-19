import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout-patient';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patient Dashboard',
        href: '/test',
    },
];

export default function Dashboard() {

    return (
        <>
        <Head title="Dashboard" />
        <AppLayout breadcrumbs={breadcrumbs}>
            <PlaceholderPattern />
        </AppLayout>
        </>
    );
}
