import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Appointments',
        href: '/user/patient/appointments'
    },
    {
        title: 'Select Schedule',
        href: '/user/patient/appointment/select-schedule'
    },
    {
        title: 'Book Appointment',
        href: '/user/patient/appointments/create'
    },
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
    created_at: string;
    updated_at: string;
    practitioner?: Practitioner;
};

type PatientTelecom = {
    id: number;
    patient_id: number;
    system: string;
    value: string;
    use: string;
};

type Patient = {
    id: number;
    given_name: string;
    family_name: string;
    gender: string;
    birth_date?: string;
    active: boolean;
    telecoms?: PatientTelecom[];
};

export default function PatientAppointmentCreate() {
    const { schedule, patients, errors } = usePage<SharedData & { 
        schedule: Schedule; 
        patients: Patient[];
        errors: Record<string, string>;
    }>().props;
    
    // Auto-select the first patient if available
    const firstPatient = patients.length > 0 ? patients[0] : null;
    
    const { data, setData, post, processing } = useForm({
        schedule_id: schedule.id,
        patient_id: firstPatient ? firstPatient.id.toString() : '',
        appointment_date: '',
        appointment_reason: '',
        notes: ''
    });

    const formatTime = (time: string) => {
        if (!time) return 'N/A';
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getPractitionerName = (schedule: Schedule) => {
        if (schedule.practitioner) {
            return `Dr. ${schedule.practitioner.given_name} ${schedule.practitioner.family_name}`;
        }
        return 'Unknown Practitioner';
    };

    const capitalizeDay = (day: string) => {
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    // Get next available dates for the selected day of week
    const getNextAvailableDates = () => {
        const dates = [];
        const today = new Date();
        const dayOfWeek = schedule.day_of_week.toLowerCase();
        
        // Map day names to numbers (0 = Sunday, 1 = Monday, etc.)
        const dayMap: { [key: string]: number } = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6
        };
        
        const targetDay = dayMap[dayOfWeek];
        
        // Find next 4 occurrences of the target day
        for (let i = 0; i < 28; i++) { // Check next 4 weeks
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            if (date.getDay() === targetDay && date > today) {
                dates.push(date);
                if (dates.length >= 4) break;
            }
        }
        
        return dates;
    };

    const availableDates = getNextAvailableDates();    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('patient.appointment.store'), {
            onSuccess: () => {
                // Success is handled by redirect in controller
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Appointment" />
            <div className="p-3 md:p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Schedule Information Card */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">Selected Schedule</CardTitle>
                            <CardDescription>Appointment details for your selected time slot</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Practitioner</Label>
                                    <p className="text-foreground font-medium">{getPractitionerName(schedule)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Specialty</Label>
                                    <p className="text-foreground">{schedule.specialty || 'General'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Day</Label>
                                    <p className="text-foreground">{capitalizeDay(schedule.day_of_week)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                                    <p className="text-foreground">{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Service Type</Label>
                                    <p className="text-foreground">{schedule.service_type || 'Consultation'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointment Booking Form */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <CardTitle className="text-xl">Book Your Appointment</CardTitle>
                                    <CardDescription>Fill in the details to complete your appointment booking</CardDescription>
                                </div>
                                <Link href={route('patient.appointment.schedules')}>
                                    <Button variant="outline" type="button">
                                        Back to Schedules
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Selected Patient Display */}
                                <div className="space-y-2">
                                    <Label>Patient Profile</Label>
                                    {firstPatient ? (
                                        <div className="p-3 bg-muted rounded-md border">
                                            <div className="text-sm font-medium text-foreground">
                                                {firstPatient.given_name} {firstPatient.family_name}
                                            </div>
                                            {firstPatient.birth_date && (
                                                <div className="text-xs text-muted-foreground">
                                                    Date of Birth: {new Date(firstPatient.birth_date).toLocaleDateString()}
                                                </div>
                                            )}
                                            <div className="text-xs text-muted-foreground mt-1">
                                                This appointment will be booked for the above patient profile
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">                                            <p className="text-destructive text-sm">No patient profile found for your account. Please contact support.</p>
                                        </div>
                                    )}
                                    {errors.patient_id && <p className="text-destructive text-sm">{errors.patient_id}</p>}
                                </div>

                                {/* Appointment Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="appointment_date">Appointment Date *</Label>
                                    <Select value={data.appointment_date} onValueChange={(value) => setData('appointment_date', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an available date" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableDates.map((date, index) => (
                                                <SelectItem key={index} value={date.toISOString().split('T')[0]}>
                                                    {date.toLocaleDateString('en-US', { 
                                                        weekday: 'long', 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.appointment_date && <p className="text-destructive text-sm">{errors.appointment_date}</p>}
                                </div>

                                {/* Appointment Reason */}
                                <div className="space-y-2">
                                    <Label htmlFor="appointment_reason">Reason for Appointment</Label>
                                    <Input
                                        id="appointment_reason"
                                        type="text"
                                        value={data.appointment_reason}
                                        onChange={(e) => setData('appointment_reason', e.target.value)}
                                        placeholder="Brief description of your visit purpose"
                                        maxLength={500}
                                    />
                                    {errors.appointment_reason && <p className="text-destructive text-sm">{errors.appointment_reason}</p>}
                                </div>

                                {/* Additional Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Additional Notes</Label>                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('notes', e.target.value)}
                                        placeholder="Any additional information or special requests"
                                        className="min-h-[100px]"
                                        maxLength={1000}
                                    />
                                    {errors.notes && <p className="text-destructive text-sm">{errors.notes}</p>}
                                </div>

                                {/* General Errors */}
                                {errors.error && (
                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                                        <p className="text-destructive text-sm">{errors.error}</p>
                                    </div>
                                )}

                                {/* Form Actions */}                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={processing || !firstPatient || !data.appointment_date}
                                        className="flex-1 md:flex-none"
                                    >
                                        {processing ? 'Booking...' : 'Book Appointment'}
                                    </Button>
                                    <Link href={route('patient.appointment.schedules')}>
                                        <Button variant="outline" type="button" className="flex-1 md:flex-none">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Information Card */}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <h4 className="font-medium text-foreground">Important Information:</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Appointments can be rescheduled up to 24 hours before the scheduled time</li>
                                    <li>• Please arrive 15 minutes early for your appointment</li>
                                    <li>• You will receive a confirmation email once your appointment is booked</li>
                                    <li>• If you need to cancel, please do so at least 24 hours in advance</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
