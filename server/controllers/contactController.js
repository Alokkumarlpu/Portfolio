import Contact from '../models/Contact.js';
import { sendContactEmail } from '../utils/sendEmail.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    console.log('Form data:', { name, email, message });

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('name, email, and message are required');
    }

    const savedMessage = new Contact({ name, email, message });
    await savedMessage.save();
    console.log('[CONTACT] Message saved to MongoDB:', { id: savedMessage._id, email, collection: 'contacts' });

    try {
      await sendContactEmail(name, email, message);
    } catch (emailError) {
      console.error('[CONTACT] Email delivery failed after save:', {
        contactId: savedMessage._id,
        message: emailError?.message,
        stack: emailError?.stack,
      });
      res.status(500);
      throw new Error('Message saved, but email delivery failed. Check server email configuration.');
    }

    res.json({ success: true, message: 'Message sent!' });
  } catch (error) {
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
