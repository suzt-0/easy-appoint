<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Str;

class UserAccountController extends Controller
{
    //to display all users
    public function index()
    {
        // Fetch all users from the database
        $users = User::all(); // Exclude admin users from the list
        //to exclude admin users, you can modify the query like this:
        // $users = User::where('role', '!=', 'admin')->get();
        // dd($users);
        return inertia('Admin/listUser', ['users' => $users]);

    }

    //to display a specific user
    public function show(User $user)
    {
        // Return the view with the user data
        return inertia('Admin/UserDetails', ['user' => $user]);
    }

    //a method to create a new user
    public function create()
    {
        return inertia('Admin/createUser');
    }

    //a method to store a new user  
    public function store(Request $request)
    {
        // dd($request->all());
        
        // Validate the request data
        $validatedData = $request->validate(rules: [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'role' => 'string|required|in:doctor,frontdesk',
        ]);
        
        // Check if the email already exists
        if (User::where('email', $validatedData['email'])->exists()) {
            return redirect()->back()->withErrors(['email' => 'User already exists with this email address.']);
        }

        // Create the user
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'role' => $validatedData['role'],
            'email_verified_at' => now(), // Set email verification date to now for testing purposes
            'remember_token' => Str::random(10), // Generate a random remember token
            'password' => bcrypt($validatedData['name'].'Pwd@1234'),
        ]);
        

        //send mail notifications 

        return redirect()->route('user.index')->with('success', 'User created successfully.');
    }


    //a method to edit a user
    public function edit(User $user)
    {
        // Return the view with the user data for editing
        return inertia('Admin/editUser', ['user' => $user]);
    }

    //a method to update a user
    public function update(Request $request, User $user)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:doctor,frontdesk',
            // 'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->update([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'role' => $validatedData['role'],
        ]);

        return redirect()->route('user.index')->with('success', 'User updated successfully.');
    }

    // Method to handle user account deletion
    public function destroy(Request $request)
    {
        // Validate the request data
        $request->validate([
            'id' => 'required|exists:users,id',
        ]);
        
        // dd($request->all());
        // Find the user by ID and delete it
        $user = User::findOrFail($request->input('id'));
        $user->delete();

        // Redirect back with a success message
        return redirect()->route('user.index')->with('success', 'User account deleted successfully.');
    }

    //method to show all the users with doctor role
    public function doctors()
    {
        // Fetch all users with the role of 'doctor'
        $users = User::where('role', 'doctor')->get();
        // dd($users);
        
        // Return the view with the list of doctors
        return inertia('Practitioner/selectPractitioner', ['users' => $users]);
    }    
}
