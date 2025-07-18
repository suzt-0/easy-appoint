<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'practitioner_id',
        'service_category',
        'service_type',
        'specialty',
        'active',
        'day_of_week',
        'start_time',
        'end_time',
        'slot_duration', 
    ];

    /**
     * A schedule belongs to a practitioner.
     */
    public function practitioner() //many-to-one relationship
    {
        return $this->belongsTo(Practitioner::class);
    }

    /**
     * A schedule can have many slots.
     */
    public function slots() //one-to-many relationship
    {
        return $this->hasMany(Slot::class);
    }
}
