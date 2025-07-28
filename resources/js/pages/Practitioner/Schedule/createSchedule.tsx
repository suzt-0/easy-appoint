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
    // {
    //     title: 'List Practitioners',
    //     href: '/admin/practitioners'
    // },
    // {
    //     title: 'Schedules',
    //     href: '/practitioner/schedule' //set below
    // },
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
    };    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Schedule" />
            <div className="flex flex-col items-center bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] text-[#1e293b] min-h-screen dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
                <Card className="w-full max-w-2xl bg-white/90 shadow-xl backdrop-blur-sm rounded-lg border border-[#e2e8f0] dark:bg-[#1e293b]/90 dark:border-[#475569] dark:text-[#f1f5f9] my-4">                    <CardHeader className="text-center lg:text-left pb-4">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#3b82f6] dark:to-[#2563eb]">
                            Add Schedule
                        </CardTitle>
                        <CardDescription className="text-lg text-[#64748b] dark:text-[#cbd5e1]">
                            Practitioner: {practitioner.given_name} {practitioner.family_name}
                        </CardDescription>
                    </CardHeader>                    <CardContent className="px-6 pb-6">
                        <form onSubmit={submit} className="space-y-4">
                            <input type="hidden" name="practitioner_id" value={data.practitioner_id} />
                            
                            <div className="space-y-1.5">
                                <Label htmlFor="service_category" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Service Category</Label>
                                <select
                                    id="service_category"
                                    name="service_category"
                                    value={data.service_category}
                                    onChange={e => setData('service_category', e.target.value)}
                                    disabled={processing}
                                    className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                    required
                                >
                                    {serviceCategories.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <InputError message={errors.service_category} className="mt-1 text-red-500 text-sm" />
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label htmlFor="service_type" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Service Type</Label>
                                <select
                                    id="service_type"
                                    name="service_type"
                                    value={data.service_type}
                                    onChange={e => setData('service_type', e.target.value)}
                                    disabled={processing}
                                    className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                    required
                                >
                                    {serviceTypes.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <InputError message={errors.service_type} className="mt-1 text-red-500 text-sm" />
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label htmlFor="specialty" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">
                                    Specialty <span className="text-xs text-[#64748b] dark:text-[#cbd5e1]">(optional)</span>
                                </Label>
                                <Input
                                    id="specialty"
                                    name="specialty"
                                    value={data.specialty}
                                    onChange={e => setData('specialty', e.target.value)}
                                    disabled={processing}
                                    className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                />
                                <InputError message={errors.specialty} className="mt-1 text-red-500 text-sm" />
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label htmlFor="day_of_week" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Day of Week</Label>
                                <select
                                    id="day_of_week"
                                    name="day_of_week"
                                    value={data.day_of_week}
                                    onChange={e => setData('day_of_week', e.target.value)}
                                    disabled={processing}
                                    required
                                    className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                >
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                                <InputError message={errors.day_of_week} className="mt-1 text-red-500 text-sm" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="start_time" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Start Time</Label>
                                    <Input
                                        id="start_time"
                                        name="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={e => setData('start_time', e.target.value)}
                                        disabled={processing}
                                        required
                                        className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                    />
                                    <InputError message={errors.start_time} className="mt-1 text-red-500 text-sm" />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <Label htmlFor="end_time" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">End Time</Label>
                                    <Input
                                        id="end_time"
                                        name="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={e => setData('end_time', e.target.value)}
                                        disabled={processing}
                                        required
                                        className="w-full rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9]"
                                    />
                                    <InputError message={errors.end_time} className="mt-1 text-red-500 text-sm" />
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="active"
                                        name="active"
                                        type="checkbox"
                                        checked={data.active}
                                        onChange={e => setData('active', e.target.checked)}
                                        disabled={processing}
                                        className="rounded border border-[#e2e8f0] bg-[#f8fafc] text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] dark:border-[#475569] dark:bg-[#334155]"
                                    />
                                    <Label htmlFor="active" className="text-sm font-medium text-[#1e293b] dark:text-[#f1f5f9]">Active</Label>
                                </div>
                                <InputError message={errors.active} className="mt-1 text-red-500 text-sm" />
                            </div>
                            
                            <div className="border-t border-[#e2e8f0] dark:border-[#475569] pt-4 mt-6">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Create Schedule
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}