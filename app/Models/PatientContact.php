<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientContact extends Model
{
     use HasFactory;

      protected $fillable = [
        'patient_id',
        'name',
        'relationship',
        'telecom',
        'address'
    ];

    /**
     * Each contact belongs to a patient.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
   
}
