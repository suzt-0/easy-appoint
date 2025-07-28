<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Updated</title>
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
            background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
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
            border-left: 4px solid #f39c12;
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
            background: #f39c12;
            color: white;
        }
        .changes-section {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
        }
        .changes-title {
            color: #856404;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .change-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 4px;
            border-left: 3px solid #f39c12;
        }
        .change-label {
            font-weight: 600;
            color: #495057;
            display: block;
        }
        .change-value {
            color: #6c757d;
            margin-top: 5px;
        }
        .old-value {
            text-decoration: line-through;
            color: #dc3545;
        }
        .new-value {
            color: #28a745;
            font-weight: 600;
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
            background: #fff3cd;
            border-radius: 4px;
            border-left: 4px solid #f39c12;
        }
        .alert-box {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
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
            <h1>Appointment Updated</h1>
            <p>Your appointment details have been modified</p>
        </div>
        
        <div class="content">
            <p>Dear {{ $patient->given_name }} {{ $patient->family_name }},</p>
            
            <div class="alert-box">
                <strong>Important Notice:</strong> Your appointment has been updated. Please review the changes below and make note of the new details.
            </div>

            @if(count($changes) > 0)
            <div class="changes-section">
                <div class="changes-title">
                    📝 Changes Made to Your Appointment:
                </div>
                
                @foreach($changes as $field => $change)
                <div class="change-item">
                    <span class="change-label">{{ ucfirst(str_replace('_', ' ', $field)) }}:</span>
                    <div class="change-value">
                        @if(isset($change['old']) && isset($change['new']))
                            <div><span class="old-value">{{ $change['old'] }}</span></div>
                            <div><span class="new-value">{{ $change['new'] }}</span></div>
                        @else
                            <span class="new-value">Updated</span>
                        @endif
                    </div>
                </div>
                @endforeach
            </div>
            @endif
            
            <p><strong>Updated Appointment Details:</strong></p>
            
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
                <h3 style="margin-top: 0; color: #856404;">Important Reminders:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Please arrive 15 minutes before your updated appointment time</li>
                    <li>Bring a valid photo ID and insurance card (if applicable)</li>
                    <li>If you have any questions about these changes, please contact us immediately</li>
                    <li>If you need to make further changes, please contact us at least 24 hours in advance</li>
                </ul>
            </div>
            
            <p style="margin-top: 30px;">
                <strong>Questions about these changes?</strong><br>
                Please contact our office immediately if you have any concerns or need clarification about the updated appointment details.
            </p>
            
            <p>Thank you for your understanding. We look forward to seeing you at your updated appointment time!</p>
            
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
