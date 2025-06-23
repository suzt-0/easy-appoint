<?php

use App\Http\Controllers\Admin\UserAccountController;
use App\Http\Controllers\Practitioner\PractitionerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Patient\PatientController;


//--------------------------------------------------------------------------------------------------------------//
// Landing page

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

//--------------------------------------------------------------------------------------------------------------//
//Organizational user routes ie for admin, receptionist, and practitioners


//all
Route::middleware(['auth', 'verified'])->group(function () {
    //for basic dashboard 
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('dashboard/practitioner/manage', function () {
        return Inertia::render('Admin/practitionerDashboard');
    })->name('dashboard.managePractitioner');

});

//---------------------------------------------------------------------------------------------------------------------------------//


//admin routes
    //admin routes specific routes
        Route::get('/admin/user/create', [UserAccountController::class, 'create'])->name('user.create');
        Route::post('/admin/user/store', [UserAccountController::class, 'store'])->name('user.store');
        Route::get('/admin/users', [UserAccountController::class, 'index'])->name('user.index');
        Route::get('/admin/user/{user}', [UserAccountController::class, 'show'])->name('user.show');  
        Route::get('/admin/user/{user}/edit', [UserAccountController::class, 'edit'])->name('user.edit');
        Route::put('/admin/user/{user}/update', [UserAccountController::class, 'update'])->name('user.update');
        Route::delete('/admin/user/{user}/delete', [UserAccountController::class, 'destroy'])->name('user.destroy');
        Route::get('/admin/users/doctors',[UserAccountController::class,'doctors'])->name('doctor.index');
 

//---------------------------------------------------------------------------------------------------------------------------------//


//practitioner routes 
    //add practitioner

    //admin limited routes
        Route::get('/admin/practitioner/{user}/create', [PractitionerController::class, 'create'])->name('practitioner.create');
        Route::post('/admin/practitioner/store', [PractitionerController::class, 'store'])->name('practitioner.store');
        Route::get('/admin/practitioners', [PractitionerController::class, 'index'])->name('practitioner.index');
        Route::delete('/admin/practitioner/{practitioner}/delete',[PractitionerController::class, 'destroy'])->name('practitioner.destroy');

    // routes accessible by both admin and practitioner
        Route::get('/practitioner/{practitioner}', [PractitionerController::class, 'show'])->name('practitioner.show');
        Route::get('/practitioner/{practitioner}/edit', [PractitionerController::class, 'edit'])->name('practitioner.edit');
        Route::put('/practitioner/{practitioner}/update', [PractitionerController::class, 'update'])->name('practitioner.update');



//------------------------------------------------------------------------------------------------------------------------------------------------//
// appointment booking routes

Route::get('/visit-type', function (){
    return Inertia::render(component: 'Patient/visit-type'); //add component here 
})->name('visit.type');


Route::get('/select-department', function (){
    return Inertia::render(component: ''); //add component here 
})->name('select.department');

//this route needs to be handled via practitioner controller
// Route::get('/select-practitioner', function (){
    //     return Inertia::render(component: ''); //add component here 
    // })->name('select.practitioner');
    
    
    
//--------------------------------------------------------------------------------------------------------------//
    // patient routes
    
    Route::get(uri: '/patients', action: [PatientController::class, 'index'])->name('patient.index');
    Route::get('/patient-new', [PatientController::class, 'create'])->name('patient.create');

    // show the UI to enter the phone number
    Route::get('/patient-old', [PatientController::class, 'add'])->name('patient.verify'); 

//--------------------------------------------------------------------------------------------------------------//
    //UI test route
    
    Route::get('/test', function (){
    return Inertia::render(component: 'Practitioner/createPractitioner'); //add component here 
    })->name('test');



//--------------------------------------------------------------------------------------------------------------//
    // Firebase Routes 
    // Route::get
    // ('/firebase-connection', 
    // [App\Http\Controllers\FirebaseConnectionController::class, 'index']
    // )->name('firebase.connection');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
