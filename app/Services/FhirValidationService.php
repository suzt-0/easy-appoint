<?php

namespace App\Services;

class FhirValidationService
{
    /**
     * Validate a FHIR Patient resource and return issues.
     */
    public static function validatePatient(array $fhirPatient): array
    {
        $issues = [];

        // Check required fields
        if (!isset($fhirPatient['resourceType']) || $fhirPatient['resourceType'] !== 'Patient') {
            $issues[] = self::createIssue('error', 'invalid', 'Missing or invalid resourceType');
        }

        if (!isset($fhirPatient['id'])) {
            $issues[] = self::createIssue('error', 'required', 'Missing required field: id');
        }

        // Check birthDate compliance
        if (isset($fhirPatient['birthDate'])) {
            if ($fhirPatient['birthDate'] === null) {
                $issues[] = self::createIssue('error', 'invalid', 'birthDate cannot be null - remove field or provide valid date');
            } elseif (!self::isValidFhirDate($fhirPatient['birthDate'])) {
                $issues[] = self::createIssue('error', 'invalid', 'birthDate must be in FHIR format (YYYY, YYYY-MM, or YYYY-MM-DD)');
            }
        }

        // Check gender compliance
        if (isset($fhirPatient['gender'])) {
            $validGenders = ['male', 'female', 'other', 'unknown'];
            if (!in_array($fhirPatient['gender'], $validGenders)) {
                $issues[] = self::createIssue('error', 'invalid', 'gender must be one of: ' . implode(', ', $validGenders));
            }
        }

        // Check name structure
        if (!isset($fhirPatient['name']) || !is_array($fhirPatient['name']) || empty($fhirPatient['name'])) {
            $issues[] = self::createIssue('error', 'required', 'Patient must have at least one name');
        } else {
            foreach ($fhirPatient['name'] as $index => $name) {
                if (!isset($name['family']) && !isset($name['given'])) {
                    $issues[] = self::createIssue('error', 'invalid', "name[$index] must have either family or given name");
                }
            }
        }

        // Check telecom validation
        if (isset($fhirPatient['telecom']) && is_array($fhirPatient['telecom'])) {
            foreach ($fhirPatient['telecom'] as $index => $telecom) {
                $telecomIssues = self::validateTelecom($telecom, $index);
                $issues = array_merge($issues, $telecomIssues);
            }
        }

        // Best practice warnings
        $warnings = self::getBestPracticeWarnings($fhirPatient);
        $issues = array_merge($issues, $warnings);

        return $issues;
    }

    /**
     * Validate telecom entries.
     */
    private static function validateTelecom(array $telecom, int $index): array
    {
        $issues = [];

        if (!isset($telecom['system'])) {
            $issues[] = self::createIssue('error', 'required', "telecom[$index] missing required field: system");
        }

        if (!isset($telecom['value'])) {
            $issues[] = self::createIssue('error', 'required', "telecom[$index] missing required field: value");
        }

        if (isset($telecom['system']) && isset($telecom['value'])) {
            switch ($telecom['system']) {
                case 'phone':
                    if (!preg_match('/^\+[1-9]\d{1,14}$/', $telecom['value'])) {
                        $issues[] = self::createIssue('error', 'invalid', 
                            "telecom[$index] phone value '{$telecom['value']}' should be in E.164 format (e.g., +977XXXXXXXXX)");
                    }
                    break;

                case 'email':
                    if (!filter_var($telecom['value'], FILTER_VALIDATE_EMAIL)) {
                        $issues[] = self::createIssue('error', 'invalid', 
                            "telecom[$index] email value '{$telecom['value']}' is not a valid email address");
                    }
                    break;
            }
        }

        if (isset($telecom['use'])) {
            $validUses = ['home', 'work', 'temp', 'old', 'mobile'];
            if (!in_array($telecom['use'], $validUses)) {
                $issues[] = self::createIssue('warning', 'invalid', 
                    "telecom[$index] use '{$telecom['use']}' should be one of: " . implode(', ', $validUses));
            }
        }

        return $issues;
    }

    /**
     * Get best practice warnings.
     */
    private static function getBestPracticeWarnings(array $fhirPatient): array
    {
        $warnings = [];

        // Missing recommended fields
        if (!isset($fhirPatient['identifier'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding patient identifier for better interoperability');
        }

        if (!isset($fhirPatient['address'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding patient address information');
        }

        if (!isset($fhirPatient['meta'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding meta information (lastUpdated, versionId)');
        }

        if (!isset($fhirPatient['birthDate'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding birthDate for better patient identification');
        }

        if (!isset($fhirPatient['gender'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding gender information');
        }

        // Check for name use attribute
        if (isset($fhirPatient['name']) && is_array($fhirPatient['name'])) {
            foreach ($fhirPatient['name'] as $index => $name) {
                if (!isset($name['use'])) {
                    $warnings[] = self::createIssue('information', 'incomplete', 
                        "Best practice: Consider adding 'use' attribute to name[$index] (e.g., 'official', 'usual')");
                }
            }
        }

        return $warnings;
    }

    /**
     * Check if date is in valid FHIR format.
     */
    private static function isValidFhirDate(string $date): bool
    {
        // FHIR date format: YYYY, YYYY-MM, or YYYY-MM-DD
        return preg_match('/^\d{4}(-\d{2}(-\d{2})?)?$/', $date) && 
               strtotime($date) !== false;
    }

    /**
     * Create a FHIR OperationOutcome issue.
     */
    private static function createIssue(string $severity, string $code, string $details): array
    {
        return [
            'severity' => $severity,
            'code' => $code,
            'details' => [
                'text' => $details
            ]
        ];
    }

    /**
     * Check for duplicate telecom values across patients.
     */
    public static function checkDuplicateTelecoms(array $patients): array
    {
        $telecoms = [];
        $duplicates = [];

        foreach ($patients as $patientIndex => $patient) {
            if (!isset($patient['telecom'])) continue;

            foreach ($patient['telecom'] as $telecom) {
                $key = $telecom['system'] . '|' . $telecom['value'];
                
                if (isset($telecoms[$key])) {
                    $duplicates[] = [
                        'severity' => 'warning',
                        'code' => 'duplicate',
                        'details' => [
                            'text' => "Duplicate {$telecom['system']} value '{$telecom['value']}' found in patients {$telecoms[$key]} and {$patientIndex}"
                        ]
                    ];
                } else {
                    $telecoms[$key] = $patientIndex;
                }
            }
        }

        return $duplicates;
    }

    /**
     * Suggest improvements for patient data quality.
     */
    public static function suggestImprovements(array $fhirPatient): array
    {
        $suggestions = [];

        // Phone number formatting suggestions
        if (isset($fhirPatient['telecom'])) {
            foreach ($fhirPatient['telecom'] as $index => $telecom) {
                if ($telecom['system'] === 'phone' && isset($telecom['value'])) {
                    $value = $telecom['value'];
                    
                    // Check if it needs E.164 formatting
                    if (!preg_match('/^\+/', $value)) {
                        $suggestions[] = "telecom[$index]: Phone number '$value' should include country code (e.g., +977...)";
                    }
                    
                    // Check for mobile vs home use
                    if (preg_match('/^\+977(98|97)/', $value) && 
                        (!isset($telecom['use']) || $telecom['use'] !== 'mobile')) {
                        $suggestions[] = "telecom[$index]: Phone number '$value' appears to be mobile, consider setting use='mobile'";
                    }
                }
            }
        }

        // Identifier suggestions
        if (!isset($fhirPatient['identifier'])) {
            $suggestions[] = "Add unique patient identifier for better tracking and interoperability";
        }

        // Address suggestions
        if (!isset($fhirPatient['address'])) {
            $suggestions[] = "Add patient address information for complete demographics";
        }

        // Contact person suggestions
        if (!isset($fhirPatient['contact'])) {
            $suggestions[] = "Consider adding emergency contact information";
        }

        return $suggestions;
    }

    /**
     * Validate a FHIR Appointment resource and return issues.
     */
    public static function validateAppointment(array $fhirAppointment): array
    {
        $issues = [];

        // Check required fields
        if (!isset($fhirAppointment['resourceType']) || $fhirAppointment['resourceType'] !== 'Appointment') {
            $issues[] = self::createIssue('error', 'invalid', 'Missing or invalid resourceType');
        }

        if (!isset($fhirAppointment['id'])) {
            $issues[] = self::createIssue('error', 'required', 'Missing required field: id');
        }

        if (!isset($fhirAppointment['status'])) {
            $issues[] = self::createIssue('error', 'required', 'Missing required field: status');
        } else {
            $validStatuses = ['proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow', 'entered-in-error'];
            if (!in_array($fhirAppointment['status'], $validStatuses)) {
                $issues[] = self::createIssue('error', 'invalid', 'status must be one of: ' . implode(', ', $validStatuses));
            }
        }

        // Check participant field (required)
        if (!isset($fhirAppointment['participant']) || !is_array($fhirAppointment['participant']) || empty($fhirAppointment['participant'])) {
            $issues[] = self::createIssue('error', 'required', 'Appointment must have at least one participant');
        } else {
            foreach ($fhirAppointment['participant'] as $index => $participant) {
                $participantIssues = self::validateAppointmentParticipant($participant, $index);
                $issues = array_merge($issues, $participantIssues);
            }
        }

        // Check null description compliance
        if (isset($fhirAppointment['description']) && $fhirAppointment['description'] === null) {
            $issues[] = self::createIssue('error', 'invalid', 'description cannot be null - remove field or provide valid description');
        }

        // Check start time format
        if (isset($fhirAppointment['start'])) {
            if (!self::isValidFhirDateTime($fhirAppointment['start'])) {
                $issues[] = self::createIssue('error', 'invalid', 'start must be in valid FHIR dateTime format (YYYY-MM-DDTHH:mm:ss[Z|±HH:mm])');
            }
        }

        // Check end time format
        if (isset($fhirAppointment['end'])) {
            if (!self::isValidFhirDateTime($fhirAppointment['end'])) {
                $issues[] = self::createIssue('error', 'invalid', 'end must be in valid FHIR dateTime format (YYYY-MM-DDTHH:mm:ss[Z|±HH:mm])');
            }
        }

        // Best practice warnings
        $warnings = self::getAppointmentBestPracticeWarnings($fhirAppointment);
        $issues = array_merge($issues, $warnings);

        return $issues;
    }

    /**
     * Validate appointment participant.
     */
    private static function validateAppointmentParticipant(array $participant, int $index): array
    {
        $issues = [];

        // Check required actor field
        if (!isset($participant['actor'])) {
            $issues[] = self::createIssue('error', 'required', "participant[$index] missing required field: actor");
        } else {
            if (!isset($participant['actor']['reference'])) {
                $issues[] = self::createIssue('error', 'required', "participant[$index].actor missing required field: reference");
            } else {
                $reference = $participant['actor']['reference'];
                if (!preg_match('/^(Patient|Practitioner|Device|HealthcareService|RelatedPerson|Location)\/[A-Za-z0-9\-\.]{1,64}$/', $reference)) {
                    $issues[] = self::createIssue('error', 'invalid', 
                        "participant[$index].actor.reference '$reference' must be in format ResourceType/id");
                }
            }
        }

        // Check participant status
        if (isset($participant['status'])) {
            $validStatuses = ['accepted', 'declined', 'tentative', 'needs-action'];
            if (!in_array($participant['status'], $validStatuses)) {
                $issues[] = self::createIssue('error', 'invalid', 
                    "participant[$index] status must be one of: " . implode(', ', $validStatuses));
            }
        }

        return $issues;
    }

    /**
     * Get best practice warnings for appointments.
     */
    private static function getAppointmentBestPracticeWarnings(array $fhirAppointment): array
    {
        $warnings = [];

        // Missing recommended fields
        if (!isset($fhirAppointment['end'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding end time for appointment duration');
        }

        if (!isset($fhirAppointment['created'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding created timestamp');
        }

        if (!isset($fhirAppointment['reasonCode'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding reasonCode for appointment purpose');
        }

        if (!isset($fhirAppointment['serviceType'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding serviceType for better categorization');
        }

        if (!isset($fhirAppointment['identifier'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding identifier for better appointment tracking');
        }

        if (!isset($fhirAppointment['meta'])) {
            $warnings[] = self::createIssue('information', 'incomplete', 
                'Best practice: Consider adding meta information (lastUpdated, versionId)');
        }

        // Check participant types
        if (isset($fhirAppointment['participant']) && is_array($fhirAppointment['participant'])) {
            foreach ($fhirAppointment['participant'] as $index => $participant) {
                if (!isset($participant['type'])) {
                    $warnings[] = self::createIssue('information', 'incomplete', 
                        "Best practice: Consider adding type to participant[$index] for role clarification");
                }
                
                if (!isset($participant['required'])) {
                    $warnings[] = self::createIssue('information', 'incomplete', 
                        "Best practice: Consider adding required field to participant[$index] (required|optional|information-only)");
                }
            }
        }

        return $warnings;
    }

    /**
     * Check if dateTime is in valid FHIR format.
     */
    private static function isValidFhirDateTime(string $dateTime): bool
    {
        // FHIR dateTime format: YYYY-MM-DDTHH:mm:ss[.sss][Z|(+|-)HH:mm]
        $pattern = '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/';
        return preg_match($pattern, $dateTime) && strtotime($dateTime) !== false;
    }
}
