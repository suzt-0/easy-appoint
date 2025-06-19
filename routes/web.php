<?php

use App\Http\Controllers\Admin\UserAccountController;
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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

//admin routes
    // Route::middleware(['auth', 'verified', 'can:create-users'])->group(function () {
        Route::get('/admin/user/create', [UserAccountController::class, 'create'])->name('users.create');
        Route::post('/admin/user/store', [UserAccountController::class, 'store'])->name('users.store');
        Route::get('/admin/users', [UserAccountController::class, 'index'])->name('users.index');
        Route::get('/admin/user/{user}', [UserAccountController::class, 'show'])->name('users.show');   
    // });
    // manage patient and other user details

//practitioner routes 
    //add schedules and time slots 
    //see appointments

//receptionist routes
    //manage appointments


//--------------------------------------------------------------------------------------------------------------//
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
    return Inertia::render(component: 'Admin/test'); //add component here 
    })->name('test');



//--------------------------------------------------------------------------------------------------------------//
    // Firebase Routes 
    // Route::get
    // ('/firebase-connection', 
    // [App\Http\Controllers\FirebaseConnectionController::class, 'index']
    // )->name('firebase.connection');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
