import InputError from '@/components/input-error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Practitioner Details',
        href: '#',
    },
    {
        title: 'Edit Practitioner',
        href: '#'
    },
];

type Telecom = {
    id?: number;
    system: string;
    value: string;
    use?: string;
};

type Qualification = {
    id?: number;
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

export default function EditPractitioner() {
    const { practitioner } = usePage<SharedData & { practitioner: Practitioner }>().props;

    const { data, setData, put, processing, errors, reset } = useForm({
        family_name: practitioner.family_name,
        given_name: practitioner.given_name,
        gender: practitioner.gender,
        birth_date: practitioner.birth_date || '',
        active: practitioner.active,
        telecoms: practitioner.telecoms || [],
        qualifications: practitioner.qualifications || [],
    });

    const addTelecom = () => {
        setData('telecoms', [...data.telecoms, { system: 'phone', value: '', use: '' }]);
    };

    const removeTelecom = (index: number) => {
        const newTelecoms = data.telecoms.filter((_, i) => i !== index);
        setData('telecoms', newTelecoms);
    };

    const updateTelecom = (index: number, field: keyof Telecom, value: string) => {
        const newTelecoms = [...data.telecoms];
        newTelecoms[index] = { ...newTelecoms[index], [field]: value };
        setData('telecoms', newTelecoms);
    };

    const addQualification = () => {
        setData('qualifications', [...data.qualifications, { code: '', period: '', issuer: '' }]);
    };

    const removeQualification = (index: number) => {
        const newQualifications = data.qualifications.filter((_, i) => i !== index);
        setData('qualifications', newQualifications);
    };

    const updateQualification = (index: number, field: keyof Qualification, value: string) => {
        const newQualifications = [...data.qualifications];
        newQualifications[index] = { ...newQualifications[index], [field]: value };
        setData('qualifications', newQualifications);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('practitioner.update', practitioner.id), {
            onSuccess: () => {
                // Optional: redirect or show success message
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Practitioner" />
            <div className="flex flex-col items-center bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] text-[#1e293b] min-h-screen dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] p-4">
                <Card className="w-full max-w-4xl bg-white/90 shadow-xl backdrop-blur-sm rounded-lg border border-[#e2e8f0] dark:bg-[#1e293b]/90 dark:border-[#475569] dark:text-[#f1f5f9] my-3">
                    <CardHeader className="text-center lg:text-left">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#3b82f6] dark:to-[#2563eb]">
                            Edit Practitioner
                        </CardTitle>
                        <CardDescription className="text-lg text-[#64748b] dark:text-[#cbd5e1]">
                            {practitioner.given_name} {practitioner.family_name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9] border-b border-[#e2e8f0] dark:border-[#475569] pb-2">
                                        Basic Information
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="given_name" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                            Given Name *
                                        </Label>
                                        <Input
                                            id="given_name"
                                            value={data.given_name}
                                            onChange={(e) => setData('given_name', e.target.value)}
                                            className="w-full rounded-md border border-[#e2e8f0] bg-background text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                            required
                                        />
                                        <InputError message={errors.given_name} className="mt-2 text-red-400 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="family_name" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                            Family Name *
                                        </Label>
                                        <Input
                                            id="family_name"
                                            value={data.family_name}
                                            onChange={(e) => setData('family_name', e.target.value)}
                                            className="w-full rounded-md border border-[#e2e8f0] bg-background text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                            required
                                        />
                                        <InputError message={errors.family_name} className="mt-2 text-red-400 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                            Gender *
                                        </Label>
                                        <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                            <SelectTrigger className="w-full border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-[#334155] dark:border-[#475569]">
                                                <SelectItem value="male" className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">Male</SelectItem>
                                                <SelectItem value="female" className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">Female</SelectItem>
                                                <SelectItem value="other" className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">Other</SelectItem>
                                                <SelectItem value="unknown" className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">Unknown</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} className="mt-2 text-red-400 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                            Birth Date
                                        </Label>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            className="w-full rounded-md border border-[#e2e8f0] bg-background text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                        />
                                        <InputError message={errors.birth_date} className="mt-2 text-red-400 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                            Active Status
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="active"
                                                checked={data.active}
                                                onChange={(e) => setData('active', e.target.checked)}
                                                className="rounded border-[#e2e8f0] text-[#3b82f6] focus:ring-[#3b82f6]"
                                            />
                                            <Label htmlFor="active" className="text-sm text-[#64748b] dark:text-[#cbd5e1]">
                                                Practitioner is active
                                            </Label>
                                        </div>
                                        <InputError message={errors.active} className="mt-2 text-red-400 text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Telecoms Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                        📞 Contact Information
                                    </h3>
                                    <Button
                                        type="button"
                                        onClick={addTelecom}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Contact
                                    </Button>
                                </div>
                                
                                {data.telecoms.map((telecom, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border border-[#e2e8f0] dark:border-[#475569] rounded-lg">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">System</Label>
                                            <Select 
                                                value={telecom.system} 
                                                onValueChange={(value) => updateTelecom(index, 'system', value)}
                                            >
                                                <SelectTrigger className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="dark:bg-[#334155] dark:border-[#475569]">
                                                    <SelectItem value="phone">Phone</SelectItem>
                                                    <SelectItem value="email">Email</SelectItem>
                                                    <SelectItem value="fax">Fax</SelectItem>
                                                    <SelectItem value="pager">Pager</SelectItem>
                                                    <SelectItem value="url">URL</SelectItem>
                                                    <SelectItem value="sms">SMS</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Value</Label>
                                            <Input
                                                value={telecom.value}
                                                onChange={(e) => updateTelecom(index, 'value', e.target.value)}
                                                placeholder="Contact value"
                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155]"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Use</Label>
                                            <Select 
                                                value={telecom.use || ''} 
                                                onValueChange={(value) => updateTelecom(index, 'use', value)}
                                            >
                                                <SelectTrigger className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155]">
                                                    <SelectValue placeholder="Select use" />
                                                </SelectTrigger>
                                                <SelectContent className="dark:bg-[#334155] dark:border-[#475569]">
                                                    <SelectItem value="home">Home</SelectItem>
                                                    <SelectItem value="work">Work</SelectItem>
                                                    <SelectItem value="mobile">Mobile</SelectItem>
                                                    <SelectItem value="temp">Temporary</SelectItem>
                                                    <SelectItem value="old">Old</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                onClick={() => removeTelecom(index)}
                                                variant="destructive"
                                                size="sm"
                                                className="w-full"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Qualifications Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                        🎓 Qualifications
                                    </h3>
                                    <Button
                                        type="button"
                                        onClick={addQualification}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Qualification
                                    </Button>
                                </div>
                                
                                {data.qualifications.map((qualification, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border border-[#e2e8f0] dark:border-[#475569] rounded-lg">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Code</Label>
                                            <Input
                                                value={qualification.code}
                                                onChange={(e) => updateQualification(index, 'code', e.target.value)}
                                                placeholder="Qualification code"
                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155]"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Period</Label>
                                            <Input
                                                type="date"
                                                value={qualification.period || ''}
                                                onChange={(e) => updateQualification(index, 'period', e.target.value)}
                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155]"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Issuer</Label>
                                            <Input
                                                value={qualification.issuer || ''}
                                                onChange={(e) => updateQualification(index, 'issuer', e.target.value)}
                                                placeholder="Issuing organization"
                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155]"
                                            />
                                        </div>
                                        
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                onClick={() => removeQualification(index)}
                                                variant="destructive"
                                                size="sm"
                                                className="w-full"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t border-[#e2e8f0] dark:border-[#475569] pt-6">
                                <div className="flex flex-wrap gap-3 justify-end">
                                    <Link href={route('practitioner.show', practitioner.id)}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white hover:from-[#2563eb] hover:to-[#1e40af]"
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
