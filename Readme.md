# Easy Appoint

Easy Appoint is a web application designed to simplify appointment scheduling and management for healthcare providers and patients. It offers a user-friendly interface and robust features to streamline the appointment process.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Project Structure](#project-structure)
5. [Routes](#routes)
6. [Middleware](#middleware)

## Features

- User authentication and role-based access control.
- Appointment scheduling and management.
- Email notifications for appointment confirmations, updates, and cancellations.
- Patient and practitioner management.
- Integration with FHIR for healthcare data standards.
- Support for managing schedules, slots, and reports.

## Installation

### Prerequisites

- PHP 8.0 or higher
- Composer
- Node.js and npm
- MySQL or any other supported database

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/suzt-0/easy-appoint.git
   cd easy-appoint
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install
   ```

4. Set up the environment file:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database and other configuration details.

5. Generate the application key:
   ```bash
   php artisan key:generate
   ```

6. Run database migrations:
   ```bash
   php artisan migrate
   ```

7. Start the development server:
   ```bash
   php artisan serve
   ```

8. Build frontend assets:
   ```bash
   npm run dev
   ```

## Usage

- Access the application at `http://localhost:8000` after starting the development server.
- Use the provided user roles to log in and explore the features.

## Project Structure

```
app/
  Http/
    Controllers/       # Application controllers
    Middleware/        # Middleware for request handling
    Requests/          # Form request validation
  Mail/                # Email templates for notifications
  Models/              # Eloquent models
  Notifications/       # Notification classes
  Providers/           # Service providers
  Services/            # Custom service classes
bootstrap/             # Application bootstrap files
config/                # Configuration files
database/
  factories/           # Model factories
  migrations/          # Database migrations
  seeders/             # Database seeders
public/                # Publicly accessible files
resources/             # Views, CSS, and JavaScript assets
routes/                # Application routes
storage/               # Logs, cache, and compiled files
tests/                 # Test cases
vendor/                # Composer dependencies
```

## Routes

Below is a list of the main routes defined in the application and their purposes:

### No-Auth Routes
- **Landing Page:**
  - `GET /` - Displays the landing page.
- **Appointment Booking:**
  - `GET /appointment/create` - Displays the appointment booking form.
  - `POST /appointment/store` - Stores appointment data.
  - `GET /appointment/success` - Displays the appointment success page.
- **Patient Login and Registration:**
  - `GET /patient/login/{user}` - Temporary signed route for patient login.
  - `GET /user/patient/create` - Displays the patient registration form.
  - `POST /user/patient/store` - Stores patient user data.
  - `GET /patient/login` - Displays the patient login form.
  - `POST /patient/login` - Logs in the patient user.

### Authenticated Routes
- **Dashboard:**
  - `GET /dashboard` - Displays the basic dashboard.
  - `GET /dashboard/user/manage` - Displays the user management dashboard.
  - `GET /dashboard/practitioner/manage` - Displays the practitioner management dashboard.
  - `GET /dashboard/patient/manage` - Displays the patient management dashboard.

### Admin Routes
- **User Management:**
  - `GET /admin/user/create` - Displays the user creation form.
  - `POST /admin/user/store` - Stores user data.
  - `GET /admin/users` - Lists all users.
  - `GET /admin/user/{user}` - Displays user details.
  - `GET /admin/user/{user}/edit` - Displays the user edit form.
  - `PUT /admin/user/{user}/update` - Updates user data.
  - `DELETE /admin/user/{user}/delete` - Deletes a user.
- **Practitioner Management:**
  - `GET /admin/users/select-practitioner` - Lists practitioners for selection.
  - `GET /admin/practitioner/{user}/create` - Displays the practitioner creation form.
  - `POST /admin/practitioner/store` - Stores practitioner data.
  - `GET /practitioner/{practitioner}/edit` - Displays the practitioner edit form.
  - `PUT /practitioner/{practitioner}/update` - Updates practitioner data.
  - `DELETE /admin/practitioner/{practitioner}/delete` - Deletes a practitioner.
- **Schedule Management:**
  - `GET /admin/schedule/edit/{schedule}` - Displays the schedule edit form.
  - `PUT /admin/schedule/update/{schedule}` - Updates schedule data.
  - `DELETE /admin/schedule/delete/{schedule}` - Deletes a schedule.

### Patient Routes
- **Appointment Management:**
  - `GET /user/patient/appointments` - Lists all appointments for the patient.
  - `GET /user/patient/appointments/{appointment}` - Displays appointment details.
  - `PUT /user/patient/appointment/cancel/{appointment}` - Cancels an appointment.
  - `GET /user/patient/appointment/reschedule/{appointment}` - Displays the reschedule form.
  - `PUT /user/patient/appointment/update/{appointment}` - Updates appointment data.

### Practitioner Routes
- **Appointment Management:**
  - `GET /user/practitioner/appointments` - Lists all appointments for the practitioner.
  - `GET /user/practitioner/appointment/{appointment}` - Displays appointment details.
  - `PUT /user/practitioner/appointment/cancel/{appointment}` - Cancels an appointment.
- **Schedule Management:**
  - `GET /user/practitioner/schedules` - Lists all schedules for the practitioner.
  - `GET /user/practitioner/schedule` - Displays a specific schedule for the practitioner.

## Middleware

The application uses the following middleware to handle requests and enforce access control:

### Global Middleware
- **`auth`**: Ensures that the user is authenticated before accessing certain routes.
- **`verified`**: Ensures that the user's email is verified.

### Route Middleware

#### Admin Middleware
- **`isAdmin`**: Restricts access to admin-only routes.

#### Staff Middleware
- **`isStaff`**: Restricts access to staff-only routes.

#### Admin or Frontdesk Middleware
- **`adminOrFrontdesk`**: Allows access to routes for both admin and frontdesk roles.

#### Patient Middleware
- **`isPatient`**: Restricts access to patient-only routes.

#### Practitioner Middleware
- **`isPractitioner`**: Restricts access to practitioner-only routes.

#### Signed Middleware
- **`signed`**: Ensures that the route is accessed via a valid signed URL.
