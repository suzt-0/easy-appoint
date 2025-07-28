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
        'family_name',
        'given_name',
        'gender',
        'birth_date',
        'active',
        // 'user_id', // Foreign key to the users table
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
     * A patient belongs to a user.
     */

    public function user()
    {
        return $this->hasOneThrough(User::class, UserPatient::class, 'patient_id', 'id', 'id', 'user_id');
    }

    /**
     * Get the user-patient relationship record
     */
    public function userPatient()
    {
        return $this->hasOne(UserPatient::class);
    }

    /**
     * Check if this patient is linked to a user account
     */
    public function hasUserAccount()
    {
        return $this->userPatient()->exists();
    }

    /**
     * A patient can get notifications
     */
    // public function notifications()
    // {
    //     return $this->morphMany(Notification::class, 'recipient');
    // }
}
