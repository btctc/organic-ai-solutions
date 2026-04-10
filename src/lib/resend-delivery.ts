import { Resend } from "resend";

const RESEND_TEST_INBOX = "tc@overtimerealestate.com";

type SendEmailArgs = {
  resend: Resend;
  from: string;
  to: string;
  subject: string;
  html: string;
};

type SendEmailResult = {
  success: boolean;
  usedFallback: boolean;
  recipient: string;
  error?: unknown;
};

function isResendTestingRestriction(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.includes("You can only send testing emails to your own email address")
  );
}

export async function sendEmailWithTestingFallback({
  resend,
  from,
  to,
  subject,
  html,
}: SendEmailArgs): Promise<SendEmailResult> {
  const firstAttempt = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (!firstAttempt.error) {
    return { success: true, usedFallback: false, recipient: to };
  }

  if (to === RESEND_TEST_INBOX || !isResendTestingRestriction(firstAttempt.error)) {
    return {
      success: false,
      usedFallback: false,
      recipient: to,
      error: firstAttempt.error,
    };
  }

  console.warn("Resend test-mode restriction hit, retrying with fallback inbox.", {
    originalRecipient: to,
    fallbackRecipient: RESEND_TEST_INBOX,
  });

  const fallbackAttempt = await resend.emails.send({
    from,
    to: RESEND_TEST_INBOX,
    subject: `[Fallback delivery for ${to}] ${subject}`,
    html,
  });

  if (!fallbackAttempt.error) {
    return {
      success: true,
      usedFallback: true,
      recipient: RESEND_TEST_INBOX,
    };
  }

  return {
    success: false,
    usedFallback: true,
    recipient: RESEND_TEST_INBOX,
    error: fallbackAttempt.error,
  };
}
