// // src/components/mailer.tsx
// import { useState } from 'react';

// const Mailer = () => {
//   const [email, setEmail] = useState('');
//   const [status, setStatus] = useState<string | null>(null);

//   const sendEmail = async () => {
//     setStatus('Sending...');
//     try {
//       const response = await fetch('/api/send-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           to: email,
//           subject: 'Hello from Next.js',
//           text: 'This email was triggered from our Next.js app!',
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setStatus('Email sent successfully!');
//       } else {
//         setStatus(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error sending email:', error);
//       setStatus('Error sending email.');
//     }
//   };

//   return (
//     <div>
//       <h1>Mailer Component</h1>
//       <input
//         type="email"
//         placeholder="Enter your email address"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <button onClick={sendEmail}>Send Email</button>
//       {status && <p>{status}</p>}
//     </div>
//   );
// };

// export default Mailer;


// src/components/mailer.tsx
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const Mailer = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
    }
  }, []);

  return (
    <div>
      <h1>Mailer Component</h1>
      {email ? (
        <p>Email notifications are scheduled for 21:30 local time to be sent to: {email}</p>
      ) : (
        <p>No email found for the current user.</p>
      )}
    </div>
  );
};

export default Mailer;
