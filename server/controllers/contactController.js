const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/sendEmail');

const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    console.log('Form data:', { name, email, message });

    const contact = new Contact({ name, email, message });
    await contact.save();

    // Fire and forget email logic
    sendContactEmail(name, email, message).catch(err => 
      console.error('Email error:', err.message)
    );

    res.json({ success: true, message: 'Message sent!' });
  } catch (error) {
    next(error);
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
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

module.exports = { submitContact, getAllMessages, markAsRead };
