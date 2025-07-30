<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentParticipants;
use App\Models\Patient;
use App\Models\PatientTelecom;
use App\Mail\AppointmentCancellationMail;
use App\Models\Practitioner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class CancelAppointmentController extends Controller
{
    /**
     * Cancel the specified appointment.
     */
    public function cancel(Request $request, Appointment $appointment)
    {

        // Validate the request data
        $validatedData = $request->validate([
            'cancellation_reason' => 'nullable|string|max:500',
            'cancelled_by' => 'required|string|in:admin,patient,practitioner,system',
        ]);
        
        // If cancelled by patient, check authorization
        if ($validatedData['cancelled_by'] === 'patient') {
            $email = Auth::user()->email;
            
            // Find patient IDs associated with the authenticated user's email
            $patient_ids = PatientTelecom::where('value', $email)->pluck('patient_id');
            
            if ($patient_ids->isEmpty()) {
                return back()->withErrors(['error' => 'Patient profile not found.']);
            }
            
            // Check if the appointment belongs to this patient
            $appointment_ids = AppointmentParticipants::whereIn('actor_id', $patient_ids)
            ->where('actor_type', 'patient')
                ->pluck('appointment_id');
                
                if (!$appointment_ids->contains($appointment->id)) {
                    return back()->withErrors(['error' => 'You are not authorized to cancel this appointment.']);
            }
        }
        
        // If cancelled by practitioner, check authorization
        if ($validatedData['cancelled_by'] === 'practitioner') {
            $user = Auth::user();
            //Load appointment with participants
            $appointment->load('participants.practitioner');
            // Check if this user is a practitioner and authorized to cancel this appointment
            $practitioner_participant = $appointment->participants()
            ->where('actor_type', 'practitioner')
            ->first();
            
            if (!$practitioner_participant) {
                return back()->withErrors(['error' => 'No practitioner found for this appointment.']);
            }
            
            // Load the practitioner to check if they belong to the authenticated user
            $practitioner = Practitioner::where('id', $practitioner_participant->actor_id)
                ->with('user')
                ->first();
                
                if (!$practitioner || $practitioner->user_id !== $user->id) {
                    return back()->withErrors(['error' => 'You are not authorized to cancel this appointment.']);
                }
            }
            
            // Check if appointment can be cancelled (more than 24 hours away)
            $appointmentDate = Carbon::parse($appointment->appointment_date);
            $now = Carbon::now();
            $hoursUntilAppointment = $now->diffInHours($appointmentDate, false);

        if ($hoursUntilAppointment < 24 && $hoursUntilAppointment > 0) {
            return back()->withErrors(['error' => 'Appointments cannot be cancelled less than 24 hours before the scheduled time.']);
        }

        // Check if appointment is already cancelled
        if ($appointment->status === 'cancelled') {
            return back()->withErrors(['error' => 'This appointment is already cancelled.']);
        }

        try {
            // Start transaction
            DB::beginTransaction();

            // Update appointment status to cancelled
            $appointment->update([
                'status' => 'cancelled'
            ]);
            
            // Get patient information for email
            $patient_participant = $appointment->participants()
            ->where('actor_type', 'patient')
            ->first();
            
            $patient = Patient::with('telecoms')->find($patient_participant->actor_id);
            
            // dd($practitioner->user_id, $user->id); //authcheck
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
                            new AppointmentCancellationMail(
                                $freshAppointment,
                                $validatedData['cancellation_reason'] ?? 'No reason provided',
                                $validatedData['cancelled_by']
                            )
                        );
                        
                        Log::info('Appointment cancellation email sent to patient: ' . $patientEmail->value);
                    } catch (\Exception $mailException) {
                        Log::error('Failed to send appointment cancellation email: ' . $mailException->getMessage());
                        // Don't fail the cancellation if email fails
                    }
                } else {
                    Log::warning('No email found for patient in appointment: ' . $appointment->id);
                }
            } else {
                Log::warning('No patient found for appointment: ' . $appointment->id);
            }

            // Commit the transaction
            DB::commit();

            // Redirect based on who cancelled the appointment
            if ($validatedData['cancelled_by'] === 'patient') {
                return redirect()->route('patient.appointment.index')
                    ->with('success', 'Appointment cancelled successfully. You will receive a confirmation email shortly.');
            } elseif ($validatedData['cancelled_by'] === 'practitioner') {
                return redirect()->route('practitioner.appointments.index')
                    ->with('success', 'Appointment cancelled successfully. Patient has been notified via email.');
            } else {
                return redirect()->route('admin.appointment.show', $appointment->id)
                    ->with('success', 'Appointment cancelled successfully. Patient has been notified via email.');
            }
            
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            Log::error('Failed to cancel appointment: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to cancel appointment: ' . $e->getMessage()]);
        }
    }
}
