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
    {
        title: 'Add Practitioner',
        href: '/admin/users/doctors'
    },
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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="max-w-lg px-1 bg-background shadow-lg border border-border" >
                    <CardHeader>
                        <CardTitle>Add Practitioner</CardTitle>
                        <CardDescription className="text-muted-foreground">Username : {user.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="flex flex-col space-y-6"
                        >
                            {/* <div>
                        <Label htmlFor="user_id" className="text-gray-200">User ID</Label>
                        <Input
                            id="user_id"
                            name="user_id"
                            value={data.user_id}
                            onChange={e => setData('user_id', e.target.value)}
                            disabled={processing}
                            required
                            className="bg-gray-900 border border-gray-700 text-gray-100"
                        />
                        <InputError message={errors.user_id} className="mt-2 text-red-400 text-sm" />
                    </div> */}
                            <div>
                                <Label htmlFor="family_name" className="text-gray-200">Family Name</Label>
                                <Input
                                    id="family_name"
                                    name="family_name"
                                    value={data.family_name}
                                    onChange={e => setData('family_name', e.target.value)}
                                    disabled={processing}
                                    required
                                    className="bg-gray-900 border border-gray-700 text-gray-100"
                                />
                                <InputError message={errors.family_name} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="given_name" className="text-gray-200">Given Name</Label>
                                <Input
                                    id="given_name"
                                    name="given_name"
                                    value={data.given_name}
                                    onChange={e => setData('given_name', e.target.value)}
                                    disabled={processing}
                                    required
                                    className="bg-gray-900 border border-gray-700 text-gray-100"
                                />
                                <InputError message={errors.given_name} className="mt-2 text-red-00 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="gender" className="text-gray-200">Gender</Label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={e => setData('gender', e.target.value)}
                                    disabled={processing}
                                    required
                                    className="border border-gray-700 bg-gray-900 text-gray-100 rounded-md px-3 py-2"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="unknown">Unknown</option>
                                </select>
                                <InputError message={errors.gender} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="birth_date" className="text-gray-200">Birth Date</Label>
                                <Input
                                    id="birth_date"
                                    name="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={e => setData('birth_date', e.target.value)}
                                    disabled={processing}
                                    className="bg-gray-900 border border-gray-700 text-gray-100"
                                />
                                <InputError message={errors.birth_date} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="active" className="text-gray-200">Active</Label>
                                <input
                                    id="active"
                                    name="active"
                                    type="checkbox"
                                    checked={data.active}
                                    onChange={e => setData('active', e.target.checked)}
                                    disabled={processing}
                                    className="accent-blue-600"
                                />
                                <InputError message={errors.active} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label className="text-gray-200">Telecoms</Label>
                                {data.telecoms.map((telecom, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <select
                                            value={telecom.system}
                                            onChange={e => handleTelecomChange(idx, 'system', e.target.value)}
                                            className="border border-gray-700 bg-gray-900 text-gray-100 rounded-md px-2 py-1"
                                        >
                                            <option value="phone">Phone</option>
                                            <option value="email">Email</option>
                                            <option value="fax">Fax</option>
                                            <option value="pager">Pager</option>
                                            <option value="url">URL</option>
                                            <option value="sms">SMS</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <Input
                                            value={telecom.value}
                                            onChange={e => handleTelecomChange(idx, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="bg-gray-900 border border-gray-700 text-gray-100 rounded-md px-2 py-1"
                                        />
                                        <select
                                            value={telecom.use}
                                            onChange={e => handleTelecomChange(idx, 'use', e.target.value)}
                                            className="border border-gray-700 bg-gray-900 text-gray-100 rounded-md px-2 py-1"
                                        >
                                            <option value="home">Home</option>
                                            <option value="work">Work</option>
                                            <option value="mobile">Mobile</option>
                                            <option value="temp">Temp</option>
                                            <option value="old">Old</option>
                                        </select>
                                        <Button type="button" onClick={() => removeTelecom(idx)} className="bg-red-800 text-red-100 hover:bg-red-600 hover:text-white cursor-pointer">Remove</Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={addTelecom} className="bg-green-800 text-green-100 hover:bg-green-600 hover:text-white cursor-pointer">Add Telecom</Button>
                                <InputError message={errors['telecoms']} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label className="text-gray-200">Qualifications</Label>
                                {data.qualifications.map((qualification, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <Input
                                            value={qualification.code}
                                            onChange={e => handleQualificationChange(idx, 'code', e.target.value)}
                                            placeholder="Code"
                                            className="bg-gray-900 border border-gray-700 text-gray-100 rounded-md px-2 py-1"
                                        />
                                        <Input
                                            type="date"
                                            value={qualification.period || ''}
                                            onChange={e => handleQualificationChange(idx, 'period', e.target.value)}
                                            placeholder="Period"
                                            className="bg-gray-900 border border-gray-700 text-gray-100 rounded-md px-2 py-1"
                                        />
                                        <Input
                                            value={qualification.issuer || ''}
                                            onChange={e => handleQualificationChange(idx, 'issuer', e.target.value)}
                                            placeholder="Issuer"
                                            className="bg-gray-900 border border-gray-700 text-gray-100 rounded-md px-2 py-1"
                                        />
                                        <Button type="button" onClick={() => removeQualification(idx)} className="bg-red-800 text-red-100 hover:bg-red-600 hover:text-white cursor-pointer">Remove</Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={addQualification} className="bg-green-800 text-green-100 hover:bg-green-600 hover:text-white cursor-pointer">Add Qualification</Button>
                                <InputError message={errors['qualifications']} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create Practitioner
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                {/* <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">Create Practitioner</h2> */}
            </div>
        </AppLayout>
    );
}
