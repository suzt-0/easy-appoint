import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedule Management',
        href: '/admin/schedule/manage',
    },
    // {
    //     title: 'List Schedules',
    //     href: '/admin/schedules'
    // },
    {
        title: 'Select Practitioner',
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
    schedules_count?: number;
};

export default function AdminScheduleSelectPractitioner() {
    const { practitioners } = usePage<SharedData & { practitioners: Practitioner[] }>().props;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAgeFromBirthDate = (birthDate?: string) => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Select Practitioner - Add Schedule" />
            <div className="p-3 md:p-6">
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl md:text-2xl text-foreground">Select Practitioner</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Choose a practitioner to create a new schedule
                                </CardDescription>
                            </div>
                            <Link href={route('admin.schedule.index')}>
                                <Button variant="outline">
                                    Back to Schedules
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {practitioners.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {practitioners.map((practitioner) => (
                                    <Card key={practitioner.id} className="border border-border hover:shadow-md transition-shadow bg-card">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-foreground mb-1">
                                                        Dr. {practitioner.given_name} {practitioner.family_name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        ID: #{practitioner.id}
                                                    </p>
                                                </div>
                                                <div className="ml-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        practitioner.active 
                                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                                            : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                        {practitioner.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted-foreground">Gender:</span>
                                                    <span className="text-sm text-foreground capitalize">{practitioner.gender}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted-foreground">Age:</span>
                                                    <span className="text-sm text-foreground">{getAgeFromBirthDate(practitioner.birth_date)} years</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted-foreground">Birth Date:</span>
                                                    <span className="text-sm text-foreground">{formatDate(practitioner.birth_date)}</span>
                                                </div>
                                                {practitioner.schedules_count !== undefined && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-muted-foreground">Existing Schedules:</span>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                                                            {practitioner.schedules_count} schedules
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col space-y-2">
                                                <Link 
                                                    href={route('admin.schedule.create', { practitioner: practitioner.id })}
                                                    className="w-full"
                                                >
                                                    <Button 
                                                        className="w-full"
                                                        disabled={!practitioner.active}
                                                    >
                                                        Create Schedule
                                                    </Button>
                                                </Link>
                                                {practitioner.schedules_count !== undefined && practitioner.schedules_count > 0 && (
                                                    <Link 
                                                        href={route('admin.schedule.index', practitioner.id)}
                                                        className="w-full"
                                                    >
                                                        <Button variant="outline" className="w-full">
                                                            View Existing Schedules
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card">
                                <div className="text-muted-foreground mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">No practitioners found</h3>
                                <p className="text-muted-foreground">Please add practitioners before creating schedules.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
