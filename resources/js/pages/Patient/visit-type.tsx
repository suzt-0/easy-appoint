import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function VisitType() {

    return (
        <>
            <Head title="Patient Type Selection">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            {/* cards to select if the patient is old or new */}
            <div className="flex flex-col min-h-screen bg-gray-900">
                <div className="absolute top-6 left-6">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center text-gray-300 hover:text-blue-400 font-medium">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>
                <div className="flex flex-1 justify-center items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link
                            href={route('patient.create')}
                            className="block bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 text-center border border-gray-700 hover:border-blue-500">
                                <h2 className="text-2xl font-semibold mb-4 text-blue-400">New Patient</h2>
                                <p className="text-gray-300">Book an appointment as a new patient.</p>
                        </Link>
                        <Link 
                            href={route('home')}
                            className="block bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 text-center border border-gray-700 hover:border-green-500">
                                <h2 className="text-2xl font-semibold mb-4 text-green-400">Existing Patient</h2>
                                <p className="text-gray-300">Book an appointment as an existing patient.</p>
                        </Link>
                    </div>
                </div>
                {/* Emergency Appointment Button */}
                <div className="fixed right-6 bottom-6">
                    <Link
                        href={route('home')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors">
                        <svg className="w-7 h-7 inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                        </svg>
                        Emergency Appointment
                    </Link>
                </div>
            </div>

        </>
    );

}