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
        Schema::create('appointment_participants', function (Blueprint $table) {
            $table->id();
             $table->foreignId('appointment_id')->constrained()->onDelete('cascade');
            $table->string('actor_type'); // 'patient' or 'practitioner'
            $table->unsignedBigInteger('actor_id'); //patient_id and practitioner_id
            $table->enum('status', ['accepted', 'declined', 'tentative', 'needs-action']);
            // $table->boolean('required')->default(true);
            $table->timestamps();

            //why is this ??? need to know 
            $table->index(['actor_type', 'actor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_participants');
    }
};
