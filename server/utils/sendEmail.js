import { Resend } from 'resend';

const REQUIRED_EMAIL_ENV = ['RESEND_API_KEY', 'EMAIL_FROM', 'EMAIL_USER'];

const maskEmail = (email = '') => {
  const [name = '', domain = ''] = String(email).split('@');
  if (!name || !domain) return 'invalid-email';
  if (name.length <= 2) return `${name[0] || '*'}***@${domain}`;
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

const sanitizeApiKey = (value = '') => String(value).trim();

const validateEmailEnv = () => {
  console.log('[EMAIL] Validating environment variables...');

  const missing = REQUIRED_EMAIL_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('[EMAIL] CRITICAL: Missing env vars:', missing);
    const error = new Error(`Missing required email environment variables: ${missing.join(', ')}`);
    error.statusCode = 500;
    throw error;
  }

  const resendApiKey = sanitizeApiKey(process.env.RESEND_API_KEY);
  const emailFrom = String(process.env.EMAIL_FROM || '').trim();
  const emailUser = String(process.env.EMAIL_USER || '').trim();

  console.log('[EMAIL] Environment variables loaded:', {
    resendApiKeySet: !!resendApiKey,
    emailFrom,
    emailUserSet: !!emailUser,
    emailUserMasked: maskEmail(emailUser),
  });

  if (!resendApiKey) {
    const error = new Error('RESEND_API_KEY is empty');
    error.statusCode = 500;
    throw error;
  }

  if (!emailFrom) {
    const error = new Error('EMAIL_FROM is empty');
    error.statusCode = 500;
    throw error;
  }

  if (!emailUser) {
    const error = new Error('EMAIL_USER is empty after trim');
    error.statusCode = 500;
    throw error;
  }

  return {
    resendApiKey,
    emailFrom,
    emailUser,
  };
};

const createResendClient = () => {
  const { resendApiKey, emailFrom, emailUser } = validateEmailEnv();
  const resend = new Resend(resendApiKey);

  console.log('[EMAIL] Resend client initialized:', {
    provider: 'resend',
    emailFrom,
    emailUser: maskEmail(emailUser),
    apiKeyPrefix: `${resendApiKey.slice(0, 6)}...`,
    env: process.env.NODE_ENV,
  });

  return { resend, emailFrom, emailUser };
};

const mapEmailError = (error) => {
  if (!error) return 'Unknown email error';

  console.error('[EMAIL] Detailed error mapping:', {
    code: error.code,
    responseCode: error.responseCode,
    command: error.command,
    message: error.message,
    errname: error.name,
  });

  if (error.statusCode === 401) {
    return 'Invalid Resend API key (401). Verify RESEND_API_KEY in Render environment variables';
  }
  if (error.statusCode === 403) {
    return 'Resend API access denied (403). Verify domain/sender permissions for EMAIL_FROM';
  }
  if (error.statusCode === 422) {
    return 'Resend rejected email payload (422). Check EMAIL_FROM and recipient addresses';
  }

  return `${error.code || error.name || 'ERROR'}: ${error.message || 'Unknown email error'}`;
};


const logSendResult = (label, info) => {
  console.log(`[EMAIL] ${label} email sent successfully:`, {
    id: info?.id || 'N/A',
    to: info?.to || 'N/A',
    from: info?.from || 'N/A',
    createdAt: info?.created_at || 'N/A',
  });
};

export const sendContactEmail = async (name, email, message) => {
  const startedAt = new Date().toISOString();
  console.log(`[EMAIL] Contact email flow started at ${startedAt}`);
  console.log('[EMAIL] Contact details:', {
    name,
    visitorEmail: maskEmail(email),
    messageLength: message?.length || 0,
  });

  let resend;
  let emailFrom;
  let emailUser;
  try {
    const client = createResendClient();
    resend = client.resend;
    emailFrom = client.emailFrom;
    emailUser = client.emailUser;
  } catch (err) {
    console.error('[EMAIL] Failed to initialize Resend client:', err.message);
    throw err;
  }

  try {
    console.log('[EMAIL] Sending contact email with Resend...');
    const payload = {
      from: emailFrom,
      to: [emailUser],
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
        <p><b>Message:</b></p>
        <pre style="white-space: pre-wrap; border: 1px solid #ddd; padding: 10px; border-radius: 8px;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        <p><b>Submitted at:</b> ${new Date().toISOString()}</p>
      `,
    };

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      throw Object.assign(new Error(error.message || 'Resend API error'), {
        statusCode: error.statusCode,
        name: error.name,
      });
    }

    if (!data) {
      throw new Error('Resend returned no data');
    }

    logSendResult('Contact', data);

    console.log('[EMAIL] Contact email flow COMPLETED SUCCESSFULLY at', new Date().toISOString());
    return {
      success: true,
      emailId: data.id,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[EMAIL] Contact email flow FAILED');
    console.error('[EMAIL] Error object:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      response: error?.response,
      statusCode: error?.statusCode,
    });
    console.error('[EMAIL] Full stack trace:', error?.stack);

    const mappedMessage = mapEmailError(error);
    console.error('[EMAIL] Mapped error message:', mappedMessage);

    const emailError = new Error(mappedMessage);
    emailError.statusCode = 500;
    emailError.originalError = error;
    throw emailError;
  }
};

export const sendTestEmail = async (recipientEmail) => {
  const startedAt = new Date().toISOString();
  const to = recipientEmail || process.env.EMAIL_USER;

  console.log(`[EMAIL][TEST] Test email flow started at ${startedAt}`);
  console.log('[EMAIL][TEST] Recipient:', maskEmail(to));

  let resend;
  let emailFrom;
  let emailUser;
  try {
    const client = createResendClient();
    resend = client.resend;
    emailFrom = client.emailFrom;
    emailUser = client.emailUser;
  } catch (err) {
    console.error('[EMAIL][TEST] Failed to initialize Resend client:', err.message);
    throw err;
  }

  try {
    console.log('[EMAIL][TEST] Sending test email with Resend...');

    const to = recipientEmail || emailUser;
    const testMailOptions = {
      from: emailFrom,
      to: [to],
      subject: '[TEST] Portfolio API Resend Configuration Verification',
      html: `
        <h2>Portfolio API Test Email</h2>
        <p>This email confirms that your Render backend can successfully send emails using Resend.</p>
        <hr/>
        <p><b>Test Time:</b> ${new Date().toISOString()}</p>
        <p><b>Node.js Version:</b> ${process.version}</p>
        <p><b>Environment:</b> ${process.env.NODE_ENV}</p>
        <p><b>Provider:</b> Resend</p>
        <hr/>
        <p style="color: green; font-weight: bold;">✓ Resend email configuration is working correctly!</p>
      `,
      text: 'Test email from Portfolio API - Resend configuration is working correctly!',
    };

    const { data, error } = await resend.emails.send(testMailOptions);

    if (error) {
      throw Object.assign(new Error(error.message || 'Resend API error'), {
        statusCode: error.statusCode,
        name: error.name,
      });
    }

    if (!data) {
      throw new Error('Test email send returned no data');
    }

    logSendResult('Test', data);
    console.log('[EMAIL][TEST] Test email flow COMPLETED SUCCESSFULLY at', new Date().toISOString());

    return {
      success: true,
      to,
      provider: 'resend',
      emailId: data.id,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[EMAIL][TEST] Test email flow FAILED');
    console.error('[EMAIL][TEST] Error object:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      response: error?.response,
    });
    console.error('[EMAIL][TEST] Full stack trace:', error?.stack);

    const mappedMessage = mapEmailError(error);
    console.error('[EMAIL][TEST] Mapped error message:', mappedMessage);

    const testError = new Error(mappedMessage);
    testError.statusCode = 500;
    testError.originalError = error;
    throw testError;
  }
};
