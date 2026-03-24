import nodemailer from 'nodemailer';

const REQUIRED_EMAIL_ENV = ['EMAIL_USER', 'EMAIL_PASS'];

const maskEmail = (email = '') => {
  const [name = '', domain = ''] = String(email).split('@');
  if (!name || !domain) return 'invalid-email';
  if (name.length <= 2) return `${name[0] || '*'}***@${domain}`;
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

const sanitizePass = (value = '') => String(value).replace(/\s+/g, '');

const withTimeout = async (promise, ms, label) => {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const timeoutError = new Error(`${label} timed out after ${ms}ms`);
      timeoutError.code = 'EMAIL_TIMEOUT';
      timeoutError.statusCode = 500;
      reject(timeoutError);
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const validateEmailEnv = () => {
  console.log('[EMAIL] Validating environment variables...');

  const missing = REQUIRED_EMAIL_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('[EMAIL] CRITICAL: Missing env vars:', missing);
    const error = new Error(`Missing required email environment variables: ${missing.join(', ')}`);
    error.statusCode = 500;
    throw error;
  }

  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = sanitizePass(process.env.EMAIL_PASS);

  console.log('[EMAIL] Environment variables loaded:', {
    emailUserSet: !!emailUser,
    emailUserMasked: maskEmail(emailUser),
    emailPassLength: emailPass.length,
  });

  if (!emailUser) {
    const error = new Error('EMAIL_USER is empty after trim');
    error.statusCode = 500;
    throw error;
  }

  if (emailPass.length < 16) {
    console.error('[EMAIL] CRITICAL: EMAIL_PASS is too short. Gmail App Passwords must be 16 characters.');
    console.error('[EMAIL] Current pass length:', emailPass.length);
    const error = new Error('EMAIL_PASS must be 16+ characters (Gmail App Password required, not regular password)');
    error.statusCode = 500;
    throw error;
  }

  return {
    emailUser,
    emailPass,
  };
};

const baseTransporterConfig = (emailUser, emailPass, port, secure) => ({
  host: 'smtp.gmail.com',
  port,
  secure,
  requireTLS: !secure,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  logger: true,
  debug: true,
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
  },
});

const logTransporterConfig = (label, emailUser, emailPass, config) => {
  console.log(`[EMAIL] ${label} transporter config:`, {
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    user: maskEmail(emailUser),
    passLength: emailPass.length,
    node: process.version,
    env: process.env.NODE_ENV,
  });
};

const createGmailTransporterWithFallback = async () => {
  const { emailUser, emailPass } = validateEmailEnv();

  const primaryConfig = baseTransporterConfig(emailUser, emailPass, 465, true);
  logTransporterConfig('Primary', emailUser, emailPass, primaryConfig);

  const primaryTransporter = nodemailer.createTransport(primaryConfig);

  try {
    console.log('[EMAIL] Verifying primary SMTP config (465/secure)...');
    await primaryTransporter.verify();
    console.log('[EMAIL] Primary SMTP verify success (465/secure)');
    return { transporter: primaryTransporter, configUsed: { port: 465, secure: true } };
  } catch (primaryErr) {
    console.error('[EMAIL] Primary SMTP verify failed:', {
      message: primaryErr?.message,
      code: primaryErr?.code,
      responseCode: primaryErr?.responseCode,
      stack: primaryErr?.stack,
    });
  }

  const fallbackConfig = baseTransporterConfig(emailUser, emailPass, 587, false);
  logTransporterConfig('Fallback', emailUser, emailPass, fallbackConfig);

  const fallbackTransporter = nodemailer.createTransport(fallbackConfig);

  try {
    console.log('[EMAIL] Verifying fallback SMTP config (587/starttls)...');
    await fallbackTransporter.verify();
    console.log('[EMAIL] Fallback SMTP verify success (587/starttls)');
    return { transporter: fallbackTransporter, configUsed: { port: 587, secure: false } };
  } catch (fallbackErr) {
    console.error('[EMAIL] Fallback SMTP verify failed:', {
      message: fallbackErr?.message,
      code: fallbackErr?.code,
      responseCode: fallbackErr?.responseCode,
      stack: fallbackErr?.stack,
    });

    const finalError = new Error('SMTP verification failed for both 465(secure) and 587(starttls). Check EMAIL_USER, EMAIL_PASS(App Password), and Render env vars.');
    finalError.statusCode = 500;
    finalError.cause = fallbackErr;
    throw finalError;
  }
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

  if (error.code === 'EAUTH') {
    return 'Gmail authentication failed (EAUTH). Verify EMAIL_USER is your full Gmail address and EMAIL_PASS is a valid 16-character Gmail App Password from myaccount.google.com/apppasswords';
  }
  if (error.code === 'ESOCKET') {
    return 'Socket error connecting to Gmail SMTP (ESOCKET). Check network/firewall on Render, ensure port 465 is open';
  }
  if (error.code === 'ETIMEDOUT') {
    return 'Connection timeout to Gmail SMTP (ETIMEDOUT). Increase timeout or check Render network configuration';
  }
  if (error.code === 'EMAIL_TIMEOUT') {
    return 'Email operation timed out while waiting for Gmail SMTP response';
  }
  if (error.code === 'ECONNREFUSED') {
    return 'Connection refused by Gmail SMTP (ECONNREFUSED). Verify smtp.gmail.com:465 is accessible';
  }
  if (error.code === 'EHOSTUNREACH') {
    return 'Host unreachable (EHOSTUNREACH). Render may block outbound SMTP. Contact Render support';
  }
  if (error.responseCode === 535) {
    return 'Gmail rejected credentials (535). Wrong EMAIL_PASS, not using App Password, or 2FA not enabled on Google Account';
  }
  if (error.responseCode === 534) {
    return 'Gmail blocked sign-in (534). Use Gmail App Password, enable 2FA, check less-secure-app settings';
  }
  if (error.responseCode === 554) {
    return 'Recipient rejected (554). Check recipient email address validity';
  }
  if (error.message?.includes('Mail command timed out')) {
    return 'Mail command timed out. SMTP server slow, increase timeout or retry';
  }

  return `${error.code || error.name || 'ERROR'}: ${error.message || 'Unknown email error'}`;
};


const logSendResult = (label, info) => {
  console.log(`[EMAIL] ${label} email sent successfully:`, {
    messageId: info?.messageId || 'N/A',
    accepted: info?.accepted || [],
    rejected: info?.rejected || [],
    pending: info?.pending || [],
    response: info?.response || 'N/A',
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

  let transporter;
  let configUsed;
  try {
    const result = await createGmailTransporterWithFallback();
    transporter = result.transporter;
    configUsed = result.configUsed;
  } catch (err) {
    console.error('[EMAIL] Failed to create transporter:', err.message);
    throw err;
  }

  try {
    console.log('[EMAIL] Using SMTP config:', configUsed);

    const ownerAddress = process.env.EMAIL_USER;

    if (!ownerAddress) {
      throw new Error('EMAIL_USER not set in environment');
    }

    const mailToOwner = {
      from: `"Portfolio Contact" <${ownerAddress}>`,
      to: ownerAddress,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
        <p><b>Message:</b><br/><pre>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></p>
        <p><b>Submitted at:</b> ${new Date().toLocaleString()}</p>
      `,
      text: `New submission from ${name} (${email}):\n\n${message}`,
    };

    const mailToVisitor = {
      from: `"Portfolio" <${ownerAddress}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <h2>Thanks for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within 24-48 hours.</p>
        <br/>
        <p><b>Your message:</b></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #666; font-style: italic;">
          ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}
        </blockquote>
        <br/>
        <p>Best regards,<br/>Portfolio Owner</p>
      `,
      text: `Hi ${name},\n\nThanks for reaching out. We'll respond soon.\n\nYour message:\n${message}`,
    };

    console.log('[EMAIL] Sending email to portfolio owner...');
    const ownerInfo = await withTimeout(
      transporter.sendMail(mailToOwner),
      12000,
      'Owner email send'
    );
    if (!ownerInfo) {
      throw new Error('Owner email send returned no info');
    }
    logSendResult('Owner', ownerInfo);

    console.log('[EMAIL] Sending confirmation email to visitor...');
    const visitorInfo = await withTimeout(
      transporter.sendMail(mailToVisitor),
      12000,
      'Visitor email send'
    );
    if (!visitorInfo) {
      throw new Error('Visitor email send returned no info');
    }
    logSendResult('Visitor', visitorInfo);

    console.log('[EMAIL] Contact email flow COMPLETED SUCCESSFULLY at', new Date().toISOString());
    return {
      success: true,
      ownerMessageId: ownerInfo.messageId,
      visitorMessageId: visitorInfo.messageId,
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

  let transporter;
  let configUsed;
  try {
    const result = await createGmailTransporterWithFallback();
    transporter = result.transporter;
    configUsed = result.configUsed;
  } catch (err) {
    console.error('[EMAIL][TEST] Failed to create transporter:', err.message);
    throw err;
  }

  try {
    console.log('[EMAIL][TEST] Using SMTP config:', configUsed);

    const testMailOptions = {
      from: `"Portfolio API Test" <${process.env.EMAIL_USER}>`,
      to,
      subject: '[TEST] Portfolio API Email Configuration Verification',
      html: `
        <h2>Portfolio API Test Email</h2>
        <p>This email confirms that your Render backend can successfully authenticate with Gmail SMTP and send emails.</p>
        <hr/>
        <p><b>Test Time:</b> ${new Date().toISOString()}</p>
        <p><b>Node.js Version:</b> ${process.version}</p>
        <p><b>Environment:</b> ${process.env.NODE_ENV}</p>
        <p><b>SMTP Server:</b> smtp.gmail.com:465</p>
        <hr/>
        <p style="color: green; font-weight: bold;">✓ Email configuration is working correctly!</p>
      `,
      text: 'Test email from Portfolio API - configuration is working correctly!',
    };

    console.log('[EMAIL][TEST] Sending test email...');
    const info = await withTimeout(
      transporter.sendMail(testMailOptions),
      12000,
      'Test email send'
    );

    if (!info) {
      throw new Error('Test email send returned no info');
    }

    logSendResult('Test', info);
    console.log('[EMAIL][TEST] Test email flow COMPLETED SUCCESSFULLY at', new Date().toISOString());

    return {
      success: true,
      to,
      smtp: configUsed,
      messageId: info.messageId,
      response: info.response,
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
