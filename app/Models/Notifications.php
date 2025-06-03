<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_type',
        'recipient_id',
        'type',
        'message',
        'delivery_method',
        'status',
        'scheduled_at',
        'sent_at',
    ];

    /**
     * Polymorphic relation to the recipient (patient or practitioner).
     */
    public function recipient()
    {
        return $this->morphTo();
    }
}
