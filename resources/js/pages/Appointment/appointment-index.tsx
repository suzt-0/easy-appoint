import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Appointments',
        href: '/admin/appointments'
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
    // Direct relationships from backend
    patient?: Patient;
    practitioner?: Practitioner;
    // Computed attributes from backend
    patient_name?: string;
    practitioner_name?: string;
    patient_data?: Patient;
    practitioner_data?: Practitioner;
};

export default function AdminAppointmentIndex() {
    const { appointments } = usePage<SharedData & { appointments: Appointment[] }>().props;
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const statusOptions = [
        { value: 'all', label: 'All Appointments' },
        { value: 'proposed', label: 'Proposed' },
        { value: 'pending', label: 'Pending' },
        { value: 'booked', label: 'Booked' },
        { value: 'arrived', label: 'Arrived' },
        { value: 'fulfilled', label: 'Fulfilled' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'noshow', label: 'No Show' }
    ];

    const filteredAppointments = statusFilter === 'all' 
        ? appointments 
        : appointments.filter(appointment => appointment.status === statusFilter);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (time: string) => {
        if (!time) return 'N/A';
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
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
    };    const getPatientName = (appointment: Appointment) => {
        // Try the direct relationship first
        if (appointment.patient) {
            return `${appointment.patient.given_name} ${appointment.patient.family_name}`;
        }
        
        // Try the computed attribute
        if (appointment.patient_name) {
            return appointment.patient_name;
        }
        
        // Fallback to participant lookup
        const patientParticipant = appointment.participants?.find(p => p.actor_type === 'patient');
        if (patientParticipant?.patient) {
            return `${patientParticipant.patient.given_name} ${patientParticipant.patient.family_name}`;
        }
        
        return 'Unknown Patient';
    };

    const getPractitionerName = (appointment: Appointment) => {
        // Try the direct relationship first
        if (appointment.practitioner) {
            return `Dr. ${appointment.practitioner.given_name} ${appointment.practitioner.family_name}`;
        }
        
        // Try the computed attribute
        if (appointment.practitioner_name) {
            return appointment.practitioner_name;
        }
        
        // Fallback to participant lookup
        const practitionerParticipant = appointment.participants?.find(p => p.actor_type === 'practitioner');
        if (practitionerParticipant?.practitioner) {
            return `Dr. ${practitionerParticipant.practitioner.given_name} ${practitionerParticipant.practitioner.family_name}`;
        }
          // Fallback to schedule practitioner
        if (appointment.schedule?.practitioner) {
            return `Dr. ${appointment.schedule.practitioner.given_name} ${appointment.schedule.practitioner.family_name}`;
        }
        
        return 'Unknown Practitioner';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Appointments" />
            <div className="p-3 md:p-6">
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className='flex justify-between items-start'>
                            <div>
                                <CardTitle className="text-xl md:text-2xl">Appointments</CardTitle>
                                <CardDescription>Manage all patient appointments</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <select 
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <Link href={route('admin.appointment.schedules')}>
                                    <Button type="button" className="bg-green-700 hover:bg-green-800 cursor-pointer text-white">
                                        New Appointment
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full bg-card">                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Practitioner</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Schedule Time</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>                                <tbody className="bg-card divide-y divide-border">
                                    {filteredAppointments.map((appointment) => (
                                        <Link 
                                            key={appointment.id} 
                                            href={route('admin.appointment.show', appointment.id)}
                                            className="contents"
                                        >
                                            <tr className="hover:bg-accent transition-colors cursor-pointer">
                                                <td className="px-3 md:px-6 py-4">
                                                    <div className="text-sm font-medium text-foreground">
                                                        {getPatientName(appointment)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground sm:hidden">
                                                        {getPractitionerName(appointment)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground md:hidden">
                                                        {appointment.schedule?.day_of_week} • {formatTime(appointment.schedule?.start_time || '')}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                                                    <div className="text-sm text-foreground">{getPractitionerName(appointment)}</div>
                                                    <div className="text-sm text-muted-foreground">{appointment.schedule?.specialty || '-'}</div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4">
                                                    <div className="text-sm text-foreground">{formatDate(appointment.appointment_date)}</div>
                                                    <div className="text-xs text-muted-foreground lg:hidden">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(appointment.status)}`}>
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                                                    <div className="text-sm text-foreground">{appointment.schedule?.day_of_week || 'N/A'}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatTime(appointment.schedule?.start_time || '')} - {formatTime(appointment.schedule?.end_time || '')}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        </Link>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredAppointments.length === 0 && (
                            <div className="text-center py-12 bg-card">
                                <div className="text-muted-foreground mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    {statusFilter === 'all' ? 'No appointments found' : `No ${statusFilter} appointments found`}
                                </h3>
                                <p className="text-muted-foreground">
                                    {statusFilter === 'all' 
                                        ? 'Get started by creating your first appointment.' 
                                        : `Try selecting a different status filter or create a new appointment.`
                                    }
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
