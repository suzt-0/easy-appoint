import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button'; // Use your own Button component
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { MouseEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Practitioner Management',
        href: '/dashboard/practitioner/manage',
    },
    {
        title: 'Add Practitioner',
        href: '/admin/users/doctors'
    },
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

    // const handleDelete = (id: number) => (e: MouseEvent) => {
    //     e.preventDefault();
    //     if (confirm('Are you sure you want to delete this user?')) {
    //         router.delete(route('user.destroy', id), {
    //             data: { id },
    //         });
    //     }
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div
                className='flex mt-1 justify-center'
            >

                <Card
                    className="max-w-fill px-1 mt-2shadow-lg border border-border bg-primary/5"
                >
                    <CardHeader>
                        <CardTitle className='text-2xl'>Doctors</CardTitle>
                        <CardDescription>List of all users with the role of a doctor</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    {/* <th className="px-4 py-2 text-left">Role</th> */}
                                    {/* <th className="px-4 py-2 text-left">Edit</th> */}
                                    <th className="px-4 py-2 text-left">Add as Practitioner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b">
                                        <td className="px-4 py-2">{user.name}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        {/* <td className="px-4 py-2">{user.role}</td> */}
                                        <td className="px-4 flex justify-center py-2">
                                            <Link
                                                href={route('practitioner.create', user.id)}
                                                className="inline-flex  items-center px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                                            >
                                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                Add
                                            </Link>
                                        </td>
                                        {/* <td className="px-4 py-2">
                                        <Button
                                            type="button"
                                            onClick={handleDelete(user.id)}
                                            className="text-red-600 hover:underline cursor-pointer"
                                            disabled={processing}
                                        >
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Delete
                                        </Button>
                                    </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
