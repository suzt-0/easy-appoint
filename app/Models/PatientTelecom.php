<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientTelecom extends Model
{
    use HasFactory; 
     protected $fillable = [
        'patient_id',
        'system',
        'value',
        'use',
        'preferred',
    ];

    /**
     * Each telecom entry belongs to a patient.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
