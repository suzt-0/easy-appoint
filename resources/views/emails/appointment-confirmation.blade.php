<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .content {
            padding: 40px 30px;
        }
        .appointment-card {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .appointment-detail {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .appointment-detail:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #495057;
        }
        .value {
            color: #6c757d;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            background: #28a745;
            color: white;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            margin: 20px 0;
            padding: 15px;
            background: #e3f2fd;
            border-radius: 4px;
        }
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: 600;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
            }
            .content {
                padding: 20px;
            }
            .appointment-detail {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Appointment Confirmed</h1>
            <p>Your appointment has been successfully scheduled</p>
        </div>
        
        <div class="content">
            <p>Dear {{ $patient->given_name }} {{ $patient->family_name }},</p>
            
            <p>We are pleased to confirm your upcoming appointment. Please find the details below:</p>
            
            <div class="appointment-card">
                <div class="appointment-detail">
                    <span class="label">Appointment Date:</span>
                    <span class="value">{{ \Carbon\Carbon::parse($appointment->appointment_date)->format('l, F j, Y \a\t g:i A') }}</span>
                </div>
                
                <div class="appointment-detail">
                    <span class="label">Practitioner:</span>
                    <span class="value">{{ $practitioner->given_name }} {{ $practitioner->family_name }}</span>
                </div>
                
                <div class="appointment-detail">
                    <span class="label">Status:</span>
                    <span class="value">
                        <span class="status-badge">{{ ucfirst($appointment->status) }}</span>
                    </span>
                </div>
                
                @if($appointment->description)
                <div class="appointment-detail">
                    <span class="label">Description:</span>
                    <span class="value">{{ $appointment->description }}</span>
                </div>
                @endif
                
                <div class="appointment-detail">
                    <span class="label">Appointment ID:</span>
                    <span class="value">#{{ $appointment->id }}</span>
                </div>
            </div>
            
            <div class="contact-info">
                <h3 style="margin-top: 0; color: #1976d2;">Important Information:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Please arrive 15 minutes before your scheduled appointment time</li>
                    <li>Bring a valid photo ID and insurance card (if applicable)</li>
                    <li>If you need to reschedule or cancel, please contact us at least 24 hours in advance</li>
                </ul>
            </div>
            
            <p style="margin-top: 30px;">
                <strong>Questions or need to make changes?</strong><br>
                Please contact our office and we'll be happy to assist you.
            </p>
            
            <p>Thank you for choosing our medical services. We look forward to seeing you!</p>
            
            <p>Best regards,<br>
               <strong>{{ config('app.name', 'Medical Center') }} Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name', 'Medical Center') }}. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
