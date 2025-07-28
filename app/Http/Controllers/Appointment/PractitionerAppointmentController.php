<?php

namespace App\Http\Controllers\Appointment;
use App\Http\Controllers\Controller;

use App\Models\Appointment;
use App\Models\AppointmentParticipants;
use App\Models\Practitioner;
use App\Models\PractitionerTelecoms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PractitionerAppointmentController extends Controller
{
    /**
     * Get appointment IDs for the authenticated practitioner user
     */
    private function getPractitionerAppointmentIds()
    {
        // Get the authenticated user
        $user_id = Auth::user()->id;

        // Find practitioner ID associated with the user
        $practitioner = Practitioner::where('user_id', $user_id)->first();

        if (!$practitioner) {
            return collect(); // Return empty collection if no practitioner found
        }

        dd($practitioner);

        // Get appointment_ids via appointment_participants
        $appointment_ids = AppointmentParticipants::where('actor_id', $practitioner->id)
            ->where('actor_type', 'practitioner')
            ->pluck('appointment_id');

        return $appointment_ids;
    }

    /**
     * Get appointments for the authenticated practitioner user
     */
    public function index()
    {
        
        try {
            // Get appointment IDs for the authenticated practitioner
            $appointment_ids = $this->getPractitionerAppointmentIds();
            
            if ($appointment_ids->isEmpty()) {
               //instead of redirectingto dashboard show that there are no appointments 
               //return inertia view with a message
                return inertia('Appointment/practitioner-appointment-index', [
                    'appointments' => collect(),
                    'message' => 'No appointments found for your account.'
                ]);
            }

            // Get the appointments based on the IDs
            $appointments = Appointment::whereIn('id', $appointment_ids)
                ->with([
                    'participants.patient', 
                    'participants.practitioner',
                    'schedule',
                    'patient',
                    'practitioner'
                ])
                ->orderBy('appointment_date', 'desc')
                ->get();

            return inertia('Appointment/practitioner-appointment-index', [
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
            // Get appointment IDs for the authenticated practitioner
            $appointment_ids = $this->getPractitionerAppointmentIds();

            if ($appointment_ids->isEmpty()) {
                return redirect()->route('dashboard')->with('error', 'Practitioner profile not found.');
            }

            // Check if the requested appointment belongs to this practitioner
            if (!$appointment_ids->contains($appointment->id)) {
                return redirect()->route('practitioner.appointments.index')->with('error', 'You are not authorized to view this appointment.');
            }

            $appointment->load([
                'schedule.practitioner.user',
                'participants.patient.telecoms',
                'participants.practitioner',
                'patient.telecoms',
                'practitioner',
                'notes'
            ]);
            
            return inertia('Appointment/practitioner-appointment-show', [
                'appointment' => $appointment,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('practitioner.appointments.index')->with('error', 'An error occurred while fetching appointment details: ' . $e->getMessage());
        }
    }
}
