import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashbaoard',
    },
    {
        title: 'My Schedules',
        href: '/user/practitioner/schedules',
    },
    {
        title: 'Schedule Details',
        href: '#'
    },
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
    description?: string;
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
    appointments: Appointment[];
};

export default function PractitionerScheduleShow() {
    const { schedule, practitioner, isToday } = usePage<SharedData & { 
        schedule: Schedule;
        practitioner: Practitioner;
        isToday: boolean;
    }>().props;

    const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Details" />
            <div className="p-3 md:p-6 space-y-6">
                {/* Schedule Info Card */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">                            <div>
                                <CardTitle className="text-xl md:text-2xl">
                                    {schedule.day_of_week} Schedule
                                    {isToday && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            Today
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                </CardDescription>
                            </div>
                            <Link href={route('practitioner.schedule.index')}>
                                <Button variant="outline" className="text-sm">
                                    Back to Schedules
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Service Category</h3>
                                <p className="text-sm">{schedule.service_category || 'Not specified'}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Service Type</h3>
                                <p className="text-sm">{schedule.service_type || 'Not specified'}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Specialty</h3>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                    {schedule.specialty || 'General'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>                {/* Appointments Card */}
                <Card className="shadow-sm">                    <CardHeader>
                        <CardTitle className="text-lg">
                            {isToday ? "Today's Appointments" : `Appointments for ${schedule.day_of_week}`}
                        </CardTitle>
                        <CardDescription>
                            {isToday ? (
                                `${schedule.appointments.length} appointment${schedule.appointments.length !== 1 ? 's' : ''} scheduled for today (${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })})`
                            ) : (
                                `This schedule is for ${schedule.day_of_week}s. ${schedule.appointments.length} appointment${schedule.appointments.length !== 1 ? 's' : ''} shown.`
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {schedule.appointments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-full bg-card">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Patient ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-card divide-y divide-border">
                                        {schedule.appointments.map((appointment) => (
                                            <tr key={appointment.id} className="hover:bg-accent transition-colors">
                                                <td className="px-3 md:px-6 py-4">
                                                    <div className="text-sm font-medium text-foreground">
                                                        {formatDate(appointment.appointment_date)}
                                                    </div>
                                                </td>                                                <td className="px-3 md:px-6 py-4">
                                                    <div className="text-sm text-foreground">
                                                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                        appointment.status === 'confirmed' 
                                                            ? 'bg-green-100 text-green-800 border-green-200'
                                                            : appointment.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                            : 'bg-gray-100 text-gray-800 border-gray-200'
                                                    }`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                                                    <div className="text-sm text-muted-foreground">
                                                        #{appointment.patient_id}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card">
                                <div className="text-muted-foreground mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V9" />
                                    </svg>
                                </div>                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    {isToday ? "No appointments for today" : "No appointments scheduled"}
                                </h3>
                                <p className="text-muted-foreground">
                                    {isToday 
                                        ? "No appointments are scheduled for today in this time slot."
                                        : `No appointments are currently scheduled for ${schedule.day_of_week}s in this time slot.`
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
