import { NextRequest, NextResponse } from 'next/server';
import {
  sendWelcomeEmail,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendSubscriptionConfirmationEmail,
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { type, email, ...data } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(
          email,
          data.companyName || 'LinkedLeads',
          `${baseUrl}/dashboard`
        );
        break;

      case 'confirm':
        result = await sendConfirmationEmail(
          email,
          data.companyName || 'LinkedLeads',
          `${baseUrl}/verify-email?token=test`
        );
        break;

      case 'password-reset':
        result = await sendPasswordResetEmail(
          email,
          data.companyName || 'LinkedLeads',
          `${baseUrl}/reset-password?token=test`
        );
        break;

      case 'subscription':
        result = await sendSubscriptionConfirmationEmail(
          email,
          data.companyName || 'LinkedLeads',
          {
            userName: data.userName || 'User',
            planName: data.planName || 'Pro',
            planPrice: data.planPrice || '$99',
            cycleLabel: data.cycleLabel || 'month',
            nextBillingDate: data.nextBillingDate || 'July 2, 2026',
            dashboardUrl: `${baseUrl}/dashboard`,
          }
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${type} email sent successfully`,
      result,
    });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
