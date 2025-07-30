import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Schedules',
        href: '/user/practitioner/schedules',
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
    is_today?: boolean;
    status?: string;
};

export default function PractitionerScheduleIndex() {
    const { schedules, practitioner } = usePage<SharedData & { 
        schedules: Schedule[];
        practitioner: Practitioner;
    }>().props;

    const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDayName = (dayOfWeek: string) => {
        return dayOfWeek;
    };    const getStatusColor = (schedule: Schedule) => {
        if (schedule.is_today) {
            return 'bg-green-100 text-green-800 border-green-200';
        }
        return 'bg-gray-100 text-gray-600 border-gray-200';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Schedules" />
            <div className="p-3 md:p-6">
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div>                            <CardTitle className="text-xl md:text-2xl">
                                My Schedules
                            </CardTitle>                            <CardDescription>
                                View your practice schedules and their current status
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full bg-card">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Day & Time</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Service</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Specialty</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        {/* <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">                                    {schedules.map((schedule) => (
                                        <Link key={schedule.id} href={route('practitioner.schedule.show', { schedule_id: schedule.id })} className="contents">
                                            <tr className="hover:bg-accent transition-colors cursor-pointer">
                                            <td className="px-3 md:px-6 py-4">
                                                <div className="text-sm font-medium text-foreground">
                                                    {getDayName(schedule.day_of_week)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                </div>                                                <div className="text-xs text-muted-foreground sm:hidden">
                                                    {schedule.service_category || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                                                <div className="text-sm text-foreground">
                                                    {schedule.service_category || '-'}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {schedule.service_type || '-'}
                                                </div>
                                            </td>
                                            <td className="px-3 md:px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                    {schedule.specialty || 'General'}
                                                </span>                                            </td>
                                            <td className="px-3 md:px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(schedule)}`}>
                                                    {schedule.is_today ? 'Active Today' : 'Inactive'}
                                                </span>
                                            </td>                                            </tr>
                                        </Link>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {schedules.length === 0 && (
                            <div className="text-center py-12 bg-card">
                                <div className="text-muted-foreground mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">No schedules found</h3>
                                <p className="text-muted-foreground">
                                    Contact your administrator to set up your practice schedules.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}