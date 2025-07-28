import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, useForm, Link } from '@inertiajs/react';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, ArrowRight, ArrowLeft, CheckCircle, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import React from 'react';

/**
 * Appointment Booking Component
 * 
 * Simplified flow:
 * 1. Patient Details - Collect basic patient information
 * 2. Select Date - Choose appointment date and view available providers
 * 3. Choose Provider - Select from available service categories/specialties
 * 4. Review & Confirm - Review all details and confirm booking
 * 
 * Expected Props:
 * - schedules: Array of Schedule objects from the database
 *   - Each schedule represents a provider's availability for a specific day of the week
 *   - Time slots are handled directly through the schedule's start_time and end_time
 * 
 * Database Requirements:
 * - schedules table: id, practitioner_id, service_category, service_type, specialty, active, day_of_week, start_time, end_time
 * - appointments table: id, status, appointment_date, description, schedule_id
 * 
 * Form matches NewAppointmentController::store() method expectations.
 */

interface Schedule {
    id: number;
    practitioner_id: number;
    // practitioner_name?: string; // Optional - may come from relationship
    service_category: string;
    service_type: string;
    specialty: string;
    active: number; // 1 for active, 0 for inactive
    day_of_week: string;
    start_time: string;
    end_time: string;
}

interface BookAppointmentProps {
    schedules: Schedule[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function BookAppointment({ schedules = [], flash }: BookAppointmentProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [availableSchedulesForDate, setAvailableSchedulesForDate] = useState<Schedule[]>([]);

    // Utility functions
    const getDayOfWeek = (dateString: string): string => {
        const date = new Date(dateString);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        family_name: '',
        given_name: '',
        gender: '',
        birth_date: '',
        active: 1,
        email: '',
        phone: '',
        name: '',
        relationship: '',
        telecom: '',
        address: '',
        schedule_id: '',
        status: 'booked',
        description: '',
        appointment_date: '',
    });

    const steps = [
        { number: 1, title: 'Patient Details', icon: UserIcon },
        { number: 2, title: 'Select Date', icon: CalendarIcon },
        { number: 3, title: 'Choose Provider', icon: ClockIcon },
        { number: 4, title: 'Review & Confirm', icon: CheckCircle },
    ];

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(data.family_name && data.given_name && data.gender && data.email && data.phone);
            case 2:
                return !!(data.appointment_date);
            case 3:
                return !!(data.schedule_id);
            default:
                return true;
        }
    };

    const nextStep = () => {
        console.log('nextStep called, current step:', currentStep);
        if (validateStep(currentStep) && currentStep < 4) {
            console.log('Moving to step:', currentStep + 1);
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('Form submission triggered');
        console.log('Submitting to URL:', '/appointment/store');
        
        post('/appointment/store', {
            onSuccess: () => {
                console.log('Appointment created successfully');
                reset();
                setSelectedSchedule(null);
                setAvailableSchedulesForDate([]);
                setCurrentStep(1);
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
                setCurrentStep(1); // Go back to the first step on error
            },
        });
    };

    const handleScheduleChange = (scheduleId: string) => {
        setData('schedule_id', scheduleId);
        const schedule = availableSchedulesForDate.find(s => s.id.toString() === scheduleId);
        setSelectedSchedule(schedule || null);
    };

    const handleDateChange = (selectedDate: string) => {
        setData('appointment_date', selectedDate);
        // Get day of week for selected date
        const dayOfWeek = getDayOfWeek(selectedDate);
        // Filter schedules available on the selected day of week
        const availableSchedules = schedules.filter((schedule: Schedule) =>
            schedule.day_of_week === dayOfWeek && schedule.active
        );
        setAvailableSchedulesForDate(availableSchedules);
        // Reset schedule selection when date changes
        setData('schedule_id', '');
        setSelectedSchedule(null);
    }; return (
        <>
            <Head title="Book Appointment - Easy Appoint">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] p-3 sm:p-6 text-[#1e293b] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
                {/* Header */}
                {/* <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <Link href={route('home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EA</span>
                            </div>
                            <span className="font-semibold text-lg text-[#1e293b] dark:text-[#f1f5f9]">Easy Appoint</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('patient.user.login')}
                                className="inline-block rounded-full border border-[#e2e8f0] px-6 py-2 text-sm font-medium text-[#1e293b] bg-white shadow-sm hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all duration-200 dark:border-[#475569] dark:text-[#f1f5f9] dark:bg-[#334155] dark:hover:bg-[#475569]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('patient.user.create')}
                                className="inline-block rounded-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] px-6 py-2 text-sm font-medium text-white shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-200"
                            >
                                Register
                            </Link>
                        </div>
                    </nav>
                </header> */}                {/* Main Content */}
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750">
                    <main className="w-full max-w-6xl">
                        <div className="rounded-lg bg-white/90 p-4 sm:p-8 lg:p-12 shadow-xl backdrop-blur-sm dark:bg-[#1e293b]/90 dark:shadow-[inset_0px_0px_0px_1px_#475569]">
                            {/* Page Header */}
                            <div className="text-center mb-6 sm:mb-8">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#3b82f6] dark:to-[#2563eb]">
                                    Book Your Appointment
                                </h1>
                                <p className="text-[#64748b] dark:text-[#cbd5e1] text-base sm:text-lg px-2">
                                    Complete the steps below to schedule your healthcare appointment
                                </p>
                            </div>                            {/* Step Indicator */}
                            <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
                                <div className="flex items-center space-x-2 sm:space-x-4 min-w-max px-2">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="flex items-center">
                                            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${currentStep >= step.number
                                                ? 'bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] border-[#3b82f6] text-white'
                                                : 'border-[#e2e8f0] text-[#64748b] dark:border-[#475569] dark:text-[#cbd5e1]'
                                                }`}>
                                                <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <div className="ml-1 sm:ml-2 hidden xs:block">
                                                <p className={`text-xs sm:text-sm font-medium ${currentStep >= step.number ? 'text-[#3b82f6] dark:text-[#60a5fa]' : 'text-[#64748b] dark:text-[#cbd5e1]'
                                                    }`}>
                                                    Step {step.number}
                                                </p>
                                                <p className={`text-xs ${currentStep >= step.number ? 'text-[#3b82f6] dark:text-[#60a5fa]' : 'text-[#64748b] dark:text-[#cbd5e1]'
                                                    }`}>
                                                    {step.title}
                                                </p>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`w-6 sm:w-12 h-0.5 ml-2 sm:ml-4 ${currentStep > step.number ? 'bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8]' : 'bg-[#e2e8f0] dark:bg-[#475569]'
                                                    }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flash Messages */}
                            {flash?.success && (
                                <div className="bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border border-[#10b981]/20 text-[#047857] px-4 py-3 rounded-lg mb-6 dark:from-[#10b981]/20 dark:to-[#059669]/20 dark:border-[#10b981]/30 dark:text-[#34d399]">
                                    {flash.success}
                                </div>
                            )}

                            {flash?.error && (
                                <div className="bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444]/20 text-[#dc2626] px-4 py-3 rounded-lg mb-6 dark:from-[#ef4444]/20 dark:to-[#dc2626]/20 dark:border-[#ef4444]/30 dark:text-[#f87171]">
                                    {flash.error}
                                </div>
                            )}

                            {/* Form Content */}
                            <Card className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155]/50">
                                <CardHeader className="border-b border-[#e2e8f0] dark:border-[#475569]">
                                    <CardTitle className="flex items-center gap-2 text-[#1e293b] dark:text-[#f1f5f9]">
                                        {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-[#3b82f6] dark:text-[#60a5fa]" })}
                                        {steps[currentStep - 1].title}
                                    </CardTitle>
                                    <CardDescription className="text-[#64748b] dark:text-[#cbd5e1]">
                                        Step {currentStep} of {steps.length}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-6">
                                    <div>
                                        {/* Step 1: Patient Details */}
                                        {currentStep === 1 && (
                                            <div className="space-y-4 sm:space-y-6">                                        
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="given_name" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">First Name *</Label>
                                                    <Input
                                                        id="given_name"
                                                        type="text"
                                                        value={data.given_name}
                                                        onChange={(e) => setData('given_name', e.target.value)}
                                                        className={`border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6] ${errors.given_name ? 'border-red-500' : ''}`}
                                                        placeholder="John"
                                                    />
                                                    {errors.given_name && (
                                                        <p className="text-sm text-red-600">{errors.given_name}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="family_name" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Last Name *</Label>
                                                    <Input
                                                        id="family_name"
                                                        type="text"
                                                        value={data.family_name}
                                                        onChange={(e) => setData('family_name', e.target.value)}
                                                        className={`border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6] ${errors.family_name ? 'border-red-500' : ''}`}
                                                        placeholder="Doe"
                                                    />
                                                    {errors.family_name && (
                                                        <p className="text-sm text-red-600">{errors.family_name}</p>
                                                    )}
                                                </div>                                            </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="gender" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Gender *</Label>
                                                        <Select onValueChange={(value) => setData('gender', value)} value={data.gender}>
                                                            <SelectTrigger className={`border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6] ${errors.gender ? 'border-red-500' : ''}`}>
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                            <SelectContent className="dark:bg-[#334155] dark:border-[#475569]">
                                                                <SelectItem value="male" className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">Male</SelectItem>
                                                                <SelectItem value="female" className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">Female</SelectItem>
                                                                <SelectItem value="other" className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">Other</SelectItem>
                                                                <SelectItem value="unknown" className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">Prefer not to say</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.gender && (
                                                            <p className="text-sm text-red-600">{errors.gender}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="birth_date" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Date of Birth</Label>
                                                        <Input
                                                            id="birth_date"
                                                            type="date"
                                                            value={data.birth_date}
                                                            onChange={(e) => setData('birth_date', e.target.value)}
                                                            className={`border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6] ${errors.birth_date ? 'border-red-500' : ''}`}
                                                        />
                                                        {errors.birth_date && (
                                                            <p className="text-sm text-red-600">{errors.birth_date}</p>
                                                        )}
                                                    </div>
                                                </div>                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="flex items-center gap-2 text-[#1e293b] dark:text-[#f1f5f9] font-medium">
                                                            <MailIcon className="h-4 w-4 text-[#3b82f6] dark:text-[#60a5fa]" />
                                                            Email Address *
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData('email', e.target.value)}
                                                            className={`border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6] ${errors.email ? 'border-red-500' : ''}`}
                                                            placeholder="john.doe@example.com"
                                                        />
                                                        {errors.email && (
                                                            <p className="text-sm text-red-600">{errors.email}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone" className="flex items-center gap-2 text-[#1e293b] dark:text-[#f1f5f9] font-medium">
                                                            <PhoneIcon className="h-4 w-4 text-[#3b82f6] dark:text-[#60a5fa]" />
                                                            Phone Number *
                                                        </Label>
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            value={data.phone}
                                                            onChange={(e) => setData('phone', e.target.value)}
                                                            className={`border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6] ${errors.phone ? 'border-red-500' : ''}`}
                                                            placeholder="+1 (555) 123-4567"
                                                        />
                                                        {errors.phone && (
                                                            <p className="text-sm text-red-600">{errors.phone}</p>
                                                        )}
                                                    </div>
                                                </div>                                                {/* Emergency Contact - Optional */}
                                                <div className="border-t border-[#e2e8f0] dark:border-[#475569] pt-4 sm:pt-6">
                                                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 flex items-center gap-2 text-[#1e293b] dark:text-[#f1f5f9]">
                                                        <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#3b82f6] dark:text-[#60a5fa]" />
                                                        Emergency Contact (Optional)
                                                    </h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="contact_name" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Contact Name</Label>
                                                            <Input
                                                                id="contact_name"
                                                                type="text"
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                placeholder="Jane Doe"
                                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="relationship" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Relationship</Label>
                                                            <Input
                                                                id="relationship"
                                                                type="text"
                                                                value={data.relationship}
                                                                onChange={(e) => setData('relationship', e.target.value)}
                                                                placeholder="Spouse, Parent, etc."
                                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="contact_telecom" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Contact Phone</Label>
                                                            <Input
                                                                id="contact_telecom"
                                                                type="tel"
                                                                value={data.telecom}
                                                                onChange={(e) => setData('telecom', e.target.value)}
                                                                placeholder="+1 (555) 987-6543"
                                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="contact_address" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Address</Label>
                                                            <Input
                                                                id="contact_address"
                                                                type="text"
                                                                value={data.address}
                                                                onChange={(e) => setData('address', e.target.value)}
                                                                placeholder="123 Main St, City, State"
                                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>)}                                        {/* Step 2: Select Date */}
                                        {currentStep === 2 && (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="space-y-3 sm:space-y-4">
                                                    <h3 className="text-base sm:text-lg font-medium text-[#1e293b] dark:text-[#f1f5f9]">Select Your Preferred Date</h3>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="appointment_date" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Select Preferred Date *</Label>
                                                        <Input
                                                            id="appointment_date"
                                                            type="date"
                                                            value={data.appointment_date}
                                                            onChange={(e) => handleDateChange(e.target.value)}
                                                            className={`border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6] ${errors.appointment_date ? 'border-red-500' : ''}`}
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                        {errors.appointment_date && (
                                                            <p className="text-sm text-red-600">{errors.appointment_date}</p>
                                                        )}
                                                    </div>                                                    {data.appointment_date && (
                                                        <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-gradient-to-r from-[#3b82f6]/10 to-[#1d4ed8]/10 dark:from-[#3b82f6]/20 dark:to-[#1d4ed8]/20 rounded-lg border border-[#3b82f6]/20 dark:border-[#3b82f6]/30">
                                                            <h4 className="font-medium text-sm sm:text-base text-[#1e293b] dark:text-[#f1f5f9]">Available Providers for {new Date(data.appointment_date).toLocaleDateString()} ({getDayOfWeek(data.appointment_date)})</h4>
                                                            <div className="text-xs sm:text-sm text-[#64748b] dark:text-[#cbd5e1]">
                                                                {availableSchedulesForDate.length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        <p><strong>Providers available:</strong> {availableSchedulesForDate.length}</p>
                                                                        <ul className="list-disc list-inside space-y-1">
                                                                            {availableSchedulesForDate.map((schedule) => (
                                                                                <li key={schedule.id}>
                                                                                    {schedule.service_category} - {schedule.specialty} ({schedule.start_time} - {schedule.end_time})
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-amber-600 dark:text-amber-400">No providers available on {getDayOfWeek(data.appointment_date)}s. Please select a different date.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* Step 3: Choose Provider */}
                                        {currentStep === 3 && (
                                            <div className="space-y-4 sm:space-y-6">
                                                {data.appointment_date && availableSchedulesForDate.length > 0 ? (<div className="space-y-3 sm:space-y-4">
                                                    <h3 className="text-base sm:text-lg font-medium text-[#1e293b] dark:text-[#f1f5f9]">Choose Your Healthcare Provider</h3>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="schedule_id" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Select Healthcare Provider *</Label>
                                                        <Select onValueChange={handleScheduleChange} value={data.schedule_id}>
                                                            <SelectTrigger className={`border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6] ${errors.schedule_id ? 'border-red-500' : ''}`}>
                                                                <SelectValue placeholder="Choose a healthcare provider" />
                                                            </SelectTrigger>
                                                            <SelectContent className="dark:bg-[#334155] dark:border-[#475569]">
                                                                {availableSchedulesForDate.map((schedule) => (
                                                                    <SelectItem key={schedule.id} value={schedule.id.toString()} className="dark:text-[#f1f5f9] dark:hover:bg-[#475569]">
                                                                        <div className=" " >
                                                                            <div className="font-medium">{schedule.service_category}</div>
                                                                            <div className="font-medium"> [{schedule.specialty}] ({schedule.start_time} - {schedule.end_time})</div>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.schedule_id && (
                                                            <p className="text-sm text-red-600">{errors.schedule_id}</p>
                                                        )}
                                                    </div>{/* {selectedSchedule && (
                                                    <div className="space-y-3 p-4 bg-[#f8fafc] dark:bg-[#334155] rounded-lg">
                                                        <h4 className="font-medium text-[#1e293b] dark:text-[#f1f5f9]">Selected Provider Details</h4>
                                                        <div className="text-sm text-[#64748b] dark:text-[#cbd5e1] space-y-1">
                                                            <p><strong>Category:</strong> {selectedSchedule.service_category}</p>
                                                            <p><strong>Specialty:</strong> {selectedSchedule.specialty}</p>
                                                            <p><strong>Date:</strong> {new Date(data.appointment_date).toLocaleDateString()}</p>
                                                            <p><strong>Available Hours:</strong> {selectedSchedule.start_time} - {selectedSchedule.end_time}</p>
                                                        </div>
                                                    </div>
                                                )} */}

                                                    {/* Appointment Reason */}
                                                    <div className="space-y-3 sm:space-y-4 border-t border-[#e2e8f0] dark:border-[#475569] pt-4 sm:pt-6">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="description" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Reason for Visit (optional)</Label>
                                                            <textarea
                                                                id="description"
                                                                value={data.description}
                                                                onChange={(e) => setData('description', e.target.value)}
                                                                className={`w-full min-h-[80px] sm:min-h-[100px] px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] ${errors.description ? 'border-red-500' : ''}`}
                                                                placeholder="Please describe your symptoms or the reason for your visit..."
                                                            />
                                                            {errors.description && (
                                                                <p className="text-sm text-red-600">{errors.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                ) : (<div className="text-center py-8">
                                                    <div className="text-[#64748b] dark:text-[#cbd5e1]">
                                                        <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                                                        <p>Please go back and select a date first.</p>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                        )}
                                        {/* Step 4: Review & Confirm */}
                                        {currentStep === 4 && (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="bg-[#f8fafc] dark:bg-[#334155] text-[#1e293b] dark:text-[#f1f5f9] p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4 border border-[#e2e8f0] dark:border-[#475569]">
                                                    <h3 className="text-base sm:text-lg font-medium">Review Your Appointment</h3>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                                        <div>
                                                            <h4 className="font-medium mb-2 text-[#1e293b] dark:text-[#f1f5f9]">Patient Information</h4>
                                                            <div className="text-sm space-y-1 text-[#64748b] dark:text-[#cbd5e1]">
                                                                <p><strong>Name:</strong> {data.given_name} {data.family_name}</p>
                                                                <p><strong>Gender:</strong> {data.gender}</p>
                                                                <p><strong>Email:</strong> {data.email}</p>
                                                                <p><strong>Phone:</strong> {data.phone}</p>
                                                                {data.birth_date && <p><strong>Date of Birth:</strong> {data.birth_date}</p>}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="font-medium mb-2 text-[#1e293b] dark:text-[#f1f5f9]">Appointment Details</h4>
                                                            <div className="text-sm space-y-1 text-[#64748b] dark:text-[#cbd5e1]">
                                                                <p><strong>Category:</strong> {selectedSchedule?.service_category}</p>
                                                                <p><strong>Specialty:</strong> {selectedSchedule?.specialty}</p>
                                                                <p><strong>Date:</strong> {new Date(data.appointment_date).toLocaleDateString()}</p>
                                                                <p><strong>Available Hours:</strong> {selectedSchedule?.start_time} - {selectedSchedule?.end_time}</p>
                                                                <p><strong>Status:</strong> {data.status}</p>
                                                            </div>
                                                        </div>
                                                    </div>                                            {data.description && (
                                                        <div>
                                                            <h4 className="font-medium mb-2 text-[#1e293b] dark:text-[#f1f5f9]">Reason for Visit</h4>
                                                            <p className="text-sm text-[#64748b] dark:text-[#cbd5e1]">{data.description}</p>
                                                        </div>
                                                    )}

                                                    {data.name && (
                                                        <div>
                                                            <h4 className="font-medium mb-2 text-[#1e293b] dark:text-[#f1f5f9]">Emergency Contact</h4>
                                                            <div className="text-sm space-y-1 text-[#64748b] dark:text-[#cbd5e1]">
                                                                <p><strong>Name:</strong> {data.name}</p>
                                                                {data.relationship && <p><strong>Relationship:</strong> {data.relationship}</p>}
                                                                {data.telecom && <p><strong>Phone:</strong> {data.telecom}</p>}
                                                                {data.address && <p><strong>Address:</strong> {data.address}</p>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>                                        <div className="text-xs sm:text-sm text-[#64748b] dark:text-[#cbd5e1] p-3 sm:p-4 bg-gradient-to-r from-[#3b82f6]/10 to-[#1d4ed8]/10 dark:from-[#3b82f6]/20 dark:to-[#1d4ed8]/20 rounded-lg border border-[#3b82f6]/20 dark:border-[#3b82f6]/30">
                                                    <p><strong>Please note:</strong> By confirming this appointment, you agree to our terms and conditions. You will receive a confirmation email shortly after booking.</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Navigation Buttons */}
                                        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-[#e2e8f0] dark:border-[#475569]">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={prevStep}
                                                disabled={currentStep === 1}
                                                className="flex items-center justify-center gap-2 w-full sm:w-auto border-[#e2e8f0] text-[#1e293b] hover:bg-[#f8fafc] hover:border-[#cbd5e1] dark:border-[#475569] dark:text-[#f1f5f9] dark:bg-[#334155] dark:hover:bg-[#475569]"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                Previous
                                            </Button>
                                            {currentStep < 4 ? (
                                                <Button
                                                    type="button"
                                                    onClick={nextStep}
                                                    disabled={!validateStep(currentStep)}
                                                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-200"
                                                >
                                                    Next
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        console.log('Submit button clicked');
                                                        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
                                                        submit(fakeEvent);
                                                    }}
                                                    disabled={processing}
                                                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] transition-all duration-200 transform hover:scale-105 shadow-lg"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                                            Booking...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4" />
                                                            Book Appointment
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>                {/* Footer */}
                <footer className="mt-8 sm:mt-12 text-center max-w-4xl px-4">
                    <div className="border-t border-[#e2e8f0] dark:border-[#475569] pt-4 sm:pt-6">
                        <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#cbd5e1]">
                            Need help? Contact us at <a href="mailto:random@easyappoint.com" className="text-[#3b82f6] hover:text-[#2563eb] dark:text-[#60a5fa] dark:hover:text-[#3b82f6] transition-colors break-all">random@easyappoint.com</a> or call <a href="tel:+9779849123456" className="text-[#3b82f6] hover:text-[#2563eb] dark:text-[#60a5fa] dark:hover:text-[#3b82f6] transition-colors">+977 9849123456</a>
                        </p>
                        <p className="text-xs text-[#64748b] dark:text-[#cbd5e1] mt-2">
                            &copy; {new Date().getFullYear()} Easy Appoint Healthcare. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
