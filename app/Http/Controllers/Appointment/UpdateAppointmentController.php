<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\Patient;
use App\Models\Practitioner;
use App\Mail\AppointmentUpdateMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UpdateAppointmentController extends Controller
{
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
        // Store original values for change tracking
        $originalData = [
            'schedule_id' => $appointment->schedule_id,
            'status' => $appointment->status,
            'description' => $appointment->description,
            'appointment_date' => $appointment->appointment_date,
        ];

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

            $changes = [];
            $oldPractitionerId = null;
            $newPractitionerId = null;

            // Check if schedule is being changed
            if (isset($validatedData['schedule_id']) && $validatedData['schedule_id'] != $appointment->schedule_id) {
                // Get the old and new schedule and practitioners
                $oldSchedule = Schedule::with('practitioner')->find($appointment->schedule_id);
                $newSchedule = Schedule::with('practitioner')->findOrFail($validatedData['schedule_id']);
                
                $oldPractitionerId = $oldSchedule ? $oldSchedule->practitioner_id : null;
                $newPractitionerId = $newSchedule->practitioner_id;
                
                // Track the practitioner change
                if ($oldSchedule && $newSchedule) {
                    $changes['practitioner'] = [
                        'old' => $oldSchedule->practitioner->given_name . ' ' . $oldSchedule->practitioner->family_name,
                        'new' => $newSchedule->practitioner->given_name . ' ' . $newSchedule->practitioner->family_name,
                    ];
                }
                
                // Update the practitioner participant
                $appointment->participants()
                    ->where('actor_type', 'practitioner')
                    ->update([
                        'actor_id' => $newPractitionerId,
                        'status' => 'accepted' // Reset status for new practitioner
                    ]);
            }

            // Track other changes
            foreach (['status', 'description', 'appointment_date'] as $field) {
                if (isset($validatedData[$field]) && $validatedData[$field] != $originalData[$field]) {
                    $changes[$field] = [
                        'old' => $originalData[$field],
                        'new' => $validatedData[$field],
                    ];
                }
            }

            // Update the appointment with the validated data
            $appointment->update($validatedData);

            // Send email notification if there are changes
            if (!empty($changes)) {
                // Get patient's email
                $patient_participant = $appointment->participants()
                ->where('actor_type', 'patient')
                ->first();
                
                $patient = Patient::with('telecoms')->find($patient_participant->actor_id);

                if ($patient) { //
                    
                    $patientEmail = $patient->telecoms()
                    ->where('system', 'email')
                    ->first();
                    
                    // dd($patientEmail->value );
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
                            
                            Log::info('Appointment update email sent to patient: ' . $patientEmail->value);
                        } catch (\Exception $mailException) {
                            Log::error('Failed to send appointment update email: ' . $mailException->getMessage());
                            // Don't fail the update if email fails
                        }
                    } else {
                        Log::warning('No email found for patient in appointment: ' . $appointment->id);
                    }
                } else {
                    Log::warning('No patient found for appointment: ' . $appointment->id);
                }
            }

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
}
