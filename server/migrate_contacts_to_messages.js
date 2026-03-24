import './config/env.js';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Contact from './models/Contact.js';
import Message from './models/Message.js';

const migrateContactsToMessages = async () => {
  try {
    await connectDB();

    const contacts = await Contact.find({}).lean();
    console.log(`[MIGRATE] Found ${contacts.length} contacts to inspect`);

    if (contacts.length === 0) {
      console.log('[MIGRATE] No contacts found. Nothing to migrate.');
      await mongoose.connection.close();
      process.exit(0);
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const contact of contacts) {
      const existing = await Message.findOne({
        name: contact.name,
        email: String(contact.email || '').toLowerCase(),
        message: contact.message,
        createdAt: contact.createdAt,
      }).lean();

      if (existing) {
        skippedCount += 1;
        continue;
      }

      await Message.create({
        name: contact.name,
        email: contact.email,
        message: contact.message,
        isRead: Boolean(contact.isRead),
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt || contact.createdAt || new Date(),
      });

      insertedCount += 1;
    }

    console.log(`[MIGRATE] Migration complete. Inserted: ${insertedCount}, Skipped: ${skippedCount}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[MIGRATE] Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

migrateContactsToMessages();
