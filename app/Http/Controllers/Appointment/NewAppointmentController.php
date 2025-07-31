<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Practitioner;
use App\Models\Schedule;
use App\Mail\AppointmentConfirmationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NewAppointmentController extends Controller
{

    /**
     * Show the form for creating a new appointment.
     */
    public function create()
    {

        $schedules = Schedule::where('active', 1)->get();
        // Return the view to create a new appointment
        return inertia('bookAppointment', props: [
            'schedules' => $schedules,
        ]);
    }

    /**
     * Store a newly created appointment in storage.
     */
    public function store(Request $request)
    {

        // dd($request->all());

        //validate the request data 
        $validatedData = $request->validate([
            // patients table fields
            'family_name' => 'required|string|max:255',
            'given_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other,unknown',
            'birth_date' => 'nullable|date',
            'active' => 'boolean',
            // patient_telecom fields
            'email' => 'required|email|email:rfc,dns|max:255|regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/',
            'phone' => 'required|string|max:15',
            // patient_contact fields
            'name' => 'nullable|string|max:255',
            'relationship' => 'nullable|string|max:255',
            'telecom' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            // appointment fields
            'schedule_id' => 'required|exists:schedules,id',
            'status' => 'required|in:proposed,pending,booked,arrived,fulfilled,cancelled,noshow',
            'description' => 'nullable|string|max:1000',
            'appointment_date' => 'required|date|after_or_equal:today', // Ensure the appointment date is today or in tne future
        ]);

        // dd($validatedData);


        try {
            //start the transaction
            DB::beginTransaction();

            //get practitioner from schedule_id
            $schedule = Schedule::findOrFail($validatedData['schedule_id']);
            $practitioner_id = $schedule->practitioner_id;

            //create new patient record 
            $patient = Patient::create([
                'family_name' => $validatedData['family_name'],
                'given_name' => $validatedData['given_name'],
                'gender' => $validatedData['gender'],
                'birth_date' => $validatedData['birth_date'] ?? null,
                'active' => $validatedData['active'] ?? true,
            ]);

            // Get the newly created patient's ID
            $patient_id = $patient->id;


            //crete new patient telecom record phone and email 
            $patient->telecoms()->create([
                'system' => 'email',
                'value' => $validatedData['email'],
            ]);

            $patient->telecoms()->create([
                'system' => 'phone',
                'value' => $validatedData['phone'],
            ]);



            //create new patient contact record if exists 
            if (isset($validatedData['name'])) {
                $patient->contacts()->create([
                    'name' => $validatedData['name'],
                    'relationship' => $validatedData['relationship'] ?? null,
                    'telecom' => $validatedData['telecom'] ?? null,
                    'address' => $validatedData['address'] ?? null,
                ]);
            }


            //crete new appointment record
            $appointment = Appointment::create([
                'status' => $validatedData['status'],
                'description' => $validatedData['description'] ?? null,
                'appointment_date' => $validatedData['appointment_date'],
                'schedule_id' => $validatedData['schedule_id'],
            ]);


            //create new appointment participant record
            $appointment->participants()->create([

                'actor_type' => 'patient',
                'actor_id' => $patient_id,
                'status' => 'accepted', // default status for patient
            ]);

            $appointment->participants()->create([

                'actor_type' => 'practitioner',
                'actor_id' => $practitioner_id,
                'status' => 'accepted', // default status for practitioner
            ]);

            // Commit the transaction
            DB::commit();

            // Send appointment confirmation email
            try {
                // Get the practitioner details
                $practitioner = Practitioner::findOrFail($practitioner_id);
                
                // Get patient email from telecoms
                $patientEmail = $patient->telecoms()->where('system', 'email')->first();

                //get schedule details
                $schedule = Schedule::findOrFail($validatedData['schedule_id']);
                
                if ($patientEmail) {
                    Mail::to($patientEmail->value)->send(
                        new AppointmentConfirmationMail($appointment, $patient,$schedule)
                    );
                    
                    Log::info('Appointment confirmation email sent successfully', [
                        'appointment_id' => $appointment->id,
                        'patient_email' => $patientEmail->value
                    ]);
                }
            } catch (\Exception $emailException) {
                // Log the email error but don't fail the appointment creation
                Log::error('Failed to send appointment confirmation email', [
                    'appointment_id' => $appointment->id,
                    'error' => $emailException->getMessage()
                ]);
                
                // Optionally, you can add a flash message to inform the user
                // that the appointment was created but email failed
                session()->flash('email_warning', 'Appointment created successfully, but confirmation email could not be sent.');
            }

        } catch (\Exception $e) {

            DB::rollBack();
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Failed to create appointment: ' . $e->getMessage()]);
        }        return redirect()->route('appointment.success')->with('success', 'Appointment created successfully.');
    }


    /**
     * Show the appointment success page.
     */
    public function success()
    {
        // Return the view to show appointment success
        return inertia('appointment-success');
    }
}
