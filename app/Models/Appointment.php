<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
     use HasFactory;

    protected $fillable = [
        'status',
        'start',
        'end',
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
     * The appointment can have one slot.
     */
    public function slot()
    {
        return $this->belongsTo(Slot::class, 'slot_id', 'id'); // assuming 'slot_id' is the foreign key in the Appointment model
    }
}
