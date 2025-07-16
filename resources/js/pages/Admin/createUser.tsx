import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
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
    const { data, setData, post, processing, errors, reset } = useForm<Required<Userdata>>({
        name: '',
        email: '',
        role: 'frontdesk', // Default role
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('user.store'), {
            onFinish: () => reset('name', 'email', 'role'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add User" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center ">
                <Card className="w-full max-w-xl mt-6 bg-background shadow-lg border border-border">
                    <CardHeader>
                        <CardTitle>Create User</CardTitle>
                        <CardDescription className="text-muted-foreground">Create a new user account</CardDescription>
                    </CardHeader>
                    <CardContent
                    className='w-full max-w-md mx-auto p-6 '
                    >
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    Username
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground shadow-sm focus:ring-primary focus:border-primary px-4 py-3"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground shadow-sm focus:ring-primary focus:border-primary px-4 py-3"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    Role
                                </Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    disabled={processing}
                                    className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground shadow-sm focus:ring-primary focus:border-primary px-4 py-3"
                                    required
                                >
                                    <option className='bg-primary-foreground' value="frontdesk">Frontdesk</option>
                                    <option  className='bg-primary-foreground' value="doctor">Doctor</option>
                                </select>
                                <InputError message={errors.role} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-primary border border-transparent rounded-md font-semibold text-primary-foreground hover:bg-primary/20 hover:text-blue-100 cursor-pointer transition-colors"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Create User
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
