import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static isTestMode(): boolean {
    return process.env.NODE_ENV !== 'production' && !!process.env.RESEND_API_KEY;
  }

  private static getValidatedFromEmail(): string {
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!fromEmail || !emailRegex.test(fromEmail)) {
      console.warn('⚠️  RESEND_FROM_EMAIL not set or invalid, using default onboarding@resend.dev');
      return 'onboarding@resend.dev';
    }
    
    return fromEmail.includes('Quilly') ? fromEmail : `Quilly <${fromEmail}>`;
  }

  private static getTestModeRecipient(originalEmail: string): string {
    // In development, redirect all emails to verified address to avoid Resend restrictions
    if (process.env.RESEND_API_KEY && process.env.NODE_ENV !== 'production') {
      // Use the verified address from Resend error message
      const verifiedEmail = 'akshatsing11@gmail.com';
      
      if (originalEmail !== verifiedEmail) {
        console.log(`🧪 TEST MODE: Redirecting email from ${originalEmail} to verified address ${verifiedEmail}`);
        return verifiedEmail;
      }
    }
    return originalEmail;
  }

  static async sendOTP(email: string, otp: string, name?: string): Promise<boolean> {
    try {
      // Validate input email format first
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error('Invalid recipient email format:', email);
        return false;
      }

      if (!process.env.RESEND_API_KEY) {
        console.error(`
          =======================================================
          ❌ RESEND API KEY MISSING - EMAIL NOT SENT
          =======================================================
          To: ${email}
          Name: ${name || 'User'}
          OTP: ${otp}
          
          CRITICAL: Add RESEND_API_KEY to your environment variables
          to enable email sending in production.
          
          For setup instructions, see: RESEND_SETUP.md
          =======================================================
        `);
        return process.env.NODE_ENV !== 'production';
      }

      const fromEmail = this.getValidatedFromEmail();
      const actualRecipient = this.getTestModeRecipient(email);
      
      console.log('📧 Sending OTP email...');
      console.log('📤 From:', fromEmail);
      console.log('👤 Original recipient:', email);
      console.log('📮 Actual recipient:', actualRecipient);
      
      // Show clear instructions for fixing Resend domain issues
      if (actualRecipient !== email) {
        console.log('🧪 EMAIL REDIRECTED FOR TESTING');
        console.log('💡 To send to any email address in production:');
        console.log('   1. Visit https://resend.com/domains');
        console.log('   2. Add and verify your domain');
        console.log('   3. Update RESEND_FROM_EMAIL to use your domain');
        console.log('   4. Set NODE_ENV=production');
      }

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [actualRecipient],
        subject: 'Verify your Quilly account',
        html: this.generateOTPEmailTemplate(otp, name, email !== actualRecipient ? email : undefined),
        text: `Hi ${name || 'there'},\n\nWelcome to Quilly! Please use this verification code to complete your account setup:\n\n${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.\n\nBest regards,\nThe Quilly Team`,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      });

      if (error) {
        console.error('❌ Resend API error:', error);
        
        if (process.env.NODE_ENV === 'production') {
          console.error(`
            =======================================================
            🚨 PRODUCTION EMAIL FAILURE
            =======================================================
            To: ${email}
            Error: ${error.message || 'Unknown Resend error'}
            
            This is a CRITICAL production issue.
            Check your Resend dashboard for details.
            =======================================================
          `);
          return false;
        } else {
          console.log(`
            =======================================================
            📧 EMAIL VERIFICATION CODE (FALLBACK - ERROR OCCURRED)
            =======================================================
            To: ${email}
            Name: ${name || 'User'}
            OTP: ${otp}
            Error: ${error.message || 'Unknown error'}
            =======================================================
          `);
          return true;
        }
      }

      console.log('✅ OTP email sent successfully! ID:', data?.id);
      return true;
    } catch (error) {
      console.error('💥 Failed to send OTP email (Exception):', error);
      
      if (process.env.NODE_ENV === 'production') {
        console.error(`
          =======================================================
          🚨 CRITICAL PRODUCTION ERROR
          =======================================================
          To: ${email}
          Exception: ${error instanceof Error ? error.message : 'Unknown error'}
          
          Email service completely failed in production.
          Immediate attention required!
          =======================================================
        `);
        return false;
      } else {
        console.log(`
          =======================================================
          📧 EMAIL VERIFICATION CODE (FALLBACK - EXCEPTION)
          =======================================================
          To: ${email}
          Name: ${name || 'User'}
          OTP: ${otp}
          
          Exception: ${error instanceof Error ? error.message : 'Unknown error'}
          =======================================================
        `);
        return true;
      }
    }
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log(`
          =======================================================
          📧 WELCOME EMAIL (DEMO MODE - NO API KEY)
          =======================================================
          To: ${email}
          Name: ${name}
          
          Please add RESEND_API_KEY to your environment variables
          to enable actual email sending.
          =======================================================
        `);
        return true;
      }

      const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev';
      const cleanFromEmail = fromEmail.includes('Quilly') 
        ? fromEmail 
        : `Quilly <${fromEmail}>`;

      const { data, error } = await resend.emails.send({
        from: cleanFromEmail,
        to: [email],
        subject: 'Welcome to Quilly!',
        html: this.generateWelcomeEmailTemplate(name),
        text: `Hi ${name},\n\nWelcome to Quilly! Your account has been successfully verified.\n\nYou can now:\n- Write and publish articles\n- Discover quality content\n- Track your engagement analytics\n- Connect with other writers and readers\n\nGet started: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard\n\nBest regards,\nThe Quilly Team`
      });

      if (error) {
        console.error('Resend error:', error);
        return false;
      }

      console.log('Welcome email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  static generateOTPEmailTemplate(otp: string, name?: string, originalEmail?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your Quilly account</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
              background: #f8f9fa; 
              margin: 0; 
              padding: 20px; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 12px; 
              overflow: hidden; 
              box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            }
            .header { 
              background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
              color: white; 
              padding: 32px 24px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 24px; 
              font-weight: 600; 
            }
            .content { 
              padding: 32px 24px; 
            }
            .otp-box { 
              background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); 
              border: 2px dashed #d1d5db; 
              border-radius: 12px; 
              padding: 24px; 
              text-align: center; 
              margin: 24px 0; 
            }
            .otp { 
              font-size: 36px; 
              font-weight: bold; 
              letter-spacing: 12px; 
              color: #1f2937; 
              font-family: 'Monaco', 'Menlo', monospace; 
              margin: 8px 0;
            }
            .footer { 
              background: #f8f9fa; 
              padding: 24px; 
              text-align: center; 
              font-size: 14px; 
              color: #6b7280; 
              border-top: 1px solid #e5e7eb;
            }
            .logo { 
              display: inline-block; 
              background: #3b82f6; 
              color: white; 
              padding: 8px 16px; 
              border-radius: 6px; 
              font-weight: 600; 
              text-decoration: none; 
              margin-bottom: 16px;
            }
            .highlight { 
              color: #3b82f6; 
              font-weight: 600; 
            }
            @media (max-width: 480px) {
              .container { 
                margin: 0; 
                border-radius: 0; 
              }
              .content { 
                padding: 24px 16px; 
              }
              .otp { 
                font-size: 28px; 
                letter-spacing: 8px; 
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Quilly</div>
              <h1>Verify your account</h1>
            </div>
            <div class="content">
              <p>Hi <span class="highlight">${name || 'there'}</span>,</p>
              ${originalEmail ? `<p style="background: #fef3c7; padding: 12px; border-radius: 6px; color: #92400e; font-size: 14px; margin-bottom: 16px;"><strong>Test Mode:</strong> This email was intended for ${originalEmail} but redirected here for testing.</p>` : ''}
              <p>Welcome to <strong>Quilly</strong>! Please use this verification code to complete your account setup:</p>
              
              <div class="otp-box">
                <div class="otp">${otp}</div>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                  This code expires in <strong>10 minutes</strong>
                </p>
              </div>
              
              <p>If you didn't create an account with Quilly, please ignore this email.</p>
              
              <p style="margin-top: 32px; color: #6b7280;">
                Best regards,<br>
                <strong>The Quilly Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p style="margin-top: 8px;">© 2025 Quilly. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static generateWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Quilly!</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
              background: #f8f9fa; 
              margin: 0; 
              padding: 20px; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 12px; 
              overflow: hidden; 
              box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            }
            .header { 
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
              color: white; 
              padding: 32px 24px; 
              text-align: center; 
            }
            .content { 
              padding: 32px 24px; 
            }
            .button { 
              display: inline-block; 
              background: #3b82f6; 
              color: white; 
              padding: 14px 28px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600; 
              margin: 16px 0;
            }
            .features { 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 24px 0; 
            }
            .feature { 
              display: flex; 
              align-items: center; 
              margin: 12px 0; 
            }
            .feature-icon { 
              background: #3b82f6; 
              color: white; 
              width: 24px; 
              height: 24px; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin-right: 12px; 
              font-size: 12px;
            }
            .footer { 
              background: #f8f9fa; 
              padding: 24px; 
              text-align: center; 
              font-size: 14px; 
              color: #6b7280; 
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Quilly!</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Your account has been successfully verified</p>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Welcome to <strong>Quilly</strong>! We're excited to have you join our community of writers and readers.</p>
              
              <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">What you can do now:</h3>
                <div class="feature">
                  <div class="feature-icon">✍️</div>
                  <span>Write and publish high-quality articles</span>
                </div>
                <div class="feature">
                  <div class="feature-icon">📚</div>
                  <span>Discover curated content from expert writers</span>
                </div>
                <div class="feature">
                  <div class="feature-icon">📊</div>
                  <span>Track your engagement analytics</span>
                </div>
                <div class="feature">
                  <div class="feature-icon">👥</div>
                  <span>Connect with other writers and readers</span>
                </div>
              </div>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="button">
                  Get Started →
                </a>
              </div>
              
              <p style="margin-top: 32px; color: #6b7280;">
                Best regards,<br>
                <strong>The Quilly Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>Need help? Reply to this email or visit our help center.</p>
              <p style="margin-top: 8px;">© 2025 Quilly. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
} 