<?php

namespace App\Mail;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Practitioner;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentCancellationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $patient;
    public $practitioner;
    public $cancellationReason;
    public $cancelledBy;

    /**
     * Create a new message instance.
     */
    public function __construct(Appointment $appointment, Patient $patient, Practitioner $practitioner, string $cancellationReason = '', string $cancelledBy = 'system')
    {
        $this->appointment = $appointment;
        $this->patient = $patient;
        $this->practitioner = $practitioner;
        $this->cancellationReason = $cancellationReason;
        $this->cancelledBy = $cancelledBy;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Appointment Cancelled - ' . config('app.name', 'EasyAppoint'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-cancellation',
            with: [
                'appointment' => $this->appointment,
                'patient' => $this->patient,
                'practitioner' => $this->practitioner,
                'cancellationReason' => $this->cancellationReason,
                'cancelledBy' => $this->cancelledBy,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
