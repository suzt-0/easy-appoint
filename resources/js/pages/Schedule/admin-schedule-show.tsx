import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedule Management',
        href: '/admin/schedule/manage',
    },
    {
        title: 'List Schedules',
        href: '/admin/schedules'
    },
    {
        title: 'Schedule Details',
        href: '#'
    }
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

export default function AdminScheduleShow() {
    const { schedule } = usePage<SharedData & { schedule: Schedule }>().props;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            router.delete(route('admin.schedule.destroy', schedule.id));
        }
    };

    const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };    const getDayName = (dayOfWeek: string) => {
        // Since day_of_week is now stored as the actual day name, return it directly
        return dayOfWeek;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
                <Card className="w-full max-w-4xl mt-6 bg-card shadow-lg border border-border">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-foreground">Schedule Details</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Practitioner: <span className="font-semibold text-foreground">
                                        Dr. {schedule.practitioner ? `${schedule.practitioner.given_name} ${schedule.practitioner.family_name}` : 'N/A'}
                                    </span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('admin.schedule.edit', schedule.id)}>
                                    <Button variant="secondary" size="sm">
                                        Edit 

                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Schedule Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Service Information
                                </h3>
                                <div>
                                    <span className="font-medium text-muted-foreground">Service Category:</span>
                                    <p className="text-foreground">{schedule.service_category || '-'}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Service Type:</span>
                                    <p className="text-foreground">{schedule.service_type || '-'}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Specialty:</span>
                                    <p className="text-foreground">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                            {schedule.specialty || '-'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Schedule Details
                                </h3>
                                <div>
                                    <span className="font-medium text-muted-foreground">Day of Week:</span>
                                    <p className="text-foreground font-medium">{getDayName(schedule.day_of_week)}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Time Slot:</span>
                                    <p className="text-foreground">
                                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Status:</span>
                                    <p>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            schedule.active 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-red-100 text-red-800 border border-red-200'
                                        }`}>
                                            {schedule.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    Additional Information
                                </h3>
                                <div>
                                    <span className="font-medium text-muted-foreground">Total Appointments:</span>
                                    <p className="text-foreground">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                                            {schedule.appointments.length} appointments
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Created:</span>
                                    <p className="text-foreground text-sm">{formatDate(schedule.created_at)}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Last Updated:</span>
                                    <p className="text-foreground text-sm">{formatDate(schedule.updated_at)}</p>
                                </div>
                            </div>
                        </div>

                        
                        {/* Action Buttons */}
                        {/* <div className="flex gap-4 mt-8 justify-end">
                            <Link href={route('admin.schedule.index')}>
                                <Button variant="outline">
                                    Back to Schedules
                                </Button>
                            </Link>
                        </div> */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
