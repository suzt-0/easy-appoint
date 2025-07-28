import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#f0f9ff] via-[#fefefe] to-[#f0f9ff] p-6 text-[#1e293b] dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            {/* <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">EA</span>
                                </div>
                                <span className="font-semibold text-xl text-[#1e293b] dark:text-[#f1f5f9]">Easy Appoint</span>
                            </div> */}
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-3 text-center mb-2">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#3b82f6] dark:to-[#2563eb]">
                                {title}
                            </h1>
                            <p className="text-[#64748b] dark:text-[#cbd5e1] text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    {/* Form Section */}
                    <div className="rounded-lg bg-white/90 p-8 shadow-xl backdrop-blur-sm dark:bg-[#1e293b]/90 dark:shadow-[inset_0px_0px_0px_1px_#475569]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
