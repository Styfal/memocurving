// // pages/api/send-email.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import nodemailer from 'nodemailer';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     // Only allow POST requests
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { to, subject, text } = req.body;

//   if (!to || !subject || !text) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     // Create the transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Define email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);

//     return res.status(200).json({ message: 'Email sent successfully', info });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return res.status(500).json({ error: 'Failed to send email', details: error });
//   }
// }
