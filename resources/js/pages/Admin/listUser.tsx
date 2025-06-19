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
        title: 'List Users',
        href: '/admin/users',
    },
];


export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>List of all users</CardDescription>
                </CardHeader>
                <CardContent>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usePage<SharedData & { users: any[] }>().props.users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}

