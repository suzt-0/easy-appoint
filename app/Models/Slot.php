<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slot extends Model
{
   use HasFactory;

    protected $fillable = [
        // 'schedule_id',
        // 'start',
        // 'end',
        // 'description', 
        // 'status',
    ];

    
    /**
     * Each slot belongs to a schedule.
    */
    // public function schedule()
    // {
    //     return $this->belongsTo(Schedule::class); // it is a many-to-one relationship
    // }

    // /**
    //  * Each slot belongs to a practitioner through a schedule.
    //  * This is a many-to-one relationship.
    //  */
    // public function practitioner()
    // {
    //     return $this->belongsToThrough(Practitioner::class, Schedule::class, 'id', 'schedule_id', 'id', 'practitioner_id');
    // }

    // /**
    //  * Each slot can have one appointment.
    //  * This is a one-to-one relationship.
    //  */
    // public function appointment()
    // {
    //     return $this->hasOne(Appointment::class, 'slot_id', 'id'); // assuming 'slot_id' is the foreign key in the Appointment model
    // }
}
