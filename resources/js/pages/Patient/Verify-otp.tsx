import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type OtpForm = {
    otp: string;
};

export default function VerifyOtp() {
    const { data, setData, post, processing, errors, reset } = useForm<OtpForm>({
        otp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verify.otp'), {
            onError: () => reset('otp'),
        });
    };

    return (
        <>
            <Head title="Verify OTP" />
            <div className="max-w-md mx-auto mt-10 bg-gray-900 rounded-lg shadow-lg p-8">
                <div className="absolute top-6 left-6">
                    <Link
                        href={route('visit.type')}
                        className="inline-flex items-center text-gray-300 hover:text-blue-400 font-medium">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>
                <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">Enter OTP Code</h2>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="otp" className="font-medium text-gray-200">OTP Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                required
                                maxLength={6}
                                autoComplete="one-time-code"
                                value={data.otp}
                                onChange={(e) => setData('otp', e.target.value)}
                                disabled={processing}
                                placeholder="Enter the 6-digit code"
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-center tracking-widest text-lg"
                            />
                            <InputError message={errors.otp} className="text-red-400 text-sm" />
                        </div>
                        <Button
                            type="submit"
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2 cursor-pointer"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Verify
                        </Button>
                    </div>
                    <div className="text-gray-400 text-center text-sm mt-4">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            className="text-blue-400 hover:underline"
                            // onClick={handleResendOtp}
                            tabIndex={6}
                        >
                            Resend OTP
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
