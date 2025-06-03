<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Notification;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'identifier',
        'family',
        'given',
        'gender',
        'birth_date',
    ];

    /**
     * A patient can have many telecom entries (e.g., phone, email).
     */
    public function telecoms(): HasMany
    {
        return $this->hasMany(PatientTelecom::class);
    }

    /**
     * A patient can have multiple contacts (emergency or next of kin).
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(PatientContact::class);
    }

    /**
     * A patient can have many appointments.
     */
    public function appointments(): HasManyThrough
    {
        return $this->hasManyThrough(Appointment::class, AppointmentParticipants::class, 'patient_id', 'id', 'id', 'appointment_id');
    }

    /**
     * A patient can get notifications
     */
    // public function notifications()
    // {
    //     return $this->morphMany(Notification::class, 'recipient');
    // }
}
