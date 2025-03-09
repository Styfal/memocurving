// // src/app/api/send-email/route.ts
// import nodemailer from 'nodemailer';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { to, subject, text } = body;

//   if (!to || !subject || !text) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//   }

//   try {
//     // Create the transporter using Gmail (adjust as needed)
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER, // from .env.local
//         pass: process.env.EMAIL_PASS, // from .env.local
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     return NextResponse.json({ message: 'Email sent successfully', info }, { status: 200 });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
//   }
// }


// src/app/api/send-email/route.ts






// src/app/api/send-email/route.ts
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Expect the client to send both the recipient email and the email content
    const { email, emailContent } = await request.json();

    if (!email || !emailContent) {
      return NextResponse.json(
        { error: 'Missing email or emailContent in request body' },
        { status: 400 }
      );
    }

    // Create the nodemailer transporter using your Gmail credentials from your .env file.
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Review Sessions Overview',
      text: emailContent,
    };

    // Send the email.
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully', info }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
  }
}
