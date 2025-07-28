<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    //define the relationship with practitioner
    public function practitioner()
    {
        return $this->hasOne(Practitioner::class);
    }

    //define the relationship with patient through pivot table
    public function patient()
    {
        return $this->hasOneThrough(Patient::class, UserPatient::class, 'user_id', 'id', 'id', 'patient_id');
    }

    /**
     * Get the user-patient relationship record
     */
    public function userPatient()
    {
        return $this->hasOne(UserPatient::class);
    }

    /**
     * Get patient appointments through service
     * Use PatientUserService::getAppointmentsForUser() for better control
     */
    public function getPatientAppointments()
    {
        $patientUserService = app(\App\Services\PatientUserService::class);
        return $patientUserService->getAppointmentsForUser($this);
    }
}
