import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputSuccess from '@/components/input-sucess';

type LoginForm = {
    email: string;
    
};

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
       
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/patient/login', {
            onFinish: () => {
                reset();
            },
            onError: (errors) => {
                console.error('Login errors:', errors);
            },
        });
    }; return (
        <>
            <Head title="Log in - Easy Appoint">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] p-3 sm:p-6 text-[#1e293b] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">

                {/* Back Button */}
                <div className="w-full max-w-md mb-4">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#1e293b] dark:text-[#cbd5e1] dark:hover:text-[#f1f5f9] transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750">
                    <main className="w-full max-w-md">
                        <div className="rounded-lg bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-sm dark:bg-[#1e293b]/90 dark:shadow-[inset_0px_0px_0px_1px_#475569]">

                            {/* Header */}
                            <div className="text-center mb-6">
                                
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#3b82f6] dark:to-[#2563eb]">
                                    Welcome Back
                                </h1>
                                <p className="text-[#64748b] dark:text-[#cbd5e1] text-sm sm:text-base">
                                    Enter your email below and we'll send you a secure login link
                                </p>
                            </div>                            

                            
                            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={submit}>
                                <div className="grid gap-4 sm:gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-[#1e293b] dark:text-[#f1f5f9] font-medium">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@example.com"
                                            className="border-[#e2e8f0] dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="mt-2 w-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-200 shadow-lg"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        {processing ? 'Sending Login Link...' : 'Send Login Link'}
                                    </Button>
                                </div>                                <div className="text-center text-sm text-[#64748b] dark:text-[#cbd5e1] mt-4">
                                    Don't have an account?{' '}
                                    <TextLink
                                        href={route('patient.user.create')}
                                        tabIndex={5}
                                        className="text-[#3b82f6] hover:text-[#2563eb] dark:text-[#60a5fa] dark:hover:text-[#3b82f6] font-medium"
                                    >
                                        Register
                                    </TextLink>
                                </div>

                                {/* Login Process Info */}
                                <div className="mt-4 p-3 bg-[#f8fafc] dark:bg-[#334155]/50 rounded-lg border border-[#e2e8f0] dark:border-[#475569]">
                                    <p className="text-xs text-[#64748b] dark:text-[#cbd5e1] text-center">
                                        🔒 For your security, we'll send a secure login link to your email.
                                        Click the link in your email to access your account.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
