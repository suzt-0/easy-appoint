<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PatientTelecom;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FhirPatientController extends Controller
{
    /**
     * Display a listing of patients in FHIR format.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('_count', 20); // FHIR standard parameter
        $patients = Patient::with('telecoms')->paginate($perPage);

        $bundle = [
            'resourceType' => 'Bundle',
            'id' => 'patient-search-' . uniqid(),
            'type' => 'searchset',
            'total' => $patients->total(),
            'entry' => []
        ];

        foreach ($patients as $patient) {
            $bundle['entry'][] = [
                'resource' => $this->transformToFhir($patient),
                'search' => [
                    'mode' => 'match'
                ]
            ];
        }

        return response()->json($bundle)
            ->header('Content-Type', 'application/fhir+json');
    }

    /**
     * Display the specified patient in FHIR format.
     */
    public function show(string $id): JsonResponse
    {
        $patient = Patient::with('telecoms')->findOrFail($id);
        
        return response()->json($this->transformToFhir($patient))
            ->header('Content-Type', 'application/fhir+json');
    }

    /**
     * Store a newly created patient from FHIR format.
     */
    public function store(Request $request): JsonResponse
    {
        $fhirData = $request->json()->all();
        
        // Validate FHIR resource type
        if (!isset($fhirData['resourceType']) || $fhirData['resourceType'] !== 'Patient') {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [[
                    'severity' => 'error',
                    'code' => 'invalid',
                    'details' => ['text' => 'Resource type must be Patient']
                ]]
            ], 400)->header('Content-Type', 'application/fhir+json');
        }

        // Extract data from FHIR format
        $patientData = $this->extractFromFhir($fhirData);
        
        // Create patient
        $patient = Patient::create($patientData['patient']);
        
        // Create telecoms
        foreach ($patientData['telecoms'] as $telecomData) {
            $patient->telecoms()->create($telecomData);
        }

        return response()->json($this->transformToFhir($patient->load('telecoms')), 201)
            ->header('Content-Type', 'application/fhir+json')
            ->header('Location', url("/api/fhir/R4/Patient/{$patient->id}"));
    }

    /**
     * Update the specified patient from FHIR format.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $patient = Patient::findOrFail($id);
        $fhirData = $request->json()->all();
        
        // Validate FHIR resource type
        if (!isset($fhirData['resourceType']) || $fhirData['resourceType'] !== 'Patient') {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [[
                    'severity' => 'error',
                    'code' => 'invalid',
                    'details' => ['text' => 'Resource type must be Patient']
                ]]
            ], 400)->header('Content-Type', 'application/fhir+json');
        }

        // Extract data from FHIR format
        $patientData = $this->extractFromFhir($fhirData);
        
        // Update patient
        $patient->update($patientData['patient']);
        
        // Update telecoms - delete existing and create new ones
        $patient->telecoms()->delete();
        foreach ($patientData['telecoms'] as $telecomData) {
            $patient->telecoms()->create($telecomData);
        }

        return response()->json($this->transformToFhir($patient->load('telecoms')))
            ->header('Content-Type', 'application/fhir+json');
    }    /**
     * Transform Patient model to FHIR format.
     */
    private function transformToFhir(Patient $patient): array
    {
        $fhirPatient = [
            'resourceType' => 'Patient',
            'id' => (string) $patient->id,
            'meta' => [
                'versionId' => '1',
                'lastUpdated' => $patient->updated_at->toISOString(),
                'profile' => ['http://hl7.org/fhir/StructureDefinition/Patient']
            ],
            'identifier' => [[
                'use' => 'usual',
                'system' => 'http://easy-appoint.local/patient-id',
                'value' => 'PAT-' . str_pad($patient->id, 6, '0', STR_PAD_LEFT)
            ]],
            'active' => (bool) $patient->active,
            'name' => [[
                'use' => 'official',
                'family' => $patient->family_name,
                'given' => [$patient->given_name]
            ]],
            'telecom' => []
        ];

        // Add gender only if valid FHIR value
        $validGenders = ['male', 'female', 'other', 'unknown'];
        $gender = strtolower($patient->gender ?? 'unknown');
        if (in_array($gender, $validGenders)) {
            $fhirPatient['gender'] = $gender;
        }

        // Add birthDate only if not null and valid
        if ($patient->birth_date && $this->isValidDate($patient->birth_date)) {
            $fhirPatient['birthDate'] = $patient->birth_date;
        }

        // Add telecoms with proper validation
        foreach ($patient->telecoms as $telecom) {
            $telecomEntry = [
                'system' => $telecom->system,
                'value' => $this->formatTelecomValue($telecom->system, $telecom->value),
                'use' => $telecom->use ?? 'home'
            ];

            // Only add if value is valid
            if ($this->isValidTelecomValue($telecom->system, $telecomEntry['value'])) {
                $fhirPatient['telecom'][] = $telecomEntry;
            }
        }

        return $fhirPatient;
    }

    /**
     * Validate if a date string is valid.
     */
    private function isValidDate(?string $date): bool
    {
        if (!$date) return false;
        
        // FHIR date format: YYYY, YYYY-MM, or YYYY-MM-DD
        return preg_match('/^\d{4}(-\d{2}(-\d{2})?)?$/', $date) && 
               strtotime($date) !== false;
    }

    /**
     * Format telecom values according to FHIR standards.
     */
    private function formatTelecomValue(string $system, string $value): string
    {
        switch ($system) {
            case 'phone':
                // Format phone numbers to E.164 standard if possible
                $cleaned = preg_replace('/[^\d+]/', '', $value);
                if (strpos($cleaned, '+') !== 0) {
                    // Add country code if missing (assuming Nepal +977)
                    if (strlen($cleaned) === 10) {
                        $cleaned = '+977' . $cleaned;
                    }
                }
                return $cleaned;
                
            case 'email':
                return strtolower(trim($value));
                
            default:
                return $value;
        }
    }

    /**
     * Validate telecom values.
     */
    private function isValidTelecomValue(string $system, string $value): bool
    {
        switch ($system) {
            case 'phone':
                // E.164 format validation
                return preg_match('/^\+[1-9]\d{1,14}$/', $value);
                
            case 'email':
                return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
                
            default:
                return !empty($value);
        }
    }

    /**
     * Extract data from FHIR format to local format.
     */
    private function extractFromFhir(array $fhirData): array
    {
        $patientData = [
            'active' => $fhirData['active'] ?? true,
            'gender' => ucfirst($fhirData['gender'] ?? 'unknown'),
            'birth_date' => $fhirData['birthDate'] ?? null
        ];

        // Extract name
        if (isset($fhirData['name'][0])) {
            $name = $fhirData['name'][0];
            $patientData['family_name'] = $name['family'] ?? '';
            $patientData['given_name'] = $name['given'][0] ?? '';
        }

        // Extract telecoms
        $telecoms = [];
        if (isset($fhirData['telecom'])) {
            foreach ($fhirData['telecom'] as $telecom) {
                $telecoms[] = [
                    'system' => $telecom['system'],
                    'value' => $telecom['value'],
                    'use' => $telecom['use'] ?? 'home'
                ];
            }
        }

        return [
            'patient' => $patientData,
            'telecoms' => $telecoms
        ];
    }
}
