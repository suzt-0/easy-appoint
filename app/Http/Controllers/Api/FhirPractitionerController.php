<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Practitioner;
use App\Models\PractitionerTelecoms;
use App\Models\PractitionerQualifications;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FhirPractitionerController extends Controller
{
    /**
     * Display a listing of practitioners in FHIR format.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('_count', 20); // FHIR standard parameter
        $practitioners = Practitioner::with(['telecoms', 'qualifications'])->paginate($perPage);

        $bundle = [
            'resourceType' => 'Bundle',
            'id' => 'practitioner-search-' . uniqid(),
            'type' => 'searchset',
            'total' => $practitioners->total(),
            'entry' => []
        ];

        foreach ($practitioners as $practitioner) {
            $bundle['entry'][] = [
                'resource' => $this->transformToFhir($practitioner),
                'search' => [
                    'mode' => 'match'
                ]
            ];
        }

        return response()->json($bundle)
            ->header('Content-Type', 'application/fhir+json');
    }

    /**
     * Display the specified practitioner in FHIR format.
     */
    public function show(string $id): JsonResponse
    {
        $practitioner = Practitioner::with(['telecoms', 'qualifications'])->findOrFail($id);
        
        return response()->json($this->transformToFhir($practitioner))
            ->header('Content-Type', 'application/fhir+json');
    }

    /**
     * Store a newly created practitioner from FHIR format.
     */
    public function store(Request $request): JsonResponse
    {
        $fhirData = $request->json()->all();
        
        // Validate FHIR resource type
        if (!isset($fhirData['resourceType']) || $fhirData['resourceType'] !== 'Practitioner') {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [[
                    'severity' => 'error',
                    'code' => 'invalid',
                    'details' => ['text' => 'Resource type must be Practitioner']
                ]]
            ], 400)->header('Content-Type', 'application/fhir+json');
        }

        // Extract data from FHIR format
        $practitionerData = $this->extractFromFhir($fhirData);
        
        // Create practitioner
        $practitioner = Practitioner::create($practitionerData['practitioner']);
        
        // Create telecoms
        foreach ($practitionerData['telecoms'] as $telecomData) {
            $practitioner->telecoms()->create($telecomData);
        }

        // Create qualifications
        foreach ($practitionerData['qualifications'] as $qualificationData) {
            $practitioner->qualifications()->create($qualificationData);
        }

        return response()->json($this->transformToFhir($practitioner->load(['telecoms', 'qualifications'])), 201)
            ->header('Content-Type', 'application/fhir+json')
            ->header('Location', url("/api/fhir/R4/Practitioner/{$practitioner->id}"));
    }

    /**
     * Update the specified practitioner from FHIR format.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $practitioner = Practitioner::findOrFail($id);
        $fhirData = $request->json()->all();
        
        // Validate FHIR resource type
        if (!isset($fhirData['resourceType']) || $fhirData['resourceType'] !== 'Practitioner') {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [[
                    'severity' => 'error',
                    'code' => 'invalid',
                    'details' => ['text' => 'Resource type must be Practitioner']
                ]]
            ], 400)->header('Content-Type', 'application/fhir+json');
        }

        // Extract data from FHIR format
        $practitionerData = $this->extractFromFhir($fhirData);
        
        // Update practitioner
        $practitioner->update($practitionerData['practitioner']);
        
        // Update telecoms - delete existing and create new ones
        $practitioner->telecoms()->delete();
        foreach ($practitionerData['telecoms'] as $telecomData) {
            $practitioner->telecoms()->create($telecomData);
        }

        // Update qualifications - delete existing and create new ones
        $practitioner->qualifications()->delete();
        foreach ($practitionerData['qualifications'] as $qualificationData) {
            $practitioner->qualifications()->create($qualificationData);
        }

        return response()->json($this->transformToFhir($practitioner->load(['telecoms', 'qualifications'])))
            ->header('Content-Type', 'application/fhir+json');
    }    /**
     * Transform Practitioner model to FHIR format with comprehensive validation.
     */
    private function transformToFhir(Practitioner $practitioner): array
    {
        // Validate practitioner data for FHIR compliance
        $validationResult = $this->validatePractitionerForFhir($practitioner);
        
        // Log warnings but continue processing
        if (!empty($validationResult['warnings'])) {
            \Log::warning('FHIR Practitioner warnings for ID ' . $practitioner->id, $validationResult['warnings']);
        }
        
        // Log errors for critical issues
        if (!empty($validationResult['errors'])) {
            \Log::error('FHIR Practitioner errors for ID ' . $practitioner->id, $validationResult['errors']);
        }

        $fhirPractitioner = [
            'resourceType' => 'Practitioner',
            'id' => (string) $practitioner->id,
            'meta' => [
                'versionId' => '1',
                'lastUpdated' => $practitioner->updated_at->toISOString(),
                'profile' => ['http://hl7.org/fhir/StructureDefinition/Practitioner']
            ],
            'active' => (bool) $practitioner->active,
            'name' => [[
                'use' => 'official',
                'family' => $practitioner->family_name,
                'given' => [$practitioner->given_name],
                'prefix' => ['Dr.']
            ]],
            'gender' => $this->getValidGender($practitioner->gender),
            'birthDate' => $this->getValidBirthDate($practitioner->birth_date),
            'telecom' => [],
            'qualification' => []
        ];

        // Add identifier for better tracking
        $fhirPractitioner['identifier'] = [[
            'use' => 'usual',
            'system' => 'http://easy-appoint.local/practitioner-id',
            'value' => 'PRAC-' . str_pad($practitioner->id, 6, '0', STR_PAD_LEFT)
        ]];

        // Add validated telecoms
        $fhirPractitioner['telecom'] = $this->buildValidatedTelecoms($practitioner->telecoms);

        // Add validated qualifications
        $fhirPractitioner['qualification'] = $this->buildValidatedQualifications($practitioner->qualifications);

        return $fhirPractitioner;
    }

    /**
     * Validate and build telecoms with FHIR compliance.
     */
    private function buildValidatedTelecoms($telecoms): array
    {
        $validTelecoms = [];
        
        foreach ($telecoms as $telecom) {
            $validatedTelecom = $this->validateAndFixTelecom($telecom);
            if ($validatedTelecom) {
                $validTelecoms[] = $validatedTelecom;
            }
        }
        
        return $validTelecoms;
    }

    /**
     * Validate and fix individual telecom entry.
     */
    private function validateAndFixTelecom($telecom): ?array
    {
        // Skip invalid telecom systems or non-contact values
        $validSystems = ['phone', 'fax', 'email', 'pager', 'url', 'sms'];
        $system = strtolower($telecom->system ?? '');
        
        if (!in_array($system, $validSystems)) {
            \Log::warning("Invalid telecom system: {$system} for practitioner telecom ID: {$telecom->id}");
            return null;
        }
        
        // Validate value format based on system
        if (!$this->isValidTelecomValue($system, $telecom->value)) {
            \Log::warning("Invalid telecom value for system {$system}: {$telecom->value}");
            return null;
        }
        
        // Validate use value
        $validUses = ['home', 'work', 'temp', 'old', 'mobile'];
        $use = strtolower($telecom->use ?? 'work');
        if (!in_array($use, $validUses)) {
            $use = 'work'; // Default fallback
        }
        
        return [
            'system' => $system,
            'value' => $telecom->value,
            'use' => $use
        ];
    }

    /**
     * Validate telecom value format based on system.
     */
    private function isValidTelecomValue(string $system, ?string $value): bool
    {
        if (empty($value)) {
            return false;
        }
        
        switch ($system) {
            case 'email':
                return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
            case 'phone':
            case 'fax':
            case 'pager':
            case 'sms':
                // Basic phone number validation (allow digits, spaces, hyphens, parentheses, plus)
                return preg_match('/^[\+]?[0-9\s\-\(\)]{7,15}$/', $value);
            case 'url':
                return filter_var($value, FILTER_VALIDATE_URL) !== false;
            default:
                // For other systems, just check it's not obviously placeholder text
                return !preg_match('/lorem|ipsum|placeholder|assumenda|distinctio|inventore/i', $value);
        }
    }

    /**
     * Validate and build qualifications with FHIR compliance.
     */
    private function buildValidatedQualifications($qualifications): array
    {
        $validQualifications = [];
        
        foreach ($qualifications as $qualification) {
            $validatedQualification = $this->validateAndFixQualification($qualification);
            if ($validatedQualification) {
                $validQualifications[] = $validatedQualification;
            }
        }
        
        return $validQualifications;
    }

    /**
     * Validate and fix individual qualification entry.
     */
    private function validateAndFixQualification($qualification): ?array
    {
        // Skip qualifications with obviously invalid or placeholder data
        if ($this->isPlaceholderText($qualification->code) || 
            $this->isPlaceholderText($qualification->qualification_name) ||
            $this->isPlaceholderText($qualification->issuer)) {
            \Log::warning("Skipping qualification with placeholder data for practitioner qualification ID: {$qualification->id}");
            return null;
        }
        
        // Validate and normalize code
        $code = $this->getValidQualificationCode($qualification->code);
        $display = $this->getValidQualificationDisplay($qualification->display, $qualification->qualification_name);
        $text = $qualification->qualification_name ?: $display;
        
        // Validate period dates
        $periodStart = $this->getValidDate($qualification->period_start);
        $periodEnd = $this->getValidDate($qualification->period_end);
        
        // Validate issuer
        $issuer = $this->getValidIssuer($qualification->issuer);
        
        $qualificationData = [
            'code' => [
                'coding' => [[
                    'system' => 'http://terminology.hl7.org/CodeSystem/v2-0360',
                    'code' => $code,
                    'display' => $display
                ]],
                'text' => $text
            ],
            'issuer' => [
                'display' => $issuer
            ]
        ];
        
        // Only add period if we have valid dates
        if ($periodStart || $periodEnd) {
            $qualificationData['period'] = [];
            if ($periodStart) {
                $qualificationData['period']['start'] = $periodStart;
            }
            if ($periodEnd) {
                $qualificationData['period']['end'] = $periodEnd;
            }
        }
        
        return $qualificationData;
    }

    /**
     * Check if text appears to be placeholder/lorem ipsum content.
     */
    private function isPlaceholderText(?string $text): bool
    {
        if (empty($text)) {
            return false;
        }
        
        $placeholderPatterns = [
            '/lorem\s+ipsum/i',
            '/placeholder/i',
            '/assumenda/i',
            '/distinctio/i',
            '/inventore/i',
            '/deleniti/i',
            '/nesciunt/i',
            '/corrupti/i',
            '/^[A-Z][a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\.?$/i' // Pattern like "Optio ipsa debitis non illo."
        ];
        
        foreach ($placeholderPatterns as $pattern) {
            if (preg_match($pattern, $text)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get valid FHIR gender value.
     */
    private function getValidGender(?string $gender): string
    {
        $validGenders = ['male', 'female', 'other', 'unknown'];
        $gender = strtolower($gender ?? 'unknown');
        
        return in_array($gender, $validGenders) ? $gender : 'unknown';
    }

    /**
     * Get valid birth date (not in the future).
     */
    private function getValidBirthDate(?string $birthDate): ?string
    {
        if (empty($birthDate)) {
            return null;
        }
        
        try {
            $date = new \DateTime($birthDate);
            $today = new \DateTime();
            
            // If birth date is in the future, log warning and return null
            if ($date > $today) {
                \Log::warning("Birth date in the future: {$birthDate}");
                return null;
            }
            
            // If birth date is more than 120 years ago, log warning
            $age = $today->diff($date)->y;
            if ($age > 120) {
                \Log::warning("Birth date indicates age over 120: {$birthDate}");
            }
            
            return $date->format('Y-m-d');
        } catch (\Exception $e) {
            \Log::warning("Invalid birth date format: {$birthDate}");
            return null;
        }
    }

    /**
     * Get valid qualification code.
     */
    private function getValidQualificationCode(?string $code): string
    {
        // Common medical qualification codes
        $validCodes = [
            'MD' => 'Doctor of Medicine',
            'DO' => 'Doctor of Osteopathic Medicine', 
            'NP' => 'Nurse Practitioner',
            'PA' => 'Physician Assistant',
            'RN' => 'Registered Nurse',
            'PT' => 'Physical Therapist',
            'PharmD' => 'Doctor of Pharmacy',
            'DDS' => 'Doctor of Dental Surgery',
            'PhD' => 'Doctor of Philosophy'
        ];
        
        if (empty($code) || $this->isPlaceholderText($code)) {
            return 'MD'; // Default fallback
        }
        
        // If it's already a valid code, return it
        if (array_key_exists($code, $validCodes)) {
            return $code;
        }
        
        // Try to match common patterns
        if (preg_match('/doctor|physician/i', $code)) {
            return 'MD';
        }
        if (preg_match('/nurse/i', $code)) {
            return 'RN';
        }
        
        return 'MD'; // Default fallback
    }

    /**
     * Get valid qualification display text.
     */
    private function getValidQualificationDisplay(?string $display, ?string $qualificationName): string
    {
        // If display is valid and not placeholder, use it
        if (!empty($display) && !$this->isPlaceholderText($display)) {
            return $display;
        }
        
        // If qualification name is valid, use it
        if (!empty($qualificationName) && !$this->isPlaceholderText($qualificationName)) {
            return $qualificationName;
        }
        
        // Default fallback
        return 'Doctor of Medicine';
    }

    /**
     * Get valid date string.
     */
    private function getValidDate(?string $date): ?string
    {
        if (empty($date)) {
            return null;
        }
        
        try {
            $dateObj = new \DateTime($date);
            return $dateObj->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get valid issuer name.
     */
    private function getValidIssuer(?string $issuer): string
    {
        if (empty($issuer) || $this->isPlaceholderText($issuer)) {
            return 'Medical Board'; // Default fallback
        }
        
        return $issuer;
    }

    /**
     * Validate practitioner data for FHIR compliance.
     */
    private function validatePractitionerForFhir(Practitioner $practitioner): array
    {
        $errors = [];
        $warnings = [];
        
        // Check required fields
        if (empty($practitioner->family_name)) {
            $errors[] = 'CRITICAL: Missing family_name - required for FHIR name.family';
        }
        
        if (empty($practitioner->given_name)) {
            $errors[] = 'CRITICAL: Missing given_name - required for FHIR name.given';
        }
        
        // Check birth date validity
        if (!empty($practitioner->birth_date)) {
            try {
                $birthDate = new \DateTime($practitioner->birth_date);
                $today = new \DateTime();
                if ($birthDate > $today) {
                    $warnings[] = "WARNING: Birth date in the future: {$practitioner->birth_date}";
                }
            } catch (\Exception $e) {
                $warnings[] = "WARNING: Invalid birth date format: {$practitioner->birth_date}";
            }
        }
        
        // Check telecoms
        $validTelecomCount = 0;
        foreach ($practitioner->telecoms as $telecom) {
            if ($this->validateAndFixTelecom($telecom)) {
                $validTelecomCount++;
            } else {
                $warnings[] = "WARNING: Invalid telecom system '{$telecom->system}' or value '{$telecom->value}'";
            }
        }
        
        if ($validTelecomCount === 0 && $practitioner->telecoms->count() > 0) {
            $warnings[] = 'WARNING: All telecoms are invalid - practitioner will have empty telecom array';
        }
        
        // Check qualifications
        $validQualificationCount = 0;
        foreach ($practitioner->qualifications as $qualification) {
            if ($this->validateAndFixQualification($qualification)) {
                $validQualificationCount++;
            } else {
                $warnings[] = "WARNING: Qualification with placeholder/invalid data - ID: {$qualification->id}";
            }
        }
        
        if ($validQualificationCount === 0 && $practitioner->qualifications->count() > 0) {
            $warnings[] = 'WARNING: All qualifications are invalid - practitioner will have empty qualification array';
        }
        
        return [
            'errors' => $errors,
            'warnings' => $warnings,
            'isValid' => empty($errors)
        ];
    }

    /**
     * Extract data from FHIR format to local format.
     */
    private function extractFromFhir(array $fhirData): array
    {
        $practitionerData = [
            'active' => $fhirData['active'] ?? true,
            'gender' => ucfirst($fhirData['gender'] ?? 'unknown'),
            'birth_date' => $fhirData['birthDate'] ?? null
        ];

        // Extract name
        if (isset($fhirData['name'][0])) {
            $name = $fhirData['name'][0];
            $practitionerData['family_name'] = $name['family'] ?? '';
            $practitionerData['given_name'] = $name['given'][0] ?? '';
        }

        // Extract telecoms
        $telecoms = [];
        if (isset($fhirData['telecom'])) {
            foreach ($fhirData['telecom'] as $telecom) {
                $telecoms[] = [
                    'system' => $telecom['system'],
                    'value' => $telecom['value'],
                    'use' => $telecom['use'] ?? 'work'
                ];
            }
        }

        // Extract qualifications
        $qualifications = [];
        if (isset($fhirData['qualification'])) {
            foreach ($fhirData['qualification'] as $qualification) {
                $qualifications[] = [
                    'qualification_name' => $qualification['code']['text'] ?? '',
                    'code' => $qualification['code']['coding'][0]['code'] ?? 'MD',
                    'display' => $qualification['code']['coding'][0]['display'] ?? '',
                    'period_start' => $qualification['period']['start'] ?? null,
                    'period_end' => $qualification['period']['end'] ?? null,
                    'issuer' => $qualification['issuer']['display'] ?? null
                ];
            }
        }

        return [
            'practitioner' => $practitionerData,
            'telecoms' => $telecoms,
            'qualifications' => $qualifications
        ];
    }
}
