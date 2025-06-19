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
    name: string;
    email: string;
    gender: string;
    birth_date: string; // Assuming birth_date is a string in 'YYYY-MM-DD' format
    // phone: string;
    // password: string;
    // password_confirmation: string;

};
export default function CreatePatient() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        gender: '',
        birth_date: '', // Assuming birth_date is a string in 'YYYY-MM-DD' format
        // phone: '',
        // password: '',
        // password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            // onFinish: () => reset('password', 'password_confirmation'),
        });
    };


    return (
        <>
            <Head title="Create Patient">
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
                <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">Patient Details</h2>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">

                        {/* first name  */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="font-medium text-gray-200">First Name</Label>
                            <Input
                                id="fname"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing} //disables input when processing
                                placeholder="Full name"
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            />
                            <InputError message={errors.name} className="mt-2 text-red-400 text-sm" />
                        </div>
                        {/* last name  */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="font-medium text-gray-200">Last Name</Label>
                            <Input
                                id="lname"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing} //disables input when processing
                                placeholder="Full name"
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            />
                            <InputError message={errors.name} className="mt-2 text-red-400 text-sm" />
                        </div>
                        {/* gender */}
                        <div className="grid gap-2">
                            <Label htmlFor="gender" className="font-medium text-gray-200">Gender</Label>
                            <select
                                id="gender"
                                required
                                tabIndex={2}
                                value={data.gender ?? ''}
                                onChange={e => setData('gender', e.target.value)}
                                disabled={processing}
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="unknown">Unknown</option>
                            </select>
                            <InputError message={errors.gender} className="mt-2 text-red-400 text-sm" />
                        </div>
                        {/* birth_date */}
                        <div className="grid gap-2">
                            <Label htmlFor="birth_date" className="font-medium text-gray-200">Birthdate</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                required
                                tabIndex={3}
                                value={data.birth_date ?? ''}
                                onChange={(e) => setData('birth_date', e.target.value)}
                                disabled={processing}
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            />
                            <InputError message={errors.birth_date} className="text-red-400 text-sm" />
                        </div>
                        {/* email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-medium text-gray-200">Email address</Label>
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
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            />
                            <InputError message={errors.email} className="text-red-400 text-sm" />
                        </div>
                        {/* phone */}
                        {/* <div className="grid gap-2">
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
                         */}
                        {/* <div className="grid gap-2">
                            <Label htmlFor="password" className="font-medium text-gray-200">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            />
                            <InputError message={errors.password} className="text-red-400 text-sm" />
                        </div> */}
                        {/* <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="font-medium text-gray-200">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            />
                            <InputError message={errors.password_confirmation} className="text-red-400 text-sm" />
                        </div> */}

                        <Button
                            type="submit"
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2 cursor-pointer"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Register as a Patient
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