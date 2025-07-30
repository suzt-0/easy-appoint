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
        title: 'My Appointments',
        href: '/user/patient/appointments'
    },
    {
        title: 'Book Appointment',
        href: '/user/patient/appointment/select-schedule'
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

export default function PatientSelectSchedule() {
    const { schedules } = usePage<SharedData & { 
        schedules: Schedule[]; 
    }>().props;
      const [dayFilter, setDayFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const daysOfWeek = [
        { value: 'all', label: 'All Days' },
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' }
    ];

    const filteredSchedules = schedules.filter(schedule => {
        const matchesDay = dayFilter === 'all' || schedule.day_of_week.toLowerCase() === dayFilter;
        
        // Filter by practitioner name if search term is provided
        const matchesSearch = searchTerm === '' || 
            (schedule.practitioner && 
             `${schedule.practitioner.given_name} ${schedule.practitioner.family_name}`
             .toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesDay && matchesSearch && schedule.active;
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

    return (        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Appointment - Select Schedule" />
            <div className="p-3 md:p-6">
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className='flex justify-between items-start'>                            <div>
                                <CardTitle className="text-xl md:text-2xl">Book New Appointment</CardTitle>
                                <CardDescription>Choose a schedule to book your appointment. Click on any schedule row to proceed.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('patient.appointment.index')}>
                                    <Button variant="outline" type="button" className="cursor-pointer">
                                        Back to My Appointments
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="flex-1">
                                <label htmlFor="day-filter" className="block text-sm font-medium text-foreground mb-2">
                                    Filter by Day
                                </label>
                                <select 
                                    id="day-filter"
                                    value={dayFilter} 
                                    onChange={(e) => setDayFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {daysOfWeek.map(day => (
                                        <option key={day.value} value={day.value}>
                                            {day.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex-1">
                                <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
                                    Search Practitioner
                                </label>
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Search by practitioner name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full bg-card">
                                <thead className="bg-muted">
                                    <tr>                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Practitioner</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Day</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Specialty</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Service Type</th>
                                        <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">                                    {filteredSchedules.map((schedule) => (
                                        <Link 
                                            key={schedule.id} 
                                            href={route('patient.appointment.create', { schedule_id: schedule.id })}
                                            className="contents"
                                        >                                            <tr className="hover:bg-accent transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
                                                <td className="px-3 md:px-6 py-4">
                                                    <div className="text-sm font-medium text-foreground">
                                                        {getPractitionerName(schedule)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground sm:hidden">
                                                        {schedule.specialty || 'General'}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4">
                                                    <div className="text-sm text-foreground">
                                                        {capitalizeDay(schedule.day_of_week)}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4">
                                                    <div className="text-sm text-foreground">
                                                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground md:hidden">
                                                        {schedule.service_type || 'Consultation'}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                                                    <div className="text-sm text-foreground">
                                                        {schedule.specialty || 'General'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {schedule.service_category || '-'}
                                                    </div>
                                                </td>                                                <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                                                    <div className="text-sm text-foreground">
                                                        {schedule.service_type || 'Consultation'}
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-4 text-center">
                                                    <Button size="sm" variant="outline" className="text-xs">
                                                        Select
                                                    </Button>
                                                </td>
                                            </tr>
                                        </Link>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredSchedules.length === 0 && (
                            <div className="text-center py-12 bg-card">
                                <div className="text-muted-foreground mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    No schedules found
                                </h3>
                                <p className="text-muted-foreground">
                                    {dayFilter !== 'all' || searchTerm !== '' 
                                        ? 'Try adjusting your filters to see more schedules.' 
                                        : 'No schedules are currently available.'
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
