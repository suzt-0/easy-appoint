# Easy Appoint

A comprehensive healthcare appointment management system built with Laravel and React. The application enables efficient scheduling, patient management, and practitioner coordination with role-based access control.

---

## Table of Contents

- [Features](#features)
- [System Requirements](#system-requirements)
- [Initial Setup](#initial-setup)
- [Running the Application](#running-the-application)
- [User Roles and Features](#user-roles-and-features)
- [Email Configuration](#email-configuration)
- [Database Structure](#database-structure)
- [Frontend Components](#frontend-components)
- [Routes](#routes)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

### Core Functionality
- **Multi-role authentication** (Admin, Practitioner, Front Desk)
- **Patient management** with comprehensive registration and contact information
- **Practitioner scheduling** with weekly schedule management
- **Appointment booking** with real-time slot availability
- **Today's schedule** filtering for practitioners
- **Email notifications** for appointment confirmations, updates, and cancellations
- **Responsive UI** with modern React components and Tailwind CSS

### Advanced Features
- **Schedule management** with day-specific time slots
- **Appointment participants** tracking
- **Notes and reports** for appointments
- **Real-time dashboard** with role-specific metrics
- **Search and filtering** capabilities
- **Mobile-responsive design**

---

## System Requirements

- **PHP** >= 8.1
- **Composer** (latest version)
- **Node.js** >= 18.x & npm
- **Database**: SQLite/MySQL/PostgreSQL
- **Web Server**: Apache/Nginx (for production)
- **Git** (recommended for version control)

---

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd easy-appoint

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

**Configure your `.env` file:**
```env
APP_NAME="Easy Appoint"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
# OR for MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=easy_appoint
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Mail Configuration (see Email Configuration section)
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@easy-appoint.com
MAIL_FROM_NAME="Easy Appoint"
```

### 3. Database Setup

```bash
# Create database file (for SQLite)
touch database/database.sqlite

# Run migrations and seed data
php artisan migrate --seed
```

---

## Running the Application

### Development Mode

```bash
# Terminal 1: Start Laravel backend
php artisan serve

# Terminal 2: Start Vite development server
npm run dev
```

Visit `http://localhost:8000` in your browser.

### Default Login Credentials

After seeding, you can use these default accounts:

- **Admin**: admin@example.com / password
- **Practitioner**: doctor@example.com / password  
- **Front Desk**: frontdesk@example.com / password

---

## User Roles and Features

### Administrator
- **Dashboard**: System overview with user, appointment, and practitioner statistics
- **User Management**: Create, edit, and manage system users
- **Practitioner Management**: Add practitioners, manage qualifications and contact info
- **Patient Management**: Comprehensive patient database with advanced search
- **System Settings**: Configure application-wide settings

### Practitioner
- **Dashboard**: Personal appointment metrics and quick actions
- **My Schedules**: View and manage weekly schedules with active/inactive status
- **Today's Schedule**: Quick access to today's appointments with real-time filtering
- **My Appointments**: Complete appointment history and management
- **Patient Records**: Access to assigned patient information

### Front Desk
- **Dashboard**: Reception-focused metrics and quick booking actions
- **Appointment Booking**: Create and manage appointments for patients
- **Patient Registration**: Register new patients and update existing records
- **Schedule Overview**: View practitioner availability and book appointments
- **Walk-in Management**: Handle immediate appointment requests

---

## Email Configuration

The system supports automated email notifications for:
- Appointment confirmations
- Appointment updates/changes
- Appointment cancellations
- Welcome emails for new users

### SMTP Setup Example

For Gmail:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```

### Email Classes
- `AppointmentConfirmationMail`: Sent when appointments are created
- `AppointmentUpdateMail`: Sent when appointments are modified
- `AppointmentCancellationMail`: Sent when appointments are cancelled

---

## Database Structure

### Key Models and Relationships

**Users & Authentication**
- `User`: System users with role-based access
- `UserPatient`: Links users to patient records

**Patient Management**
- `Patient`: Core patient information
- `PatientContact`: Patient contact details
- `PatientTelecom`: Phone, email, and communication preferences

**Practitioner Management**
- `Practitioner`: Healthcare provider information
- `PractitionerQualifications`: Professional qualifications and certifications
- `PractitionerTelecoms`: Practitioner contact information

**Scheduling System**
- `Schedule`: Weekly schedule templates for practitioners
- `Slot`: Available time slots within schedules
- `Appointment`: Individual appointment bookings
- `AppointmentParticipants`: Track appointment attendees
- `AppointmentNotes`: Clinical notes and observations

**Notifications & Reporting**
- `Notifications`: System notifications
- `Report`: Appointment reports and analytics

---

## Frontend Components

### Key React Components

**Layout & Navigation**
- `app-sidebar.tsx`: Role-based sidebar navigation
- `dashboard.tsx`: Role-specific dashboard cards

**Patient Management**
- Patient registration forms with comprehensive validation
- Patient search and filtering
- Contact management interfaces

**Practitioner Scheduling**
- `practitioner-schedule-index.tsx`: Weekly schedule overview
- `practitioner-schedule-show.tsx`: Daily schedule with today's filtering
- Schedule creation and management forms

**Appointment Management**
- Appointment booking forms
- Calendar views and time slot selection
- Appointment history and search

### Styling and UI
- **Tailwind CSS**: Modern, responsive design system
- **Headless UI**: Accessible component primitives
- **Heroicons**: Consistent iconography
- **Custom components**: Reusable form elements and layouts

---

## Routes

### Authentication Routes
```
POST /login
POST /logout
POST /register
```

### Practitioner Routes
```
GET /practitioner/schedules           # Weekly schedule index
GET /practitioner/schedules/{id}      # Daily schedule with appointments
GET /practitioner/appointments        # All practitioner appointments
GET /practitioner/dashboard           # Dashboard data
```

### Patient Routes
```
GET /patients                         # Patient listing
POST /patients                        # Create patient
GET /patients/{id}                    # Patient details
PUT /patients/{id}                    # Update patient
DELETE /patients/{id}                 # Delete patient
```

### Appointment Routes
```
GET /appointments                     # Appointment listing
POST /appointments                    # Create appointment
GET /appointments/{id}                # Appointment details
PUT /appointments/{id}                # Update appointment
DELETE /appointments/{id}             # Cancel appointment
```

---

## Deployment

### Production Build

```bash
# Build frontend assets
npm run build

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### Web Server Configuration

**Apache (.htaccess in public directory):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
```

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### Environment Variables for Production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Use secure database credentials
# Configure production mail settings
# Set up proper logging
```

---

## Troubleshooting

### Common Issues

**1. Database Connection Errors**
- Verify database credentials in `.env`
- Ensure database server is running
- Check file permissions for SQLite

**2. Email Not Sending**
- Verify SMTP settings in `.env`
- Check firewall settings for SMTP ports
- Validate email credentials

**3. Frontend Assets Not Loading**
- Run `npm run build` for production
- Clear browser cache
- Check Vite configuration

**4. Permission Errors**
```bash
# Fix storage permissions
sudo chown -R www-data:www-data storage
sudo chmod -R 755 storage

# Fix cache permissions
sudo chown -R www-data:www-data bootstrap/cache
sudo chmod -R 755 bootstrap/cache
```

**5. Migration Errors**
```bash
# Reset migrations (development only)
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status
```

### Debug Mode

Enable detailed error reporting:
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

### Performance Optimization

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev
```

---

## Development Workflow

### Code Standards
- Follow PSR-12 coding standards for PHP
- Use ESLint and Prettier for JavaScript/TypeScript
- Write descriptive commit messages
- Use feature branches for new functionality

### Testing
```bash
# Run PHP tests
php artisan test

# Run frontend tests (if configured)
npm run test
```

### Database Management
```bash
# Create new migration
php artisan make:migration create_new_table

# Create new model
php artisan make:model ModelName -m

# Seed specific data
php artisan db:seed --class=SpecificSeeder
```

---

## License

This project is developed for educational and demonstration purposes. Please ensure you comply with relevant healthcare data protection regulations (HIPAA, GDPR, etc.) when deploying in production environments.

---
<!-- 
## Support and Documentation

For additional setup guides and feature documentation, see:
- `EMAIL_SETUP_GUIDE.md` - Detailed email configuration
- `PATIENT_MANAGEMENT_DASHBOARD.md` - Patient management features
- `ENHANCED_PATIENT_REGISTRATION.md` - Registration system details

--- -->

*Built with ❤️ using Laravel, React, and modern web technologies*
