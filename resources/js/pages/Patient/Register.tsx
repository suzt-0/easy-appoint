import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    family_name: string;
    given_name: string;
    gender: string;
    birth_date: string;
    phone?: string;
};

export default function Register() {    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        family_name: '',
        given_name: '',
        gender: '',
        birth_date: '',
        phone: '',
    });
    
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('patient.user.store'));
    };    return (
        <>
            <Head title="Register - Easy Appoint">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-start bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] p-6 text-[#1e293b] lg:justify-items-start lg:p-8 dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
                {/* Header */}
                <header className="mb-6 w-full max-w-[335px] text-sm md:max-w-4xl lg:max-w-7xl">
                    <nav className="flex items-center justify-between"> 
                        <Link href={route('home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EA</span>
                            </div>
                            <span className="font-semibold text-lg text-[#1e293b] dark:text-[#f1f5f9]">Easy Appoint</span>
                        </Link>
                        <Link
                            href={route('patient.user.login')}
                            className="inline-block rounded-full border border-[#e2e8f0] px-6 py-2 text-sm font-medium text-[#1e293b] bg-white shadow-sm hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all duration-200 dark:border-[#475569] dark:text-[#f1f5f9] dark:bg-[#334155] dark:hover:bg-[#475569]"
                        >
                            Log in
                        </Link>
                    </nav>
                </header>                {/* Main Content */}
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750">
                    <main className="w-full max-w-lg">
                        <div className="rounded-lg bg-white/90 p-8 shadow-xl backdrop-blur-sm dark:bg-[#1e293b]/90 dark:shadow-[inset_0px_0px_0px_1px_#475569]">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#3b82f6] dark:to-[#2563eb]">
                                    Create Patient Account
                                </h1>
                                <p className="text-[#64748b] dark:text-[#cbd5e1]">Enter your details below to create your patient account</p>
                            </div>{/* Form */}
                            <form className="flex flex-col gap-6" onSubmit={submit}>
                                <div className="grid gap-6">
                                    {/* Patient Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#f1f5f9] border-b border-[#e2e8f0] dark:border-[#475569] pb-2">Patient Information</h3>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="name" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Full Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                disabled={processing}
                                                placeholder="John Doe"
                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                disabled={processing}
                                                placeholder="email@example.com"
                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="given_name" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">First Name</Label>
                                                <Input
                                                    id="given_name"
                                                    type="text"
                                                    required
                                                    tabIndex={3}
                                                    value={data.given_name}
                                                    onChange={(e) => setData('given_name', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="John"
                                                    className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                                />
                                                <InputError message={errors.given_name} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="family_name" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Last Name</Label>
                                                <Input
                                                    id="family_name"
                                                    type="text"
                                                    required
                                                    tabIndex={4}
                                                    value={data.family_name}
                                                    onChange={(e) => setData('family_name', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Doe"
                                                    className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                                />
                                                <InputError message={errors.family_name} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="gender" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Gender</Label>
                                                <select
                                                    id="gender"
                                                    required
                                                    tabIndex={5}
                                                    value={data.gender}
                                                    onChange={(e) => setData('gender', e.target.value)}
                                                    disabled={processing}
                                                    className="flex h-10 w-full rounded-md border border-[#e2e8f0] dark:border-[#475569] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                                >
                                                    <option value="">Select gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                <InputError message={errors.gender} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="birth_date" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Date of Birth</Label>
                                                <Input
                                                    id="birth_date"
                                                    type="date"
                                                    required
                                                    tabIndex={6}
                                                    value={data.birth_date}
                                                    onChange={(e) => setData('birth_date', e.target.value)}
                                                    disabled={processing}
                                                    className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                                />
                                                <InputError message={errors.birth_date} />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="phone" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Phone Number (Optional)</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                tabIndex={7}
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                disabled={processing}
                                                placeholder="+1 (555) 123-4567"
                                                className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="mt-2 w-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] text-white shadow-lg transition-all duration-200 transform hover:scale-105" 
                                        tabIndex={8} 
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        Create account
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-[#64748b] dark:text-[#cbd5e1]">
                                    Already have an account?{' '}
                                    <Link 
                                        href={route('patient.user.login')} 
                                        tabIndex={9}
                                        className="font-medium text-[#3b82f6] hover:text-[#2563eb] dark:text-[#60a5fa] dark:hover:text-[#3b82f6] transition-colors"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
