import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { SharedData, BreadcrumbItem } from '@/types';
import { Head, usePage, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Practitioner Dashboard',
        href: '/dashboard/practitioner/manage'
    },
    {
        title: 'List Practitioners',
        href: '/practitioners'
    },
    {
        title: 'Schedules',
        href: '#'
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
};

type Schedule = {
    id: number;
    service_category?: string;
    service_type?: string;
    specialty?: string;
    active: boolean;
    day_of_week: string;
    start_time: string;
    end_time: string;
    practitioner_id: number;
};

export default function ShowSchedule() {
    const { schedule, practitioner } = usePage<SharedData & { schedule: Schedule; practitioner: Practitioner }>().props;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            router.delete(
                route('practitioner.schedule.destroy', {
                    practitioner: practitioner.id,
                    schedule: schedule.id,
                })
            );
        }
    };

        //breadcrumb
    breadcrumbs.map((breadcrumb, i) =>{
        i===2 && (breadcrumb.href = `/practitioner/${practitioner.id}/schedule`)     
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
                <Card className="w-full max-w-xl mt-6 bg-background shadow-lg border border-border">
                    <CardHeader>
                        <CardTitle className="text-2xl">Schedule Details</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Practitioner: <span className="font-semibold">{practitioner.given_name} {practitioner.family_name}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
                            <div>
                                <span className="font-semibold text-gray-700">Service Category:</span>
                                <span className="ml-2">{schedule.service_category || '-'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Service Type:</span>
                                <span className="ml-2">{schedule.service_type || '-'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Specialty:</span>
                                <span className="ml-2">{schedule.specialty || '-'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Day of Week:</span>
                                <span className="ml-2">{schedule.day_of_week}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Start Time:</span>
                                <span className="ml-2">{schedule.start_time}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">End Time:</span>
                                <span className="ml-2">{schedule.end_time}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Active:</span>
                                <span className={`ml-2 font-bold ${schedule.active ? 'text-green-600' : 'text-red-600'}`}>
                                    {schedule.active ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8 justify-end">
                            <Link
                                href={route('practitioner.schedule.edit', {
                                    practitioner: practitioner.id,
                                    schedule: schedule.id,
                                })}
                            >
                                <Button 
                                type="button" 
                                variant={'default'}
                                className='cursor-pointer'
                                >
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                type="button"
                                className="bg-destructive hover:bg-destructive-foreground cursor-pointer text-white"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}