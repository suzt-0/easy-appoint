<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_type'); // 'patient' or 'practitioner'
            $table->unsignedBigInteger('recipient_id');
            $table->string('type'); // e.g., 'appointment_reminder'
            $table->text('message');
            $table->string('delivery_method')->default('in_app'); // 'email', 'sms', etc.
            $table->string('status')->default('pending'); // 'pending', 'sent', 'failed', 'read'
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
