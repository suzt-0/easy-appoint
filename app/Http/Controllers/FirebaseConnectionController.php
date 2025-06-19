<?php

namespace App\Http\Controllers;
use Kreait\Firebase\Factory;
use Exception;
use Illuminate\Http\Request;

class FirebaseConnectionController extends Controller
{
    public function __construct(){
        $path = base_path('storage\firebase\firebase.json');

        if(!file_exists($path)){
            die("The file path {$path} does not exists");
        }

        // Initialize Firebase Factory with the service account and database URI
        // This is done in the constructor to ensure that the Firebase connection is established when the controller is instantiated.
        try {
            $factory = (new Factory)
                ->withServiceAccount($path)
                ->withDatabaseUri('https://easy-appoint-ff5df-default-rtdb.firebaseio.com');
          
        } catch (Exception $e) {
            die("Firebase connection failed: " . $e->getMessage());
        }

        
    }
//    public function index(){
//     $path = base_path('storage\firebase\firebase.json');

//     if(!file_exists($path)){
//         die("The file path {$path} does not exists");
//     }

//     try{
//         $factory = (new Factory)
//             ->withServiceAccount($path)
//             ->withDatabaseUri('https://easy-appoint-ff5df-default-rtdb.firebaseio.com');
//         $database = $factory->createDatabase();
//         $reference = $database->getReference('contacts');
//         $reference->set(['connection'=> true]);
//         $snapshot = $reference->getSnapshot();
//         $value = $snapshot->getValue();
//         return response([
//             'message' => 'Firebase connection successful',
//             'status' => true,
//             'data' => $value
//         ]);

//     }
//     catch(Exception $e){
//         return response([
//             'message' => $e->getMessage(),
//             'status'=>false,
//         ]);

//     }
    
//    }  
}
