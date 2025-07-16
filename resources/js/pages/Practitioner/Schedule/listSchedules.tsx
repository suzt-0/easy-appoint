import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
   {
        title: 'Practitioner Dashboard',
        href: '/dashboard/practitioner/manage'
    },
    { 
        title: 'List Practitioners', 
        href: '/admin/practitioners' 
    },
    { 
        title: 'Practitioner Details', 
        href: '/practitioner/id' //will be set below
    },
    { 
        title: 'Schedules', 
        href: '#' 
    },
];

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

type Practitioner = {
    id: number;
    given_name: string;
    family_name: string;
};

export default function ListSchedules() {
    const { schedules, practitioner } = usePage<SharedData & { schedules: Schedule[]; practitioner: Practitioner }>().props;
       //breadcrumb
    breadcrumbs.map((breadcrumb, i) =>{
        i===2 && (breadcrumb.href = `/practitioner/${practitioner.id}`)     
    })
    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title="Schedules" />
            <Card className="m-3">
                <CardHeader>
                    <CardTitle>Schedules for {practitioner.given_name} {practitioner.family_name}</CardTitle>
                    <CardDescription>List of all schedules for this practitioner</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Link href={route('practitioner.schedule.create', practitioner.id)}>
                            <Button type="button" className="bg-green-700 hover:bg-green-800 cursor-pointer text-white">
                                Add Schedule
                            </Button>
                        </Link>
                    </div>
                    {schedules.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">No schedules found.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Service Category</th>
                                    <th className="px-4 py-2 text-left">Service Type</th>
                                    <th className="px-4 py-2 text-left">Specialty</th>
                                    <th className="px-4 py-2 text-left">Day of Week</th>
                                    <th className="px-4 py-2 text-left">Start Time</th>
                                    <th className="px-4 py-2 text-left">End Time</th>
                                    <th className="px-4 py-2 text-left">Active</th>
                                    <th className="px-4 py-2 text-left">Show Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id} className="border-b">
                                        <td className="px-4 py-2">{schedule.service_category || '-'}</td>
                                        <td className="px-4 py-2">{schedule.service_type || '-'}</td>
                                        <td className="px-4 py-2">{schedule.specialty || '-'}</td>
                                        <td className="px-4 py-2">{schedule.day_of_week}</td>
                                        <td className="px-4 py-2">{schedule.start_time}</td>
                                        <td className="px-4 py-2">{schedule.end_time}</td>
                                        <td className="px-4 py-2">{schedule.active ? 'Yes' : 'No'}</td>
                                        <td className="px-4 py-2">
                                            <Link
                                                href={route('practitioner.schedule.show', { practitioner: practitioner.id, schedule: schedule.id })}
                                            >
                                                <Button type="button" className="bg-primary px-3 py-1 rounded cursor-pointer">
                                                    Show Details
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}