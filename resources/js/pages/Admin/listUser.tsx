import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button'; // Use your own Button component
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { MouseEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'List Users', href: '/admin/users' },
];

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function Users() {
    const { users } = usePage<SharedData & { users: User[] }>().props;
    const { processing } = useForm();

    const handleDelete = (id: number) => (e: MouseEvent) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('user.destroy', id), {
                data: { id },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Card
            className='m-3'
            >
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
                                <th className="px-4 py-2 text-left">Edit</th>
                                <th className="px-4 py-2 text-left">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={route('user.edit', user.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Button
                                            type="button"
                                            onClick={handleDelete(user.id)}
                                            className="text-red-600 hover:underline cursor-pointer"
                                            disabled={processing}
                                        >
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Delete
                                        </Button>
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
