<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all patients from the database
        $patients = Patient::all()->where('is_active', true);

        // Return the patient index view with the list of patients
        return inertia(
            'Patient/Index',
            [
                'patients' => $patients
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Patient/Create');
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            // patients table fields
            'family_name' => 'required|string|max:255',
            'given_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other,unknown',
            'birth_date' => 'nullable|date',
            'active' => 'boolean',
            // patient_telecom fields
            'email' => 'required|email|max:255|unique:patients,email',
            'phone' => 'required|string|max:15',
            // patient_contact fields
            'name' => 'nullable|string|max:255',
            'relationship' => 'nullable|string|max:255',
            'telecom' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        \DB::beginTransaction();

        try {
            // Store the patient details using mass assignment
            $patient = Patient::create([
                'family_name' => $validatedData['family_name'],
                'given_name' => $validatedData['given_name'],
                'gender' => $validatedData['gender'],
                'birth_date' => $validatedData['birth_date'] ?? null,
                'active' => $validatedData['active'] ?? true,
            ]);

            // Store the patient's telecom information
            $patient->telecoms()->create([
                'system' => 'email',
                'value' => $validatedData['email'],
                'use' => 'home',
            ]);
            $patient->telecoms()->create([
                'system' => 'phone',
                'value' => $validatedData['phone'],
                'use' => 'mobile',
            ]);

            // Only create a contact if at least one contact field is provided
            if (!empty($validatedData['name']) && (!empty($validatedData['relationship']) || !empty($validatedData['telecom']) || !empty($validatedData['address']))) {
                $patient->contacts()->create([
                    'name' => $validatedData['name'],
                    'relationship' => $validatedData['relationship'] ?? null,
                    'telecom' => $validatedData['telecom'] ?? null,
                    'address' => $validatedData['address'] ?? null,
                ]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create patient: ' . $e->getMessage()]);
        }
        //check if user is authentaicated
        if (!auth()->check()) {
            return redirect()->route('dashboard')->with('sucess', 'Registered successfully. Please verify using otp sent to your email.');
        }

        if (auth()->user()->hasRole('admin')) {
            return redirect()->route('patient.index')->with('success', 'Patient created successfully.');
        } else if (auth()->user()->hasRole('frontdesk')) {
            return redirect()->route('frontdesk.dashboard')->with('success', 'Patient created registered.');
        } elseif (auth()->user()->hasRole('doctor')) {
            return redirect()->route('practitioner.dashboard')->with('success', 'Patient created successfully.');
        }

        abort(403, 'Unauthorized action.');

    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        return inertia('Patient/Show', [
            'patient' => $patient
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        // Return the edit view with the patient data
        return inertia('Patient/Edit', [
            'patient' => $patient
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient)
    {
        $validatedData = $request->validate([
            // patients table fields
            'family_name' => 'required|string|max:255',
            'given_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other,unknown',
            'birth_date' => 'nullable|date',
            'active' => 'boolean',
            // patient_telecom fields
            'email' => 'required|email|max:255|unique:patients,email',
            'phone' => 'required|string|max:15',
            // patient_contact fields
            'name' => 'nullable|string|max:255',
            'relationship' => 'nullable|string|max:255',
            'telecom' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);



    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        // Soft delete the patient
        $patient->update(['is_active' => false]);

        // Redirect to the patient index page with a success message
        return redirect()->route('patient.index')->with('success', 'Patient deleted successfully.');
    }

    /**
     * Send form to get email or phone number for verification using otp
     */
    public function verify()
    {
        // Render the verification view ie a form to input email or phone number
        return inertia('Patient/Verify');

    }


    public function otpForm(Request $request)
    {
        // Validate the request to ensure the phone number or email is provided
        $request->validate([
            'contact' => 'required|string|max:255',
        ]);

        // Here you would typically send an OTP to the provided contact method
        // For demonstration, we will assume the OTP is sent 
        
        //***************************************************************************************** */
        // Generate a random 6-digit OTP
        $otp = rand(100000, 999999);

        // Store the OTP in the session or database as needed (for demo, we'll use session)
        session(['otp' => $otp, 'otp_contact' => $request->input('contact')]);

        // Check if the contact is an email
        if (filter_var($request->input('contact'), FILTER_VALIDATE_EMAIL)) {
            // Send OTP via email
            Mail::raw("Your OTP code is: $otp", function ($message) use ($request) {
                $message->to($request->input('contact'))
                        ->subject('Your OTP Code');
            });
        } elseif (preg_match('/^\+?[0-9]{10,15}$/', $request->input('contact'))) {
            // For phone, you would integrate with an SMS gateway here

            // Example: Use a service like Twilio or Nexmo to send the OTP via SMS
            // This is a placeholder for SMS sending logic
            // $smsService->send($request->input('contact'), "Your OTP code is: $otp");
            // For now, just log the OTP
            // \Log::info('OTP for phone ' . $request->input('contact') . ': ' . $otp);
        }
        //***************************************************************************************** */

        // Render the OTP form view
        return inertia('Patient/VerifyOTP', [
            'contact' => $request->input('contact'),
        ]);
    }

    public function verifyOTP(Request $request)
    {
        // Validate the OTP input
        $request->validate([
            'otp' => 'required|numeric|digits:6',
        ]);

        // Here you would typically check the OTP against your database or service
        // For now, we will assume the OTP is valid for demonstration purposes

        // Redirect to a success page or back to the dashboard
        return redirect()->route('patient.dashboard')->with('success', 'Phone number verified successfully.');
    }

}
