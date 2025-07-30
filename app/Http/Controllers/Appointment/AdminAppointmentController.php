<?php

namespace App\Http\Controllers\Appointment;
use App\Http\Controllers\Controller;
use App\Mail\AppointmentConfirmationMail;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Practitioner;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminAppointmentController extends Controller
{

    /**
     * Display dashboard for appointments.
     */
    public function dashboard()
    {
        

        return inertia('Appointment/dashboard');
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appointments = Appointment::
        with([
            'schedule.practitioner', 
            'patient',
            'practitioner'
           ])
        ->get(); 


        return inertia(
            'Appointment/appointment-index',
            [
                'appointments' => $appointments
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $schedule_id = $request->get('schedule_id');
        
        if ($schedule_id) {
            // If schedule_id is provided, load the schedule and show appointment creation form
            $schedule = Schedule::with('practitioner.user')->find($schedule_id);
            
            if (!$schedule) {
                return redirect()->route('admin.appointment.schedules')
                    ->withErrors(['error' => 'Selected schedule not found.']);
            }
            
            return inertia('Appointment/appointment-create', [
                'schedule' => $schedule,
            ]);
        }
        
        // If no schedule_id, redirect to schedule selection
        return redirect()->route('admin.appointment.schedules');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        //validate the request data 
        $validatedData = $request->validate([
            // patients table fields
            'family_name' => 'required|string|max:255',
            'given_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other,unknown',
            'birth_date' => 'nullable|date',
            'active' => 'boolean',
            // patient_telecom fields
            'email' => 'required|email|max:255|email:rfc,dns|regex:/^.+@gmail.com$/',
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
        }

        return redirect()->route('dashboard')->with('success', 'Appointment created successfully.');//redirect to appointment index
    }


    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        // Load appointment with all related data
        $appointment->load([
            'schedule.practitioner.user',
            'participants.patient',
            'participants.practitioner',
            'patient',
            'practitioner',
            'notes'
        ]);

        return inertia(
            'Appointment/appointment-show',
            [
                'appointment' => $appointment
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        // Load appointment with all related data
        $appointment->load([
            'schedule.practitioner.user',
            'participants.patient',
            'participants.practitioner',
            'patient',
            'practitioner'
        ]);

        // Get available schedules for potential schedule change
        $schedules = Schedule::with('practitioner.user')
            ->where('active', true)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return inertia(
            'Appointment/appointment-edit',
            [
                'appointment' => $appointment,
                'schedules' => $schedules
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'schedule_id' => 'nullable|exists:schedules,id',
            'status' => 'required|in:proposed,pending,booked,arrived,fulfilled,cancelled,noshow',
            'description' => 'nullable|string|max:1000',
            'appointment_date' => 'required|date|after_or_equal:today', // Ensure the appointment date is today or in the future
        ]);

        try {
            // Start transaction
            DB::beginTransaction();

            // Check if schedule is being changed
            if (isset($validatedData['schedule_id']) && $validatedData['schedule_id'] != $appointment->schedule_id) {
                // Get the new schedule and its practitioner
                $newSchedule = Schedule::findOrFail($validatedData['schedule_id']);
                $newPractitionerId = $newSchedule->practitioner_id;
                
                // Update the practitioner participant
                $appointment->participants()
                    ->where('actor_type', 'practitioner')
                    ->update([
                        'actor_id' => $newPractitionerId,
                        'status' => 'accepted' // Reset status for new practitioner
                    ]);
            }

            // Update the appointment with the validated data
            $appointment->update($validatedData);

            // Commit the transaction
            DB::commit();

            return redirect()->route('admin.appointment.show', $appointment->id)->with('success', 'Appointment updated successfully.');
            
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            Log::error('Failed to update appointment: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update appointment: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        try {
            DB::beginTransaction();
            
            // Delete the appointment record - participants and notes will be cascade deleted automatically
            $appointment->delete();
            
            DB::commit();
            
            return redirect()->route('admin.appointment.index')->with('success', 'Appointment and all related records deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete appointment: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete appointment: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the form to select a schedule for creating an appointment.
     */
    public function selectSchedule()
    {
        // Get all active schedules with practitioner information
        $schedules = Schedule::with('practitioner.user')
            ->where('active', true)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
        
        // Get all active patients for potential filtering
        $patients = Patient::where('active', true)
            ->orderBy('family_name')
            ->orderBy('given_name')
            ->get();
        
        return inertia('Appointment/select-schedule',
            [
                'schedules' => $schedules,
                'patients' => $patients,
            ]
        );
    }

    /**
     * Display appointments for a specific practitioner.
     */
    public function practitionerAppointments($practitioner_id)
    {
        // Get appointments for a specific practitioner
        $appointments = Appointment::whereHas('participants', function ($query) use ($practitioner_id) {
            $query->where('actor_type', 'practitioner')
                  ->where('actor_id', $practitioner_id);
        })->where('is_active', true)->with(['schedule', 'participants'])->get();

        
        $practitioner = Practitioner::with('user')->findOrFail($practitioner_id);

        return inertia(
            'Appointment/appointment-index', //create a new view for practitioner appointments 
            [
                'appointments' => $appointments,
                'practitioner' => $practitioner
            ]
        );
    }
}
