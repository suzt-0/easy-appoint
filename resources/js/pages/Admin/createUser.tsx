import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Add User',
        href: '/admin/users/create',
    },
];

type Userdata = {
    name: string;
    email: string;
    role: string;
};


export default function AdminUserCreate() {
    const { data, setData, post, processing, errors, reset } =useForm<Required<Userdata>>({
        name: '',
        email: '',
        role: 'frontDesk', // Default role
    });


    const submit: FormEventHandler = (e) => {
            e.preventDefault();
            post(route('users.store'), {
                // onFinish: () => reset('password', 'password_confirmation'),
            });
        };
    // const handleSubmit = (e: React.dataEvent) => {
    //     e.preventDefault();
    //     // Submit logic here (e.g., Inertia.post('/admin/users', data))
    //     alert('User created: ' + JSON.stringify(data, null, 2));
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add User" />
             <div className="max-w-md mx-auto mt-10 bg-primary/10 rounded-lg shadow-lg p-8">
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Add New User</CardTitle>
                    </CardHeader>
                    <CardContent> */}
                     <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">Create User</h2>
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label className="font-medium text-gray-200" htmlFor="name">Name</Label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="font-medium text-gray-200" htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-red-400 text-sm" />
                            </div>
                            {/* <div className="grid gap-2">
                                <Label className="font-medium text-gray-200" htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-red-400 text-sm" />
                            </div> */}
                            <div className="grid gap-2">
                                <Label className="font-medium text-gray-200" htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    disabled={processing}
                                   className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                    required
                                >
                                    <option selected value="frontDesk">FrontDesk</option>
                                    <option value="doctor">Doctor</option>
                                </select>
                                <InputError message={errors.name} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create User
                            </Button>
                        </form>
                    {/* </CardContent>
                </Card> */}
            </div>
        </AppLayout>
    );
}
