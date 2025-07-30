<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FhirPatientController;
use App\Http\Controllers\Api\FhirPractitionerController;
use App\Http\Controllers\Api\FhirAppointmentController;

/*
|--------------------------------------------------------------------------
| FHIR API Routes
|--------------------------------------------------------------------------
|
| Here are FHIR-compliant API routes for healthcare interoperability.
| These routes are separate from your web routes and follow FHIR R4 standard.
|
*/

Route::middleware(['api'])->group(function () {
    
    // FHIR R4 Base URL: /api/fhir/R4
    Route::prefix('fhir/R4')->group(function () {
        
        // Patient Resource Routes
        Route::prefix('Patient')->group(function () {
            Route::get('/', [FhirPatientController::class, 'index'])->name('fhir.patient.index');
            Route::get('/{id}', [FhirPatientController::class, 'show'])->name('fhir.patient.show');
            // Route::post('/', [FhirPatientController::class, 'store'])->name('fhir.patient.store');
            // Route::put('/{id}', [FhirPatientController::class, 'update'])->name('fhir.patient.update');
        });

        // Practitioner Resource Routes
        Route::prefix('Practitioner')->group(function () {
            Route::get('/', [FhirPractitionerController::class, 'index'])->name('fhir.practitioner.index');
            Route::get('/{id}', [FhirPractitionerController::class, 'show'])->name('fhir.practitioner.show');
            // Route::post('/', [FhirPractitionerController::class, 'store'])->name('fhir.practitioner.store');
            // Route::put('/{id}', [FhirPractitionerController::class, 'update'])->name('fhir.practitioner.update');
        });

        // Appointment Resource Routes
        Route::prefix('Appointment')->group(function () {
            Route::get('/', [FhirAppointmentController::class, 'index'])->name('fhir.appointment.index');
            Route::get('/{id}', [FhirAppointmentController::class, 'show'])->name('fhir.appointment.show');
            // Route::post('/', [FhirAppointmentController::class, 'store'])->name('fhir.appointment.store');
            // Route::put('/{id}', [FhirAppointmentController::class, 'update'])->name('fhir.appointment.update');
            // Route::patch('/{id}', [FhirAppointmentController::class, 'patch'])->name('fhir.appointment.patch');
        });        
        
        // Metadata endpoint (FHIR Capability Statement)
        Route::get('metadata', function () {
            return response()->json([
                'resourceType' => 'CapabilityStatement',
                'status' => 'active',
                'date' => now()->toISOString(),
                'publisher' => 'Easy Appoint Healthcare System',
                'kind' => 'instance',
                'fhirVersion' => '4.0.1',
                'format' => ['application/fhir+json'],
                'rest' => [[
                    'mode' => 'server',
                    'resource' => [
                        [
                            'type' => 'Patient',
                            'interaction' => [
                                ['code' => 'read'],
                                ['code' => 'search-type'],
                                ['code' => 'create'],
                                ['code' => 'update']
                            ]
                        ],
                        [
                            'type' => 'Practitioner',
                            'interaction' => [
                                ['code' => 'read'],
                                ['code' => 'search-type'],
                                ['code' => 'create'],
                                ['code' => 'update']
                            ]
                        ],
                        [
                            'type' => 'Appointment',
                            'interaction' => [
                                ['code' => 'read'],
                                ['code' => 'search-type'],
                                ['code' => 'create'],
                                ['code' => 'update'],
                                ['code' => 'patch']
                            ]
                        ]
                    ]
                ]]
            ])->header('Content-Type', 'application/fhir+json');
        })->name('fhir.metadata');

        // FHIR Validation endpoint for Patient
        Route::post('Patient/$validate', function (Request $request) {
            $fhirData = $request->json()->all();
            $issues = \App\Services\FhirValidationService::validatePatient($fhirData);
            
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => $issues
            ])->header('Content-Type', 'application/fhir+json');
        })->name('fhir.patient.validate');

        // FHIR Validation endpoint for Appointment
        Route::post('Appointment/$validate', function (Request $request) {
            $fhirData = $request->json()->all();
            $issues = \App\Services\FhirValidationService::validateAppointment($fhirData);
            
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => $issues
            ])->header('Content-Type', 'application/fhir+json');
        })->name('fhir.appointment.validate');
        
    });
});
