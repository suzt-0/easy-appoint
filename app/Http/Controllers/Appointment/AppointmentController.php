<?php

namespace App\Http\Controllers\Appointment;
use App\Http\Controllers\Controller;

use App\Models\Appointment;
use App\Models\Practitioner;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display a listing of all the appointments for admin and frontdesk.
     * This method retrieves all active appointments and returns them to the index view.
     */
    public function indexAll()
    {
        // for admin and frontdesk to see all the appointments 

        $appointments = Appointment::all();

        // Return the appointment index view with the list of appointments
        return inertia(
            'Appointment/appointment-index',
            [
                'appointments' => $appointments
            ]
        );
    }

    /**
     * Display a listing of all the appointments for practitioners 
     * This method retrieves all active appointments and returns them to the practitioner index view.
     */
    public function indexForPractitioner(Practitioner $practitioner){ //here the paramenters can be either practitioner or patient
        $appointments = Appointment::where('practitioner_id', $practitioner->id)
            ->where('is_active', true)
            ->get();
        // Return the appointment index view with the list of appointments for the practitioner
        return inertia(
            'Appointment/PractitionerIndex',
            [
                'appointments' => $appointments,
                'practitioner' => $practitioner
            ]
        );

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        //
    }
}
