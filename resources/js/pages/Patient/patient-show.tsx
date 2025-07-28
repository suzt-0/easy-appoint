import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { User, Phone, Mail, Calendar, ArrowLeft, Edit, Trash2, UserCheck, AlertCircle } from 'lucide-react';

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

export default function PatientShow() {
    const { patient } = usePage<SharedData & { patient: Patient }>().props;

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
            href: '/patients'
        },
        {
            title: `${patient.given_name} ${patient.family_name}`,
            href: '#'
        }
    ];

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
            month: 'long',
            day: 'numeric'
        });
    };

    const getPatientEmail = () => {
        return patient.telecoms?.find(t => t.system === 'email')?.value || 'No email';
    };

    const getPatientPhone = () => {
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
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Patient Details - ${patient.given_name} ${patient.family_name}`} />
            
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Button variant="outline" asChild>
                                    <Link href="/patients">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Patients
                                    </Link>
                                </Button>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {patient.given_name} {patient.family_name}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Patient ID: {patient.id}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={`/patient/${patient.id}/edit`}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={`/appointment/select-schedule?patient_id=${patient.id}`}>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Book Appointment
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Patient Status Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                                            {patient.active ? (
                                                <UserCheck className="w-8 h-8 text-white" />
                                            ) : (
                                                <User className="w-8 h-8 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Patient Status
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Account created on {formatDate(patient.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge 
                                        variant={patient.active ? "default" : "secondary"}
                                        className={
                                            patient.active 
                                                ? 'bg-green-100 text-green-800 border-green-300 text-lg px-4 py-2' 
                                                : 'bg-red-100 text-red-800 border-red-300 text-lg px-4 py-2'
                                        }
                                    >
                                        {patient.active ? 'Active Patient' : 'Inactive Patient'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Personal details and identification information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Full Name
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {patient.given_name} {patient.family_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Gender
                                        </label>
                                        <div className="mt-1">
                                            <Badge 
                                                variant="outline" 
                                                className={getGenderBadgeColor(patient.gender)}
                                            >
                                                {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Date of Birth
                                        </label>
                                        <p className="text-lg text-gray-900 dark:text-gray-100">
                                            {patient.birth_date ? formatDate(patient.birth_date) : 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Age
                                        </label>
                                        <p className="text-lg text-gray-900 dark:text-gray-100">
                                            {getAge(patient.birth_date)} years old
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription>
                                    Primary contact details for the patient
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Email Address
                                            </label>
                                            <p className="text-lg text-gray-900 dark:text-gray-100">
                                                {getPatientEmail()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Phone Number
                                            </label>
                                            <p className="text-lg text-gray-900 dark:text-gray-100">
                                                {getPatientPhone()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emergency Contact Card */}
                        {patient.contacts && patient.contacts.length > 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Emergency Contact
                                    </CardTitle>
                                    <CardDescription>
                                        Emergency contact information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {patient.contacts.map((contact, index) => (
                                        <div key={contact.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Contact Name
                                                    </label>
                                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                                        {contact.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Relationship
                                                    </label>
                                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                                        {contact.relationship || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Phone Number
                                                    </label>
                                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                                        {contact.telecom || 'Not provided'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Address
                                                    </label>
                                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                                        {contact.address || 'Not provided'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Emergency Contact
                                    </CardTitle>
                                    <CardDescription>
                                        No emergency contact information provided
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            No emergency contact has been added for this patient.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Record Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Record Information
                                </CardTitle>
                                <CardDescription>
                                    Patient record creation and update history
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Record Created
                                        </label>
                                        <p className="text-lg text-gray-900 dark:text-gray-100">
                                            {formatDate(patient.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Last Updated
                                        </label>
                                        <p className="text-lg text-gray-900 dark:text-gray-100">
                                            {patient.updated_at !== patient.created_at 
                                                ? formatDate(patient.updated_at)
                                                : 'Never updated'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
