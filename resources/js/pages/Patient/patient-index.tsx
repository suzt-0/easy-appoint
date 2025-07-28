import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, User, Phone, Mail, Calendar, Filter, Plus, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Patient Management',
        href: '/dashboard/patient/manage'
    },
    {
        title: 'All Patients',
        href: '#'
    }
];

type PatientContact = {
    id: number;
    patient_id: number;
    name: string;
    relationship: string;
    telecom?: string;
    address?: string;
};

type PatientTelecom = {
    id: number;
    patient_id: number;
    system: 'phone' | 'email' | 'fax' | 'pager' | 'url' | 'sms' | 'other';
    value: string;
    use?: string;
};

type Patient = {
    id: number;
    given_name: string;
    family_name: string;
    gender: 'male' | 'female' | 'other' | 'unknown';
    birth_date?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    contacts?: PatientContact[];
    telecoms?: PatientTelecom[];
};

export default function PatientIndex() {
    const { patients } = usePage<SharedData & { patients: Patient[] }>().props;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('active');
    const [sortBy, setSortBy] = useState<string>('created');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);    // Filter and sort patients based on current filters
    const filteredAndSortedPatients = useMemo(() => {
        let filtered = patients.filter(patient => {
            const matchesSearch = 
                patient.given_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${patient.given_name} ${patient.family_name}`.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' && patient.active) ||
                (statusFilter === 'inactive' && !patient.active);
            
            return matchesSearch && matchesGender && matchesStatus;
        });

        // Sort patients
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return `${a.family_name} ${a.given_name}`.localeCompare(`${b.family_name} ${b.given_name}`);
                case 'created':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'age':
                    if (!a.birth_date && !b.birth_date) return 0;
                    if (!a.birth_date) return 1;
                    if (!b.birth_date) return -1;
                    return new Date(a.birth_date).getTime() - new Date(b.birth_date).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    }, [patients, searchTerm, genderFilter, statusFilter, sortBy]);

    // Pagination calculations
    const totalItems = filteredAndSortedPatients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPatients = filteredAndSortedPatients.slice(startIndex, endIndex);

    // Reset to first page when filters change
    const resetToFirstPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    };

    // Update current page when filters change
    useMemo(() => {
        resetToFirstPage();
    }, [searchTerm, genderFilter, statusFilter, sortBy]);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToPrevPage = () => goToPage(currentPage - 1);
    const goToNextPage = () => goToPage(currentPage + 1);

    const getAge = (birthDate?: string) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPatientEmail = (patient: Patient) => {
        return patient.telecoms?.find(t => t.system === 'email')?.value || 'No email';
    };

    const getPatientPhone = (patient: Patient) => {
        return patient.telecoms?.find(t => t.system === 'phone')?.value || 'No phone';
    };

    const getGenderBadgeColor = (gender: string) => {
        switch (gender) {
            case 'male':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'female':
                return 'bg-pink-100 text-pink-800 border-pink-300';
            case 'other':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };    const clearFilters = () => {
        setSearchTerm('');
        setGenderFilter('all');
        setStatusFilter('all');
        setSortBy('name');
        setCurrentPage(1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Management - All Patients" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Patient Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Manage and view all patient records in the system
                                </p>
                            </div>
                            {/* <Button asChild>
                                <Link href="/dashboard/patient/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Patient
                                </Link>
                            </Button> */}
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Total Patients
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                                {patients.length}
                                            </p>
                                        </div>
                                        <User className="w-8 h-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Active Patients
                                            </p>
                                            <p className="text-3xl font-bold text-green-600">
                                                {patients.filter(p => p.active).length}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Inactive Patients
                                            </p>
                                            <p className="text-3xl font-bold text-red-600">
                                                {patients.filter(p => !p.active).length}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Filtered Results
                                            </p>                            <p className="text-3xl font-bold text-purple-600">
                                {filteredAndSortedPatients.length}
                                            </p>
                                        </div>
                                        <Filter className="w-8 h-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters and Search */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Search and Filter Patients
                                </CardTitle>
                                <CardDescription>
                                    Use the filters below to find specific patients
                                </CardDescription>
                            </CardHeader>                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                                    {/* Search */}
                                    <div className="lg:col-span-2">
                                        <Label htmlFor="search">Search Patients</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="search"
                                                type="text"
                                                placeholder="Search by name..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {/* Gender Filter */}
                                    <div>
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={genderFilter} onValueChange={setGenderFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Genders" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Genders</SelectItem>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                                <SelectItem value="unknown">Unknown</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sort By */}
                                    <div>
                                        <Label htmlFor="sort">Sort By</Label>
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sort by..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                                <SelectItem value="created">Recently Added</SelectItem>
                                                <SelectItem value="age">Age</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Items Per Page */}
                                    <div>
                                        <Label htmlFor="itemsPerPage">Per Page</Label>
                                        <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                                            setItemsPerPage(Number(value));
                                            setCurrentPage(1);
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Items per page" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5 per page</SelectItem>
                                                <SelectItem value="10">10 per page</SelectItem>
                                                <SelectItem value="25">25 per page</SelectItem>
                                                <SelectItem value="50">50 per page</SelectItem>
                                                <SelectItem value="100">100 per page</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                {/* Clear Filters Button */}
                                {(searchTerm || genderFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'name') && (
                                    <div className="mt-4">
                                        <Button variant="outline" onClick={clearFilters}>
                                            Clear All Filters
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>                        {/* Patient List */}
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <CardTitle>
                                            Patient Directory ({totalItems} patients)
                                        </CardTitle>
                                        <CardDescription>
                                            {totalItems > 0 ? (
                                                <>Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} patients</>
                                            ) : (
                                                'Complete list of all patients in the system'
                                            )}
                                        </CardDescription>
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredAndSortedPatients.length === 0 ? (
                                    <div className="text-center py-12">
                                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            No patients found
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {searchTerm || genderFilter !== 'all' || statusFilter !== 'all' 
                                                ? 'Try adjusting your search criteria or filters.'
                                                : 'Get started by adding your first patient.'
                                            }
                                        </p>
                                        {!searchTerm && genderFilter === 'all' && statusFilter === 'all' && (
                                            <Button asChild>
                                                <Link href="/dashboard/patient/create">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add First Patient
                                                </Link>
                                            </Button>
                                        )}
                                    </div>                                ) : (
                                    <div className="space-y-4">
                                        {paginatedPatients.map((patient) => (
                                            <div
                                                key={patient.id}
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                                    {/* Patient Info */}
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                {patient.given_name} {patient.family_name}
                                                            </h3>
                                                            <Badge 
                                                                variant="outline" 
                                                                className={getGenderBadgeColor(patient.gender)}
                                                            >
                                                                {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                                                            </Badge>
                                                            <Badge 
                                                                variant={patient.active ? "default" : "secondary"}
                                                                className={
                                                                    patient.active 
                                                                        ? 'bg-green-100 text-green-800 border-green-300' 
                                                                        : 'bg-red-100 text-red-800 border-red-300'
                                                                }
                                                            >
                                                                {patient.active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4" />
                                                                <span>ID: {patient.id}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>
                                                                    Age: {getAge(patient.birth_date)}
                                                                    {patient.birth_date && ` (${formatDate(patient.birth_date)})`}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4" />
                                                                <span className="truncate">{getPatientEmail(patient)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-4 h-4" />
                                                                <span>{getPatientPhone(patient)}</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-xs text-gray-500 dark:text-gray-500">
                                                            Added: {formatDate(patient.created_at)}
                                                            {patient.updated_at !== patient.created_at && (
                                                                <> • Updated: {formatDate(patient.updated_at)}</>
                                                            )}
                                                        </div>

                                                        {/* Emergency Contact */}
                                                        {patient.contacts && patient.contacts.length > 0 && (
                                                            <div className="text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Emergency Contact: </span>
                                                                <span className="text-gray-900 dark:text-gray-100">
                                                                    {patient.contacts[0].name} ({patient.contacts[0].relationship})
                                                                </span>
                                                                {patient.contacts[0].telecom && (
                                                                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                                                                        • {patient.contacts[0].telecom}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>                                                    {/* Actions */}
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/patient/${patient.id}`}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </Link>
                                                        </Button>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/appointment/select-schedule?patient_id=${patient.id}`}>
                                                                Book Appointment
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>                                        ))}
                                        
                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {/* First Page */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={goToFirstPage}
                                                        disabled={currentPage === 1}
                                                        className="hidden sm:flex"
                                                    >
                                                        <ChevronsLeft className="w-4 h-4" />
                                                    </Button>
                                                    
                                                    {/* Previous Page */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={goToPrevPage}
                                                        disabled={currentPage === 1}
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                        <span className="hidden sm:inline ml-1">Previous</span>
                                                    </Button>
                                                    
                                                    {/* Page Numbers */}
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                            let pageNumber;
                                                            if (totalPages <= 5) {
                                                                pageNumber = i + 1;
                                                            } else if (currentPage <= 3) {
                                                                pageNumber = i + 1;
                                                            } else if (currentPage >= totalPages - 2) {
                                                                pageNumber = totalPages - 4 + i;
                                                            } else {
                                                                pageNumber = currentPage - 2 + i;
                                                            }
                                                            
                                                            return (
                                                                <Button
                                                                    key={pageNumber}
                                                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => goToPage(pageNumber)}
                                                                    className="w-8 h-8 p-0"
                                                                >
                                                                    {pageNumber}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                    
                                                    {/* Next Page */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={goToNextPage}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        <span className="hidden sm:inline mr-1">Next</span>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                    
                                                    {/* Last Page */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={goToLastPage}
                                                        disabled={currentPage === totalPages}
                                                        className="hidden sm:flex"
                                                    >
                                                        <ChevronsRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
