<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->createMany([
            [
            'name' => 'admin',
            'email' => 'test@example.com',
            'password' => bcrypt('admin@123'),
            'role' => 'admin'
            ],
            [
            'name' => 'doc1',
            'email' => 'doc1@example.com',
            'password' => bcrypt('doc1@123'),
            'role' => 'doctor'
            ],
            [
            'name' => 'doc2',
            'email' => 'doc2@example.com',
            'password' => bcrypt('doc2@123'),
            'role' => 'doctor'
            ],
            [
            'name' => 'doc3',
            'email' => 'doc3@example.com',
            'password' => bcrypt('doc3@123'),
            'role' => 'doctor'
            ],
            [
            'name' => 'rep1',
            'email' => 'rep1@example.com',
            'password' => bcrypt('rep1@123'),
            'role' => 'frontdesk'
            ]
        ]);
    }
}
