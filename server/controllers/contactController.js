import Contact from '../models/Contact.js';
import { sendContactEmail } from '../utils/sendEmail.js';

const withTimeout = async (promise, ms, label) => {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const timeoutError = new Error(`${label} timed out after ${ms}ms`);
      timeoutError.code = 'CONTACT_EMAIL_TIMEOUT';
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

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    console.log('[SUBMIT-CONTACT] Received form submission:', {
      nameProvided: !!name,
      emailProvided: !!email,
      messageProvided: !!message,
    });

    if (!name || !email || !message) {
      const error = new Error('name, email, and message are required');
      error.statusCode = 400;
      throw error;
    }

    console.log('[SUBMIT-CONTACT] Saving message to MongoDB...');
    const savedMessage = new Contact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      isRead: false,
    });
    await savedMessage.save();
    console.log('[SUBMIT-CONTACT] Message saved successfully:', {
      id: savedMessage._id,
      email: email.trim(),
      collection: 'contacts',
    });

    console.log('[SUBMIT-CONTACT] Attempting to send email...');
    let emailResult;
    try {
      emailResult = await withTimeout(
        sendContactEmail(name, email, message),
        15000,
        'Contact email workflow'
      );
      console.log('[SUBMIT-CONTACT] Email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('[SUBMIT-CONTACT] CRITICAL: Email delivery failed after save');
      console.error('[SUBMIT-CONTACT] Email error details:', {
        contactId: savedMessage._id,
        originalMessage: emailError?.message,
        originalCode: emailError?.code,
        originalResponseCode: emailError?.responseCode,
        originalStack: emailError?.stack,
      });

      const error = new Error('Message saved, but email delivery failed. Check server email configuration.');
      error.statusCode = 500;
      error.contactId = savedMessage._id;
      error.emailError = emailError;
      throw error;
    }

    console.log('[SUBMIT-CONTACT] Form submission completed successfully');
    res.status(200).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: {
        contactId: savedMessage._id,
        emailSent: true,
      },
    });
  } catch (error) {
    console.error('[SUBMIT-CONTACT] Form submission failed with error:', {
      message: error?.message,
      statusCode: error?.statusCode,
      stack: error?.stack,
    });
    next(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (message) {
      message.isRead = true;
      await message.save();
      res.json(message);
    } else {
      res.status(404);
      throw new Error('Message not found');
    }
  } catch (error) {
    next(error);
  }
};
