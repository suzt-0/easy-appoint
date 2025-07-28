<?php

namespace App\Http\Controllers\Patient;
use App\Http\Controllers\Controller;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{

    /**
     * display the dashboard for the patient
     */
    public function dashboard(){

        return inertia('Patient/patient-manage');
    }



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all patients from the database
        $patients = Patient::with(['telecoms','contacts'])
        // ->where('active', true)
        ->get();
        // ->with(['telecoms', 'contacts']);

        // dd($patients);        // Return the patient index view with the list of patients
        return inertia(
            'Patient/patient-index',
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
        // Return the create view for a new patient
        // return inertia('Patient/patient-create');
    }

    /**
     * create a new patient-type user record
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
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            // patient_contact fields (emergency contact)
            'emergency_name' => 'nullable|string|max:255',
            'emergency_relationship' => 'nullable|string|max:255',
            'emergency_telecom' => 'nullable|string|max:255',
            'emergency_address' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            // Create new patient record 
            $patient = Patient::create([
                'family_name' => $validatedData['family_name'],
                'given_name' => $validatedData['given_name'],
                'gender' => $validatedData['gender'],
                'birth_date' => $validatedData['birth_date'] ?? null,
                'active' => $validatedData['active'] ?? true,
            ]);

            // Create patient telecom records (phone and email)
            $patient->telecoms()->create([
                'system' => 'email',
                'value' => $validatedData['email'],
            ]);

            $patient->telecoms()->create([
                'system' => 'phone',
                'value' => $validatedData['phone'],
            ]);

            // Create emergency contact record if provided
            if (!empty($validatedData['emergency_name'])) {
                $patient->contacts()->create([
                    'name' => $validatedData['emergency_name'],
                    'relationship' => $validatedData['emergency_relationship'] ?? null,
                    'telecom' => $validatedData['emergency_telecom'] ?? null,
                    'address' => $validatedData['emergency_address'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('patient.index')->with('success', 'Patient created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create patient: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        // Load patient with related data
        $patient->load(['telecoms', 'contacts']);
        
        return inertia('Patient/patient-show', [
            'patient' => $patient
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        // Load patient with related data
        $patient->load(['telecoms', 'contacts']);
        
        return inertia('Patient/patient-edit', [
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
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            // patient_contact fields (emergency contact)
            'emergency_name' => 'nullable|string|max:255',
            'emergency_relationship' => 'nullable|string|max:255',
            'emergency_telecom' => 'nullable|string|max:255',
            'emergency_address' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            // Update patient basic information
            $patient->update([
                'family_name' => $validatedData['family_name'],
                'given_name' => $validatedData['given_name'],
                'gender' => $validatedData['gender'],
                'birth_date' => $validatedData['birth_date'],
                'active' => $validatedData['active'] ?? true,
            ]);

            // Update or create email telecom
            $patient->telecoms()->updateOrCreate(
                ['system' => 'email'],
                ['value' => $validatedData['email']]
            );

            // Update or create phone telecom
            $patient->telecoms()->updateOrCreate(
                ['system' => 'phone'],
                ['value' => $validatedData['phone']]
            );

            // Handle emergency contact
            if (!empty($validatedData['emergency_name'])) {
                // Update or create emergency contact
                $patient->contacts()->updateOrCreate(
                    ['patient_id' => $patient->id],
                    [
                        'name' => $validatedData['emergency_name'],
                        'relationship' => $validatedData['emergency_relationship'] ?? null,
                        'telecom' => $validatedData['emergency_telecom'] ?? null,
                        'address' => $validatedData['emergency_address'] ?? null,
                    ]
                );
            } else {
                // Remove emergency contact if name is empty
                $patient->contacts()->delete();
            }

            DB::commit();

            return redirect()->route('patient.show', $patient)->with('success', 'Patient updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update patient: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        try {
            DB::beginTransaction();

            // Delete related telecoms and contacts
            $patient->telecoms()->delete();
            $patient->contacts()->delete();
            
            // Delete the patient record
            $patient->delete();

            DB::commit();

            return redirect()->route('patient.index')->with('success', 'Patient deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete patient: ' . $e->getMessage()]);
        }
    }

    /**
     * Send form to get email or phone number for verification using otp
     */
    // public function verify()
    // {
    //     // Render the verification view ie a form to input email or phone number
    //     // return inertia('Patient/Verify');

    // }


    // public function otpForm(Request $request)
    // {
    //     // Validate the request to ensure the phone number or email is provided
    //     $request->validate([
    //         'contact' => 'required|string|max:255',
    //     ]);

    //     // Here you would typically send an OTP to the provided contact method
    //     // For demonstration, we will assume the OTP is sent 
        
    //     //***************************************************************************************** */
    //     // Generate a random 6-digit OTP
    //     $otp = rand(100000, 999999);

    //     // Store the OTP in the session or database as needed (for demo, we'll use session)
    //     session(['otp' => $otp, 'otp_contact' => $request->input('contact')]);

    //     // Check if the contact is an email
    //     if (filter_var($request->input('contact'), FILTER_VALIDATE_EMAIL)) {
    //         // Send OTP via email
    //         Mail::raw("Your OTP code is: $otp", function ($message) use ($request) {
    //             $message->to($request->input('contact'))
    //                     ->subject('Your OTP Code');
    //         });
    //     } elseif (preg_match('/^\+?[0-9]{10,15}$/', $request->input('contact'))) {
    //         // For phone, you would integrate with an SMS gateway here

    //         // Example: Use a service like Twilio or Nexmo to send the OTP via SMS
    //         // This is a placeholder for SMS sending logic
    //         // $smsService->send($request->input('contact'), "Your OTP code is: $otp");
    //         // For now, just log the OTP
    //         // \Log::info('OTP for phone ' . $request->input('contact') . ': ' . $otp);
    //     }
    //     //***************************************************************************************** */

    //     // Render the OTP form view
    //     // return inertia('Patient/VerifyOTP', [
    //     //     'contact' => $request->input('contact'),
    //     // ]);
    // }

    // public function verifyOTP(Request $request)
    // {
    //     // Validate the OTP input
    //     $request->validate([
    //         'otp' => 'required|numeric|digits:6',
    //     ]);

    //     // Here you would typically check the OTP against your database or service
    //     // For now, we will assume the OTP is valid for demonstration purposes

    //     // Redirect to a success page or back to the dashboard
    //     return redirect()->route('patient.dashboard')->with('success', 'Phone number verified successfully.');
    // }

}
