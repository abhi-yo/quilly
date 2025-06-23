interface EnvironmentConfig {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  NEXTAUTH_URL?: string;
  NEXTAUTH_SECRET?: string;
  DATABASE_URL?: string;
  NODE_ENV?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateProductionEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const env: EnvironmentConfig = process.env;
  
  if (!env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is required for email functionality');
  } else if (!env.RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY appears to be invalid (should start with "re_")');
  }
  
  if (!env.RESEND_FROM_EMAIL) {
    warnings.push('RESEND_FROM_EMAIL not set, will use onboarding@resend.dev');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(env.RESEND_FROM_EMAIL)) {
      errors.push('RESEND_FROM_EMAIL is not a valid email address');
    }
  }
  
  if (!env.NEXTAUTH_URL) {
    errors.push('NEXTAUTH_URL is required for authentication');
  } else if (!env.NEXTAUTH_URL.startsWith('https://') && env.NODE_ENV === 'production') {
    errors.push('NEXTAUTH_URL must use HTTPS in production');
  }
  
  if (!env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is required for secure authentication');
  } else if (env.NEXTAUTH_SECRET.length < 32) {
    warnings.push('NEXTAUTH_SECRET should be at least 32 characters long');
  }
  
  if (!env.DATABASE_URL) {
    errors.push('DATABASE_URL is required for data persistence');
  }
  
  if (env.NODE_ENV === 'production') {
    if (env.RESEND_TEST_EMAIL) {
      warnings.push('RESEND_TEST_EMAIL is set in production - emails will be redirected');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function logEnvironmentStatus(): void {
  const validation = validateProductionEnvironment();
  
  console.log('🔍 Environment Configuration Check');
  console.log('==================================');
  
  if (validation.isValid) {
    console.log('✅ All required environment variables are configured');
  } else {
    console.log('❌ Environment configuration issues found:');
    validation.errors.forEach(error => {
      console.error(`   • ${error}`);
    });
  }
  
  if (validation.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    validation.warnings.forEach(warning => {
      console.warn(`   • ${warning}`);
    });
  }
  
  console.log('==================================\n');
  
  if (!validation.isValid && process.env.NODE_ENV === 'production') {
    console.error('🚨 Production deployment will fail with current configuration!');
    console.error('Please fix the errors above before deploying.\n');
  }
}

if (require.main === module && process.env.NODE_ENV !== 'test') {
  logEnvironmentStatus();
} 