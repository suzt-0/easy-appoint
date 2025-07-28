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
     * Participant may be a patient (when actor_type is 'patient').
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'actor_id')->where('actor_type', 'patient');
    }

    /**
     * Participant may be a practitioner (when actor_type is 'practitioner').
     */
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class, 'actor_id')->where('actor_type', 'practitioner');
    }
}
