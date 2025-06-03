<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Notification;

class Practitioner extends Model
{
    use HasFactory;

    protected $fillable = [
        'family_name',
        'given_name',
        'gender',
        // 'birth_date',
        // 'active',
    ];

    /**
     * A practitioner can have many telecoms (e.g., phone, email).
     */
    public function telecoms()
    {
        return $this->hasMany(PractitionerTelecoms::class);
    }

    /**
     * A practitioner can have multiple qualifications.
     */
    public function qualifications()
    {
        return $this->hasMany(PractitionerQualifications::class);
    }

    /**
     * A practitioner can be part of many appointments via participants.
     */
    public function appointments()
    {
        return $this->hasManyThrough(Appointment::class, AppointmentParticipants::class, 'practitioner_id', 'id', 'id', 'appointment_id');
    }

     /**
     * A practitioner can get notifications
     */
    // public function notifications()
    // {
    //     return $this->morphMany(Notification::class, 'recipient');
    // }
}
