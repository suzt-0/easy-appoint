<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PractitionerQualifications extends Model
{
    use HasFactory;

    protected $fillable = [
        'practitioner_id',
        'code',
        'issuer',
        'period_start',
        'period_end',
    ];

    /**
     * Each qualification belongs to a practitioner.
     */
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class);
    }
}
