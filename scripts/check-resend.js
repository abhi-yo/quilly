const { Resend } = require('resend');
require('dotenv').config();

async function checkResendConfig() {
  console.log('🔍 Checking Resend Configuration...\n');

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const nodeEnv = process.env.NODE_ENV;

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not set');
    console.log('   Please add your Resend API key to your environment variables');
    console.log('   Get your API key from: https://resend.com/api-keys\n');
    return false;
  }

  if (!apiKey.startsWith('re_')) {
    console.error('❌ RESEND_API_KEY appears to be invalid (should start with "re_")');
    return false;
  }

  console.log('✅ RESEND_API_KEY is set');

  if (!fromEmail) {
    console.warn('⚠️  RESEND_FROM_EMAIL is not set, will use onboarding@resend.dev');
  } else {
    console.log(`✅ RESEND_FROM_EMAIL is set: ${fromEmail}`);
  }

  console.log(`ℹ️  NODE_ENV: ${nodeEnv || 'not set'}\n`);

  const resend = new Resend(apiKey);

  try {
    console.log('🧪 Testing Resend connection...');
    
    const testEmail = process.env.RESEND_TEST_EMAIL || fromEmail || 'test@example.com';
    
    if (testEmail === 'test@example.com') {
      console.log('⚠️  No test email configured. Skipping send test.');
      console.log('   Set RESEND_TEST_EMAIL to test email sending\n');
      return true;
    }

    const result = await resend.emails.send({
      from: fromEmail || 'onboarding@resend.dev',
      to: [testEmail],
      subject: 'Quilly - Resend Configuration Test',
      html: `
        <h2>✅ Resend Configuration Test Successful</h2>
        <p>Your Quilly application can now send emails through Resend!</p>
        <p><strong>Configuration:</strong></p>
        <ul>
          <li>From: ${fromEmail || 'onboarding@resend.dev'}</li>
          <li>Environment: ${nodeEnv || 'not set'}</li>
          <li>Test Email: ${testEmail}</li>
        </ul>
        <p>You can now deploy your application with confidence.</p>
      `,
      text: `Resend Configuration Test Successful! Your Quilly application can now send emails.`
    });

    if (result.error) {
      console.error('❌ Test email failed:', result.error);
      return false;
    }

    console.log(`✅ Test email sent successfully! ID: ${result.data.id}`);
    console.log(`📧 Check ${testEmail} for the test email\n`);

    return true;

  } catch (error) {
    console.error('❌ Resend test failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('   Double-check your RESEND_API_KEY');
    }
    
    if (error.message.includes('from address')) {
      console.log('   Verify your domain in Resend dashboard or use onboarding@resend.dev');
    }
    
    return false;
  }
}

async function main() {
  console.log('🚀 Quilly Resend Configuration Checker\n');
  
  const success = await checkResendConfig();
  
  if (success) {
    console.log('🎉 Resend is properly configured for production!');
    console.log('   Your Quilly application is ready to send emails.');
  } else {
    console.log('❌ Resend configuration needs attention.');
    console.log('   See RESEND_SETUP.md for detailed setup instructions.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkResendConfig }; 