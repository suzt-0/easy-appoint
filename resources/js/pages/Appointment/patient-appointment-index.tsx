import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, Clock, Filter, Search, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Appointments',
        href: '/patient/appointments',
    },
];

interface AppointmentParticipant {
    id: number;
    appointment_id: number;
    actor_type: 'patient' | 'practitioner';
    actor_id: number;
    status: string;
    created_at: string;
    updated_at: string;
    patient: any;
    practitioner: any;
}

interface Appointment {
    id: number;
    status: string;
    appointment_date: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    schedule_id: number;
    participants: AppointmentParticipant[];
}

interface PageProps {
    appointments: Appointment[];
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

const isUpcoming = (dateString: string) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
};

const isPast = (dateString: string) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate < today;
};

export default function PatientAppointmentIndex() {
    const { appointments } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const filteredAppointments = useMemo(() => {
        return appointments.filter((appointment) => {            // Search filter
            const searchMatch = searchTerm === '' || 
                appointment.status.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;

            // Date filter
            let dateMatch = true;
            if (dateFilter === 'upcoming') {
                dateMatch = isUpcoming(appointment.appointment_date);
            } else if (dateFilter === 'past') {
                dateMatch = isPast(appointment.appointment_date);
            } else if (dateFilter === 'today') {
                const today = new Date().toISOString().split('T')[0];
                dateMatch = appointment.appointment_date === today;
            }

            return searchMatch && statusMatch && dateMatch;
        });
    }, [appointments, searchTerm, statusFilter, dateFilter]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDateFilter('all');
    };

    const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || dateFilter !== 'all';

    const getPractitionerInfo = (appointment: Appointment) => {
        const practitioner = appointment.participants.find(p => p.actor_type === 'practitioner');
        return practitioner;
    };

    const getPatientStatus = (appointment: Appointment) => {
        const patient = appointment.participants.find(p => p.actor_type === 'patient');
        return patient?.status || 'unknown';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Appointments" />
            
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
                        <p className="text-muted-foreground">
                            View and manage your upcoming and past appointments
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="hidden md:inline-flex">
                            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2"
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filters</span>
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className={`transition-all duration-200 ${showFilters ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Appointments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Search */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />                                    <Input
                                        placeholder="Search by status..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="booked">Booked</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date Range</label>
                                <Select value={dateFilter} onValueChange={setDateFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Dates</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="past">Past</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <div className="flex items-center justify-between pt-4 border-t">
                                <span className="text-sm text-muted-foreground">
                                    {filteredAppointments.length} of {appointments.length} appointments shown
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="flex items-center space-x-2"
                                >
                                    <X className="h-4 w-4" />
                                    <span>Clear Filters</span>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Appointments Grid */}
                {filteredAppointments.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent className="space-y-4">
                            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                                <h3 className="text-lg font-semibold">No appointments found</h3>
                                <p className="text-muted-foreground">
                                    {hasActiveFilters 
                                        ? "Try adjusting your filters to see more appointments."
                                        : "You don't have any appointments scheduled yet."
                                    }
                                </p>
                            </div>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAppointments.map((appointment) => {
                            const practitionerInfo = getPractitionerInfo(appointment);
                            const patientStatus = getPatientStatus(appointment);
                            const isAppointmentUpcoming = isUpcoming(appointment.appointment_date);

                            return (
                                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">
                                                    My Appointment
                                                </CardTitle>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={getStatusColor(appointment.status)}>
                                                        {appointment.status}
                                                    </Badge>
                                                    <Badge 
                                                        variant="outline" 
                                                        className={getParticipantStatusColor(patientStatus)}
                                                    >
                                                        {patientStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {isAppointmentUpcoming && (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                    Upcoming
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Date and Time */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {formatDate(appointment.appointment_date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{formatTime(appointment.appointment_date)}</span>
                                            </div>
                                        </div>                                        {/* Practitioner Info */}
                                        {practitionerInfo && (
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span>Healthcare Provider</span>
                                                </div>
                                                <Badge 
                                                    variant="outline"
                                                    className={getParticipantStatusColor(practitionerInfo.status)}
                                                >
                                                    Provider: {practitionerInfo.status}
                                                </Badge>
                                            </div>                                        )}                                        {/* Action Buttons */}
                                        <div className="flex space-x-2 pt-2">
                                            <Link 
                                                href={`/patient/appointments/${appointment.id}`}
                                                className="flex-1"
                                            >
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="w-full"
                                                    disabled={!isAppointmentUpcoming || appointment.status === 'cancelled'}
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
