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
     * Participant may be a patient.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Participant may be a practitioner.
     */
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class);
    }
}
