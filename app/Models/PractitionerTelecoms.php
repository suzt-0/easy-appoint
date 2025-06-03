<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PractitionerTelecoms extends Model
{
    use HasFactory;

    protected $fillable = [
        'practitioner_id',
        'system',
        'value',
        'use',
    ];

    /**
     * Each telecom entry belongs to a practitioner.
     */
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class);
    }
}
