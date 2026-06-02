import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome';
import ConfirmEmail from '@/emails/confirm-email';
import PasswordResetEmail from '@/emails/password-reset';
import SubscriptionConfirmation from '@/emails/subscription-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  email: string,
  companyName: string,
  dashboardUrl: string
) {
  try {
    const result = await resend.emails.send({
      from: `onboarding@resend.dev`,
      to: email,
      subject: `Welcome to ${companyName}`,
      react: WelcomeEmail({ companyName, url: dashboardUrl }),
    });
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export async function sendConfirmationEmail(
  email: string,
  companyName: string,
  verificationUrl: string
) {
  try {
    const result = await resend.emails.send({
      from: `onboarding@resend.dev`,
      to: email,
      subject: `Confirm your email address`,
      react: ConfirmEmail({ companyName, url: verificationUrl }),
    });
    return result;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  companyName: string,
  resetUrl: string
) {
  try {
    const result = await resend.emails.send({
      from: `onboarding@resend.dev`,
      to: email,
      subject: `Reset your password`,
      react: PasswordResetEmail({ companyName, url: resetUrl }),
    });
    return result;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

export async function sendSubscriptionConfirmationEmail(
  email: string,
  companyName: string,
  data: {
    userName: string;
    planName: string;
    planPrice: string;
    cycleLabel: string;
    nextBillingDate: string;
    dashboardUrl: string;
  }
) {
  try {
    const result = await resend.emails.send({
      from: `onboarding@resend.dev`,
      to: email,
      subject: `You're subscribed to ${companyName} ${data.planName}`,
      react: SubscriptionConfirmation({
        companyName,
        url: data.dashboardUrl,
        userName: data.userName,
        planName: data.planName,
        planPrice: data.planPrice,
        cycleLabel: data.cycleLabel,
        nextBillingDate: data.nextBillingDate,
      }),
    });
    return result;
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error);
    throw error;
  }
}
