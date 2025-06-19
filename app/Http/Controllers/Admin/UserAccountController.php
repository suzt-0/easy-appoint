<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\User;
use Illuminate\Http\Request;

class UserAccountController extends Controller
{
    //to display all users
    public function index()
    {
        // Fetch all users from the database
        $users = User::all(); // Exclude admin users from the list\
        // dd($users);
        // $users = User::all()->where('role', '!=', 'admin'); 
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
            'role' => 'string|required',
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
            'password' => bcrypt($validatedData['name'].'Pwd@1234'),
        ]);

        //send mail notifications 

        return redirect()->route('users.create')->with('success', 'User created successfully.');
    }


    //a method to edit a user
    public function editUser(User $user)
    {
        // Return the view with the user data for editing
        return inertia('Admin/EditUser', ['user' => $user]);
    }

    //a method to update a user
    public function updateUser(Request $request, User $user)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:doctor,frontDesk',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $updateData = [];

        // Check if the validated data is different from the current user data
        if ($validatedData['name'] !== $user->name) {  
            $updateData['name'] = $validatedData['name'];
        }
        if ($validatedData['email'] !== $user->email) {
            $updateData['email'] = $validatedData['email'];
        }
        if ($validatedData['role'] !== $user->role) {
            $updateData['role'] = $validatedData['role'];
        }
        if (!empty($validatedData['password'])) {
            $updateData['password'] = bcrypt($validatedData['password']);
        }

        if (!empty($updateData)) {
            $user->update($updateData);
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    // Method to handle user account deletion
    public function deleteAccount(Request $request)
    {
        $userId = $request->input('user_id');
        $targetUser = User::find($userId);

        if ($targetUser) {
            $targetUser->delete();
            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
        }

        return redirect()->back()->withErrors(['user' => 'User not found.']);
    }
}
