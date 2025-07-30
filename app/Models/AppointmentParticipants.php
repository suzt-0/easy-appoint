<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentParticipants extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'actor_type',
        'actor_id',
        'status',
    ];

    /**
     * Belongs to an appointment.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get the participant's patient (only if actor_type is 'patient').
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'actor_id');
    }

    /**
     * Get the participant's practitioner (only if actor_type is 'practitioner').
     */
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class, 'actor_id');
    }

    /**
     * Get the actor (patient or practitioner) based on actor_type.
     */
    public function getActorAttribute()
    {
        if ($this->actor_type === 'patient') {
            return $this->patient;
        } elseif ($this->actor_type === 'practitioner') {
            return $this->practitioner;
        }
        return null;
    }

    /**
     * Check if this participant is a patient.
     */
    public function isPatient(): bool
    {
        return $this->actor_type === 'patient';
    }

    /**
     * Check if this participant is a practitioner.
     */
    public function isPractitioner(): bool
    {
        return $this->actor_type === 'practitioner';
    }
}
