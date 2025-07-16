<?php

use App\Http\Controllers\Admin\UserAccountController;
use App\Http\Controllers\Practitioner\PractitionerController;
use App\Http\Controllers\Schedule\ScheduleController;
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

    Route::get('dashboard/user/manage', function () {
        return Inertia::render('Admin/userDashboard');
    })->name('dashboard.manage.user');

});

//---------------------------------------------------------------------------------------------------------------------------------//
//admin routes ->needs update 

        //admin features specific routes ## only admin access ##

        // user management related routes 
        Route::get('/admin/user/create', [UserAccountController::class, 'create'])->name('user.create');
        Route::post('/admin/user/store', [UserAccountController::class, 'store'])->name('user.store');
        Route::get('/admin/users', [UserAccountController::class, 'index'])->name('user.index');
        Route::get('/admin/user/{user}', [UserAccountController::class, 'show'])->name('user.show');  
        Route::get('/admin/user/{user}/edit', [UserAccountController::class, 'edit'])->name('user.edit');
        Route::put('/admin/user/{user}/update', [UserAccountController::class, 'update'])->name('user.update');
        Route::delete('/admin/user/{user}/delete', [UserAccountController::class, 'destroy'])->name('user.destroy');
        Route::get('/admin/users/doctors',[UserAccountController::class,'doctors'])->name('doctor.index');
 

//---------------------------------------------------------------------------------------------------------------------------------//
// practitioner routes  -> needs many changes to be made 
    
    //globally available routes 
        Route::get('admin/practitioners', [PractitionerController::class, 'index'])->name('practitioner.index');
        Route::get('/practitioner/{practitioner}', [PractitionerController::class, 'show'])->name('practitioner.show');
    //admin limited routes
        Route::get('/admin/practitioner/{user}/create', [PractitionerController::class, 'create'])->name('practitioner.create');
        Route::post('/admin/practitioner/store', [PractitionerController::class, 'store'])->name('practitioner.store');
        Route::delete('/admin/practitioner/{practitioner}/delete',[PractitionerController::class, 'destroy'])->name('practitioner.destroy');

    // routes accessible by both admin and practitioner
        Route::get('/practitioner/{practitioner}/edit', [PractitionerController::class, 'edit'])->name('practitioner.edit');
        Route::put('/practitioner/{practitioner}/update', [PractitionerController::class, 'update'])->name('practitioner.update');

    //schedule routes
        Route::get('/practitioner/{practitioner}/schedule', [ScheduleController::class, 'index'])->name('practitioner.schedule.index');
        Route::get('/practitioner/{practitioner}/schedule/create', [ScheduleController::class, 'create'])->name('practitioner.schedule.create');
        Route::post('/practitioner/{practitioner}/schedule/store', [ScheduleController::class, 'store'])->name('practitioner.schedule.store');
        Route::get('/practitioner/{practitioner}/schedule/{schedule}', [ScheduleController::class, 'show'])->name('practitioner.schedule.show');
        Route::get('/practitioner/{practitioner}/schedule/edit/{schedule}', [ScheduleController::class, 'edit'])->name('practitioner.schedule.edit');
        Route::put('/practitioner/{practitioner}/schedule/update/{schedule}', [ScheduleController::class, 'update'])->name('practitioner.schedule.update');
        Route::delete('/practitioner/{practitioner}/schedule/delete/{schedule}', [ScheduleController::class, 'destroy'])->name('practitioner.schedule.destroy');



//------------------------------------------------------------------------------------------------------------------------------------------------//
// appointment booking routes -> not even started 

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
    // patient routes -> needs complete makeover 
    
     ## admin and management features related routes ##
    Route::get( '/patients',  [PatientController::class, 'index'])->name('patient.index'); //for admin and frontdesk to see all patients

    ## Patient features related routes ##  => only baisc features related to account management
    Route::get('/patient/dashboard', [PatientController::class, 'dashboard'])->name('patient.dashboard'); //for patient dashboard
    Route::get('/patient/create', [PatientController::class, 'create'])->name('patient.create'); //to show registration form
    Route::post('/patient/store', [PatientController::class, 'store'])->name('patient.store'); //to store patient data
    Route::get('/patient/verify', [PatientController::class, 'verify'])->name('patient.verify'); //to verify patient phone number
    Route::get('/patient/verify/otp', [PatientController::class, 'otpForm'])->name('patient.verify.otp.form'); //to show OTP form   
    Route::post('/patient/verify/otp', [PatientController::class, 'verifyOTP'])->name('patient.verify.otp'); //to verify patient phone number
    Route::get('/patient/{patient}', [PatientController::class, 'show'])->name('patient.show');
    Route::get('/patient/{patient}/edit', [PatientController::class, 'edit'])->name('patient.edit');
    Route::put('/patient/{patient}/update', [PatientController::class, 'update'])->name('patient.update');
    Route::delete('/patient/{patient}/delete', [PatientController::class, 'destroy'])->name('patient.destroy');

    // show the UI to enter the phone number
    Route::get('/patient-old', [PatientController::class, 'add'])->name('patient.verify'); 

//--------------------------------------------------------------------------------------------------------------//
    //UI test route
    
    Route::get('/test', function (){
    return Inertia::render(component: 'Patient/Verify-otp'); //add component here 
    })->name('test');



//--------------------------------------------------------------------------------------------------------------//
    // Firebase Routes 
    // Route::get
    // ('/firebase-connection', 
    // [App\Http\Controllers\FirebaseConnectionController::class, 'index']
    // )->name('firebase.connection');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
