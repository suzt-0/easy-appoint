import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Practitioner Management',
        href: '/dashboard/practitioner/manage',
    },
    {
        title: 'List Practitioners',
        href: '/admin/practitioners'
    },
];

type Practitioner = {
    id: number;
    given_name: string;
    family_name: string;
    gender: string;
    birth_date?: string;
    active: boolean;
    user_id: number;
};

export default function Practitioners() {
    const { practitioners } = usePage<SharedData & { practitioners: Practitioner[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Practitioners" />
            <Card 
                className='m-3'
            >
                <CardHeader>
                    <CardTitle>Practitioners</CardTitle>
                    <CardDescription>List of all practitioners</CardDescription>
                </CardHeader>
                <CardContent>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Given Name</th>
                                <th className="px-4 py-2 text-left">Family Name</th>
                                <th className="px-4 py-2 text-left">Gender</th>
                                <th className="px-4 py-2 text-left">Birth Date</th>
                                <th className="px-4 py-2 text-left">Active</th>
                                <th className="px-4 py-2 text-left">Show Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {practitioners.map((practitioner) => (
                                <tr key={practitioner.id} className="border-b">
                                    <td className="px-4 py-2">{practitioner.given_name}</td>
                                    <td className="px-4 py-2">{practitioner.family_name}</td>
                                    <td className="px-4 py-2">{practitioner.gender}</td>
                                    <td className="px-4 py-2">{practitioner.birth_date || '-'}</td>
                                    <td className="px-4 py-2">{practitioner.active ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={route('practitioner.show', practitioner.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            <Button
                                                type="button"
                                                className="cursor-pointer">
                                                Show Details
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
