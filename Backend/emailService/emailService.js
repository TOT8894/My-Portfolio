import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
    port: 465,
    secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async (fullname, email, phone, message) => {
  const mailOptions = {
    from: `"Portfolio Contact" <${email}>`,
    to: process.env.EMAIL_USER, 
    subject: `New Contact Message from ${fullname}`,
    html: `
      <h2>New Portfolio Message 📩</h2>
      <p><b>Name:</b> ${fullname}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Message:</b></p>
      <p>${message}</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};