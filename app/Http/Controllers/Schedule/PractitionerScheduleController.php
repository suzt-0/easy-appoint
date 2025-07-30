<?php

namespace App\Http\Controllers\Schedule;
use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Practitioner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PractitionerScheduleController extends Controller
{
    /**
     * Index for a particular practitioner to view their own schedules
     */
    public function index()
    {
        // Get the authenticated user
        $user = Auth::user();
        
        // Find the practitioner record for this user
        $practitioner = Practitioner::where('user_id', $user->id)->first();
        
        if (!$practitioner) {
            return redirect()->back()->with('error', 'Practitioner profile not found.');
        }
        
        // Get today's day name
        $todayDayName = now()->format('l'); // e.g., 'Monday', 'Tuesday', etc.
        
        // Get all active schedules for this practitioner without appointments
        $schedules = Schedule::where('practitioner_id', $practitioner->id)
            ->where('active', 1)
            ->orderBy('day_of_week', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        // Add a status indicator for each schedule
        foreach ($schedules as $schedule) {
            $schedule->is_today = ($schedule->day_of_week === $todayDayName);
            $schedule->status = $schedule->is_today ? 'active' : 'inactive';
            // Set empty appointments collection for index page
            $schedule->setRelation('appointments', collect([]));
        }
        
        // Return the view with schedules data
        return inertia('Schedule/practitoner-schedule-index', [
            'schedules' => $schedules,
            'practitioner' => $practitioner
        ]);
    }

    /**
     * Show a specific schedule for the authenticated practitioner
     */
    public function show(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();
        
        // Find the practitioner record for this user
        $practitioner = Practitioner::where('user_id', $user->id)->first();
        
        if (!$practitioner) {
            return redirect()->back()->with('error', 'Practitioner profile not found.');
        }
        
        // Get the schedule ID from request parameter or show the first available schedule
        $scheduleId = $request->query('schedule_id');
        
        // Get today's day name
        $todayDayName = now()->format('l');

        if ($scheduleId) {
            // Show specific schedule - ensure it belongs to this practitioner
            $schedule = Schedule::where('id', $scheduleId)
                ->where('practitioner_id', $practitioner->id)
                ->where('active', 1)
                ->first();
                
            if ($schedule) {
                // Load today's appointments only if today matches the schedule's day
                if ($schedule->day_of_week === $todayDayName) {
                    $schedule->load(['appointments' => function($query) {
                        $query->where('status', '!=', 'cancelled')
                              ->where('appointment_date', now()->toDateString())
                              ->orderBy('appointment_date', 'asc');
                    }]);
                } else {
                    // Set empty collection for schedules not happening today
                    $schedule->setRelation('appointments', collect([]));
                }
            }
                
            if (!$schedule) {
                return redirect()->route('practitioner.schedule.index')
                    ->with('error', 'Schedule not found or access denied.');
            }
        } else {
            // Show today's schedule if it exists, otherwise show the first available schedule
            $schedule = Schedule::where('practitioner_id', $practitioner->id)
                ->where('active', 1)
                ->where('day_of_week', $todayDayName)
                ->first();
                
            // If no schedule for today, get the first available schedule
            if (!$schedule) {
                $schedule = Schedule::where('practitioner_id', $practitioner->id)
                    ->where('active', 1)
                    ->orderBy('day_of_week', 'asc')
                    ->orderBy('start_time', 'asc')
                    ->first();
            }
                
            if ($schedule) {
                // Load today's appointments only if today matches the schedule's day
                if ($schedule->day_of_week === $todayDayName) {
                    $schedule->load(['appointments' => function($query) {
                        $query->where('status', '!=', 'cancelled')
                              ->where('appointment_date', now()->toDateString())
                              ->orderBy('appointment_date', 'asc');
                    }]);
                } else {
                    // Set empty collection for schedules not happening today
                    $schedule->setRelation('appointments', collect([]));
                }
            }
                
            if (!$schedule) {
                return redirect()->route('practitioner.schedule.index')
                    ->with('info', 'No active schedules found.');
            }
        }
        
        // Return the view with schedule data
        return inertia('Schedule/practitioner-schedule-show', [
            'schedule' => $schedule,
            'practitioner' => $practitioner,
            'isToday' => $schedule->day_of_week === $todayDayName
        ]);
    }
}
