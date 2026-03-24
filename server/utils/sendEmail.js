import nodemailer from 'nodemailer';

const REQUIRED_EMAIL_ENV = ['EMAIL_USER', 'EMAIL_PASS'];

const maskEmail = (email = '') => {
  const [name = '', domain = ''] = String(email).split('@');
  if (!name || !domain) return 'invalid-email';
  if (name.length <= 2) return `${name[0] || '*'}***@${domain}`;
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

const sanitizePass = (value = '') => String(value).replace(/\s+/g, '');

const validateEmailEnv = () => {
  const missing = REQUIRED_EMAIL_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    const error = new Error(`Missing required email environment variables: ${missing.join(', ')}`);
    error.statusCode = 500;
    throw error;
  }

  const normalizedPass = sanitizePass(process.env.EMAIL_PASS);
  if (normalizedPass.length < 16) {
    console.warn('[EMAIL] EMAIL_PASS looks too short. Use a Gmail App Password (16 chars), not your regular Gmail password.');
  }

  return {
    emailUser: process.env.EMAIL_USER,
    emailPass: normalizedPass,
  };
};

const createGmailTransporter = () => {
  const { emailUser, emailPass } = validateEmailEnv();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  });

  console.log('[EMAIL] Transporter configuration:', {
    provider: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: true,
    user: maskEmail(emailUser),
    passLength: emailPass.length,
  });

  return transporter;
};

const mapEmailError = (error) => {
  if (!error) return 'Unknown email error';

  if (error.code === 'EAUTH') {
    return 'Gmail authentication failed. Use EMAIL_USER + Gmail App Password for EMAIL_PASS.';
  }
  if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
    return 'Network/TLS error while connecting to Gmail SMTP. Check Render egress/network restrictions.';
  }
  if (error.responseCode === 535 || error.responseCode === 534) {
    return 'Invalid Gmail credentials or blocked sign-in. Confirm App Password and account security settings.';
  }

  return error.message || 'Unknown email error';
};

const logSendResult = (label, info) => {
  console.log(`[EMAIL] ${label} sendMail success:`, {
    messageId: info?.messageId,
    accepted: info?.accepted,
    rejected: info?.rejected,
    response: info?.response,
    envelope: info?.envelope,
  });
};

export const sendContactEmail = async (name, email, message) => {
  const startedAt = new Date().toISOString();
  console.log(`[EMAIL] Contact send started at ${startedAt}`, {
    fromUser: maskEmail(process.env.EMAIL_USER),
    visitor: maskEmail(email),
  });

  const transporter = createGmailTransporter();

  try {
    await transporter.verify();
    console.log('[EMAIL] SMTP verify success');

    const ownerAddress = process.env.EMAIL_USER;

    const mailToOwner = {
      from: `"Portfolio Contact" <${ownerAddress}>`,
      to: ownerAddress,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
        <p><b>Timestamp:</b> ${new Date().toLocaleString()}</p>
      `,
    };

    const mailToVisitor = {
      from: `"Portfolio Owner" <${ownerAddress}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <h2>Hey ${name}, thanks for reaching out!</h2>
        <p>I have received your message and will get back to you within 24-48 hours.</p>
        <br/>
        <p><b>Your message:</b></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
          ${message}
        </blockquote>
        <br/>
        <p>- Portfolio Owner</p>
      `,
    };

    const ownerInfo = await transporter.sendMail(mailToOwner);
    logSendResult('Owner', ownerInfo);

    const visitorInfo = await transporter.sendMail(mailToVisitor);
    logSendResult('Visitor', visitorInfo);

    console.log('[EMAIL] Contact send completed successfully');
    return {
      ownerMessageId: ownerInfo?.messageId,
      visitorMessageId: visitorInfo?.messageId,
    };
  } catch (error) {
    console.error('[EMAIL] Contact send failed');
    console.error('[EMAIL] Error details:', {
      message: error?.message,
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      response: error?.response,
      stack: error?.stack,
    });

    const mappedMessage = mapEmailError(error);
    const wrappedError = new Error(`Email delivery failed: ${mappedMessage}`);
    wrappedError.statusCode = 500;
    wrappedError.cause = error;
    throw wrappedError;
  }
};

export const sendTestEmail = async (recipientEmail) => {
  const startedAt = new Date().toISOString();
  const to = recipientEmail || process.env.EMAIL_USER;

  console.log(`[EMAIL][TEST] Test email started at ${startedAt}`, {
    to: maskEmail(to),
  });

  const transporter = createGmailTransporter();

  try {
    await transporter.verify();
    console.log('[EMAIL][TEST] SMTP verify success');

    const info = await transporter.sendMail({
      from: `"Portfolio API Test" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Portfolio API test email',
      text: 'This is a production test email from your Render backend.',
      html: `
        <h2>Portfolio API test email</h2>
        <p>This confirms your Render backend can authenticate with Gmail SMTP.</p>
        <p><b>Timestamp:</b> ${new Date().toISOString()}</p>
      `,
    });

    logSendResult('Test', info);
    return {
      to,
      messageId: info?.messageId,
      response: info?.response,
    };
  } catch (error) {
    console.error('[EMAIL][TEST] Test email failed');
    console.error('[EMAIL][TEST] Error details:', {
      message: error?.message,
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      response: error?.response,
      stack: error?.stack,
    });

    const mappedMessage = mapEmailError(error);
    const wrappedError = new Error(`Test email failed: ${mappedMessage}`);
    wrappedError.statusCode = 500;
    wrappedError.cause = error;
    throw wrappedError;
  }
};
