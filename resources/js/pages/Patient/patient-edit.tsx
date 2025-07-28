import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { User, Phone, Mail, Calendar, Save, AlertCircle, ArrowLeft } from 'lucide-react';

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

type PatientFormData = {
    // Patient basic information
    family_name: string;
    given_name: string;
    gender: 'male' | 'female' | 'other' | 'unknown' | '';
    birth_date: string;
    active: boolean;
    
    // Contact information
    email: string;
    phone: string;
    
    // Emergency contact (optional)
    emergency_name: string;
    emergency_relationship: string;
    emergency_telecom: string;
    emergency_address: string;
};

export default function PatientEdit() {
    const { patient } = usePage<SharedData & { patient: Patient }>().props;
    
    const [showEmergencyContact, setShowEmergencyContact] = useState(
        !!(patient.contacts && patient.contacts.length > 0)
    );

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
            title: `Edit ${patient.given_name} ${patient.family_name}`,
            href: '#'
        }
    ];

    // Get patient data for form initialization
    const getPatientEmail = () => {
        return patient.telecoms?.find(t => t.system === 'email')?.value || '';
    };

    const getPatientPhone = () => {
        return patient.telecoms?.find(t => t.system === 'phone')?.value || '';
    };

    const getEmergencyContact = () => {
        const contact = patient.contacts?.[0];
        return {
            name: contact?.name || '',
            relationship: contact?.relationship || '',
            telecom: contact?.telecom || '',
            address: contact?.address || ''
        };
    };

    const emergencyContact = getEmergencyContact();

    const { data, setData, put, processing, errors, reset } = useForm<PatientFormData>({
        family_name: patient.family_name,
        given_name: patient.given_name,
        gender: patient.gender,
        birth_date: patient.birth_date || '',
        active: patient.active,
        email: getPatientEmail(),
        phone: getPatientPhone(),
        emergency_name: emergencyContact.name,
        emergency_relationship: emergencyContact.relationship,
        emergency_telecom: emergencyContact.telecom,
        emergency_address: emergencyContact.address,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/patient/${patient.id}/update`, {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
        });
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
            <Head title={`Edit Patient - ${patient.given_name} ${patient.family_name}`} />
            
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Edit Patient
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Update {patient.given_name} {patient.family_name}'s information
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                Patient ID: {patient.id} • Created: {formatDate(patient.created_at)}
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="flex justify-start">
                            <Button variant="outline" asChild>
                                <a href={`/patient/${patient.id}`}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Patient Details
                                </a>
                            </Button>
                        </div>

                        {/* Patient Edit Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        {/* Given Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="given_name">
                                                First Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="given_name"
                                                type="text"
                                                value={data.given_name}
                                                onChange={(e) => setData('given_name', e.target.value)}
                                                placeholder="Enter first name"
                                                className={errors.given_name ? 'border-red-500' : ''}
                                            />
                                            {errors.given_name && (
                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.given_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Family Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="family_name">
                                                Last Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="family_name"
                                                type="text"
                                                value={data.family_name}
                                                onChange={(e) => setData('family_name', e.target.value)}
                                                placeholder="Enter last name"
                                                className={errors.family_name ? 'border-red-500' : ''}
                                            />
                                            {errors.family_name && (
                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.family_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Gender */}
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">
                                                Gender <span className="text-red-500">*</span>
                                            </Label>
                                            <Select 
                                                value={data.gender} 
                                                onValueChange={(value) => setData('gender', value as PatientFormData['gender'])}
                                            >
                                                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                    <SelectItem value="unknown">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.gender && (
                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.gender}
                                                </p>
                                            )}
                                        </div>

                                        {/* Birth Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="birth_date">
                                                Date of Birth
                                            </Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    id="birth_date"
                                                    type="date"
                                                    value={data.birth_date}
                                                    onChange={(e) => setData('birth_date', e.target.value)}
                                                    className={`pl-10 ${errors.birth_date ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.birth_date && (
                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.birth_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active Status */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="active"
                                            checked={data.active}
                                            onCheckedChange={(checked) => setData('active', checked as boolean)}
                                        />
                                        <Label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Patient is active
                                        </Label>
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
                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email Address <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="patient@example.com"
                                                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                Phone Number <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+1 (555) 123-4567"
                                                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Emergency Contact Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" />
                                            Emergency Contact
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowEmergencyContact(!showEmergencyContact)}
                                        >
                                            {showEmergencyContact ? 'Hide' : 'Add'} Emergency Contact
                                        </Button>
                                    </CardTitle>
                                    <CardDescription>
                                        Optional emergency contact information
                                    </CardDescription>
                                </CardHeader>
                                {showEmergencyContact && (
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Emergency Contact Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="emergency_name">Contact Name</Label>
                                                <Input
                                                    id="emergency_name"
                                                    type="text"
                                                    value={data.emergency_name}
                                                    onChange={(e) => setData('emergency_name', e.target.value)}
                                                    placeholder="Emergency contact name"
                                                />
                                            </div>

                                            {/* Emergency Contact Relationship */}
                                            <div className="space-y-2">
                                                <Label htmlFor="emergency_relationship">Relationship</Label>
                                                <Input
                                                    id="emergency_relationship"
                                                    type="text"
                                                    value={data.emergency_relationship}
                                                    onChange={(e) => setData('emergency_relationship', e.target.value)}
                                                    placeholder="e.g., Spouse, Parent, Sibling"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Emergency Contact Phone */}
                                            <div className="space-y-2">
                                                <Label htmlFor="emergency_telecom">Contact Phone</Label>
                                                <Input
                                                    id="emergency_telecom"
                                                    type="tel"
                                                    value={data.emergency_telecom}
                                                    onChange={(e) => setData('emergency_telecom', e.target.value)}
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                            </div>

                                            {/* Emergency Contact Address */}
                                            <div className="space-y-2">
                                                <Label htmlFor="emergency_address">Address</Label>
                                                <Input
                                                    id="emergency_address"
                                                    type="text"
                                                    value={data.emergency_address}
                                                    onChange={(e) => setData('emergency_address', e.target.value)}
                                                    placeholder="Contact address"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>

                            {/* Submit Actions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.history.back()}
                                            disabled={processing}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Updating Patient...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Update Patient
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
