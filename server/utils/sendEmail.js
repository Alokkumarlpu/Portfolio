const nodemailer = require('nodemailer');

const sendContactEmail = async (name, email, message) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('SMTP verified ✅');
  } catch (error) {
    console.error('SMTP verify failed:', error.message);
  }

  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`PASS LENGTH: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined'}`);

  // Email 1: Notify portfolio owner
  const mailToOwner = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
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

  // Email 2: Auto reply to visitor
  const mailToVisitor = {
    from: `"Portfolio Owner" <${process.env.EMAIL_USER}>`,
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
      <p>— Portfolio Owner</p>
    `,
  };

  await transporter.sendMail(mailToOwner);
  await transporter.sendMail(mailToVisitor);
  console.log('Emails sent successfully ✅');
};

module.exports = { sendContactEmail };
