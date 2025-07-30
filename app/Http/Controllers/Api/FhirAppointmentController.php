<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentParticipants;
use App\Models\Patient;
use App\Models\Practitioner;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class FhirAppointmentController extends Controller
{
    /**
     * Display a listing of appointments in FHIR format.
     */    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('_count', 20); // FHIR standard parameter
        $appointments = Appointment::with([
            'participants', 
            'participants.patient', 
            'participants.practitioner'
        ])->paginate($perPage);

        $bundle = [
            'resourceType' => 'Bundle',
            'id' => 'appointment-search-' . uniqid(),
            'type' => 'searchset',
            'total' => $appointments->total(),
            'entry' => []
        ];

        foreach ($appointments as $appointment) {
            $bundle['entry'][] = [
                'resource' => $this->transformToFhir($appointment),
                'search' => [
                    'mode' => 'match'
                ]
            ];
        }

        return response()->json($bundle)
            ->header('Content-Type', 'application/fhir+json');
    }

    /**
     * Display the specified appointment in FHIR format.
     */    public function show(string $id): JsonResponse
    {
        $appointment = Appointment::with([
            'participants', 
            'participants.patient', 
            'participants.practitioner'
        ])->findOrFail($id);
        
        return response()->json($this->transformToFhir($appointment))
            ->header('Content-Type', 'application/fhir+json');
    }

    /**
     * Store a newly created appointment from FHIR format.
     */
    public function store(Request $request): JsonResponse
    {
        $fhirData = $request->json()->all();
        
        // Validate FHIR resource type
        if (!isset($fhirData['resourceType']) || $fhirData['resourceType'] !== 'Appointment') {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [[
                    'severity' => 'error',
                    'code' => 'invalid',
                    'details' => ['text' => 'Resource type must be Appointment']
                ]]
            ], 400)->header('Content-Type', 'application/fhir+json');
        }

        // Extract data from FHIR format
        $appointmentData = $this->extractFromFhir($fhirData);
        
        // Create appointment
        $appointment = Appointment::create($appointmentData['appointment']);
        
        // Create participants
        foreach ($appointmentData['participants'] as $participantData) {
            $appointment->participants()->create($participantData);
        }

        return response()->json($this->transformToFhir($appointment->load([
            'participants', 
            'participants.patient', 
            'participants.practitioner'
        ])), 201)
            ->header('Content-Type', 'application/fhir+json')
            ->header('Location', url("/api/fhir/R4/Appointment/{$appointment->id}"));
    }

    /**
     * Update the specified appointment from FHIR format.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $fhirData = $request->json()->all();
        
        // Validate FHIR resource type
        if (!isset($fhirData['resourceType']) || $fhirData['resourceType'] !== 'Appointment') {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [[
                    'severity' => 'error',
                    'code' => 'invalid',
                    'details' => ['text' => 'Resource type must be Appointment']
                ]]
            ], 400)->header('Content-Type', 'application/fhir+json');
        }

        // Extract data from FHIR format
        $appointmentData = $this->extractFromFhir($fhirData);
        
        // Update appointment
        $appointment->update($appointmentData['appointment']);
          // Update participants - delete existing and create new ones
        $appointment->participants()->delete();
        foreach ($appointmentData['participants'] as $participantData) {
            $appointment->participants()->create($participantData);
        }

        return response()->json($this->transformToFhir($appointment->load([
            'participants', 
            'participants.patient', 
            'participants.practitioner'
        ])))
            ->header('Content-Type', 'application/fhir+json');
    }

    /**
     * Patch the specified appointment (partial update).
     */
    public function patch(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $fhirData = $request->json()->all();
        
        // Handle status updates
        if (isset($fhirData['status'])) {
            $appointment->update(['status' => $fhirData['status']]);
        }

        // Handle description updates
        if (isset($fhirData['description'])) {
            $appointment->update(['description' => $fhirData['description']]);
        }

        // Handle start time updates
        if (isset($fhirData['start'])) {
            $startDateTime = Carbon::parse($fhirData['start']);
            $appointment->update([
                'appointment_date' => $startDateTime->format('Y-m-d')
            ]);        }

        return response()->json($this->transformToFhir($appointment->load([
            'participants', 
            'participants.patient', 
            'participants.practitioner'
        ])))
            ->header('Content-Type', 'application/fhir+json');
    }    /**
     * Transform Appointment model to FHIR format with compliance validation.
     */
    private function transformToFhir(Appointment $appointment): array
    {
        // Validate appointment data for FHIR compliance before transformation
        $validationResult = $this->validateAppointmentForFhir($appointment);
        
        // Log warnings but continue processing
        if (!empty($validationResult['warnings'])) {
            \Log::warning('FHIR Appointment warnings for ID ' . $appointment->id, $validationResult['warnings']);
        }

        // Start with basic required fields
        $fhirAppointment = [
            'resourceType' => 'Appointment',
            'id' => (string) $appointment->id,
            'meta' => [
                'versionId' => '1',
                'lastUpdated' => $appointment->updated_at->toISOString(),
                'profile' => ['http://hl7.org/fhir/StructureDefinition/Appointment']
            ],
            'status' => $this->getValidStatus($appointment->status),
        ];

        // Add identifier for better tracking
        $fhirAppointment['identifier'] = [[
            'use' => 'usual',
            'system' => 'http://easy-appoint.local/appointment-id',
            'value' => 'APT-' . str_pad($appointment->id, 6, '0', STR_PAD_LEFT)
        ]];

        // Add serviceType if available (optional but recommended)
        $fhirAppointment['serviceType'] = [[
            'coding' => [[
                'system' => 'http://terminology.hl7.org/CodeSystem/service-type',
                'code' => '124',
                'display' => 'General Practice'
            ]],
            'text' => 'General Medical Consultation'
        ]];

        // Add start time (required)
        if ($appointment->appointment_date) {
            $fhirAppointment['start'] = $this->formatDateTime($appointment->appointment_date, '09:00:00');
            
            // Add end time (recommended) - default 30 min appointment
            $endTime = Carbon::parse($fhirAppointment['start'])->addMinutes(30);
            $fhirAppointment['end'] = $endTime->toISOString();
        }

        // Add description only if not null (FHIR compliance)
        if (!is_null($appointment->description) && trim($appointment->description) !== '') {
            $fhirAppointment['description'] = $appointment->description;
        }

        // Add created timestamp (recommended)
        if ($appointment->created_at) {
            $fhirAppointment['created'] = $appointment->created_at->toISOString();
        }        // Add participants with proper validation - CRITICAL FHIR REQUIREMENT
        $participants = [];
        if ($appointment->participants && $appointment->participants->count() > 0) {
            foreach ($appointment->participants as $participant) {
                $participantData = $this->buildParticipantData($participant);
                if ($participantData) {
                    $participants[] = $participantData;
                }
            }
        }// FHIR COMPLIANCE: At least one participant is REQUIRED
        if (empty($participants)) {
            // CRITICAL: This is a severe compliance error that should be handled properly
            // Creating a placeholder participant violates FHIR as it lacks proper reference
            // In production, this appointment should be rejected or fixed at data source
            
            // Log the critical error for monitoring
            \Log::error("FHIR Compliance Error: Appointment ID {$appointment->id} has no valid participants with actor references");
            
            // Return an OperationOutcome instead of invalid FHIR resource
            return [
                'resourceType' => 'OperationOutcome',
                'issue' => [[
                    'severity' => 'error',
                    'code' => 'required',
                    'details' => [
                        'text' => "FHIR Compliance Error: Appointment must have at least one participant with valid actor reference (Patient/id or Practitioner/id). Current appointment has no linked participants."
                    ],
                    'diagnostics' => "Appointment ID: {$appointment->id} - No participants with valid patient_id or practitioner_id found"
                ]]
            ];
        }

        $fhirAppointment['participant'] = $participants;

        // Add reasonCode if available (optional but recommended)
        $fhirAppointment['reasonCode'] = [[
            'coding' => [[
                'system' => 'http://snomed.info/sct',
                'code' => '185349003',
                'display' => 'Encounter for check up'
            ]],
            'text' => 'Routine medical consultation'
        ]];

        return $fhirAppointment;
    }    /**
     * Build participant data with strict FHIR compliance validation.
     */
    private function buildParticipantData($participant): ?array
    {
        // CRITICAL VALIDATION: Ensure actor reference exists and is valid
        $actorReference = null;
        $actorDisplay = null;
        $participantType = null;

        // Check actor type and load appropriate relationship
        if ($participant->actor_type === 'patient' && $participant->patient) {
            // Validate patient data exists and is complete
            if (!$participant->patient->id || 
                !$participant->patient->given_name || 
                !$participant->patient->family_name) {
                \Log::warning("Invalid patient participant: Missing required fields", [
                    'participant_id' => $participant->id ?? 'unknown',
                    'patient_id' => $participant->patient->id ?? 'missing',
                    'actor_type' => $participant->actor_type,
                    'actor_id' => $participant->actor_id
                ]);
                return null; // Skip invalid participant
            }

            $actorReference = "Patient/{$participant->patient->id}";
            $actorDisplay = trim("{$participant->patient->given_name} {$participant->patient->family_name}");
            $participantType = [
                'coding' => [[
                    'system' => 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                    'code' => 'PPRF',
                    'display' => 'primary performer'
                ]],
                'text' => 'Patient'
            ];
            
        } elseif ($participant->actor_type === 'practitioner' && $participant->practitioner) {
            // Validate practitioner data exists and is complete
            if (!$participant->practitioner->id || 
                !$participant->practitioner->given_name || 
                !$participant->practitioner->family_name) {
                \Log::warning("Invalid practitioner participant: Missing required fields", [
                    'participant_id' => $participant->id ?? 'unknown',
                    'practitioner_id' => $participant->practitioner->id ?? 'missing',
                    'actor_type' => $participant->actor_type,
                    'actor_id' => $participant->actor_id
                ]);
                return null; // Skip invalid participant
            }

            $actorReference = "Practitioner/{$participant->practitioner->id}";
            $actorDisplay = "Dr. " . trim("{$participant->practitioner->given_name} {$participant->practitioner->family_name}");
            $participantType = [
                'coding' => [[
                    'system' => 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                    'code' => 'ATND',
                    'display' => 'attender'
                ]],
                'text' => 'Healthcare Provider'
            ];
              } else {
            // CRITICAL ERROR: No valid actor reference found or relationship not loaded
            \Log::error("Participant has no valid patient or practitioner reference", [
                'participant_id' => $participant->id ?? 'unknown',
                'actor_type' => $participant->actor_type,
                'actor_id' => $participant->actor_id
            ]);
            return null;
        }

        // Validate actor reference format (FHIR requirement)
        if (!preg_match('/^(Patient|Practitioner)\/[0-9]+$/', $actorReference)) {
            \Log::error("Invalid actor reference format", [
                'reference' => $actorReference,
                'expected_format' => 'ResourceType/numericId'
            ]);
            return null;
        }

        // Build FHIR-compliant participant
        $participantData = [
            'actor' => [
                'reference' => $actorReference,  // REQUIRED: Must be valid resource reference
                'display' => $actorDisplay      // RECOMMENDED: Human-readable name
            ],
            'status' => $this->getValidParticipantStatus($participant->status ?? 'accepted'),
            'required' => 'required',  // RECOMMENDED: Indicates participation necessity
            'type' => [$participantType]  // RECOMMENDED: Specifies participant role
        ];

        return $participantData;
    }

    /**
     * Get valid FHIR appointment status.
     */
    private function getValidStatus(?string $status): string
    {
        $validStatuses = [
            'proposed', 'pending', 'booked', 'arrived', 
            'fulfilled', 'cancelled', 'noshow', 'entered-in-error'
        ];
        
        $status = strtolower($status ?? 'booked');
        
        // Map common status values to FHIR standard
        $statusMap = [
            'scheduled' => 'booked',
            'confirmed' => 'booked',
            'completed' => 'fulfilled',
            'missed' => 'noshow',
            'canceled' => 'cancelled'
        ];
        
        if (isset($statusMap[$status])) {
            $status = $statusMap[$status];
        }
        
        return in_array($status, $validStatuses) ? $status : 'booked';
    }

    /**
     * Get valid FHIR participant status.
     */
    private function getValidParticipantStatus(?string $status): string
    {
        $validStatuses = ['accepted', 'declined', 'tentative', 'needs-action'];
        $status = strtolower($status ?? 'accepted');
        
        return in_array($status, $validStatuses) ? $status : 'accepted';
    }

    /**
     * Format date and time to ISO 8601 format.
     */
    private function formatDateTime(string $date, string $time = '09:00:00'): string
    {
        try {
            $dateTime = Carbon::createFromFormat('Y-m-d H:i:s', $date . ' ' . $time);
            return $dateTime->toISOString();
        } catch (\Exception $e) {
            // Fallback to current time if parsing fails
            return Carbon::now()->toISOString();
        }
    }    /**
     * Extract data from FHIR format to local format.
     */
    private function extractFromFhir(array $fhirData): array
    {
        $appointmentData = [
            'status' => $this->mapFhirStatusToLocal($fhirData['status'] ?? 'booked')
        ];

        // Only add description if it's not null and not empty
        if (isset($fhirData['description']) && !is_null($fhirData['description']) && trim($fhirData['description']) !== '') {
            $appointmentData['description'] = $fhirData['description'];
        }

        // Extract start date and time
        if (isset($fhirData['start'])) {
            $startDateTime = Carbon::parse($fhirData['start']);
            $appointmentData['appointment_date'] = $startDateTime->format('Y-m-d');
            $appointmentData['appointment_time'] = $startDateTime->format('H:i:s');
        }

        // Extract end time if provided
        if (isset($fhirData['end'])) {
            $endDateTime = Carbon::parse($fhirData['end']);
            $appointmentData['end_time'] = $endDateTime->format('H:i:s');
        }

        // Extract participants with validation
        $participants = [];
        if (isset($fhirData['participant']) && is_array($fhirData['participant'])) {
            foreach ($fhirData['participant'] as $participant) {
                $participantData = $this->extractParticipantData($participant);
                if ($participantData) {
                    $participants[] = $participantData;
                }
            }
        }

        return [
            'appointment' => $appointmentData,
            'participants' => $participants
        ];
    }

    /**
     * Extract participant data with validation.
     */
    private function extractParticipantData(array $participant): ?array
    {
        $participantData = [
            'status' => $participant['status'] ?? 'accepted'
        ];

        // Validate that actor exists (required field)
        if (!isset($participant['actor']['reference'])) {
            // Skip participants without proper actor reference
            return null;
        }

        $reference = $participant['actor']['reference'];
        
        if (strpos($reference, 'Patient/') === 0) {
            $patientId = str_replace('Patient/', '', $reference);
            $participantData['patient_id'] = $patientId;
        } elseif (strpos($reference, 'Practitioner/') === 0) {
            $practitionerId = str_replace('Practitioner/', '', $reference);
            $participantData['practitioner_id'] = $practitionerId;
        } else {
            // Invalid reference format
            return null;
        }

        return $participantData;
    }

    /**
     * Map FHIR status to local status values.
     */
    private function mapFhirStatusToLocal(string $fhirStatus): string
    {
        $statusMap = [
            'proposed' => 'pending',
            'pending' => 'pending', 
            'booked' => 'confirmed',
            'arrived' => 'in-progress',
            'fulfilled' => 'completed',
            'cancelled' => 'cancelled',
            'noshow' => 'missed',
            'entered-in-error' => 'cancelled'
        ];

        return $statusMap[$fhirStatus] ?? 'pending';
    }

    /**
     * Validate appointment data for FHIR compliance before transformation.
     */
    private function validateAppointmentForFhir(Appointment $appointment): array
    {
        $errors = [];
        $warnings = [];

        // Check if appointment has valid participants
        if (!$appointment->participants || $appointment->participants->count() === 0) {
            $errors[] = 'CRITICAL: Appointment must have at least one participant (Patient, Practitioner, etc.)';
        } else {
            $validParticipants = 0;
            foreach ($appointment->participants as $participant) {
                if ($participant->patient || $participant->practitioner) {
                    $validParticipants++;
                }
            }
            if ($validParticipants === 0) {
                $errors[] = 'CRITICAL: No valid participants found - all participants missing patient/practitioner references';
            }
        }

        // Check required fields
        if (!$appointment->appointment_date) {
            $errors[] = 'CRITICAL: Missing appointment_date - required for FHIR start field';
        }

        if (!$appointment->status) {
            $warnings[] = 'WARNING: Missing status - will default to "booked"';
        }

        // Check optional but recommended fields
        if (!$appointment->description || trim($appointment->description) === '') {
            $warnings[] = 'INFO: No description provided - consider adding appointment purpose';
        }        return [
            'errors' => $errors,
            'warnings' => $warnings,
            'isValid' => empty($errors)        ];
    }

    /**
     * Validate all FHIR fields structure and content.
     */
    private function validateFhirStructure(array $fhirAppointment): array
    {
        $issues = [];

        // Validate identifier structure
        if (isset($fhirAppointment['identifier'])) {
            foreach ($fhirAppointment['identifier'] as $index => $identifier) {
                if (!isset($identifier['system']) || !isset($identifier['value'])) {
                    $issues[] = "identifier[$index]: Missing required 'system' or 'value'";
                }
                if (isset($identifier['use']) && !in_array($identifier['use'], ['usual', 'official', 'temp', 'secondary'])) {
                    $issues[] = "identifier[$index]: Invalid 'use' value";
                }
            }
        }

        // Validate status
        $validStatuses = ['proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow', 'entered-in-error'];
        if (!isset($fhirAppointment['status']) || !in_array($fhirAppointment['status'], $validStatuses)) {
            $issues[] = "status: Must be one of: " . implode(', ', $validStatuses);
        }

        // Validate serviceType structure
        if (isset($fhirAppointment['serviceType'])) {
            foreach ($fhirAppointment['serviceType'] as $index => $serviceType) {
                if (isset($serviceType['coding'])) {
                    foreach ($serviceType['coding'] as $codingIndex => $coding) {
                        if (!isset($coding['system']) || !isset($coding['code'])) {
                            $issues[] = "serviceType[$index].coding[$codingIndex]: Missing required 'system' or 'code'";
                        }
                    }
                }
            }
        }

        // Validate start/end datetime format
        if (isset($fhirAppointment['start'])) {
            if (!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/', $fhirAppointment['start'])) {
                $issues[] = "start: Must be valid ISO 8601 datetime format";
            }
        }

        if (isset($fhirAppointment['end'])) {
            if (!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/', $fhirAppointment['end'])) {
                $issues[] = "end: Must be valid ISO 8601 datetime format";
            }
        }

        // Validate reasonCode structure
        if (isset($fhirAppointment['reasonCode'])) {
            foreach ($fhirAppointment['reasonCode'] as $index => $reasonCode) {
                if (isset($reasonCode['coding'])) {
                    foreach ($reasonCode['coding'] as $codingIndex => $coding) {
                        if (!isset($coding['system']) || !isset($coding['code'])) {
                            $issues[] = "reasonCode[$index].coding[$codingIndex]: Missing required 'system' or 'code'";
                        }
                    }
                }
            }
        }

        // Validate participant structure - CRITICAL
        if (!isset($fhirAppointment['participant']) || empty($fhirAppointment['participant'])) {
            $issues[] = "participant: At least one participant is required";
        } else {
            foreach ($fhirAppointment['participant'] as $index => $participant) {
                // CRITICAL: Validate actor reference
                if (!isset($participant['actor']['reference'])) {
                    $issues[] = "participant[$index].actor: Missing required 'reference' field";
                } else {
                    $reference = $participant['actor']['reference'];
                    if (!preg_match('/^(Patient|Practitioner|Device|HealthcareService|RelatedPerson|Location)\/[A-Za-z0-9\-\.]{1,64}$/', $reference)) {
                        $issues[] = "participant[$index].actor.reference: Invalid format '$reference' - must be ResourceType/id";
                    }
                }

                // Validate participant status
                $validParticipantStatuses = ['accepted', 'declined', 'tentative', 'needs-action'];
                if (!isset($participant['status']) || !in_array($participant['status'], $validParticipantStatuses)) {
                    $issues[] = "participant[$index].status: Must be one of: " . implode(', ', $validParticipantStatuses);
                }
            }
        }

        return $issues;
    }
}
