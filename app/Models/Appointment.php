<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
     use HasFactory;

    protected $fillable = [
        'schedule_id',
        'status',
        'appointment_date',
        'description',
    ];

    /**
     * The appointment can have many participants (patients/practitioners).
     */
    public function participants()
    {
        return $this->hasMany(AppointmentParticipants::class);
    }

    /**
     * The appointment can have many notes.
     */
    public function notes()
    {
        return $this->hasMany(AppointmentNotes::class);
    }

    /**
     * The appointment is assosiated with a schedule.
     */
    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id', 'id'); 
    }

    /**
     * The appointment can have one patient.
     */
    public function patient(){
        return $this->hasOneThrough(
            Patient::class,
            AppointmentParticipants::class,
            'appointment_id', // Foreign key on AppointmentParticipants table
            'id', // Foreign key on Patient table
            'id', // Local key on Appointment table
            'actor_id' // Local key on AppointmentParticipants table
        )->where('actor_type', 'patient');                          
    }
    /**
     * The appointment can have one patient.
     */
    public function practitioner(){
        return $this->hasOneThrough(
            Practitioner::class,
            AppointmentParticipants::class,
            'appointment_id', // Foreign key on AppointmentParticipants table
            'id', // Foreign key on practitioner table
            'id', // Local key on Appointment table
            'actor_id' // Local key on AppointmentParticipants table
        )->where('actor_type', 'practitioner');                          
    }
}
