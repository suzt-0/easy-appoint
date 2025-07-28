<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\User;
use App\Models\UserPatient;
use Illuminate\Database\Eloquent\Collection;

class PatientUserService
{
    /**
     * Link a user to a patient
     */
    public function linkUserToPatient(User $user, Patient $patient): UserPatient
    {
        return UserPatient::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
        ]);
    }

    /**
     * Get patient for authenticated user
     */
    public function getPatientForUser(User $user): ?Patient
    {
        $userPatient = UserPatient::where('user_id', $user->id)->first();
        return $userPatient ? $userPatient->patient : null;
    }

    /**
     * Get appointments for authenticated patient user
     */
    public function getAppointmentsForUser(User $user): Collection
    {
        $patient = $this->getPatientForUser($user);
        
        if (!$patient) {
            return collect();
        }

        return $patient->appointments;
    }

    /**
     * Check if user is linked to a patient
     */
    public function userHasPatientRecord(User $user): bool
    {
        return UserPatient::where('user_id', $user->id)->exists();
    }

    /**
     * Unlink user from patient
     */
    public function unlinkUserFromPatient(User $user): bool
    {
        return UserPatient::where('user_id', $user->id)->delete();
    }

    /**
     * Find or create patient for user during registration
     * This can be used when a user registers and wants to link to existing patient record
     */
    public function findOrCreatePatientForUser(User $user, array $patientData = null): Patient
    {
        // First check if user already has a patient record
        $existingPatient = $this->getPatientForUser($user);
        
        if ($existingPatient) {
            return $existingPatient;
        }

        // If patient data is provided, create new patient
        if ($patientData) {
            $patient = Patient::create($patientData);
            $this->linkUserToPatient($user, $patient);
            return $patient;
        }

        // You might want to implement logic to match existing patients
        // based on email, phone, or other criteria
        throw new \Exception('No patient data provided and no existing patient found');
    }
}
