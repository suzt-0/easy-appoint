import { type SharedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    phone: string;

};
export default function CreatePatient() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({

        phone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onError: () => reset('phone'),
            // onFinish: () => reset('password', 'password_confirmation'),
        });
    };


    return (
        <>
            <Head title="Patient Telecom">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                {/* <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" /> */}
            </Head>
            {/* cards to select if the patient is old or new */}
            
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
                <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">Enter Mobile Number</h2>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">

                        {/* phone */}
                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="font-medium text-gray-200">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                required
                                tabIndex={4}
                                autoComplete="tel"
                                value={data.phone ?? ''}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. +977 9812345678"
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            />
                            <InputError message={errors.phone} className="text-red-400 text-sm" />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2 cursor-pointer"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Submit
                        </Button>
                    </div>

                    <div className="text-gray-400 text-center text-sm mt-4">
                        Old patient?{' '}
                        <TextLink href={route('visit.type')} tabIndex={6} className="text-blue-400 hover:underline">
                           Book an appointment
                        </TextLink>
                    </div>
                </form>
            </div>
        </>
    );

}