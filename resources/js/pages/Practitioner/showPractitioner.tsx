import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { SharedData, BreadcrumbItem } from '@/types';
import { Head, usePage, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Practitioner Management',
        href: '/dashboard/practitioner/manage',
    },
    {
        title: 'List Practitioners',
        href: '/admin/practitioners'
    },
    {
        title: 'Practitioner Details',
        href: '#'
    },
];

type Telecom = {
    id: number;
    system: string;
    value: string;
    use?: string;
};

type Qualification = {
    id: number;
    code: string;
    period?: string;
    issuer?: string;
};

type Practitioner = {
    id: number;
    given_name: string;
    family_name: string;
    gender: string;
    birth_date?: string;
    active: boolean;
    user_id: number;
    telecoms?: Telecom[];
    qualifications?: Qualification[];
};

export default function ShowPractitioner() {
    const { practitioner } = usePage<SharedData & { practitioner: Practitioner }>().props;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this practitioner?')) {
            router.delete(route('practitioner.destroy', practitioner.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Practitioner Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
                <Card className="max-w-lg px-1 mt-3 bg-background shadow-lg border border-border">
                    <CardHeader>
                        <CardTitle>Practitioner Details</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {practitioner.given_name} {practitioner.family_name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="">
                            <div 
                            className='flex flex-col justify-center'
                            >
                                {/* given name */}
                                <div>
                                    <Label htmlFor="given_name" className="block text-sm font-medium text-foreground">
                                        Given Name
                                    </Label>
                                    <Input
                                        id="given_name"
                                        value={practitioner.given_name}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground cursor-not-allowed px-4 py-3"
                                    />
                                </div>
                                {/* family name */}
                                <div>
                                    <Label htmlFor="family_name" className="block text-sm font-medium text-foreground">
                                        Family Name
                                    </Label>
                                    <Input
                                        id="family_name"
                                        value={practitioner.family_name}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground cursor-not-allowed px-4 py-3"
                                    />
                                </div>
                                {/* gender */}
                                <div>
                                    <Label htmlFor="gender" className="block text-sm font-medium text-foreground">
                                        Gender
                                    </Label>
                                    <Input
                                        id="gender"
                                        value={practitioner.gender}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground cursor-not-allowed px-4 py-3"
                                    />
                                </div>
                                {/* Birth date  */}
                                <div>
                                    <Label htmlFor="birth_date" className="block text-sm font-medium text-foreground">
                                        Birth Date
                                    </Label>
                                    <Input
                                        id="birth_date"
                                        value={practitioner.birth_date || '-'}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground cursor-not-allowed px-4 py-3"
                                    />
                                </div>
                                {/* Status  */}
                                <div>
                                    <Label htmlFor="active" className="block text-sm font-medium text-foreground">
                                        Active
                                    </Label>
                                    <Input
                                        id="active"
                                        value={practitioner.active ? 'Yes' : 'No'}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border border-border bg-Input text-foreground cursor-not-allowed px-4 py-3"
                                    />
                                </div>
                            </div>
                            <div
                            className='col-span-1'
                            >
                                {/* Telecoms */}
                                <div>
                                    <Label className="block text-sm font-medium text-foreground">
                                        Telecoms
                                    </Label>
                                    <ul className="list-disc ml-6 mt-1 text-foreground">
                                        {practitioner.telecoms && practitioner.telecoms.length > 0 ? (
                                            practitioner.telecoms.map((telecom) => (
                                                <li key={telecom.id}>
                                                    {telecom.system}: {telecom.value} {telecom.use && `(${telecom.use})`}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No telecoms</li>
                                        )}
                                    </ul>
                                </div>

                                {/* Qualifications */}
                                <div>
                                    <Label className="block text-sm font-medium text-foreground">
                                        Qualifications
                                    </Label>
                                    <ul className="list-disc ml-6 mt-1 text-foreground">
                                        {practitioner.qualifications && practitioner.qualifications.length > 0 ? (
                                            practitioner.qualifications.map((qual) => (
                                                <li key={qual.id}>
                                                    {qual.code}
                                                    {qual.period && `, Period: ${qual.period}`}
                                                    {qual.issuer && `, Issuer: ${qual.issuer}`}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No qualifications</li>
                                        )}
                                    </ul>
                                </div>

                            <div className="flex gap-4 mt-6 justify-end">
                                <Link href={route('practitioner.edit', practitioner.id)}>
                                    <Button type="button" className="bg-blue-600 text-white">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    type="button"
                                    className="bg-red-600 text-white"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                                <Link href={route('practitioner.schedule.index', practitioner.id)}>
                                    <Button type="button" className="bg-green-600 hover:bg-green-800 cursor-pointer text-white">
                                        Schedules
                                    </Button>
                                </Link>
                            </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}