<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\Login;
use Illuminate\Validation\ValidationException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;

class PatientLoginController extends Controller
{

    /**
     * display the login form for patients.
     */
    public function loginForm()
    {
        // Render the login form for patients
        return inertia('Patient/login');
    }

    /**
     * Handle the login request for patients.
     */
    public function login(Request $request)
    {
        try {
            // Validate the login request
            $request->validate([
                'email' => 'required|email|email:rfc,dns|exists:users,email|regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/',
            ]);

            // get role of the user of given email
            $user = User::where('email', $request->email)->first();

            // Check if the user is a patient
            if ($user->role != 'patient') {
                // Log in the patient user
                return redirect()->back()->withErrors(['email' => 'You are not patient!!!.']);
            }

            //create a temporary signed route for the patient
            $link = URL::temporarySignedRoute( 'login.token' ,now()->addHours(2),['user'=>$user->id]); 

            //send mail notification
            $user->notify(new Login($link));


            //return without input and with success message
            return redirect()
            ->route('home')
            ->with('success', 'Login link has been sent to your email. Please check your email to log in.');


        } catch (Exception $e) {
            if ($e instanceof ValidationException) {
                return redirect()->back()->withErrors($e->validator)->withInput();
            }

            // Handle other exceptions
            return redirect()->back()->withErrors(['error' => 'An error occurred while processing your request.']);
        }
    }


    /**
     * Handle the creation of logintoken.
     */

    public function loginViaToken(User $user){
        // dd($user);
        Auth::login($user);

        request()->session()->regenerate();

        return redirect('dashboard')->with('sucess','Logged in sucessfully');
    }


}
