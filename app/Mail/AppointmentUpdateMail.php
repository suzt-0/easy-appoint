<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentUpdateMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $patientName;
    public $practitionerName;
    public $appointmentDate;
    public $appointmentStatus;
    public $changes;

    /**
     * Create a new message instance.
     */
    public function __construct(Appointment $appointment, $changes = [])
    {
        $this->appointment = $appointment;
        $this->changes = $changes;
        
        // Get patient name from participants
        $patient = $appointment->participants()
            ->where('actor_type', 'patient')
            ->with('patient')
            ->first();
        $this->patientName = $patient && $patient->patient 
            ? $patient->patient->given_name . ' ' . $patient->patient->family_name 
            : 'Patient';

        // Get practitioner name from participants
        $practitioner = $appointment->participants()
            ->where('actor_type', 'practitioner')
            ->with('practitioner')
            ->first();
        $this->practitionerName = $practitioner && $practitioner->practitioner 
            ? $practitioner->practitioner->given_name . ' ' . $practitioner->practitioner->family_name 
            : 'Doctor';

        $this->appointmentDate = $appointment->appointment_date;
        $this->appointmentStatus = $appointment->status;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Appointment Updated - ' . config('app.name', 'EasyAppoint'))
                    ->view('emails.appointment-update')
                    ->with([
                        'patientName' => $this->patientName,
                        'practitionerName' => $this->practitionerName,
                        'appointmentDate' => $this->appointmentDate,
                        'appointmentStatus' => $this->appointmentStatus,
                        'changes' => $this->changes,
                        'appointment' => $this->appointment,
                    ]);
    }
}
