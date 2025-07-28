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
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Appointments',
        href: '/admin/appointments'
    },
    {
        title: 'Create Appointment',
        href: '#'
    }
];

type User = {
    id: number;
    name: string;
    email: string;
};

type Practitioner = {
    id: number;
    given_name: string;
    family_name: string;
    gender: string;
    birth_date?: string;
    active: boolean;
    user_id: number;
    user?: User;
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
    practitioner?: Practitioner;
};

export default function AdminAppointmentCreate() {
    const { schedule } = usePage<SharedData & { 
        schedule: Schedule;
    }>().props;    const { data, setData, post, processing, errors } = useForm({
        // Patient details
        family_name: '',
        given_name: '',
        gender: '',
        birth_date: '',
        active: true,
        // Patient contact details
        email: 'suztbhttr@gmail.com',
        phone: '',
        // Emergency contact (optional)
        name: '',
        relationship: '',
        telecom: '',
        address: '',
        // Appointment details
        schedule_id: schedule.id,
        status: 'pending',
        appointment_date: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.appointment.store'));
    };

    // Helper function to get day name from date
    const getDayNameFromDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    };

    // Validate that the selected date matches the schedule's day
    const isDateValid = !data.appointment_date || 
        getDayNameFromDate(data.appointment_date) === schedule.day_of_week.toLowerCase();

    const formatTime = (time: string) => {
        if (!time) return 'N/A';
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getPractitionerName = () => {
        if (schedule.practitioner) {
            return `Dr. ${schedule.practitioner.given_name} ${schedule.practitioner.family_name}`;
        }
        return 'Unknown Practitioner';
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'booked', label: 'Booked' },
        { value: 'proposed', label: 'Proposed' }
    ];

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'unknown', label: 'Prefer not to say' }
    ];

    const relationshipOptions = [
        'Spouse',
        'Parent',
        'Child',
        'Sibling',
        'Friend',
        'Guardian',
        'Other'
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Appointment" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
                <Card className="w-full max-w-4xl mt-6 bg-card shadow-lg border border-border">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-foreground">Create New Appointment</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Schedule a new appointment for a patient
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('admin.appointment.schedules')}>
                                    <Button variant="outline" size="sm">
                                        Change Schedule
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Selected Schedule Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Selected Schedule
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div>
                                        <span className="font-medium text-blue-700">Practitioner:</span>
                                        <p className="text-blue-900 font-medium">{getPractitionerName()}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Day:</span>
                                        <p className="text-blue-900">{schedule.day_of_week}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Time:</span>
                                        <p className="text-blue-900">
                                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Specialty:</span>
                                        <p className="text-blue-900">{schedule.specialty || 'General'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Patient Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="given_name" className="text-foreground">First Name *</Label>
                                        <Input
                                            id="given_name"
                                            type="text"
                                            value={data.given_name}
                                            onChange={(e) => setData('given_name', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                            placeholder="Enter first name"
                                        />
                                        {errors.given_name && (
                                            <p className="text-sm text-red-600">{errors.given_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="family_name" className="text-foreground">Last Name *</Label>
                                        <Input
                                            id="family_name"
                                            type="text"
                                            value={data.family_name}
                                            onChange={(e) => setData('family_name', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                            placeholder="Enter last name"
                                        />
                                        {errors.family_name && (
                                            <p className="text-sm text-red-600">{errors.family_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-foreground">Gender *</Label>
                                        <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                            <SelectTrigger className="bg-background border-input">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {genderOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && (
                                            <p className="text-sm text-red-600">{errors.gender}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date" className="text-foreground">Date of Birth</Label>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                            max={new Date().toISOString().split('T')[0]} // Prevent future dates
                                        />
                                        {errors.birth_date && (
                                            <p className="text-sm text-red-600">{errors.birth_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-foreground">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                            placeholder="patient@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact (Optional) */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Emergency Contact (Optional)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_name" className="text-foreground">Contact Name</Label>
                                        <Input
                                            id="contact_name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                            placeholder="Emergency contact name"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="relationship" className="text-foreground">Relationship</Label>
                                        <Select value={data.relationship} onValueChange={(value) => setData('relationship', value)}>
                                            <SelectTrigger className="bg-background border-input">
                                                <SelectValue placeholder="Select relationship" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {relationshipOptions.map((option) => (
                                                    <SelectItem key={option} value={option.toLowerCase()}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.relationship && (
                                            <p className="text-sm text-red-600">{errors.relationship}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_telecom" className="text-foreground">Contact Phone</Label>
                                        <Input
                                            id="contact_telecom"
                                            type="tel"
                                            value={data.telecom}
                                            onChange={(e) => setData('telecom', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        {errors.telecom && (
                                            <p className="text-sm text-red-600">{errors.telecom}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_address" className="text-foreground">Address</Label>
                                        <Input
                                            id="contact_address"
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="bg-background border-input text-foreground"
                                            placeholder="Contact address"
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-600">{errors.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Appointment Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="appointment_date" className="text-foreground">
                                            Appointment Date * 
                                            <span className="text-sm text-muted-foreground ml-1">
                                                (Must be a {schedule.day_of_week})
                                            </span>
                                        </Label>
                                        <Input
                                            id="appointment_date"
                                            type="date"
                                            value={data.appointment_date}
                                            onChange={(e) => setData('appointment_date', e.target.value)}
                                            className={`bg-background border-input text-foreground ${
                                                !isDateValid ? 'border-red-500 focus:ring-red-500' : ''
                                            }`}
                                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                        />
                                        {errors.appointment_date && (
                                            <p className="text-sm text-red-600">{errors.appointment_date}</p>
                                        )}
                                        {!isDateValid && data.appointment_date && (
                                            <p className="text-sm text-red-600">
                                                Please select a {schedule.day_of_week} for this appointment.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-foreground">Initial Status</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger className="bg-background border-input">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-foreground">Description / Notes</Label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows={3}
                                        placeholder="Add any additional notes about this appointment..."
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            {data.given_name && data.family_name && data.appointment_date && isDateValid && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                        Appointment Summary
                                    </h3>
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-medium text-green-700">Patient:</span>
                                                <p className="text-green-900">{data.given_name} {data.family_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Practitioner:</span>
                                                <p className="text-green-900">{getPractitionerName()}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Date & Time:</span>
                                                <p className="text-green-900">
                                                    {new Date(data.appointment_date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })} at {formatTime(schedule.start_time)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Specialty:</span>
                                                <p className="text-green-900">{schedule.specialty || 'General'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 justify-end border-t border-border">
                                <Link href={route('admin.appointment.schedules')}>
                                    <Button type="button" variant="outline">
                                        Back to Schedule Selection
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing || !isDateValid || !data.given_name || !data.family_name || !data.email || !data.phone || !data.gender || !data.appointment_date}
                                >
                                    {processing ? 'Creating...' : 'Create Appointment'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
