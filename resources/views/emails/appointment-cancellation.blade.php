<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Cancelled</title>
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
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
            border-left: 4px solid #e74c3c;
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
            background: #e74c3c;
            color: white;
        }
        .cancellation-section {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
        }
        .cancellation-title {
            color: #721c24;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .reason-box {
            background: white;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
            border-left: 3px solid #e74c3c;
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
            background: #d1ecf1;
            border-radius: 4px;
            border-left: 4px solid #17a2b8;
        }
        .alert-box {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .reschedule-info {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            background: #007bff;
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
            <h1>Appointment Cancelled</h1>
            <p>Your appointment has been cancelled</p>
        </div>
        
        <div class="content">
            <p>Dear {{ $patient->given_name }} {{ $patient->family_name }},</p>
            
            <div class="alert-box">
                <strong>Notice:</strong> We regret to inform you that your appointment has been cancelled. Please review the details below.
            </div>

            <div class="cancellation-section">
                <div class="cancellation-title">
                    ❌ Cancellation Details:
                </div>
                
                <div class="reason-box">
                    <strong>Cancelled by:</strong> {{ ucfirst($cancelledBy) }}<br>
                    <strong>Cancellation Date:</strong> {{ \Carbon\Carbon::now()->format('l, F j, Y \a\t g:i A') }}
                    
                    @if($cancellationReason)
                    <br><br>
                    <strong>Reason:</strong><br>
                    {{ $cancellationReason }}
                    @endif
                </div>
            </div>
            
            <p><strong>Cancelled Appointment Details:</strong></p>
            
            <div class="appointment-card">
                <div class="appointment-detail">
                    <span class="label">Original Date:</span>
                    <span class="value">{{ \Carbon\Carbon::parse($appointment->appointment_date)->format('l, F j, Y \a\t g:i A') }}</span>
                </div>
                
                <div class="appointment-detail">
                    <span class="label">Practitioner:</span>
                    <span class="value">{{ $practitioner->given_name }} {{ $practitioner->family_name }}</span>
                </div>
                
                <div class="appointment-detail">
                    <span class="label">Status:</span>
                    <span class="value">
                        <span class="status-badge">Cancelled</span>
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
            
            <div class="reschedule-info">
                <h3 style="margin-top: 0; color: #155724;">Need to Reschedule?</h3>
                <p style="margin-bottom: 10px;">We understand that cancellations can be inconvenient. If you would like to schedule a new appointment, please:</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Contact our office during business hours</li>
                    <li>Visit our website to book online</li>
                    <li>Call us to speak with our scheduling team</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <h3 style="margin-top: 0; color: #0c5460;">Important Information:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>No charges will be applied for this cancellation</li>
                    <li>If you had any prepaid fees, they will be refunded according to our policy</li>
                    <li>Please contact us if you have any questions about this cancellation</li>
                    <li>We apologize for any inconvenience this may have caused</li>
                </ul>
            </div>
            
            <p style="margin-top: 30px;">
                <strong>Questions or concerns?</strong><br>
                Please don't hesitate to contact our office. We're here to help and look forward to serving you in the future.
            </p>
            
            <p>We sincerely apologize for any inconvenience and hope to see you again soon.</p>
            
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
