<?php

namespace App\Http\Controllers\Patient;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PatientUserService;
use Exception;
use Illuminate\Http\Request;

class PatientUserController extends Controller
{
    /**
     * Registration form for the patient-type user 
     */
     public function create()
    {
        //return the view for registration form
        return inertia('Patient/Register');
    }


    /**
     * Store a patient-type user.
     */
    public function store(Request $request, PatientUserService $patientUserService){

        // dd($request->all());
        try{
            $validatedData = $request->validate([
                // User data (email only, name will be derived from given_name)
                'email' => 'required|email|unique:users,email',
                
                // Patient data
                'family_name' => 'required|string|max:255',
                'given_name' => 'required|string|max:255',
                'gender' => 'required|in:male,female,other',
                'birth_date' => 'required|date|before:today',
                
                // Optional patient contact information
                'phone' => 'nullable|string|max:20',
            ]);
            
            // Create the patient user (use given_name as the user's name)
            $user = User::create([
                'name' => $validatedData['given_name'],
                'email' => $validatedData['email'],
                'password' => bcrypt("Password".$validatedData['given_name'].random_int(5,10)),
                'active' => true,
                'role' => 'patient', // Set the role to 'patient'
                'remember_token' =>  (string)random_int(10,10),
            ]); 

            // Prepare patient data
            $patientData = [
                'family_name' => $validatedData['family_name'],
                'given_name' => $validatedData['given_name'],
                'gender' => $validatedData['gender'],
                'birth_date' => $validatedData['birth_date'],
                'active' => true,
            ];

            // Create patient and link to user
            $patient = $patientUserService->findOrCreatePatientForUser($user, $patientData);

            // Add phone number if provided
            if (!empty($validatedData['phone'])) {
                $patient->telecoms()->create([
                    'system' => 'phone',
                    'value' => $validatedData['phone'],
                    'use' => 'mobile',
                ]);
            }

            // Add email as telecom
            $patient->telecoms()->create([
                'system' => 'email',
                'value' => $validatedData['email'],
                'use' => 'home',
            ]);

        }
        catch(Exception $e){
            //handle validation errors
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                return redirect()->back()->withErrors($e->validator)->withInput();
            }
            dd($e->getMessage());
            // Handle the exception, log it, or return an error response
            return redirect()->back()->withErrors(['error' => 'An error occurred while creating the patient account.']);
        }
        // Optionally, you can send a verification email or perform other actions here
        // Redirect to a login page 
        return redirect()->route('patient.user.loginForm')->with('success', 'Patient account created successfully.');
    }
}
