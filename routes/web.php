<?php

use App\Http\Controllers\Admin\UserAccountController;
use App\Http\Controllers\Appointment\AdminAppointmentController;
use App\Http\Controllers\Appointment\NewAppointmentController;
use App\Http\Controllers\Appointment\PatientAppointmentController;
use App\Http\Controllers\Appointment\PractitionerAppointmentController;
use App\Http\Controllers\Practitioner\PractitionerController;
use App\Http\Controllers\Schedule\ScheduleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Patient\PatientController;
use App\Http\Controllers\Patient\PatientLoginController;
use App\Http\Controllers\Patient\PatientUserController;
use App\Http\Controllers\Schedule\AdminScheduleController ;



//---------------------------------------------------------------------------------------------------------------------------------//

//doesnot work needs fixing 
// Route::get('/admin/appointment/practitioner/{practitioner}', [AdminAppointmentController::class, 'practitionerAppointments'])->name('admin.appointment.practitioner.appointments'); //to view appointments for a specific practitioner

   
    
    // //old schedule routes needs to be disposed or repurposed 
    //     Route::get('/practitioner/{practitioner}/schedule', [ScheduleController::class, 'index'])->name('practitioner.schedule.index');
    //     Route::get('/practitioner/{practitioner}/schedule/create', [ScheduleController::class, 'create'])->name('practitioner.schedule.create');
    //     Route::post('/practitioner/{practitioner}/schedule/store', [ScheduleController::class, 'store'])->name('practitioner.schedule.store');
    //     Route::get('/practitioner/{practitioner}/schedule/{schedule}', [ScheduleController::class, 'show'])->name('practitioner.schedule.show');
    //     Route::get('/practitioner/{practitioner}/schedule/edit/{schedule}', [ScheduleController::class, 'edit'])->name('practitioner.schedule.edit');
    //     Route::put('/practitioner/{practitioner}/schedule/update/{schedule}', [ScheduleController::class, 'update'])->name('practitioner.schedule.update');
    //     Route::delete('/practitioner/{practitioner}/schedule/delete/{schedule}', [ScheduleController::class, 'destroy'])->name('practitioner.schedule.destroy');
    
        
        
//------------------------------------------------------------------------------------------------------------------------------------------------//
    //UI test route
    
    Route::get('/test', function (){
        // return Inertia::render( 'Patient/patient-manage'); //add component here 
    })->name('test');
    
    // ----------------------------no-auth routes---------------------------------------------------------------------------------------------------// 
    
    
    //landing page 
    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');
    
    
    // unauthenticated appointment booking routes 
    Route::get('/appointment/create', [NewAppointmentController::class, 'create'])->name('appointment.create'); //to show appointment booking form
    Route::post('/appointment/store', [NewAppointmentController::class, 'store'])->name('appointment.store'); //to store appointment data
    Route::get('/appointment/success', [NewAppointmentController::class, 'success'])->name('appointment.success'); //to show appointment success page
    
    //signed-route generation 
    Route::get('/patient/login/{user}', [PatientLoginController::class, 'loginViaToken'])->name('login.token')->middleware('signed'); //to create a temporary signed route
    
    //Patient-type user login and registration 
    Route::get('/user/patient/create', [PatientUserController::class, 'create'])->name('patient.user.create'); //for patient registration form
    Route::post('/user/patient/store', [PatientUserController::class, 'store'])->name('patient.user.store'); //to store patient user data
    Route::get('/patient/login', [PatientLoginController::class, 'loginForm'])->name('patient.user.loginForm'); //for patient login form
    Route::post('/patient/login', [PatientLoginController::class, 'login'])->name('patient.user.login'); //to login patient user
    
    
    // ----------------------------auth only routes----------------------------------------------------------- 
    Route::middleware(['auth', 'verified'])->group(function () {
        //for basic dashboard 
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
        
        Route::get('dashboard/user/manage', function () {
            return Inertia::render('Admin/userDashboard');
        })->name('dashboard.manage.user');
        
        Route::get('dashboard/practitioner/manage', function () {
            return Inertia::render('Admin/practitionerDashboard');
        })->name('dashboard.managePractitioner');
        
        Route::get('dashboard/patient/manage', function () {
            return Inertia::render('Patient/patient-manage');
    })->name('dashboard.manage.patient');
    
    
    //for appointment booking also used by patients so here 
    Route::get('/admin/appointment/create', [AdminAppointmentController::class, 'create'])->name('admin.appointment.create'); //to show appointment creation form
    Route::post('/admin/appointment/store', [AdminAppointmentController::class, 'store'])->name('admin.appointment.store'); //to store appointment data
    
});

// ----------------------------admin only routes----------------------------------------------------------- 
Route::middleware(['isAdmin','auth'])->group(function () {
    
    // user management related routes 
    Route::get('/admin/user/create', [UserAccountController::class, 'create'])->name('user.create');
    Route::post('/admin/user/store', [UserAccountController::class, 'store'])->name('user.store');
    Route::get('/admin/users', [UserAccountController::class, 'index'])->name('user.index');
    Route::get('/admin/user/{user}', [UserAccountController::class, 'show'])->name('user.show');  
    Route::get('/admin/user/{user}/edit', [UserAccountController::class, 'edit'])->name('user.edit');
    Route::put('/admin/user/{user}/update', [UserAccountController::class, 'update'])->name('user.update');
    Route::delete('/admin/user/{user}/delete', [UserAccountController::class, 'destroy'])->name('user.destroy');
    
    //practitioner management routes 
    Route::get('/admin/users/select-practitioner',[UserAccountController::class,'selectPractitioner'])->name('doctor.index');
    Route::get('/admin/practitioner/{user}/create', [PractitionerController::class, 'create'])->name('practitioner.create');
    Route::post('/admin/practitioner/store', [PractitionerController::class, 'store'])->name('practitioner.store');
    Route::delete('/admin/practitioner/{practitioner}/delete',[PractitionerController::class, 'destroy'])->name('practitioner.destroy');
    Route::get('/practitioner/{practitioner}/edit', [PractitionerController::class, 'edit'])->name('practitioner.edit');
    Route::put('/practitioner/{practitioner}/update', [PractitionerController::class, 'update'])->name('practitioner.update');

    //schedule management routes specific to admin
    Route::get('/admin/schedule/edit/{schedule}', [AdminScheduleController::class, 'edit'])->name('admin.schedule.edit');
    Route::put('/admin/schedule/update/{schedule}', [AdminScheduleController::class, 'update'])->name('admin.schedule.update');
    Route::delete('/admin/schedule/delete/{schedule}', [AdminScheduleController::class, 'destroy'])->name('admin.schedule.destroy');
    
    
    
});



// ----------------------------staff routes----------------------------------------------------------- 
Route::middleware(['isStaff'])->group(function () {
    
    
});


// ----------------------------admin or frontdesk routes----------------------------------------------------------- 
Route::middleware(['adminOrFrontdesk', 'auth', 'verified'])->group(function () {
    
    //practitioner data routes 
    Route::get('admin/practitioners', [PractitionerController::class, 'index'])->name('practitioner.index');
    Route::get('/practitioner/{practitioner}', [PractitionerController::class, 'show'])->name('practitioner.show');
    
    //routes for admin to manage schedules 
    Route::get('/admin/schedule/manage', [AdminScheduleController::class, 'dashboard'])->name('admin.schedule.dashboard'); //to view all schedules
    Route::get('/admin/schedules', [AdminScheduleController::class, 'index'])->name('admin.schedule.index');
    Route::get('/admin/schedule/selectpractitioner', [AdminScheduleController::class, 'selectPractitioner'])->name('admin.schedule.practitioners'); //to view appointments for a specific schedule
    Route::get('/admin/schedule/create/{practitioner}', [AdminScheduleController::class, 'create'])->name('admin.schedule.create');
    Route::post('/admin/schedule/store/{practitioner}', [AdminScheduleController::class, 'store'])->name('admin.schedule.store');
    Route::get('/admin/schedule/{schedule}', [AdminScheduleController::class, 'show'])->name('admin.schedule.show');
    
    
    //routes for appointment management
    Route::get('/admin/appointment/manage', [AdminAppointmentController::class, 'dashboard'])->name('admin.appointment.dashboard'); //to view all appointments
    Route::get('/admin/appointments', [AdminAppointmentController::class, 'index'])->name('admin.appointment.index'); //to view all appointments
    Route::get('/appointment/select-schedule', [AdminAppointmentController::class, 'selectSchedule'])->name('admin.appointment.schedules'); //to view appointments for a specific practitioner
    Route::get('/admin/appointment/{appointment}', [AdminAppointmentController::class, 'show'])->name('admin.appointment.show'); //to view appointment details
    Route::get('/admin/appointment/edit/{appointment}', [AdminAppointmentController::class, 'edit'])->name('admin.appointment.edit'); //to show appointment edit form
    Route::put('/admin/appointment/update/{appointment}', [AdminAppointmentController::class, 'update'])->name('admin.appointment.update'); //to update appointment data
    Route::delete('/admin/appointment/delete/{appointment}', [AdminAppointmentController::class, 'destroy'])->name('admin.appointment.destroy'); //to delete appointment
    
    //routes for patient data management
    // Route::get('/patient/dashboard', [PatientController::class, 'dashboard'])->name('patient.dashboard'); //for patient dashboard
    Route::get( '/patients',  [PatientController::class, 'index'])->name('patient.index'); //for admin and frontdesk to see all patients
    // Route::get('/patient/create', [PatientController::class, 'create'])->name('patient.create'); //to show registration form
    // Route::post('/patient/store', [PatientController::class, 'store'])->name('patient.store'); //to store patient data
    Route::get('/patient/{patient}', [PatientController::class, 'show'])->name('patient.show');
    Route::get('/patient/{patient}/edit', [PatientController::class, 'edit'])->name('patient.edit');
    Route::put('/patient/{patient}/update', [PatientController::class, 'update'])->name('patient.update');
    Route::delete('/patient/{patient}/delete', [PatientController::class, 'destroy'])->name('patient.destroy');
    
    
});


// ----------------------------patient routes ----------------------------------------------------------- 
Route::middleware(['auth', 'verified'])->group(function () {
    
    //appoientment management routes for patient(works but still requires routes for update and cancel)
    Route::get('/patient/appointments',[PatientAppointmentController::class, 'index'])->name('patient.appointment.index'); //to view all appointments for the patient
    Route::get('/patient/appointments/{appointment}', [PatientAppointmentController::class, 'show'])->name('patient.appointment.show'); //to view appointment details
    
    
});

// ----------------------------practitioner routes----------------------------------------------------------- 
Route::middleware(['auth', 'verified'])->group(function () {

    //appointment routes (doesnot work at the moment)
    Route::get('user/practitioner/appointments', [PractitionerAppointmentController::class, 'index'])->name('practitioner.appointments.index'); //to view all appointments for the practitioner
    Route::get('user/practitioner/appointment/{appointment}', [PractitionerAppointmentController::class, 'show'])->name('practitioner.appointments.show'); //to view appointment details
        
        
    });
//-----------------------------------------------------------------------------------------------------------------------
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
