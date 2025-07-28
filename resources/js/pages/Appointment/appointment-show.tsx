import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link, router } from '@inertiajs/react';

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
        title: 'Appointment Details',
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

type AppointmentNote = {
    id: number;
    appointment_id: number;
    note: string;
    created_at: string;
    updated_at: string;
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
    notes?: AppointmentNote[];
    // Direct relationships
    patient?: Patient;
    practitioner?: Practitioner;
};

export default function AdminAppointmentShow() {
    const { appointment } = usePage<SharedData & { appointment: Appointment }>().props;

    // const handleDelete = () => {
    //     if (confirm('Are you sure you want to cancel this appointment?')) {
    //         router.put(route('admin.appointment.update', appointment.id), {
    //             status: 'cancelled'
    //         });
    //     }
    // };

    const formatTime = (time: string) => {
        if (!time) return 'N/A';
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'proposed':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'booked':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'arrived':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'fulfilled':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'noshow':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
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

    const getPatientDetails = () => {
        if (appointment.patient) return appointment.patient;
        const patientParticipant = appointment.participants?.find(p => p.actor_type === 'patient');
        return patientParticipant?.patient;
    };

    const capitalizeStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointment Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
                <Card className="w-full max-w-4xl mt-6 bg-card shadow-lg border border-border">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-foreground">Appointment Details</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Appointment ID: <span className="font-semibold text-foreground">#{appointment.id}</span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('admin.appointment.edit', appointment.id)}>
                                    <Button variant="secondary" size="sm">
                                        Edit
                                    </Button>
                                </Link>
                                {appointment.status !== 'cancelled' && (
                                    <></>
                                    // <Button
                                    //     variant="destructive"
                                    //     size="sm"
                                    //     onClick={handleDelete}
                                    // >
                                    //     Cancel
                                    // </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Appointment Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Patient Information
                                </h3>
                                <div>
                                    <span className="font-medium text-muted-foreground">Patient Name:</span>
                                    <p className="text-foreground font-medium">{getPatientName()}</p>
                                </div>
                                {getPatientDetails() && (
                                    <>
                                        <div>
                                            <span className="font-medium text-muted-foreground">Gender:</span>
                                            <p className="text-foreground capitalize">{getPatientDetails()?.gender}</p>
                                        </div>
                                        {getPatientDetails()?.birth_date && (
                                            <div>
                                                <span className="font-medium text-muted-foreground">Date of Birth:</span>
                                                <p className="text-foreground">{formatDate(getPatientDetails()!.birth_date!)}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Practitioner Information
                                </h3>
                                <div>
                                    <span className="font-medium text-muted-foreground">Practitioner:</span>
                                    <p className="text-foreground font-medium">{getPractitionerName()}</p>
                                </div>
                                {appointment.schedule && (
                                    <>
                                        <div>
                                            <span className="font-medium text-muted-foreground">Specialty:</span>
                                            <p className="text-foreground">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                    {appointment.schedule.specialty || 'General'}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-muted-foreground">Service Type:</span>
                                            <p className="text-foreground">{appointment.schedule.service_type || 'Consultation'}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Appointment Details
                                </h3>
                                <div>
                                    <span className="font-medium text-muted-foreground">Date:</span>
                                    <p className="text-foreground font-medium">{formatDate(appointment.appointment_date)}</p>
                                </div>
                                {appointment.schedule && (
                                    <>
                                        <div>
                                            <span className="font-medium text-muted-foreground">Day:</span>
                                            <p className="text-foreground capitalize">{appointment.schedule.day_of_week}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-muted-foreground">Time Slot:</span>
                                            <p className="text-foreground">
                                                {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                                            </p>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <span className="font-medium text-muted-foreground">Status:</span>
                                    <p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(appointment.status)}`}>
                                            {capitalizeStatus(appointment.status)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {appointment.description && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                                    Description
                                </h3>
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <p className="text-foreground">{appointment.description}</p>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {appointment.notes && appointment.notes.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                                    Notes
                                </h3>
                                <div className="space-y-3">
                                    {appointment.notes.map((note) => (
                                        <div key={note.id} className="bg-muted/30 rounded-lg p-4">
                                            <p className="text-foreground mb-2">{note.note}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Added on {formatDateTime(note.created_at)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Participants */}
                        {appointment.participants && appointment.participants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                                    Participants
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {appointment.participants.map((participant) => (
                                        <div key={participant.id} className="bg-muted/30 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-foreground capitalize">
                                                        {participant.actor_type}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Status: <span className="capitalize">{participant.status}</span>
                                                    </p>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    participant.status === 'accepted' 
                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                }`}>
                                                    {participant.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-border">
                            <div>
                                <span className="font-medium text-muted-foreground">Created:</span>
                                <p className="text-foreground text-sm">{formatDateTime(appointment.created_at)}</p>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground">Last Updated:</span>
                                <p className="text-foreground text-sm">{formatDateTime(appointment.updated_at)}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8 justify-end">
                            <Link href={route('admin.appointment.index')}>
                                <Button variant="outline">
                                    Back to Appointments
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
