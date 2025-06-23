import InputError from '@/components/input-error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

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

type UserData = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function EditUser() {
    const { user } = usePage<SharedData & { user: UserData }>().props;

    const { data, setData, put, processing, errors, reset } =useForm<Required<UserData>>({
            id: user.id,           
            name: user.name,
            email: user.email,
            role: user.role,
        });
        const submit: FormEventHandler = (e) => {
                e.preventDefault();
                put(route('user.update', user.id), {
                    // nothing to do 
                });
            };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
                <Card className="max-w-lg px-1 mt-3 bg-background shadow-lg border border-border">
                    <CardHeader>
                        <CardTitle>Edit User</CardTitle>
                        <CardDescription className="text-muted-foreground">{user.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={user.name}
                                    onChange={(e) => setData('name', e.target.value)}
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
                                    defaultValue={user.email}
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
                                    defaultValue={user.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground shadow-sm focus:ring-primary focus:border-primary px-4 py-3"
                                    required
                                >
                                    <option value="frontdesk">Frontdesk</option>
                                    <option value="doctor">Doctor</option>
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
                                    Save Changes
                                </Button>
                            </div>
                            <InputError message={errors.id} className="mt-2 text-red-400 text-sm" />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
