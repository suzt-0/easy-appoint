<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'appointment_id',
        'title',
        'content',
        'file_path',
        'received_at',
    ];

    /**
     * The report is linked to a patient.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * The report may be linked to an appointment.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
