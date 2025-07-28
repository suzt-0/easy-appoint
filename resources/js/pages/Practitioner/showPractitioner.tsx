import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { SharedData, BreadcrumbItem } from '@/types';
import { Head, usePage, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashbaord',
        href: '/dashboard',
    },
    // {
    //     title: 'List Practitioners',
    //     href: '/admin/practitioners'
    // },
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
    }; return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Practitioner Details" />
            <div className="flex flex-col items-center bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] text-[#1e293b] min-h-screen dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
                <Card className="w-full max-w-3xl p-4 bg-white/90 shadow-xl backdrop-blur-sm rounded-lg border border-[#e2e8f0] dark:bg-[#1e293b]/90 dark:border-[#475569] dark:text-[#f1f5f9] my-3">
                    <CardHeader className="text-center lg:text-left ">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#3b82f6] dark:to-[#2563eb]">
                            Practitioner Details
                        </CardTitle>
                        <CardDescription className="text-lg text-[#64748b] dark:text-[#cbd5e1]">
                            {practitioner.given_name} {practitioner.family_name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 ">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <div className="space-y-4">
                                {/* given name */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="given_name" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                        Given Name
                                    </Label>
                                    <Input
                                        id="given_name"
                                        value={practitioner.given_name}
                                        readOnly
                                        className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] cursor-not-allowed"
                                    />
                                </div>
                                {/* family name */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="family_name" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                        Family Name
                                    </Label>
                                    <Input
                                        id="family_name"
                                        value={practitioner.family_name}
                                        readOnly
                                        className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] cursor-not-allowed"
                                    />
                                </div>
                                {/* gender */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="gender" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                        Gender
                                    </Label>
                                    <Input
                                        id="gender"
                                        value={practitioner.gender}
                                        readOnly
                                        className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] cursor-not-allowed"
                                    />
                                </div>
                                {/* Birth date  */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="birth_date" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                        Birth Date
                                    </Label>
                                    <Input
                                        id="birth_date"
                                        value={practitioner.birth_date || '-'}
                                        readOnly
                                        className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] cursor-not-allowed"
                                    />
                                </div>
                                {/* Status  */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="active" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                        Active Status
                                    </Label>
                                    <Input
                                        id="active"
                                        value={practitioner.active ? 'Yes' : 'No'}
                                        readOnly
                                        className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {/* Telecoms */}
                                <div className="p-4 mt-6 rounded-md bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#475569]">
                                    <Label className="text-base font-medium text-[#1e293b] dark:text-[#f1f5f9] mb-3 block">
                                        📞 Contact Information
                                    </Label>
                                    <div className="space-y-2">
                                        {practitioner.telecoms && practitioner.telecoms.length > 0 ? (
                                            practitioner.telecoms.map((telecom) => (
                                                <div key={telecom.id} className="flex items-center space-x-2 text-sm text-[#64748b] dark:text-[#cbd5e1]">
                                                    <span className="font-medium">{telecom.system}:</span>
                                                    <span>{telecom.value}</span>
                                                    {telecom.use && (
                                                        <span className="px-2 py-0.5 text-xs bg-[#3b82f6] text-white rounded-full">
                                                            {telecom.use}
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1] italic">No contact information available</p>
                                        )}
                                    </div>
                                </div>

                                {/* Qualifications */}
                                <div className="p-4 rounded-md bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#475569]">
                                    <Label className="text-base font-medium text-[#1e293b] dark:text-[#f1f5f9] mb-3 block">
                                        🎓 Qualifications
                                    </Label>
                                    <div className="space-y-2">
                                        {practitioner.qualifications && practitioner.qualifications.length > 0 ? (
                                            practitioner.qualifications.map((qual) => (
                                                <div key={qual.id} className="p-3 rounded-md bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#475569]">
                                                    <div className="text-sm text-[#1e293b] dark:text-[#f1f5f9] font-medium">
                                                        {qual.code}
                                                    </div>
                                                    {qual.period && (
                                                        <div className="text-xs text-[#64748b] dark:text-[#cbd5e1] mt-1">
                                                            Period: {qual.period}
                                                        </div>
                                                    )}
                                                    {qual.issuer && (
                                                        <div className="text-xs text-[#64748b] dark:text-[#cbd5e1]">
                                                            Issuer: {qual.issuer}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1] italic">No qualifications listed</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {/* <div className="border-t border-[#e2e8f0] dark:border-[#475569] pt-4 mt-6">
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                                <Link href={route('practitioner.edit', practitioner.id)}>
                                    <Button type="button">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                                <Link href={route('practitioner.schedule.index', practitioner.id)}>
                                    <Button type="button" variant="secondary">
                                        Schedules
                                    </Button>
                                </Link>
                            </div>
                        </div> */}
                        </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}