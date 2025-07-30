import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface Schedule {
    id: number;
    practitioner_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    active: boolean;
    practitioner: {
        id: number;
        given_name: string;
        family_name: string;
        user: {
            email: string;
        };
    };
}

interface Practitioner {
    id: number;
    given_name: string;
    family_name: string;
    gender: string;
}

interface Appointment {
    id: number;
    status: string;
    appointment_date: string;
    description: string | null;
    schedule_id: number;
    schedule: {
        id: number;
        day_of_week: string;
        start_time: string;
        end_time: string;
        practitioner: Practitioner;
    };
}

interface PageProps {
    appointment: Appointment;
    schedules: Schedule[];
    practitioner: Practitioner;
    [key: string]: any;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'booked':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'confirmed':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'cancelled':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'completed':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
};

export default function PatientAppointmentReschedule() {
    const { appointment, schedules, practitioner } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'My Appointments',
            href: route('patient.appointment.index'),
        },
        {
            title: 'Appointment Details',
            href: route('patient.appointment.show', appointment.id),
        },
        {
            title: 'Reschedule',
            href: '#',
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        schedule_id: appointment.schedule_id.toString(),
        appointment_date: appointment.appointment_date.split('T')[0], // Extract date part
        reschedule_reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('patient.appointment.reschedule.update', appointment.id));
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

    // Check if appointment is more than 24 hours away
    const isMoreThan24HoursAway = () => {
        const appointmentDateTime = new Date(appointment.appointment_date);
        const now = new Date();
        const timeDifference = appointmentDateTime.getTime() - now.getTime();
        const hoursUntilAppointment = timeDifference / (1000 * 3600);
        
        return hoursUntilAppointment >= 24;
    };

    // Check if current date/schedule combination is valid
    const isDateScheduleValid = validateDateWithSchedule(data.appointment_date, data.schedule_id);
    const canReschedule = isMoreThan24HoursAway();

    // Handle date change
    const handleDateChange = (newDate: string) => {
        setData('appointment_date', newDate);
    };

    // Handle schedule change
    const handleScheduleChange = (newScheduleId: string) => {
        setData('schedule_id', newScheduleId);
    };

    const getScheduleDisplay = (schedule: Schedule) => {
        const timeSlot = `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`;
        return `${schedule.day_of_week} ${timeSlot}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reschedule Appointment" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
                <Card className="w-full max-w-4xl mt-6 bg-card shadow-lg border border-border">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-foreground">Reschedule Appointment</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Appointment ID: <span className="font-semibold text-foreground">#{appointment.id}</span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('patient.appointment.show', appointment.id)}>
                                    <Button variant="outline" size="sm">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!canReschedule ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-red-800">Cannot Reschedule</h3>
                                            <p className="text-red-700 mt-1">
                                                Appointments can only be rescheduled at least 24 hours in advance. 
                                                Your appointment is scheduled for less than 24 hours from now.
                                            </p>
                                            <p className="text-red-700 mt-2">
                                                Please contact the healthcare provider directly if you need to make changes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Current Appointment Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                        Current Appointment Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date & Time</p>
                                            <p className="font-medium text-foreground">
                                                {formatDate(appointment.appointment_date)} at {formatTime(appointment.schedule.start_time)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Healthcare Provider</p>
                                            <p className="font-medium text-foreground">
                                                Dr. {practitioner.given_name} {practitioner.family_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <Badge className={getStatusColor(appointment.status)}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                            <p className="font-medium text-foreground">
                                                {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Current Appointment Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                        Current Appointment Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date & Time</p>
                                            <p className="font-medium text-foreground">
                                                {formatDate(appointment.appointment_date)} at {formatTime(appointment.schedule.start_time)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Healthcare Provider</p>
                                            <p className="font-medium text-foreground">
                                                Dr. {practitioner.given_name} {practitioner.family_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <Badge className={getStatusColor(appointment.status)}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                            <p className="font-medium text-foreground">
                                                {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reschedule Form Fields */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                        Reschedule Appointment
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Date Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="appointment_date" className="text-foreground">
                                                New Appointment Date
                                            </Label>
                                            <Input
                                                id="appointment_date"
                                                type="date"
                                                value={data.appointment_date}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 24 hours from now
                                                className="w-full"
                                            />
                                            {errors.appointment_date && (
                                                <p className="text-sm text-red-600">{errors.appointment_date}</p>
                                            )}
                                        </div>

                                        {/* Schedule Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="schedule_id" className="text-foreground">
                                                Available Time Slots
                                            </Label>
                                            <Select 
                                                value={data.schedule_id} 
                                                onValueChange={handleScheduleChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a time slot" />
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
                                        </div>
                                    </div>

                                    {/* Reschedule Reason */}
                                    <div className="space-y-2">
                                        <Label htmlFor="reschedule_reason" className="text-foreground">
                                            Reason for Rescheduling (Optional)
                                        </Label>
                                        <textarea
                                            id="reschedule_reason"
                                            value={data.reschedule_reason}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('reschedule_reason', e.target.value)}
                                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            rows={4}
                                            placeholder="Please let us know why you need to reschedule..."
                                        />
                                        {errors.reschedule_reason && (
                                            <p className="text-sm text-red-600">{errors.reschedule_reason}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Important Notes */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                        Important Notes
                                    </h3>
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-start space-x-2">
                                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                            <div className="text-yellow-800">
                                                <p className="font-medium">Please Note:</p>
                                                <ul className="mt-2 space-y-1 text-sm">
                                                    <li>• You can only reschedule to time slots with the same healthcare provider</li>
                                                    <li>• The selected date must match the day of the week for the chosen time slot</li>
                                                    <li>• Your appointment status will be reset to "pending" after rescheduling</li>
                                                    <li>• You will receive an email confirmation of the changes</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6 justify-end border-t border-border">
                                    <Link href={route('patient.appointment.show', appointment.id)}>
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button 
                                        type="submit" 
                                        disabled={processing || !isDateScheduleValid}
                                        className={!isDateScheduleValid ? 'opacity-50 cursor-not-allowed' : ''}
                                    >
                                        {processing ? 'Rescheduling...' : 'Reschedule Appointment'}
                                    </Button>
                                    {!isDateScheduleValid && (
                                        <p className="text-sm text-red-600 mt-2">
                                            The selected date must match the day of the week for the chosen time slot.
                                        </p>
                                    )}
                                </div>

                                {Object.keys(errors).length > 0 && (
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <h4 className="font-medium text-red-900 mb-2">Please correct the following errors:</h4>
                                        <ul className="text-sm text-red-800 space-y-1">
                                            {Object.entries(errors).map(([key, error]) => (
                                                <li key={key}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
