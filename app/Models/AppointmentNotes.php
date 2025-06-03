<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentNotes extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'text',
    ];

    /**
     * The note belongs to an appointment.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

}
