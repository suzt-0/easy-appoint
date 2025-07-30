<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentParticipants;
use App\Models\Patient;
use App\Models\PatientTelecom;
use App\Models\UserPatient;
use App\Services\PatientUserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\AppointmentUpdateMail;
use App\Mail\AppointmentConfirmationMail;
use Illuminate\Support\Facades\Mail;

class PatientAppointmentController extends Controller
{
    /**
     * Get appointment IDs for the authenticated patient user
     */
    private function getPatientAppointmentIds()
    {
        // Get the authenticated user
        $email = Auth::user()->email;

        // Find patient IDs associated with the email
        $patient_ids = PatientTelecom::where('value', $email)->pluck('patient_id');

        if ($patient_ids->isEmpty()) {
            return collect(); // Return empty collection if no patient IDs found
        }

        // Get appointment_ids via appointment_participants
        $appointment_ids = AppointmentParticipants::whereIn('actor_id', $patient_ids)
            ->where('actor_type', 'patient')
            ->pluck('appointment_id');

        return $appointment_ids;
    }

    /**
     * Get appointments for the authenticated patient user
     */
    public function index()
    {
        // dd('Patient Appointment Index');
        try {
            // Get appointment IDs for the authenticated patient
            $appointment_ids = $this->getPatientAppointmentIds();

            if ($appointment_ids->isEmpty()) {
                return redirect()->route('dashboard')->with('message', 'No appointments found for your account.');
            }

            // Get the appointments based on the IDs
            $appointments = Appointment::whereIn('id', $appointment_ids)
                ->with(['participants.patient', 'participants.practitioner'])
                ->get();

            return inertia('Appointment/patient-appointment-index', [
                'appointments' => $appointments,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('message', 'An error occurred while fetching appointments: ' . $e->getMessage());
        }
    }


    /**
     * Show individual appointment details
     */
    public function show(Appointment $appointment) {
        try {
            // Get appointment IDs for the authenticated patient
            $appointment_ids = $this->getPatientAppointmentIds();

            if ($appointment_ids->isEmpty()) {
                return redirect()->route('dashboard')->with('error', 'Patient profile not found.');
            }

            // Check if the requested appointment belongs to this patient
            if (!$appointment_ids->contains($appointment->id)) {
                return redirect()->route('patient.appointment.index')->with('error', 'You are not authorized to view this appointment.');
            }

            $appointment->load([
                'schedule.practitioner.user',
                'participants.patient',
                'participants.practitioner',
                'patient',
                'practitioner',
                'notes'
            ]);
            
            return inertia('Appointment/patient-appointment-show', [
                'appointment' => $appointment,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('patient.appointment.index')->with('error', 'An error occurred while fetching appointment details: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing/rescheduling the appointment
     */
    public function edit(Appointment $appointment)
    {
        try {
            // Get appointment IDs for the authenticated patient
            $appointment_ids = $this->getPatientAppointmentIds();

            if ($appointment_ids->isEmpty()) {
                return redirect()->route('dashboard')->with('error', 'Patient profile not found.');
            }

            // Check if the requested appointment belongs to this patient
            if (!$appointment_ids->contains($appointment->id)) {
                return redirect()->route('patient.appointment.index')->with('error', 'You are not authorized to reschedule this appointment.');
            }

            // Check if appointment can be rescheduled (not in the past, not cancelled)
            if ($appointment->status === 'cancelled' || $appointment->status === 'completed') {
                return redirect()->route('patient.appointment.index')->with('error', 'This appointment cannot be rescheduled.');
            }

            // Check if appointment is more than 24 hours away
            $appointmentDateTime = new \DateTime($appointment->appointment_date);
            $now = new \DateTime();
            $timeDifference = $appointmentDateTime->diff($now);
            $hoursUntilAppointment = ($timeDifference->days * 24) + $timeDifference->h;
            
            if ($appointmentDateTime <= $now || $hoursUntilAppointment < 24) {
                return redirect()->route('patient.appointment.index')->with('error', 'Appointments can only be rescheduled at least 24 hours in advance.');
            }

            // Load appointment with all related data
            $appointment->load([
                'schedule.practitioner.user',
                'participants.patient',
                'participants.practitioner',
                'patient',
                'practitioner',
                'notes'
            ]);

            // Get available schedules for the same practitioner
            $practitioner = $appointment->schedule->practitioner;
            $schedules = Schedule::with('practitioner.user')
                ->where('practitioner_id', $practitioner->id)
                ->where('active', true)
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->get();

            return inertia('Appointment/patient-appointment-reschedule', [
                'appointment' => $appointment,
                'schedules' => $schedules,
                'practitioner' => $practitioner
            ]);
        } catch (\Exception $e) {
            return redirect()->route('patient.appointment.index')->with('error', 'An error occurred while loading the reschedule form: ' . $e->getMessage());
        }
    }

    /**
     * Update/reschedule the appointment
     */
    public function update(Request $request, Appointment $appointment)
    {
        try {
            // Get appointment IDs for the authenticated patient
            $appointment_ids = $this->getPatientAppointmentIds();

            if ($appointment_ids->isEmpty()) {
                return redirect()->route('dashboard')->with('error', 'Patient profile not found.');
            }

            // Check if the requested appointment belongs to this patient
            if (!$appointment_ids->contains($appointment->id)) {
                return redirect()->route('patient.appointment.index')->with('error', 'You are not authorized to reschedule this appointment.');
            }

            // Check if appointment can be rescheduled
            if ($appointment->status === 'cancelled' || $appointment->status === 'completed') {
                return redirect()->route('patient.appointment.index')->with('error', 'This appointment cannot be rescheduled.');
            }

            // Check if appointment is more than 24 hours away
            $appointmentDateTime = new \DateTime($appointment->appointment_date);
            $now = new \DateTime();
            $timeDifference = $appointmentDateTime->diff($now);
            $hoursUntilAppointment = ($timeDifference->days * 24) + $timeDifference->h;
            
            if ($appointmentDateTime <= $now || $hoursUntilAppointment < 24) {
                return redirect()->route('patient.appointment.index')->with('error', 'Appointments can only be rescheduled at least 24 hours in advance.');
            }

            // Validate the request data
            $validatedData = $request->validate([
                'schedule_id' => 'required|exists:schedules,id',
                'appointment_date' => 'required|date|after:now',
                'reschedule_reason' => 'nullable|string|max:500'
            ]);

            // Store original values for change tracking
            $originalData = [
                'schedule_id' => $appointment->schedule_id,
                'appointment_date' => $appointment->appointment_date,
            ];

            // Start transaction
            DB::beginTransaction();

            $changes = [];

            // Check if schedule is being changed
            if ($validatedData['schedule_id'] != $appointment->schedule_id) {
                $oldSchedule = Schedule::with('practitioner')->find($appointment->schedule_id);
                $newSchedule = Schedule::with('practitioner')->findOrFail($validatedData['schedule_id']);
                
                // Ensure the new schedule belongs to the same practitioner
                if ($oldSchedule->practitioner_id !== $newSchedule->practitioner_id) {
                    DB::rollBack();
                    return back()->withErrors(['error' => 'You can only reschedule to a time slot with the same practitioner.']);
                }
                
                $changes['schedule'] = [
                    'old' => $oldSchedule->day_of_week . ' ' . $oldSchedule->start_time . '-' . $oldSchedule->end_time,
                    'new' => $newSchedule->day_of_week . ' ' . $newSchedule->start_time . '-' . $newSchedule->end_time,
                ];
            }

            // Track appointment date change
            if ($validatedData['appointment_date'] != $originalData['appointment_date']) {
                $changes['appointment_date'] = [
                    'old' => $originalData['appointment_date'],
                    'new' => $validatedData['appointment_date'],
                ];
            }

            // Update the appointment
            $appointment->update([
                'schedule_id' => $validatedData['schedule_id'],
                'appointment_date' => $validatedData['appointment_date'],
                'status' => 'pending' // Reset to pending after reschedule
            ]);

            // Add reschedule reason to changes if provided
            if (!empty($validatedData['reschedule_reason'])) {
                $changes['reschedule_reason'] = $validatedData['reschedule_reason'];
            }

            // Send email notification if there are changes
            if (!empty($changes)) {
                // Get patient's email
                $patient_participant = $appointment->participants()
                    ->where('actor_type', 'patient')
                    ->first();
                
                $patient = Patient::with('telecoms')->find($patient_participant->actor_id);

                if ($patient) {
                    $patientEmail = $patient->telecoms()
                        ->where('system', 'email')
                        ->first();
                    
                    if ($patientEmail && $patientEmail->value) {
                        try {
                            // Load the appointment with fresh data including relationships
                            $freshAppointment = $appointment->fresh([
                                'schedule.practitioner',
                                'participants.patient',
                                'participants.practitioner'
                            ]);
                            
                            Mail::to($patientEmail->value)->send(
                                new AppointmentUpdateMail($freshAppointment, $changes)
                            );
                            
                            Log::info('Appointment reschedule email sent to patient: ' . $patientEmail->value);
                        } catch (\Exception $mailException) {
                            Log::error('Failed to send appointment reschedule email: ' . $mailException->getMessage());
                            // Don't fail the update if email fails
                        }
                    }
                }
            }

            // Commit the transaction
            DB::commit();

            return redirect()->route('patient.appointment.show', $appointment->id)->with('success', 'Appointment rescheduled successfully.');
            
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            Log::error('Failed to reschedule appointment: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to reschedule appointment: ' . $e->getMessage()]);
        }
    }

    /**
     * Show available schedules for appointment booking
     */
    public function selectSchedule()
    {
        try {
            // Get all active schedules with practitioner information
            $schedules = Schedule::with(['practitioner.user'])
                ->where('active', true)
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->get();

            return inertia('Appointment/patient-select-schedule', [
                'schedules' => $schedules,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'An error occurred while fetching schedules: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new appointment
     */
    public function create(Request $request)
    {
        try {
            $schedule_id = $request->query('schedule_id');
            
            if (!$schedule_id) {
                return redirect()->route('patient.appointment.schedules')->with('error', 'Please select a schedule first.');
            }

            // Get the selected schedule with practitioner information
            $schedule = Schedule::with(['practitioner.user'])
                ->where('id', $schedule_id)
                ->where('active', true)
                ->first();

            if (!$schedule) {
                return redirect()->route('patient.appointment.schedules')->with('error', 'Selected schedule not found or inactive.');
            }

            // Get patient information for the authenticated user
            $email = Auth::user()->email;
            $patient_ids = PatientTelecom::where('value', $email)->pluck('patient_id');
            
            $patients = collect();
            if (!$patient_ids->isEmpty()) {
                $patients = Patient::with('telecoms')->whereIn('id', $patient_ids)->get();
            }

            // Check if user has any patient profiles
            if ($patients->isEmpty()) {
                return redirect()->route('patient.appointment.schedules')->with('error', 'No patient profile found for your account. Please contact support to create a patient profile.');
            }

            return inertia('Appointment/patient-appointment-create', [
                'schedule' => $schedule,
                'patients' => $patients,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('patient.appointment.schedules')->with('error', 'An error occurred while loading the appointment form: ' . $e->getMessage());
        }
    }

    /**
     * Store a new appointment
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data (patient_id is no longer required from form)
            $validatedData = $request->validate([
                'schedule_id' => 'required|exists:schedules,id',
                'appointment_date' => 'required|date|after:now',
                'appointment_reason' => 'nullable|string|max:500',
                'notes' => 'nullable|string|max:1000'
            ]);

            // Get the first patient for the authenticated user
            $email = Auth::user()->email;
            $patient_ids = PatientTelecom::where('value', $email)->pluck('patient_id');
            
            if ($patient_ids->isEmpty()) {
                return back()->withErrors(['error' => 'No patient profile found for your account. Please contact support.']);
            }

            // Use the first patient ID
            $patient_id = $patient_ids->first();

            // Get the schedule and verify it's active
            $schedule = Schedule::with('practitioner')->findOrFail($validatedData['schedule_id']);
            
            if (!$schedule->active) {
                return back()->withErrors(['schedule_id' => 'Selected schedule is no longer available.']);
            }

            // Start transaction
            DB::beginTransaction();

            // Create the appointment
            $appointment = Appointment::create([
                'schedule_id' => $validatedData['schedule_id'],
                'appointment_date' => $validatedData['appointment_date'],
                'status' => 'pending',
                'appointment_reason' => $validatedData['appointment_reason'] ?? null,
            ]);

            // Create appointment participants
            AppointmentParticipants::create([
                'appointment_id' => $appointment->id,
                'actor_type' => 'patient',
                'actor_id' => $patient_id,
                'status' => 'accepted',
            ]);

            AppointmentParticipants::create([
                'appointment_id' => $appointment->id,
                'actor_type' => 'practitioner',
                'actor_id' => $schedule->practitioner_id,
                'status' => 'accepted',
            ]);

            // Add notes if provided
            if (!empty($validatedData['notes'])) {
                $appointment->notes()->create([
                    'author_type' => 'patient',
                    'author_id' => $patient_id,
                    'text' => $validatedData['notes'],
                ]);
            }

            // Send appointment confirmation email
            try {
                // Get patient details - ensure we get a single Patient model
                $patientModel = Patient::with('telecoms')->where('id', $patient_id)->first();
                
                if (!$patientModel) {
                    throw new \Exception('Patient not found');
                }
                
                // Get patient email from telecoms
                $patientEmail = $patientModel->telecoms()->where('system', 'email')->first();
                
                if ($patientEmail && $patientEmail->value) {
                    Mail::to($patientEmail->value)->send(
                        new AppointmentConfirmationMail($appointment, $patientModel, $schedule)
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

            // Commit the transaction
            DB::commit();

            return redirect()->route('patient.appointment.show', $appointment->id)->with('success', 'Appointment booked successfully! A confirmation email has been sent to you.');
            
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            Log::error('Failed to create patient appointment: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to book appointment: ' . $e->getMessage()]);
        }
    }
}
