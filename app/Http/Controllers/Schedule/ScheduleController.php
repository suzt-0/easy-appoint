<?php

namespace App\Http\Controllers\Schedule;
use App\Http\Controllers\Controller;

use App\Models\Practitioner;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Practitioner $practitioner)
    {
        // Fetch schedules for the given practitioner
        $schedules = $practitioner->schedules()->get();

        // dd($schedules);
        // dd($practitioner);
        return inertia('Practitioner/Schedule/listSchedules', [
            'schedules' => $schedules,
            'practitioner' => $practitioner,
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Practitioner $practitioner)
    {
        //to create a new schedule for a practitioner

        return inertia('Practitioner/Schedule/createSchedule', [
            'practitioner' => $practitioner,
            'daysOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'practitioner_id' => 'required|exists:practitioners,id',
            'service_category' => 'nullable|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'specialty' => 'nullable|string|max:255',
            'active' => 'boolean',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);


        //Create using mass assignment method
        $schedule = Schedule::create([
            'practitioner_id' => $validatedData['practitioner_id'],
            'service_category' => $validatedData['service_category'],
            'service_type' => $validatedData['service_type'],
            'specialty' => $validatedData['specialty'],
            'active' => $validatedData['active'] ?? true, // Default to true if not provided
            'day_of_week' => $validatedData['day_of_week'],
            'start_time' => $validatedData['start_time'],
            'end_time' => $validatedData['end_time'],
        ]);


        // Redirect back to the schedule index with a success message
        return redirect()->route('practitioner.schedule.index', ['practitioner' => $schedule->practitioner_id])
            ->with('success', 'Schedule created successfully.');
            
    }

    /**
     * Display the specified resource.
     */
    public function show(Practitioner $practitioner, Schedule $schedule)
    {
        //show the details of a specific schedule
        return inertia('Practitioner/Schedule/showSchedule', [
            'schedule' => $schedule,
            'practitioner' => $practitioner,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        //edit form for a specific schedule
        return inertia('Practitioner/Schedule/editSchedule', [
            'schedule' => $schedule,
            'practitioner' => $schedule->practitioner,
            'daysOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schedule $schedule)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'service_category' => 'nullable|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'specialty' => 'nullable|string|max:255',
            'active' => 'boolean',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);
        // Update the schedule using mass assignment
        $schedule->update([
            'service_category' => $validatedData['service_category'],
            'service_type' => $validatedData['service_type'],
            'specialty' => $validatedData['specialty'],
            'active' => $validatedData['active'] ?? true, // Default to true if not provided
            'day_of_week' => $validatedData['day_of_week'],
            'start_time' => $validatedData['start_time'],
            'end_time' => $validatedData['end_time'],
        ]);
        // Redirect back to the schedule index with a success message
        return redirect()->route('practitioner.schedule.index', ['practitioner' => $schedule->practitioner_id])
            ->with('success', 'Schedule updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        //delete the specified schedule
        $practitionerId = $schedule->practitioner_id;
        $schedule->delete();
        // Redirect back to the schedule index with a success message
        return redirect()->route('practitioner.schedule.index', ['practitioner' => $practitionerId])
            ->with('success', 'Schedule deleted successfully.');
    }
    
    /**
     * Toggle the active status of the specified schedule.
     */
    public function toggleActive(Schedule $schedule)
    {
        // Toggle the active status of the schedule
        $schedule->active = !$schedule->active; //if active is true, set it to false and vice versa
        $schedule->save();

        // Redirect back to the schedule index with a success message
        return redirect()->route('practitioner.schedule.index', ['practitioner' => $schedule->practitioner_id])
            ->with('success', 'Schedule status updated successfully.');
    }
}
