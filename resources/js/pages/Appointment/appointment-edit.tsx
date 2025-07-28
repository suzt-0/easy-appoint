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
        title: 'Edit Appointment',
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

type Patient = {
    id: number;
    given_name: string;
    family_name: string;
    gender: string;
    birth_date?: string;
    active: boolean;
};

type AppointmentParticipant = {
    id: number;
    appointment_id: number;
    actor_type: 'patient' | 'practitioner';
    actor_id: number;
    status: string;
    patient?: Patient;
    practitioner?: Practitioner;
};

type Appointment = {
    id: number;
    schedule_id: number;
    status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow';
    appointment_date: string;
    description?: string;
    created_at: string;
    updated_at: string;
    schedule?: Schedule;
    participants?: AppointmentParticipant[];
    patient?: Patient;
    practitioner?: Practitioner;
};

export default function AdminAppointmentEdit() {
    const { appointment, schedules } = usePage<SharedData & { 
        appointment: Appointment;
        schedules?: Schedule[];
    }>().props;    const { data, setData, put, processing, errors } = useForm({
        schedule_id: appointment.schedule_id.toString(),
        status: appointment.status,
        appointment_date: appointment.appointment_date,
        description: appointment.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.appointment.update', appointment.id));
    };

    // Helper function to get day name from date
    const getDayNameFromDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    };

    // Helper function to validate date against schedule
    const validateDateWithSchedule = (dateString: string, scheduleId: string) => {
        if (!dateString || !scheduleId) return true;
        
        const selectedSchedule = schedules?.find(s => s.id.toString() === scheduleId) || 
                                 (appointment.schedule_id.toString() === scheduleId ? appointment.schedule : null);
        
        if (!selectedSchedule) return true;
        
        const dayFromDate = getDayNameFromDate(dateString);
        const dayFromSchedule = selectedSchedule.day_of_week.toLowerCase();
        
        return dayFromDate === dayFromSchedule;
    };

    // Check if current date/schedule combination is valid
    const isDateScheduleValid = validateDateWithSchedule(data.appointment_date, data.schedule_id);

    // Handle date change
    const handleDateChange = (newDate: string) => {
        setData('appointment_date', newDate);
    };

    // Handle schedule change
    const handleScheduleChange = (newScheduleId: string) => {
        setData('schedule_id', newScheduleId);
    };

    const statusOptions = [
        { value: 'proposed', label: 'Proposed' },
        { value: 'pending', label: 'Pending' },
        { value: 'booked', label: 'Booked' },
        { value: 'arrived', label: 'Arrived' },
        { value: 'fulfilled', label: 'Fulfilled' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'noshow', label: 'No Show' }
    ];

    const formatTime = (time: string) => {
        if (!time) return 'N/A';
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getPatientName = () => {
        if (appointment.patient) {
            return `${appointment.patient.given_name} ${appointment.patient.family_name}`;
        }
        const patientParticipant = appointment.participants?.find(p => p.actor_type === 'patient');
        if (patientParticipant?.patient) {
            return `${patientParticipant.patient.given_name} ${patientParticipant.patient.family_name}`;
        }
        return 'Unknown Patient';
    };

    const getPractitionerName = () => {
        if (appointment.practitioner) {
            return `Dr. ${appointment.practitioner.given_name} ${appointment.practitioner.family_name}`;
        }
        const practitionerParticipant = appointment.participants?.find(p => p.actor_type === 'practitioner');
        if (practitionerParticipant?.practitioner) {
            return `Dr. ${practitionerParticipant.practitioner.given_name} ${practitionerParticipant.practitioner.family_name}`;
        }
        if (appointment.schedule?.practitioner) {
            return `Dr. ${appointment.schedule.practitioner.given_name} ${appointment.schedule.practitioner.family_name}`;
        }
        return 'Unknown Practitioner';
    };

    const getScheduleDisplay = (schedule: Schedule) => {
        const practitionerName = schedule.practitioner 
            ? `Dr. ${schedule.practitioner.given_name} ${schedule.practitioner.family_name}`
            : 'Unknown Practitioner';
        const timeSlot = `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`;
        const specialty = schedule.specialty ? ` (${schedule.specialty})` : '';
        
        return `${practitionerName} - ${schedule.day_of_week} ${timeSlot}${specialty}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Appointment" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
                <Card className="w-full max-w-4xl mt-6 bg-card shadow-lg border border-border">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-foreground">Edit Appointment</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Appointment ID: <span className="font-semibold text-foreground">#{appointment.id}</span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('admin.appointment.show', appointment.id)}>
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Current Appointment Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Current Appointment Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div>
                                        <span className="font-medium text-muted-foreground">Patient:</span>
                                        <p className="text-foreground font-medium">{getPatientName()}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-muted-foreground">Current Practitioner:</span>
                                        <p className="text-foreground">{getPractitionerName()}</p>
                                    </div>
                                    {appointment.schedule && (
                                        <>
                                            <div>
                                                <span className="font-medium text-muted-foreground">Current Schedule:</span>
                                                <p className="text-foreground">
                                                    {appointment.schedule.day_of_week} • {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">Specialty:</span>
                                                <p className="text-foreground">{appointment.schedule.specialty || 'General'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Editable Fields */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Edit Appointment Details
                                </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="appointment_date" className="text-foreground">Appointment Date *</Label>
                                        <Input
                                            id="appointment_date"
                                            type="date"
                                            value={data.appointment_date}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            className={`bg-background border-input text-foreground ${
                                                !isDateScheduleValid ? 'border-red-500 focus:ring-red-500' : ''
                                            }`}
                                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                        />
                                        {errors.appointment_date && (
                                            <p className="text-sm text-red-600">{errors.appointment_date}</p>
                                        )}
                                        {!isDateScheduleValid && (
                                            <p className="text-sm text-red-600">
                                                The selected date does not match the schedule's day of the week. 
                                                Please select a {appointment.schedule?.day_of_week || 'different'} or change the schedule.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-foreground">Status *</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value as any)}>
                                            <SelectTrigger className="bg-background border-input">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>
                                </div>                                {/* Schedule Selection (Optional) */}
                                {schedules && schedules.length > 0 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="schedule_id" className="text-foreground">
                                            Change Schedule (Optional)
                                        </Label>
                                        <Select value={data.schedule_id} onValueChange={handleScheduleChange}>
                                            <SelectTrigger className={`bg-background border-input ${
                                                !isDateScheduleValid ? 'border-red-500 focus:ring-red-500' : ''
                                            }`}>
                                                <SelectValue placeholder="Select a different schedule" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {schedules.map((schedule) => (
                                                    <SelectItem key={schedule.id} value={schedule.id.toString()}>
                                                        {getScheduleDisplay(schedule)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.schedule_id && (
                                            <p className="text-sm text-red-600">{errors.schedule_id}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Leave unchanged to keep the current schedule
                                        </p>
                                        {!isDateScheduleValid && (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                                                <p className="text-sm text-amber-800">
                                                    ⚠️ The selected date ({getDayNameFromDate(data.appointment_date)}) doesn't match 
                                                    the schedule's day ({
                                                        (schedules?.find(s => s.id.toString() === data.schedule_id) || appointment.schedule)?.day_of_week
                                                    }). Please adjust either the date or schedule.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}<div className="space-y-2">
                                    <Label htmlFor="description" className="text-foreground">Description</Label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows={4}
                                        placeholder="Add any additional notes or details about this appointment..."
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </div>                            {/* Important Notes */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Important Notes
                                </h3>
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Please note:
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>The appointment date must match the day of the week specified in the schedule</li>
                                                    <li>Changing the appointment date will require patient confirmation</li>
                                                    <li>Status changes may trigger automatic notifications</li>
                                                    <li>Changing the schedule will update the practitioner and time slot</li>
                                                    <li>Cancelled appointments cannot be changed back to active status without creating a new appointment</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>{/* Action Buttons */}
                            <div className="flex gap-4 pt-6 justify-end border-t border-border">
                                <Link href={route('admin.appointment.show', appointment.id)}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing || !isDateScheduleValid}
                                    className={!isDateScheduleValid ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                    {processing ? 'Updating...' : 'Update Appointment'}
                                </Button>
                                {!isDateScheduleValid && (
                                    <p className="text-xs text-red-600 self-center">
                                        Please fix date/schedule mismatch before updating
                                    </p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
