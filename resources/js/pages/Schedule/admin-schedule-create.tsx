import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedule Management',
        href: '/admin/schedule/manage',
    },
    {
        title: 'Select Practitioner',
        href: '/admin/schedule/selectpractitioner'
    },
    {
        title: 'Create Schedule',
        href: '#'
    }
];

type Practitioner = {
    id: number;
    given_name: string;
    family_name: string;
    gender: string;
    birth_date?: string;
    active: boolean;
    user_id: number;
};

type Appointment = {
    id: number;
    patient_id: number;
    schedule_id: number;
    status: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
};

type Schedule = {
    id: number;
    practitioner_id: number;
    service_category: string | null;
    service_type: string | null;
    specialty: string | null;
    active: boolean;
    day_of_week: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
    practitioner: Practitioner;
    appointments: Appointment[];
};

export default function AdminScheduleCreate() {
    const { practitioner } = usePage<SharedData & { practitioner: Practitioner }>().props;    const { data, setData, post, processing, errors } = useForm({
        service_category: '',
        service_type: '',
        specialty: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        active: true as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.schedule.store', practitioner.id));
    };    const dayOptions = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' }
    ];

    const serviceCategories = [
        'General Medicine',
        'Specialist Consultation',
        'Emergency Care',
        'Preventive Care',
        'Diagnostic Services',
        'Therapeutic Services'
    ];

    const serviceTypes = [
        'In-Person Consultation',
        'Telemedicine',
        'Follow-up',
        'Routine Check-up',
        'Emergency Visit',
        'Procedure'
    ];

    const specialties = [
        'General Practice',
        'Cardiology',
        'Dermatology',
        'Endocrinology',
        'Gastroenterology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Radiology'
    ];    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Schedule" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
                <Card className="w-full max-w-4xl mt-6 bg-card shadow-lg border border-border">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-foreground">Create New Schedule</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Practitioner: <span className="font-semibold text-foreground">
                                        Dr. {practitioner.given_name} {practitioner.family_name}
                                    </span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('admin.schedule.practitioners')}>
                                    <Button variant="outline" size="sm">
                                        Back to Selection
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Service Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Service Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="service_category" className="text-foreground">Service Category</Label>
                                        <Select value={data.service_category} onValueChange={(value) => setData('service_category', value)}>
                                            <SelectTrigger className="bg-background border-input">
                                                <SelectValue placeholder="Select service category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {serviceCategories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.service_category && (
                                            <p className="text-sm text-red-600">{errors.service_category}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service_type" className="text-foreground">Service Type</Label>
                                        <Select value={data.service_type} onValueChange={(value) => setData('service_type', value)}>
                                            <SelectTrigger className="bg-background border-input">
                                                <SelectValue placeholder="Select service type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {serviceTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.service_type && (
                                            <p className="text-sm text-red-600">{errors.service_type}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="specialty" className="text-foreground">Specialty</Label>
                                        <Select value={data.specialty} onValueChange={(value) => setData('specialty', value)}>
                                            <SelectTrigger className="bg-background border-input">
                                                <SelectValue placeholder="Select specialty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {specialties.map((specialty) => (
                                                    <SelectItem key={specialty} value={specialty}>
                                                        {specialty}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.specialty && (
                                            <p className="text-sm text-red-600">{errors.specialty}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Schedule Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="day_of_week" className="text-foreground">Day of Week *</Label>
                                        <Select value={data.day_of_week} onValueChange={(value) => setData('day_of_week', value)}>
                                            <SelectTrigger className="bg-background border-input">
                                                <SelectValue placeholder="Select day" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dayOptions.map((day) => (
                                                    <SelectItem key={day.value} value={day.value}>
                                                        {day.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.day_of_week && (
                                            <p className="text-sm text-red-600">{errors.day_of_week}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="start_time" className="text-foreground">Start Time *</Label>
                                        <Input
                                            id="start_time"
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                        />
                                        {errors.start_time && (
                                            <p className="text-sm text-red-600">{errors.start_time}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_time" className="text-foreground">End Time *</Label>
                                        <Input
                                            id="end_time"
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                        />
                                        {errors.end_time && (
                                            <p className="text-sm text-red-600">{errors.end_time}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Status
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={data.active}
                                        onChange={(e) => setData('active', e.target.checked)}
                                        className="rounded border-input"
                                    />
                                    <Label htmlFor="active" className="text-foreground">
                                        Active Schedule
                                    </Label>
                                </div>
                                {errors.active && (
                                    <p className="text-sm text-red-600">{errors.active}</p>
                                )}
                            </div>                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 justify-end border-t border-border">
                                <Link href={route('admin.schedule.practitioners')}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Schedule'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
