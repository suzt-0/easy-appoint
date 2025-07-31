<?php

namespace App\Http\Controllers\Practitioner;
use App\Http\Controllers\Controller;

use App\Models\Practitioner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PractitionerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $practitioners = Practitioner::all()
        ->where('active', true);

        return inertia('Practitioner/listPractitioners', ['practitioners' => $practitioners]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(User $user)
    {
        return inertia('Practitioner/createPractitioner', ['user' => $user]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        // Validate the request data
        $validatedData = $request->validate([
            // for basic practitioner table
            'user_id' => 'required|exists:users,id', // Assuming the user is created separately  
            'family_name' => 'required|string|max:255',
            'given_name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female,other,unknown',
            'birth_date' => 'nullable|date',
            'active' => 'boolean',
            //for telecoms
            'telecoms.*.system' => 'required|string|in:phone,email,fax,pager,url,sms,other',
            'telecoms.*.value' => 'required|string|max:255',
            'telecoms.*.use' => 'nullable|string|in:home,work,mobile,temp,old,mobile', //use is optional and can be one of these values
            //for qualifications
            'qualifications.*.code' => 'required|string|max:255', //the * indicates that this is an array of qualifications
            'qualifications.*.period' => 'nullable|date',
            'qualifications.*.issuer' => 'nullable|string|max:255',
        ]);

        //check if the user already has a practitioner record
        if (Practitioner::where('user_id', $validatedData['user_id'])->exists()) {
            return back()->withErrors(['user_id' => 'This user already has a practitioner record.']);
        }
        // Check if the user is a doctor
        $user = User::find($validatedData['user_id']);
        if ($user->role !== 'doctor') {
            return back()->withErrors(['user_id' => 'The selected user is not a doctor.']);
        }

        // start a transaction to ensure data integrity
        DB::beginTransaction();

        try {
            // dd($validatedData);
            // Create the practitioner
            $practitioner = Practitioner::create([
                'user_id' => $validatedData['user_id'],
                'given_name' => $validatedData['given_name'],
                'family_name' => $validatedData['family_name'],
                'gender' => $validatedData['gender'],
                'birth_date' => $validatedData['birth_date'] ?? null,
                'active' => $validatedData['active'] ?? false,
            ]);

            // dd($practitioner);

            // Create telecoms if provided
            if (!empty($validatedData['telecoms'])) {
                foreach ($validatedData['telecoms'] as $telecom) {
                    //here loop all the data for telecoms of the practitioner
                    $practitioner->telecoms()->create([
                        'system' => $telecom['system'],
                        'value' => $telecom['value'],
                        'use' => $telecom['use'] ?? null,
                    ]);
                }
            }

            // Create qualifications if provided
            if (!empty($validatedData['qualifications'])) {
                foreach ($validatedData['qualifications'] as $qualification) {
                    //here loop all the data for qualifications of the practitioner
                    $practitioner->qualifications()->create([
                        'code' => $qualification['code'],
                        'period' => $qualification['period'] ?? null,
                        'issuer' => $qualification['issuer'] ?? null,
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create practitioner: ' . $e->getMessage()]);
        }


        return redirect()->route('practitioner.index')->with('success', 'Practitioner created successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(Practitioner $practitioner)
    {
        // $pract = Practitioner::with(['telecoms', 'qualifications'])
        //     ->get()
        //     ->where('practitioner_id', $practitioner->id);

        //$pract = Practitioner::with(['telecoms', 'qualifications'])
        $pract = Practitioner::with(['telecoms', 'qualifications'])
            ->where('id', $practitioner->id)
            ->firstOrFail(); // Use firstOrFail to get a single practitioner or throw a 404 if not found
        // dd($pract);

        return inertia('Practitioner/showPractitioner', ['practitioner' => $pract]);



    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Practitioner $practitioner)
    {
        $practitioner->load(['telecoms', 'qualifications']); // Load related telecoms and qualifications
        // dd($practitioner);
        
        return inertia('Practitioner/editPractitioner',['practitioner' => $practitioner]); //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Practitioner $practitioner)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'family_name' => 'required|string|max:255',
            'given_name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female,other,unknown',
            'birth_date' => 'nullable|date',
            'active' => 'boolean',
            // for telecoms
            'telecoms.*.system' => 'required|string|in:phone,email,fax,pager,url,sms,other',
            'telecoms.*.value' => 'required|string|max:255',
            'telecoms.*.use' => 'nullable|string|in:home,work,mobile,temp,old,mobile',
            // for qualifications
            'qualifications.*.code' => 'required|string|max:255',
            'qualifications.*.period' => 'nullable|date',
            'qualifications.*.issuer' => 'nullable|string|max:255',
        ]);

        // Additional validation for email telecoms
        if (isset($validatedData['telecoms'])) {
            foreach ($validatedData['telecoms'] as $index => $telecom) {
                if ($telecom['system'] === 'email') {
                    if (!preg_match('/^[a-zA-Z0-9._%+-]+@gmail\.com$/', $telecom['value'])) {
                        return back()->withErrors(["telecoms.{$index}.value" => 'The email must be a Gmail address.'])->withInput();
                    }
                }
            }
        }

        DB::beginTransaction();

        try {
            // Update the practitioner's basic info
            $practitioner->update([
                'family_name' => $validatedData['family_name'],
                'given_name' => $validatedData['given_name'],
                'gender' => $validatedData['gender'],
                'birth_date' => $validatedData['birth_date'] ?? null,
                'active' => $validatedData['active'] ?? false,
            ]);

            // Update telecoms: delete old and add new
            if (isset($validatedData['telecoms'])) {
                $practitioner->telecoms()->delete();
                foreach ($validatedData['telecoms'] as $telecom) {
                    $practitioner->telecoms()->create([
                        'system' => $telecom['system'],
                        'value' => $telecom['value'],
                        'use' => $telecom['use'] ?? null,
                    ]);
                }
            }

            // Update qualifications: delete old and add new
            if (isset($validatedData['qualifications'])) {
                $practitioner->qualifications()->delete();
                foreach ($validatedData['qualifications'] as $qualification) {
                    $practitioner->qualifications()->create([
                        'code' => $qualification['code'],
                        'period' => $qualification['period'] ?? null,
                        'issuer' => $qualification['issuer'] ?? null,
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update practitioner: ' . $e->getMessage()]);
        }

        return redirect()->route('practitioner.show', $practitioner)->with('success', 'Practitioner updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Practitioner $practitioner)
    {
        $practitioner->update(['active' => false]); //associated with user, schedules, time slots, and appointments
        // Redirect back to the practitioner index with a success message
        return redirect()->route('practitioner.index')->with('success', 'Practitioner deleted successfully.');
    }
}
