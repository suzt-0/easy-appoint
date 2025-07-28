import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
     {
        title: 'Practitioner Management',
        href: '/dashboard/practitioner/manage',
    },
    // {
    //     title: 'Add Practitioner',
    //     href: '/admin/users/doctors'
    // },
    {
        title: 'Add Practitioner details',
        href: '/test',
    },
];

type Telecom = {
    system: string;
    value: string;
    use?: string;
};

type Qualification = {
    code: string;
    period?: string;
    issuer?: string;
};

type PractitionerData = {
    user_id: number;
    family_name: string;
    given_name: string;
    gender: string;
    birth_date?: string;
    active: boolean;
    telecoms: Telecom[];
    qualifications: Qualification[];
};

type UserData = {
    id: number;
    name: string;
};

export default function CreatePractitioner() {

        const { user } = usePage<{ user: UserData }>().props;

    const { data, setData, post, processing, errors, reset } = useForm<PractitionerData>({
        user_id: user.id,
        family_name: '',
        given_name: '',
        gender: 'male',
        birth_date: '',
        active: true,
        telecoms: [{ system: 'phone', value: '', use: 'work' }],
        qualifications: [{ code: '', period: '', issuer: '' }],
    });

    // Handlers for dynamic fields
    const handleTelecomChange = (idx: number, field: keyof Telecom, value: string) => {
        const telecoms = [...data.telecoms];
        telecoms[idx][field] = value;
        setData('telecoms', telecoms);
    };

    const addTelecom = () => setData('telecoms', [...data.telecoms, { system: 'phone', value: '', use: 'work' }]);

    const removeTelecom = (idx: number) => setData('telecoms', data.telecoms.filter((_, i) => i !== idx));

    const handleQualificationChange = (idx: number, field: keyof Qualification, value: string) => {
        const qualifications = [...data.qualifications];
        qualifications[idx][field] = value;
        setData('qualifications', qualifications);
    };

    const addQualification = () => setData('qualifications', [...data.qualifications, { code: '', period: '', issuer: '' }]);

    const removeQualification = (idx: number) => setData('qualifications', data.qualifications.filter((_, i) => i !== idx));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('practitioner.store'), {
            onFinish: () => reset(),
        });
    };




    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Practitioner" />
            <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Welcome Header */}
                    <div className="glass glass-dark rounded-xl p-4 sm:p-6 lg:p-8 shadow-elegant">
                        <h1 className="text-gradient-blue text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                            Add Practitioner
                        </h1>
                        <p className="text-[#64748b] dark:text-[#cbd5e1] text-base sm:text-lg">
                            Create a new practitioner profile for {user.name}
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="glass glass-dark rounded-xl p-4 sm:p-6 lg:p-8 shadow-elegant">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="family_name" className="text-sm font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                        Family Name
                                    </Label>
                                    <Input
                                        id="family_name"
                                        name="family_name"
                                        value={data.family_name}
                                        onChange={e => setData('family_name', e.target.value)}
                                        disabled={processing}
                                        required
                                        placeholder="Enter family name"
                                        className="h-10 sm:h-12 rounded-lg border-[#e2e8f0] bg-[#f8fafc] px-3 sm:px-4 text-[#1e293b] placeholder-[#64748b] transition-all duration-200 focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] dark:placeholder-[#cbd5e1] dark:focus:border-[#60a5fa] dark:focus:bg-[#1e293b] dark:focus:ring-[#60a5fa]/20"
                                    />
                                    <InputError message={errors.family_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="given_name" className="text-sm font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                        Given Name
                                    </Label>
                                    <Input
                                        id="given_name"
                                        name="given_name"
                                        value={data.given_name}
                                        onChange={e => setData('given_name', e.target.value)}
                                        disabled={processing}
                                        required
                                        placeholder="Enter given name"
                                        className="h-10 sm:h-12 rounded-lg border-[#e2e8f0] bg-[#f8fafc] px-3 sm:px-4 text-[#1e293b] placeholder-[#64748b] transition-all duration-200 focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] dark:placeholder-[#cbd5e1] dark:focus:border-[#60a5fa] dark:focus:bg-[#1e293b] dark:focus:ring-[#60a5fa]/20"
                                    />
                                    <InputError message={errors.given_name} />
                                </div>
                            </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-sm font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                    Gender
                                </Label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={e => setData('gender', e.target.value)}
                                    disabled={processing}
                                    required
                                    className="h-10 sm:h-12 w-full rounded-lg border-[#e2e8f0] bg-[#f8fafc] px-3 sm:px-4 text-[#1e293b] transition-all duration-200 focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] dark:focus:border-[#60a5fa] dark:focus:bg-[#1e293b] dark:focus:ring-[#60a5fa]/20"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="unknown">Unknown</option>
                                </select>
                                <InputError message={errors.gender} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birth_date" className="text-sm font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                    Birth Date
                                </Label>
                                <Input
                                    id="birth_date"
                                    name="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={e => setData('birth_date', e.target.value)}
                                    disabled={processing}
                                    className="h-10 sm:h-12 rounded-lg border-[#e2e8f0] bg-[#f8fafc] px-3 sm:px-4 text-[#1e293b] transition-all duration-200 focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] dark:focus:border-[#60a5fa] dark:focus:bg-[#1e293b] dark:focus:ring-[#60a5fa]/20"
                                />
                                <InputError message={errors.birth_date} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 p-4 rounded-lg bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#475569]">
                            <div className="flex items-center space-x-3">
                                <input
                                    id="active"
                                    name="active"
                                    type="checkbox"
                                    checked={data.active}
                                    onChange={e => setData('active', e.target.checked)}
                                    disabled={processing}
                                    className="h-4 w-4 rounded border-[#e2e8f0] text-[#3b82f6] focus:ring-[#3b82f6]/20 dark:border-[#475569] dark:bg-[#334155]"
                                />
                                <Label htmlFor="active" className="text-sm text-[#64748b] dark:text-[#cbd5e1] cursor-pointer">
                                    Mark as active practitioner
                                </Label>
                            </div>
                            <p className="text-xs text-[#64748b] dark:text-[#cbd5e1] sm:ml-auto">
                                Active practitioners can accept appointments
                            </p>
                            <InputError message={errors.active} />
                        </div>

                        {/* Telecoms Section */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <Label className="text-base sm:text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                    Contact Information
                                </Label>
                                <Button 
                                    type="button" 
                                    onClick={addTelecom} 
                                    className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-sm font-medium shadow-lg hover:from-[#059669] hover:to-[#047857] transition-all duration-200 transform hover:scale-105"
                                >
                                    Add Contact
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {data.telecoms.map((telecom, idx) => (
                                    <div key={idx} className="flex flex-col gap-3 p-3 sm:p-4 rounded-lg bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#475569] sm:flex-row sm:gap-3">
                                        <div className="grid grid-cols-2 gap-2 sm:contents">
                                            <select
                                                value={telecom.system}
                                                onChange={e => handleTelecomChange(idx, 'system', e.target.value)}
                                                className="h-9 sm:h-10 rounded-lg border-[#e2e8f0] bg-white px-2 sm:px-3 text-sm text-[#1e293b] dark:border-[#475569] dark:bg-[#1e293b] dark:text-[#f1f5f9]"
                                            >
                                                <option value="phone">Phone</option>
                                                <option value="email">Email</option>
                                                <option value="fax">Fax</option>
                                                <option value="pager">Pager</option>
                                                <option value="url">URL</option>
                                                <option value="sms">SMS</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <select
                                                value={telecom.use}
                                                onChange={e => handleTelecomChange(idx, 'use', e.target.value)}
                                                className="h-9 sm:h-10 rounded-lg border-[#e2e8f0] bg-white px-2 sm:px-3 text-sm text-[#1e293b] dark:border-[#475569] dark:bg-[#1e293b] dark:text-[#f1f5f9]"
                                            >
                                                <option value="home">Home</option>
                                                <option value="work">Work</option>
                                                <option value="mobile">Mobile</option>
                                                <option value="temp">Temp</option>
                                                <option value="old">Old</option>
                                            </select>
                                        </div>
                                        <Input
                                            value={telecom.value}
                                            onChange={e => handleTelecomChange(idx, 'value', e.target.value)}
                                            placeholder="Contact value"
                                            className="sm:flex-1 h-9 sm:h-10 rounded-lg border-[#e2e8f0] bg-white px-2 sm:px-3 text-sm text-[#1e293b] dark:border-[#475569] dark:bg-[#1e293b] dark:text-[#f1f5f9]"
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={() => removeTelecom(idx)} 
                                            className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-sm font-medium hover:from-[#dc2626] hover:to-[#b91c1c] transition-all duration-200"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors['telecoms']} />
                        </div>

                        {/* Qualifications Section */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <Label className="text-base sm:text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                    Professional Qualifications
                                </Label>
                                <Button 
                                    type="button" 
                                    onClick={addQualification} 
                                    className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white text-sm font-medium shadow-lg hover:from-[#7c3aed] hover:to-[#6d28d9] transition-all duration-200 transform hover:scale-105"
                                >
                                    Add Qualification
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {data.qualifications.map((qualification, idx) => (
                                    <div key={idx} className="flex flex-col gap-3 p-3 sm:p-4 rounded-lg bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#475569] lg:flex-row lg:gap-3">
                                        <Input
                                            value={qualification.code}
                                            onChange={e => handleQualificationChange(idx, 'code', e.target.value)}
                                            placeholder="Qualification code"
                                            className="lg:flex-1 h-9 sm:h-10 rounded-lg border-[#e2e8f0] bg-white px-2 sm:px-3 text-sm text-[#1e293b] dark:border-[#475569] dark:bg-[#1e293b] dark:text-[#f1f5f9]"
                                        />
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:">
                                            <Input
                                                type="date"
                                                value={qualification.period || ''}
                                                onChange={e => handleQualificationChange(idx, 'period', e.target.value)}
                                                placeholder="Issue date"
                                                className="h-9 sm:h-10 rounded-lg border-[#e2e8f0] bg-white px-2 sm:px-3 text-sm text-[#1e293b] dark:border-[#475569] dark:bg-[#1e293b] dark:text-[#f1f5f9]"
                                            />
                                            <Input
                                                value={qualification.issuer || ''}
                                                onChange={e => handleQualificationChange(idx, 'issuer', e.target.value)}
                                                placeholder="Issuing organization"
                                                className=" h-9 sm:h-10 rounded-lg border-[#e2e8f0] bg-white px-2 sm:px-3 text-sm text-[#1e293b] dark:border-[#475569] dark:bg-[#1e293b] dark:text-[#f1f5f9]"
                                            />
                                        </div>
                                        <Button 
                                            type="button" 
                                            onClick={() => removeQualification(idx)} 
                                            className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-sm font-medium hover:from-[#dc2626] hover:to-[#b91c1c] transition-all duration-200"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors['qualifications']} />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 sm:pt-6">
                            <Button
                                type="submit"
                                className="w-full h-10 sm:h-12 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white text-sm sm:text-base font-semibold shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] focus:from-[#2563eb] focus:to-[#1e40af] focus:ring-2 focus:ring-[#3b82f6]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {processing ? 'Creating...' : 'Create Practitioner Profile'}
                            </Button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </AppLayout>
    );
}
