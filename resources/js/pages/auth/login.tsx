import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Welcome Back" description="Enter your credentials to access your healthcare dashboard">
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-center text-sm font-medium text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    {status}
                </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                            Email address
                        </Label>
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
                            className="h-12 rounded-lg border-[#e2e8f0] bg-[#f8fafc] px-4 text-[#1e293b] placeholder-[#64748b] transition-all duration-200 focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] dark:placeholder-[#cbd5e1] dark:focus:border-[#60a5fa] dark:focus:bg-[#1e293b] dark:focus:ring-[#60a5fa]/20"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-semibold text-[#1e293b] dark:text-[#f1f5f9]">
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink 
                                    href={route('password.request')} 
                                    className="text-sm text-[#3b82f6] hover:text-[#1d4ed8] dark:text-[#60a5fa] dark:hover:text-[#3b82f6] transition-colors duration-200" 
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 rounded-lg border-[#e2e8f0] bg-[#f8fafc] px-4 text-[#1e293b] placeholder-[#64748b] transition-all duration-200 focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#475569] dark:bg-[#334155] dark:text-[#f1f5f9] dark:placeholder-[#cbd5e1] dark:focus:border-[#60a5fa] dark:focus:bg-[#1e293b] dark:focus:ring-[#60a5fa]/20"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="bg-blue-200 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#3b82f6] data-[state=checked]:to-[#1d4ed8] data-[state=checked]:border-[#3b82f6] dark:data-[state=checked]:from-[#60a5fa] dark:data-[state=checked]:to-[#3b82f6]"
                        />
                        <Label htmlFor="remember" className="text-sm text-[#64748b] dark:text-[#cbd5e1] cursor-pointer">
                            Remember me 
                        </Label>
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 h-12 w-full rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white font-semibold shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] focus:from-[#2563eb] focus:to-[#1e40af] focus:ring-2 focus:ring-[#3b82f6]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] dark:from-[#3b82f6] dark:to-[#1d4ed8] dark:hover:from-[#2563eb] dark:hover:to-[#1e40af] dark:focus:ring-[#60a5fa]/20" 
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        {processing ? 'Signing in...' : 'Sign in to your account'}
                    </Button>
                </div>

                {/* <div className="text-center text-sm text-[#64748b] dark:text-[#cbd5e1]">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={6} className="text-[#3b82f6] hover:text-[#1d4ed8] dark:text-[#60a5fa] dark:hover:text-[#3b82f6] font-medium transition-colors duration-200">
                        Create an account
                    </TextLink>
                </div> */}
            </form>
        </AuthLayout>
    );
}
