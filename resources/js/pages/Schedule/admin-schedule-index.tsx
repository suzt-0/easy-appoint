import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedule Management',
        href: '/admin/schedule/manage',
    },
    {
        title: 'List Schedules',
        href: '/admin/schedules'
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

export default function AdminScheduleIndex() {
    const { schedules } = usePage<SharedData & { schedules: Schedule[] }>().props;

    const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };    const getDayName = (dayOfWeek: string) => {
        // Since day_of_week is now stored as the actual day name, return it directly
        return dayOfWeek;
    };return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Schedules" />
            <div className="p-3 md:p-6">
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div
                        className='flex justify-between'
                        >
                        <div>
                            <CardTitle className="text-xl md:text-2xl">Schedules</CardTitle>
                            <CardDescription>Manage all practitioner schedules</CardDescription>
                        </div>
                        <div className="mb-4">
                            <Link href={route('admin.schedule.practitioners')}>
                                <Button type="button" className="bg-green-700 hover:bg-green-800 cursor-pointer text-white">
                                    Add Schedule
                                </Button>
                            </Link>
                        </div>

                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full bg-card">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Practitioner</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Service</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Specialty</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Schedule</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Appointments</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">
                                    {schedules.map((schedule) => (
                                        <Link key={schedule.id} href={route('admin.schedule.show', schedule.id)} className="contents">
                                            <tr className="hover:bg-accent transition-colors cursor-pointer rounded-md p-10">
                                                <td className="px-3 md:px-6 py-4">
                                                    <div className="text-sm font-medium text-foreground">
                                                        {schedule.practitioner ?
                                                            `Dr. ${schedule.practitioner.given_name} `
                                                            : 'N/A'
                                                        }
                                                    </div>                                                    <div className="text-xs text-muted-foreground md:hidden">
                                                        {schedule.service_category || 'N/A'} • {getDayName(schedule.day_of_week)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground lg:hidden">
                                                        {schedule.appointments.length} appointments
                                                    </div>
                                                </td>                                                <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                                                    <div className="text-sm text-foreground">{schedule.service_category || '-'}</div>
                                                    <div className="text-sm text-muted-foreground">{schedule.service_type || '-'}</div>
                                                </td>                                                <td className="px-3 md:px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                        {schedule.specialty || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                                                    <div className="text-sm text-foreground">{getDayName(schedule.day_of_week)}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4 hidden lg:table-cell">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                                                        {schedule.appointments.length} appointments
                                                    </span>
                                                </td>
                                            </tr>
                                        </Link>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {schedules.length === 0 && (
                            <div className="text-center py-12 bg-card">
                                <div className="text-muted-foreground mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">No schedules found</h3>
                                <p className="text-muted-foreground">Get started by creating your first schedule.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
