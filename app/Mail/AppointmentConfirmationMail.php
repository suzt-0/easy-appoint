<?php

namespace App\Mail;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Schedule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $patient;
    public $schedule;
    public $practitioner;

    /**
     * Create a new message instance.
     */
    public function __construct(Appointment $appointment, Patient $patient, Schedule $schedule)
    {
        $this->appointment = $appointment;
        $this->patient = $patient;
        $this->schedule = $schedule;
        $this->practitioner = $schedule->practitioner;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Appointment Confirmation - ' . config('app.name', 'EasyAppoint'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-confirmation',
            with: [
                'appointment' => $this->appointment,
                'patient' => $this->patient,
                'schedule' => $this->schedule,
                'practitioner' => $this->practitioner,
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
