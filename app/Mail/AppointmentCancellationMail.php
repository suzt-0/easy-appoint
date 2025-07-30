<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentCancellationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $patientName;
    public $practitionerName;
    public $appointmentDate;
    public $cancellationReason;
    public $cancelledBy;
    public $cancellationDate;

    /**
     * Create a new message instance.
     */
    public function __construct(Appointment $appointment, string $cancellationReason = '', string $cancelledBy = 'system')
    {
        $this->appointment = $appointment;
        $this->cancellationReason = $cancellationReason;
        $this->cancelledBy = $cancelledBy;
        $this->cancellationDate = now()->format('l, F j, Y \a\t g:i A');
        
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
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Appointment Cancelled - ' . config('app.name', 'EasyAppoint'))
                    ->view('emails.appointment-cancellation')
                    ->with([
                        'patientName' => $this->patientName,
                        'practitionerName' => $this->practitionerName,
                        'appointmentDate' => $this->appointmentDate,
                        'cancellationReason' => $this->cancellationReason,
                        'cancelledBy' => $this->cancelledBy,
                        'cancellationDate' => $this->cancellationDate,
                        'appointment' => $this->appointment,
                    ]);
    }
}
