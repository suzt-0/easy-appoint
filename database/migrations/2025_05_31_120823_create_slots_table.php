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
        Schema::create('slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('schedules')->onDelete('cascade');
            $table->dateTime('start');
            $table->dateTime('end');
            //removed patient_id foreign key since it's not required in our context
            // $table->foreignId('patient_id')->nullable()->constrained('patients')->nullOnDelete(); // Nullable for free slots
            $table->string('description')->nullable(); // Optional description for the slot
            $table->enum('status', ['free', 'busy', 'entered-in-error'])->default('free'); 
            //[ busy | free | busy-unavailable | busy-tentative | entered-in-error ] values must be within the given value set
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slots');
    }
};
