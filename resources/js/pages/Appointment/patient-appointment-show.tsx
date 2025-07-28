import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    FileText, 
    MapPin, 
    Phone, 
    Stethoscope, 
    User, 
    UserCheck,
    Mail,
    Badge as BadgeIcon
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Appointments',
        href: '/patient/appointments',
    },
    {
        title: 'Appointment Details',
        href: '#',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface Practitioner {
    id: number;
    user_id: number;
    family_name: string;
    given_name: string;
    gender: string;
    birth_date: string;
    active: boolean;
    user?: User;
    qualifications?: PractitionerQualification[];
    telecoms?: PractitionerTelecom[];
}

interface PractitionerQualification {
    id: number;
    practitioner_id: number;
    code: string;
    display: string;
    period_start: string;
    period_end: string;
}

interface PractitionerTelecom {
    id: number;
    practitioner_id: number;
    system: string;
    value: string;
    use: string;
}

interface Patient {
    id: number;
    family_name: string;
    given_name: string;
    gender: string;
    birth_date: string;
    active: boolean;
}

interface Schedule {
    id: number;
    practitioner_id: number;
    service_category: string;
    service_type: string;
    specialty: string;
    active: boolean;
    day_of_week: string;
    start_time: string;
    end_time: string;
    practitioner?: Practitioner;
}

interface AppointmentParticipant {
    id: number;
    appointment_id: number;
    actor_type: 'patient' | 'practitioner';
    actor_id: number;
    status: string;
    created_at: string;
    updated_at: string;
    patient?: Patient;
    practitioner?: Practitioner;
}

interface AppointmentNote {
    id: number;
    appointment_id: number;
    text: string;
    created_at: string;
    updated_at: string;
}

interface Appointment {
    id: number;
    status: string;
    appointment_date: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    schedule_id: number;
    schedule?: Schedule;
    participants: AppointmentParticipant[];
    patient?: Patient;
    practitioner?: Practitioner;
    notes?: AppointmentNote[];
}

interface PageProps {
    appointment: Appointment;
    [key: string]: any;
}

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

const getParticipantStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'accepted':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'declined':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const isUpcoming = (dateString: string) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
};

export default function PatientAppointmentShow() {
    const { appointment } = usePage<PageProps>().props;
    
    const practitionerParticipant = appointment.participants?.find(p => p.actor_type === 'practitioner');
    const patientParticipant = appointment.participants?.find(p => p.actor_type === 'patient');
    
    const practitioner = appointment.practitioner || appointment.schedule?.practitioner || practitionerParticipant?.practitioner;
    const patient = appointment.patient || patientParticipant?.patient;
    
    const isAppointmentUpcoming = isUpcoming(appointment.appointment_date);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointment Details" />
            
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/patient/appointments"
                            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Appointments
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                        </Badge>
                        {isAppointmentUpcoming && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                Upcoming
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Appointment Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Appointment Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Appointment Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Date and Time */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm font-medium">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>Date</span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            {formatDate(appointment.appointment_date)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm font-medium">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>Time</span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            {formatTime(appointment.appointment_date)}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Service Information */}
                                {appointment.schedule && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">Service Information</h4>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground">Category</span>
                                                <p className="font-medium">{appointment.schedule.service_category}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground">Type</span>
                                                <p className="font-medium">{appointment.schedule.service_type}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground">Specialty</span>
                                                <p className="font-medium">{appointment.schedule.specialty}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground">Schedule Hours</span>
                                                <p className="font-medium">
                                                    {appointment.schedule.start_time} - {appointment.schedule.end_time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                {/* Participants Status */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Participants</h4>
                                    <div className="space-y-3">
                                        {patientParticipant && (
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span>Patient (You)</span>
                                                </div>
                                                <Badge className={getParticipantStatusColor(patientParticipant.status)}>
                                                    {patientParticipant.status}
                                                </Badge>
                                            </div>
                                        )}
                                        {practitionerParticipant && (
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                                    <span>Healthcare Provider</span>
                                                </div>
                                                <Badge className={getParticipantStatusColor(practitionerParticipant.status)}>
                                                    {practitionerParticipant.status}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Created/Updated Info */}
                                <Separator />
                                <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
                                    <div>
                                        <span className="font-medium">Created:</span> {formatDateTime(appointment.created_at)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span> {formatDateTime(appointment.updated_at)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appointment Notes */}
                        {appointment.notes && appointment.notes.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5" />
                                        <span>Appointment Notes</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {appointment.notes.map((note) => (
                                            <div key={note.id} className="p-4 border rounded-lg">
                                                <p className="text-sm mb-2">{note.text}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Added on {formatDateTime(note.created_at)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Healthcare Provider Info */}
                        {practitioner && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <UserCheck className="h-5 w-5" />
                                        <span>Healthcare Provider</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-lg">
                                            Dr. {practitioner.given_name} {practitioner.family_name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {practitioner.gender}
                                        </p>
                                    </div>

                                    {/* Practitioner Contact Info */}
                                    {practitioner.user && (
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{practitioner.user.email}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Practitioner Telecoms */}
                                    {practitioner.telecoms && practitioner.telecoms.length > 0 && (
                                        <div className="space-y-2">
                                            {practitioner.telecoms.map((telecom) => (
                                                <div key={telecom.id} className="flex items-center space-x-2 text-sm">
                                                    {telecom.system === 'phone' ? (
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <span>{telecom.value}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {telecom.use}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Practitioner Qualifications */}
                                    {practitioner.qualifications && practitioner.qualifications.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm font-medium">
                                                <BadgeIcon className="h-4 w-4 text-muted-foreground" />
                                                <span>Qualifications</span>
                                            </div>
                                            <div className="space-y-2">
                                                {practitioner.qualifications.map((qualification) => (
                                                    <div key={qualification.id} className="text-sm">
                                                        <p className="font-medium">{qualification.display}</p>
                                                        <p className="text-muted-foreground">
                                                            Code: {qualification.code}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <Badge variant={practitioner.active ? "default" : "secondary"}>
                                            {practitioner.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    disabled={!isAppointmentUpcoming || appointment.status === 'cancelled'}
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Reschedule
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    disabled={appointment.status === 'cancelled'}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Download Details
                                </Button>
                                {practitioner?.telecoms?.find(t => t.system === 'phone') && (
                                    <Button variant="outline" className="w-full">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Contact Provider
                                    </Button>
                                )}
                            </CardContent>
                        </Card> */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
