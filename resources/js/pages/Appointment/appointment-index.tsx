import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

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
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [hidePastAppointments, setHidePastAppointments] = useState<boolean>(true);    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);const handleCancelAppointment = (appointmentId: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (confirm('Are you sure you want to cancel this appointment? The patient will be notified via email.')) {
            setCancellingId(appointmentId);
            
            router.put(route('admin.appointment.cancel', appointmentId), {
                cancellation_reason: 'Cancelled by administrator',
                cancelled_by: 'admin'
            }, {
                onSuccess: () => {
                    setCancellingId(null);
                },
                onError: () => {
                    setCancellingId(null);
                }
            });
        }
    };const canCancelAppointment = (appointment: Appointment) => {
        // Don't show cancel button if already cancelled or fulfilled
        if (appointment.status === 'cancelled' || appointment.status === 'fulfilled') {
            return false;
        }
        
        // Check if appointment is more than 24 hours away
        const appointmentDate = new Date(appointment.appointment_date);
        const now = new Date();
        const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        return hoursUntilAppointment >= 24;
    };

    // Optional: More flexible cancellation policy
    const canCancelAppointmentFlexible = (appointment: Appointment) => {
        // Don't show cancel button if already cancelled or fulfilled
        if (appointment.status === 'cancelled' || appointment.status === 'fulfilled') {
            return false;
        }
        
        // Allow cancellation for any future appointment (remove 24-hour restriction)
        const appointmentDate = new Date(appointment.appointment_date);
        const now = new Date();
        
        return appointmentDate.getTime() > now.getTime();
    };

    const statusOptions = [
        { value: 'all', label: 'All Appointments' },
        { value: 'proposed', label: 'Proposed' },
        { value: 'pending', label: 'Pending' },
        { value: 'booked', label: 'Booked' },
        { value: 'arrived', label: 'Arrived' },
        { value: 'fulfilled', label: 'Fulfilled' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'noshow', label: 'No Show' }
    ];    const filteredAppointments = statusFilter === 'all' 
        ? appointments 
        : appointments.filter(appointment => appointment.status === statusFilter);

    // Filter out past appointments if toggle is enabled
    const dateFilteredAppointments = hidePastAppointments 
        ? filteredAppointments.filter(appointment => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const appointmentDate = new Date(appointment.appointment_date);
            appointmentDate.setHours(0, 0, 0, 0);
            
            // Keep today's and future appointments only
            return appointmentDate.getTime() >= today.getTime();
        })
        : filteredAppointments;

    // Sort appointments: today's first (green), then future, then past (red)
    const sortedAppointments = [...dateFilteredAppointments].sort((a, b) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dateA = new Date(a.appointment_date);
        dateA.setHours(0, 0, 0, 0);
        
        const dateB = new Date(b.appointment_date);
        dateB.setHours(0, 0, 0, 0);
        
        const isAToday = dateA.getTime() === today.getTime();
        const isBToday = dateB.getTime() === today.getTime();
        
        // Both are today's appointments
        if (isAToday && isBToday) return 0;
        
        // A is today, B is not
        if (isAToday && !isBToday) return -1;
        
        // B is today, A is not
        if (!isAToday && isBToday) return 1;
        
        // Neither is today - sort by date (future first, then past)
        const isAFuture = dateA.getTime() > today.getTime();
        const isBFuture = dateB.getTime() > today.getTime();
        
        if (isAFuture && !isBFuture) return -1;
        if (!isAFuture && isBFuture) return 1;
          // Both future or both past - sort by date
        return dateA.getTime() - dateB.getTime();
    });

    // Pagination logic
    const totalItems = sortedAppointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAppointments = sortedAppointments.slice(startIndex, endIndex);

    // Reset to first page when filters change
    const resetPagination = () => {
        setCurrentPage(1);
    };    // Update pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [statusFilter, hidePastAppointments, itemsPerPage]);

    // Helper function to get row styling based on appointment date
    const getRowStyling = (appointment: Appointment) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const appointmentDate = new Date(appointment.appointment_date);
        appointmentDate.setHours(0, 0, 0, 0);
        
        if (appointmentDate.getTime() === today.getTime()) {
            // Today's appointments - green highlight
            return "hover:bg-green-50 bg-green-50/50 border-l-4 border-l-green-500 transition-colors";
        } else if (appointmentDate.getTime() < today.getTime()) {
            // Past appointments - red highlight
            return "hover:bg-red-50 bg-red-50/50 border-l-4 border-l-red-500 transition-colors";
        } else {
            // Future appointments - normal styling
            return "hover:bg-accent transition-colors";
        }
    };    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateWithIndicator = (dateString: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const appointmentDate = new Date(dateString);
        appointmentDate.setHours(0, 0, 0, 0);
        
        const formattedDate = formatDate(dateString);
        
        if (appointmentDate.getTime() === today.getTime()) {
            return { date: formattedDate, indicator: 'TODAY', indicatorClass: 'text-green-600 font-semibold' };
        } else if (appointmentDate.getTime() < today.getTime()) {
            return { date: formattedDate, indicator: 'PAST', indicatorClass: 'text-red-600 font-semibold' };
        } else {            return { date: formattedDate, indicator: null, indicatorClass: '' };
        }
    };    // Get appointment counts for display (always show total counts regardless of filter)
    const getAppointmentCounts = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let todayCount = 0;
        let upcomingCount = 0;
        let pastCount = 0;
        
        // Use filtered appointments (by status) but not date-filtered for counts
        filteredAppointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.appointment_date);
            appointmentDate.setHours(0, 0, 0, 0);
            
            if (appointmentDate.getTime() === today.getTime()) {
                todayCount++;
            } else if (appointmentDate.getTime() > today.getTime()) {
                upcomingCount++;
            } else {
                pastCount++;
            }
        });
        
        return { todayCount, upcomingCount, pastCount };
    };

    const { todayCount, upcomingCount, pastCount } = getAppointmentCounts();

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
                        <div className='flex justify-between items-start'>                            <div>
                                <CardTitle className="text-xl md:text-2xl">Appointments</CardTitle>
                                <CardDescription>Manage all patient appointments</CardDescription>                                {sortedAppointments.length > 0 && (
                                    <div className="flex gap-4 mt-2 text-sm">
                                        {todayCount > 0 && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                                                Today: {todayCount}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={hidePastAppointments}
                                            onChange={(e) => setHidePastAppointments(e.target.checked)}
                                            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                                        />
                                        <span>Hide past appointments</span>
                                    </label>
                                </div>
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
                                {/* Temporarily commented out to reduce header clutter */}
                                {/* <Link href={route('admin.appointment.schedules')}>
                                    <Button type="button" className="bg-green-700 hover:bg-green-800 cursor-pointer text-white">
                                        New Appointment
                                    </Button>
                                </Link> */}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">                            <table className="w-full min-w-full bg-card">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Practitioner</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Schedule Time</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>                                <tbody className="bg-card divide-y divide-border">
                                    {paginatedAppointments.map((appointment) => (
                                        <tr key={appointment.id} className={getRowStyling(appointment)}>
                                            <td className="px-3 md:px-6 py-4">
                                                <Link 
                                                    href={route('admin.appointment.show', appointment.id)}
                                                    className="block"
                                                >
                                                    <div className="text-sm font-medium text-foreground">
                                                        {getPatientName(appointment)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground sm:hidden">
                                                        {getPractitionerName(appointment)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground md:hidden">
                                                        {appointment.schedule?.day_of_week} • {formatTime(appointment.schedule?.start_time || '')}
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                                                <Link 
                                                    href={route('admin.appointment.show', appointment.id)}
                                                    className="block"
                                                >
                                                    <div className="text-sm text-foreground">{getPractitionerName(appointment)}</div>
                                                    <div className="text-sm text-muted-foreground">{appointment.schedule?.specialty || '-'}</div>
                                                </Link>
                                            </td>                                            <td className="px-3 md:px-6 py-4">
                                                <Link 
                                                    href={route('admin.appointment.show', appointment.id)}
                                                    className="block"
                                                >
                                                    <div className="text-sm text-foreground">
                                                        {formatDateWithIndicator(appointment.appointment_date).date}
                                                        {formatDateWithIndicator(appointment.appointment_date).indicator && (
                                                            <span className={`ml-2 text-xs ${formatDateWithIndicator(appointment.appointment_date).indicatorClass}`}>
                                                                {formatDateWithIndicator(appointment.appointment_date).indicator}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground lg:hidden">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(appointment.status)}`}>
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                                                <Link 
                                                    href={route('admin.appointment.show', appointment.id)}
                                                    className="block"
                                                >
                                                    <div className="text-sm text-foreground">{appointment.schedule?.day_of_week || 'N/A'}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatTime(appointment.schedule?.start_time || '')} - {formatTime(appointment.schedule?.end_time || '')}
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-3 md:px-6 py-4">
                                                <Link 
                                                    href={route('admin.appointment.show', appointment.id)}
                                                    className="block lg:hidden"
                                                >
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </Link>
                                                <div className="hidden lg:block">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                            </td>                                            <td className="px-3 md:px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link href={route('admin.appointment.show', appointment.id)}>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            className="text-xs"
                                                        >
                                                            View
                                                        </Button>
                                                    </Link>
                                                    {canCancelAppointment(appointment) && (
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm"
                                                            className="text-xs"
                                                            onClick={(e) => handleCancelAppointment(appointment.id, e)}
                                                            disabled={cancellingId === appointment.id}
                                                        >
                                                            {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>                            </table>                        </div>
                        
                        {/* Page Size Selector - Always visible */}
                        {sortedAppointments.length > 0 && (
                            <div className="px-4 py-3 bg-card border-t border-border">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-muted-foreground">Show:</label>
                                    <select 
                                        value={itemsPerPage} 
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        className="px-2 py-1 border border-border rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="text-sm text-muted-foreground">per page</span>
                                </div>
                            </div>
                        )}
                          
                        {/* Pagination Navigation - Only when multiple pages */}
                        {totalPages > 1 && (                            <div className="px-4 py-3 bg-card border-t border-border">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <span>
                                            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} appointments
                                        </span>
                                    </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="text-xs"
                                    >
                                        Previous
                                    </Button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(page => {
                                                // Show first page, last page, current page, and pages around current
                                                return page === 1 || 
                                                       page === totalPages || 
                                                       Math.abs(page - currentPage) <= 1;
                                            })
                                            .map((page, index, filteredPages) => {
                                                const prevPage = filteredPages[index - 1];
                                                const showEllipsis = prevPage && page - prevPage > 1;
                                                
                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsis && (
                                                            <span className="px-2 text-xs text-muted-foreground">...</span>
                                                        )}
                                                        <Button
                                                            variant={currentPage === page ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(page)}
                                                            className="text-xs w-8 h-8 p-0"
                                                        >
                                                            {page}
                                                        </Button>
                                                    </React.Fragment>
                                                );
                                            })
                                        }
                                    </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="text-xs"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                            </div>
                        )}
                        
                        {sortedAppointments.length === 0 && (
                            <div className="text-center py-12 bg-card">
                                <div className="text-muted-foreground mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    {statusFilter === 'all' 
                                        ? (hidePastAppointments ? 'No current or upcoming appointments found' : 'No appointments found')
                                        : (hidePastAppointments 
                                            ? `No current or upcoming ${statusFilter} appointments found` 
                                            : `No ${statusFilter} appointments found`)
                                    }
                                </h3>
                                <p className="text-muted-foreground">
                                    {statusFilter === 'all' 
                                        ? (hidePastAppointments 
                                            ? 'Get started by creating your first appointment or try showing past appointments.' 
                                            : 'Get started by creating your first appointment.')
                                        : (hidePastAppointments 
                                            ? `Try selecting a different status filter, showing past appointments, or create a new appointment.`
                                            : `Try selecting a different status filter or create a new appointment.`)
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
