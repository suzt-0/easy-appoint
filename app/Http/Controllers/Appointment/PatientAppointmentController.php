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
                return redirect()->route('patient.appointments.index')->with('error', 'You are not authorized to view this appointment.');
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
            return redirect()->route('patient.appointments.index')->with('error', 'An error occurred while fetching appointment details: ' . $e->getMessage());
        }
    }
}
