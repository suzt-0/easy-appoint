<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slot extends Model
{
   use HasFactory;

    protected $fillable = [
       'schedule_id',
        'start',
        'end',
        'status',
    ];

    /**
     * Each slot belongs to a practitioner.
     */
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class);
    }
}
