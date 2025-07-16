import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { BreadcrumbItem, SharedData } from '@/types';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Practitioner Dashboard',
        href: '/dashboard/practitioner/manage'
    },
    {
        title: 'List Practitioners',
        href: '/admin/practitioners'
    },
    {
        title: 'Schedules',
        href: '/practitioner/schedule' //set below
    },
    {
        title: 'Add Schedule',
        href: `#`
    },
];

type Practitioner = {
    id: number;
    given_name: string;
    family_name: string;
};

type ScheduleData = {
    practitioner_id: number;
    service_category?: string;
    service_type?: string;
    specialty?: string;
    active: boolean;
    day_of_week: string;
    start_time: string;
    end_time: string;
};

const serviceCategories = [
    { value: '', label: 'Select Category' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'therapy', label: 'Therapy' },
    { value: 'diagnostics', label: 'Diagnostics' },
];

const serviceTypes = [
    { value: '', label: 'Select Type' },
    { value: 'general', label: 'General' },
    { value: 'specialist', label: 'Specialist' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
];

export default function CreateSchedule() {
    const { practitioner, daysOfWeek } = usePage<SharedData & { practitioner: Practitioner; daysOfWeek: string[] }>().props;
    const { data, setData, post, processing, errors, reset } = useForm<ScheduleData>({
        practitioner_id: practitioner.id,
        service_category: '',
        service_type: '',
        specialty: '',
        active: true,
        day_of_week: daysOfWeek[0] || '',
        start_time: '',
        end_time: '',
    });

    //breadcrumb
    breadcrumbs.map((breadcrumb, i) =>{
        i===2 && (breadcrumb.href = `/practitioner/${practitioner.id}/schedule`)     
    })

    // Handle form submission
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // console.log(practitioner);
        post(route('practitioner.schedule.store', { id: practitioner.id }));

        // post(route('practitioner.schedule.store'), { //wrong because it also needs practitioner_id
        //     onFinish: () => reset(),
        // });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Schedule" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="max-w-lg px-1 bg-background shadow-lg border border-border">
                    <CardHeader>
                        <CardTitle>Add Schedule</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Practitioner: {practitioner.given_name} {practitioner.family_name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col space-y-6">
                            <input type="hidden" name="practitioner_id" value={data.practitioner_id} />
                            <div>
                                <Label htmlFor="service_category" className="text-gray-200">Service Category</Label>
                                <select
                                    id="service_category"
                                    name="service_category"
                                    value={data.service_category}
                                    onChange={e => setData('service_category', e.target.value)}
                                    disabled={processing}
                                    className="border border-gray-700 bg-gray-900 text-gray-100 rounded-md ml-4 px-3 py-2"
                                    required
                                >
                                    {serviceCategories.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <InputError message={errors.service_category} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="service_type" className="text-gray-200">Service Type</Label>
                                <select
                                    id="service_type"
                                    name="service_type"
                                    value={data.service_type}
                                    onChange={e => setData('service_type', e.target.value)}
                                    disabled={processing}
                                    className="border border-gray-700 bg-gray-900 text-gray-100 rounded-md ml-4 px-3 py-2"
                                    required
                                >
                                    {serviceTypes.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <InputError message={errors.service_type} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="specialty" className="text-gray-200">
                                    Specialty <span className="text-xs text-gray-400">(optional)</span>
                                </Label>
                                <Input
                                    id="specialty"
                                    name="specialty"
                                    value={data.specialty}
                                    onChange={e => setData('specialty', e.target.value)}
                                    disabled={processing}
                                    className="bg-gray-900 border border-gray-700 text-gray-100"
                                />
                                <InputError message={errors.specialty} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="day_of_week" className="text-gray-200">Day of Week</Label>
                                <select
                                    id="day_of_week"
                                    name="day_of_week"
                                    value={data.day_of_week}
                                    onChange={e => setData('day_of_week', e.target.value)}
                                    disabled={processing}
                                    required
                                    className="border border-gray-700 ml-4 bg-gray-900 text-gray-100 rounded-md px-3 py-2"
                                >
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                                <InputError message={errors.day_of_week} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="start_time" className="text-gray-200">Start Time</Label>
                                <Input
                                    id="start_time"
                                    name="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    disabled={processing}
                                    required
                                    className="bg-gray-900 border border-gray-700 text-gray-100"
                                />
                                <InputError message={errors.start_time} className="mt-2 text-red-400 text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="end_time" className="text-gray-200">End Time</Label>
                                <Input
                                    id="end_time"
                                    name="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    disabled={processing}
                                    required
                                    className="bg-gray-900 border border-gray-700 text-gray-100"
                                />
                                <InputError message={errors.end_time} className="mt-2 text-red-400 text-sm" />
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
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create Schedule
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}