<?php

namespace App\Http\Controllers\Schedule;

use App\Http\Controllers\Controller;
use App\Models\Practitioner;
use App\Models\Schedule;
use Illuminate\Http\Request;

class AdminScheduleController extends Controller
{
    /**
     * Dashboard for the admin to manage schedules
     */

    public function dashboard(){
        return inertia('Schedule/admin-schedule-manage');
    }



    /**
     * List all the schedules for the admin 
     */

    public function index()
    {

        $schedules =  Schedule::where('active', 1)
            ->with(['practitioner', 'appointments'])
            ->get();
        // dd($schedules);
        // Return the view to list all schedules
        return inertia('Schedule/admin-schedule-index', [
            'schedules' => $schedules
        ]);
    }

    /**
     * Show a specific schedule for the admin
     */
    public function show(Schedule $schedule){
        $schedule->load(['practitioner', 'appointments']); // Eager load the practitioner and appointments relationships
        // dd($schedule);
        // Return the view to show a specific schedule
        return inertia('Schedule/admin-schedule-show', [
            'schedule' => $schedule
        ]);
    }

    /**
     * Show the form for editing the specified schedule
     */
    public function edit(Schedule $schedule)
    {

        $schedule->load(['practitioner']);
        // dd($schedule);
        return inertia('Schedule/admin-schedule-edit', [
            'schedule' => $schedule
        ]);
    }

    /**
     * Update the specified schedule in storage
     */
    public function update(Request $request, Schedule $schedule)
    {
        //get practitioner_id from schedule
        $practitioner = $schedule->practitioner;
        //check if the practitioner exists
        if (!$practitioner) {
            return redirect()->route('dashboard')
                ->with('error', 'Practitioner not found.');
        }

        $request->validate([
            'service_category' => 'nullable|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'specialty' => 'nullable|string|max:255',
            'active' => 'boolean',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time'
        ]);

        $schedule->update($request->only([
            'practitioner_id',
            'service_category',
            'service_type',
            'specialty',
            'day_of_week',
            'start_time',
            'end_time',
            'active',
        ]));

        return redirect()->route('admin.schedule.show', $schedule->id)
            ->with('success', 'Schedule updated successfully.');
    }

    /**
     * Remove the specified schedule from storage
     */
    public function destroy(Schedule $schedule)
    {
        $schedule->delete(); //delete the schedule directly without checking for appointments
        
        return redirect()->route('admin.schedule.index')
            ->with('success', 'Schedule deleted successfully.');
    }

    /**
     * Show the form for creating a new schedule
     */
    public function selectPractitioner()
    {
        // Get all active practitioners with their schedule counts
        $practitioners = Practitioner::where('active', 1)
            ->withCount('schedules')
            ->orderBy('given_name')
            ->orderBy('family_name')
            ->get();

        return inertia('Schedule/admin-schedule-select-practitioner', [
            'practitioners' => $practitioners
        ]);
    }

    /**
     * Show the form for creating a new schedule for a specific practitioner
     */
    public function create(Practitioner $practitioner)
    {
        return inertia('Schedule/admin-schedule-create', [
            'practitioner' => $practitioner
        ]);
    }    /**
     * Store a newly created schedule in storage
     */
    public function store(Request $request, Practitioner $practitioner)
    {

        //check if the practitioner exists
        if (!$practitioner) {
            return redirect()->route('dashboard')
                ->with('error', 'Practitioner not found.');
        }


        $request->validate([
            'service_category' => 'nullable|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'specialty' => 'nullable|string|max:255',
            'active' => 'boolean',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time'
        ]);

        $schedule = Schedule::create([
            'practitioner_id' => $practitioner->id,
            'service_category' => $request->service_category,
            'service_type' => $request->service_type,
            'specialty' => $request->specialty,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'active' => $request->boolean('active'),
        ]);

        return redirect()->route('admin.schedule.show', $schedule->id)
            ->with('success', 'Schedule created successfully.');
    }

    /**
     * Show all schedules for a specific practitioner
     */
    // public function practitionerSchedules(Practitioner $practitioner)
    // {
    //     $schedules = Schedule::where('practitioner_id', $practitioner->id)
    //         ->with(['appointments'])
    //         ->orderBy('day_of_week')
    //         ->orderBy('start_time')
    //         ->get();

    //     return inertia('Schedule/admin-practitioner-schedules', [
    //         'practitioner' => $practitioner,
    //         'schedules' => $schedules
    //     ]);
    // }
}
