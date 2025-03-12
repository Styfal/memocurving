// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function PrivacyPolicy() {
//   return (
//     <Card className="w-full max-w-4xl mx-auto my-8">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">
//           Privacy Policy
//         </CardTitle>
//         <p className="text-center text-muted-foreground">
//           Last Updated: November 24, 2023
//         </p>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-[600px] w-full rounded-md border p-4">
//           <div className="space-y-6">
//             {/* 1. Introduction */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
//               <p>
//                 This Privacy Policy sets forth the terms and conditions under which
//                 Memocurve (the “Company,” “we,” “us,” or “our”) collects, uses,
//                 discloses, and safeguards the personal information of users (“you” or
//                 “your”) when accessing or utilizing our flashcard study application
//                 (the “Service”).
//               </p>
//               <p className="mt-2">
//                 By accessing or using the Service, you acknowledge that you have read,
//                 understood, and agree to be bound by this Privacy Policy. If you do not
//                 agree with our practices and policies, you must discontinue use of the
//                 Service immediately.
//               </p>
//             </section>

//             {/* 2. Company Information */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">2. Company Information</h2>
//               <p>Company Name: Memocurve</p>
//               <p>Location: Japan</p>
//               <p>
//                 Contact Information: For any inquiries or concerns regarding this
//                 Privacy Policy, please contact us at{" "}
//                 <a href="mailto:memocurve@gmail.com" className="underline">
//                   memocurve@gmail.com
//                 </a>
//                 .
//               </p>
//             </section>

//             {/* 3. Information We Collect */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 3. Information We Collect
//               </h2>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 3.1 Personal Information
//               </h3>
//               <p>
//                 We may collect personal information that you voluntarily provide to us,
//                 including, but not limited to:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>Full Name</li>
//                 <li>Email Address</li>
//                 <li>
//                   Login Credentials (including authentication via third-party services
//                   such as Google)
//                 </li>
//               </ul>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 3.2 Profile Data
//               </h3>
//               <p>
//                 We may collect information related to your use of the Service,
//                 including:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>Flashcards Created</li>
//                 <li>Study Progress</li>
//                 <li>Test Scores</li>
//                 <li>User Preferences</li>
//               </ul>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 3.3 Payment Information
//               </h3>
//               <p>
//                 For users who opt to upgrade to a premium plan, we collect payment
//                 information through our third-party payment processor, Stripe. This
//                 may include:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>Billing Address</li>
//                 <li>Payment Details</li>
//               </ul>
//               <p className="mt-2">
//                 Please note that all payment transactions are processed by Stripe and
//                 are subject to Stripe’s privacy policy. We do not store your full
//                 payment information on our servers.
//               </p>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 3.4 Other Data
//               </h3>
//               <p>
//                 We may automatically collect additional information when you use the
//                 Service, such as:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>IP Address</li>
//                 <li>
//                   Device Information (including device type and operating system)
//                 </li>
//                 <li>
//                   Location Data (used solely for region settings)
//                 </li>
//               </ul>
//             </section>

//             {/* 4. Methods of Information Collection */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 4. Methods of Information Collection
//               </h2>
//               <p>We collect information through various methods:</p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   Direct Collection: Information provided directly by you when you
//                   create an account, fill out forms, or communicate with us.
//                 </li>
//                 <li>
//                   Automated Technologies: Information collected automatically as you
//                   navigate through the Service via cookies and other tracking
//                   technologies.
//                 </li>
//                 <li>
//                   Third-Party Sources: Information received from third parties, such as
//                   authentication services like Firebase.
//                 </li>
//               </ul>
//             </section>

//             {/* 5. Use of Collected Information */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 5. Use of Collected Information
//               </h2>
//               <p>
//                 We utilize the collected information for purposes including, but not
//                 limited to:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   Service Provision: To provide, maintain, and enhance the Service,
//                   including saving flashcards and tracking your study progress.
//                 </li>
//                 <li>
//                   Personalization: To customize your experience and present content
//                   tailored to your interests and learning patterns.
//                 </li>
//                 <li>
//                   Payment Processing: To facilitate transactions and manage
//                   subscriptions through Stripe.
//                 </li>
//                 <li>
//                   Communication: To send administrative information, updates,
//                   security alerts, and support messages.
//                 </li>
//                 <li>
//                   Analytics and Improvements: To monitor usage patterns and improve
//                   the functionality and user experience of the Service.
//                 </li>
//               </ul>
//             </section>

//             {/* 7. Disclosure of Information */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 7. Disclosure of Information
//               </h2>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 7.1 Third-Party Service Providers
//               </h3>
//               <p>
//                 We may disclose your personal information to trusted third-party
//                 service providers who assist us in operating the Service and
//                 conducting our business, including:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   Stripe: For secure payment processing. Your payment information is
//                   handled in accordance with Stripe’s privacy policy.
//                 </li>
//                 <li>
//                   Firebase: For user authentication and secure account management.
//                 </li>
//                 <li>
//                   Analytics Providers: To analyze usage data and improve the Service’s
//                   performance.
//                 </li>
//               </ul>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 7.2 Legal Obligations and Safety
//               </h3>
//               <p>We may disclose your personal information:</p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   To comply with any applicable laws, regulations, legal processes,
//                   or governmental requests.
//                 </li>
//                 <li>
//                   To enforce our terms of service and other agreements.
//                 </li>
//                 <li>
//                   To protect the rights, property, or safety of the Company, our
//                   users, or others.
//                 </li>
//               </ul>
//             </section>

//             {/* 8. Data Retention */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 8. Data Retention
//               </h2>
//               <p>We will retain your personal information as follows:</p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   Active Accounts: For as long as your account remains active.
//                 </li>
//                 <li>
//                   Inactive Accounts: For a reasonable period as dictated by applicable
//                   laws and regulations.
//                 </li>
//                 <li>
//                   Deletion Requests: Upon your request to delete your personal
//                   information, we will proceed in accordance with legal requirements,
//                   unless retention is necessary to comply with legal obligations.
//                 </li>
//               </ul>
//             </section>

//             {/* 9. Your Rights and Choices */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 9. Your Rights and Choices
//               </h2>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 9.1 Access and Correction
//               </h3>
//               <p>
//                 You have the right to access and correct your personal information at
//                 any time through your account settings.
//               </p>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 9.2 Data Deletion
//               </h3>
//               <p>
//                 You may request the deletion of your personal information by contacting
//                 us at{" "}
//                 <a href="mailto:memocurve@gmail.com" className="underline">
//                   memocurve@gmail.com
//                 </a>
//                 . We will respond to your request within the timeframe required by
//                 applicable law.
//               </p>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 9.3 Opt-Out Preferences
//               </h3>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   Communications: You may opt out of receiving promotional
//                   communications by following the unsubscribe instructions provided
//                   in such emails.
//                 </li>
//                 <li>
//                   Cookies: You can set your browser to refuse all or some browser
//                   cookies or to alert you when cookies are being set.
//                 </li>
//               </ul>
//             </section>

//             {/* 10. Security Measures */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 10. Security Measures
//               </h2>
//               <p>
//                 We implement appropriate technical and organizational measures to
//                 protect your personal information against unauthorized access,
//                 alteration, disclosure, or destruction. These measures include:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   Data Encryption: Utilizing encryption protocols for data in transit
//                   and at rest where applicable.
//                 </li>
//                 <li>
//                   Secure Infrastructure: Hosting data on servers with advanced
//                   security features and regular security assessments.
//                 </li>
//                 <li>
//                   Access Controls: Restricting access to personal information to
//                   authorized personnel who are bound by confidentiality obligations.
//                 </li>
//               </ul>
//               <p className="mt-2">
//                 Despite our efforts, no security measures are entirely foolproof, and
//                 we cannot guarantee absolute security.
//               </p>
//             </section>

//             {/* 11. International Data Transfers */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 11. International Data Transfers
//               </h2>
//               <p>
//                 Your information may be transferred to, stored, and processed in
//                 countries other than your own, where data protection laws may differ.
//                 By using the Service, you consent to the transfer of information to
//                 countries outside your country of residence.
//               </p>
//             </section>

//             {/* 12. Legal Basis for Processing (GDPR Compliance) */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 12. Legal Basis for Processing (GDPR Compliance)
//               </h2>
//               <p>
//                 For individuals located within the European Economic Area (EEA), we
//                 process your personal data under the following legal bases:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   Consent: You have provided explicit consent for the processing of
//                   your personal data for one or more specific purposes.
//                 </li>
//                 <li>
//                   Contractual Necessity: Processing is necessary for the performance
//                   of a contract to which you are a party.
//                 </li>
//                 <li>
//                   Legal Obligation: Processing is necessary for compliance with a
//                   legal obligation to which we are subject.
//                 </li>
//                 <li>
//                   Legitimate Interests: Processing is necessary for the purposes of
//                   our legitimate interests, except where overridden by your fundamental
//                   rights and freedoms.
//                 </li>
//               </ul>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 12.1 GDPR Rights
//               </h3>
//               <p>
//                 Under the General Data Protection Regulation (GDPR), you are entitled
//                 to the following rights:
//               </p>
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   Right of Access: To request confirmation as to whether we are
//                   processing your personal data and access to such data.
//                 </li>
//                 <li>
//                   Right to Rectification: To request correction of inaccurate or
//                   incomplete personal data.
//                 </li>
//                 <li>
//                   Right to Erasure (“Right to Be Forgotten”): To request the deletion
//                   of your personal data under certain conditions.
//                 </li>
//                 <li>
//                   Right to Restrict Processing: To request the limitation of
//                   processing your personal data under specific circumstances.
//                 </li>
//                 <li>
//                   Right to Data Portability: To receive your personal data in a
//                   structured, commonly used, and machine-readable format.
//                 </li>
//                 <li>
//                   Right to Object: To object to the processing of your personal data
//                   based on legitimate interests or for direct marketing purposes.
//                 </li>
//               </ul>
//               <p className="mt-2">
//                 To exercise any of these rights, please contact us at{" "}
//                 <a href="mailto:memocurve@gmail.com" className="underline">
//                   memocurve@gmail.com
//                 </a>
//                 .
//               </p>
//             </section>

//             {/* 13. Children's Privacy */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 13. Children's Privacy
//               </h2>
//               <p>
//                 Our Service is accessible to users of all ages. However, for
//                 individuals under the age of 13, we require verifiable parental or
//                 guardian consent before collecting any personal information. We do
//                 not knowingly collect personal data from children under 13 without
//                 such consent.
//               </p>
//               <p className="mt-2">
//                 If you are a parent or guardian and become aware that your child
//                 under the age of 13 has provided us with personal information without
//                 your consent, please contact us at{" "}
//                 <a href="mailto:memocurve@gmail.com" className="underline">
//                   memocurve@gmail.com
//                 </a>
//                 . We will take immediate steps to remove such information from our
//                 records.
//               </p>
//             </section>

//             {/* 14. Changes to This Policy */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 14. Changes to This Policy
//               </h2>
//               <p>
//                 We reserve the right to amend this Privacy Policy at our discretion
//                 and at any time. When changes are made, we will update the "Last
//                 Updated" date at the top of this Policy. Your continued use of the
//                 Service following the posting of changes constitutes your acceptance
//                 of such changes.
//               </p>
//             </section>

//             {/* 15. Contact Information */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">
//                 15. Contact Information
//               </h2>
//               <p>
//                 If you have any questions, comments, or concerns about this Privacy
//                 Policy or our privacy practices, please contact us at:
//               </p>
//               <p className="mt-2">Email: memocurve@gmail.com</p>
//             </section>
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }



import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Privacy Policy
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Last Updated: November 24, 2023
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          <div className="space-y-6">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
              <p>
                This Privacy Policy sets forth the terms and conditions under which
                Memocurve (the “Company,” “we,” “us,” or “our”) collects, uses,
                discloses, and safeguards the personal information of users (“you” or
                “your”) when accessing or utilizing our flashcard study application
                (the “Service”).
              </p>
              <p className="mt-2">
                By accessing or using the Service, you acknowledge that you have read,
                understood, and agree to be bound by this Privacy Policy. If you do not
                agree with our practices and policies, you must discontinue use of the
                Service immediately.
              </p>
            </section>

            {/* 2. Company Information */}
            <section>
              <h2 className="text-xl font-semibold mb-2">2. Company Information</h2>
              <p>Company Name: Memocurve</p>
              <p>Location: Japan</p>
              <p>
                Contact Information: For any inquiries or concerns regarding this
                Privacy Policy, please contact us at{" "}
                <a href="mailto:memocurve@gmail.com" className="underline">
                  memocurve@gmail.com
                </a>
                .
              </p>
            </section>

            {/* 3. Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                3. Information We Collect
              </h2>
              <h3 className="text-lg font-medium mt-4 mb-2">
                3.1 Personal Information
              </h3>
              <p>
                We may collect personal information that you voluntarily provide to us,
                including, but not limited to:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>
                  Login Credentials (including authentication via third-party services
                  such as Google)
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-4 mb-2">3.2 Profile Data</h3>
              <p>
                We may collect information related to your use of the Service,
                including:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Flashcards Created</li>
                <li>Study Progress</li>
                <li>Test Scores</li>
                <li>User Preferences</li>
              </ul>
              <h3 className="text-lg font-medium mt-4 mb-2">
                3.3 Payment Information
              </h3>
              <p>
                For users who opt to upgrade to a premium plan, we collect payment
                information through our third-party payment processor, Stripe. This
                may include:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Billing Address</li>
                <li>Payment Details</li>
              </ul>
              <p className="mt-2">
                Please note that all payment transactions are processed by Stripe and
                are subject to Stripe&rsquo;s privacy policy. We do not store your full
                payment information on our servers.
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">3.4 Other Data</h3>
              <p>
                We may automatically collect additional information when you use the
                Service, such as:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>IP Address</li>
                <li>
                  Device Information (including device type and operating system)
                </li>
                <li>
                  Location Data (used solely for region settings)
                </li>
              </ul>
            </section>

            {/* 4. Methods of Information Collection */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                4. Methods of Information Collection
              </h2>
              <p>We collect information through various methods:</p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Direct Collection: Information provided directly by you when you
                  create an account, fill out forms, or communicate with us.
                </li>
                <li>
                  Automated Technologies: Information collected automatically as you
                  navigate through the Service via cookies and other tracking
                  technologies.
                </li>
                <li>
                  Third-Party Sources: Information received from third parties, such as
                  authentication services like Firebase.
                </li>
              </ul>
            </section>

            {/* 5. Use of Collected Information */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                5. Use of Collected Information
              </h2>
              <p>
                We utilize the collected information for purposes including, but not
                limited to:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Service Provision: To provide, maintain, and enhance the Service,
                  including saving flashcards and tracking your study progress.
                </li>
                <li>
                  Personalization: To customize your experience and present content
                  tailored to your interests and learning patterns.
                </li>
                <li>
                  Payment Processing: To facilitate transactions and manage
                  subscriptions through Stripe.
                </li>
                <li>
                  Communication: To send administrative information, updates,
                  security alerts, and support messages.
                </li>
                <li>
                  Analytics and Improvements: To monitor usage patterns and improve
                  the functionality and user experience of the Service.
                </li>
              </ul>
            </section>

            {/* 7. Disclosure of Information */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                7. Disclosure of Information
              </h2>
              <h3 className="text-lg font-medium mt-4 mb-2">
                7.1 Third-Party Service Providers
              </h3>
              <p>
                We may disclose your personal information to trusted third-party
                service providers who assist us in operating the Service and
                conducting our business, including:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Stripe: For secure payment processing. Your payment information is
                  handled in accordance with Stripe&rsquo;s privacy policy.
                </li>
                <li>
                  Firebase: For user authentication and secure account management.
                </li>
                <li>
                  Analytics Providers: To analyze usage data and improve the Service&rsquo;s
                  performance.
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-4 mb-2">
                7.2 Legal Obligations and Safety
              </h3>
              <p>We may disclose your personal information:</p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  To comply with any applicable laws, regulations, legal processes,
                  or governmental requests.
                </li>
                <li>
                  To enforce our terms of service and other agreements.
                </li>
                <li>
                  To protect the rights, property, or safety of the Company, our
                  users, or others.
                </li>
              </ul>
            </section>

            {/* 8. Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                8. Data Retention
              </h2>
              <p>We will retain your personal information as follows:</p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Active Accounts: For as long as your account remains active.
                </li>
                <li>
                  Inactive Accounts: For a reasonable period as dictated by applicable
                  laws and regulations.
                </li>
                <li>
                  Deletion Requests: Upon your request to delete your personal
                  information, we will proceed in accordance with legal requirements,
                  unless retention is necessary to comply with legal obligations.
                </li>
              </ul>
            </section>

            {/* 9. Your Rights and Choices */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                9. Your Rights and Choices
              </h2>
              <h3 className="text-lg font-medium mt-4 mb-2">
                9.1 Access and Correction
              </h3>
              <p>
                You have the right to access and correct your personal information at
                any time through your account settings.
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">
                9.2 Data Deletion
              </h3>
              <p>
                You may request the deletion of your personal information by contacting
                us at{" "}
                <a href="mailto:memocurve@gmail.com" className="underline">
                  memocurve@gmail.com
                </a>
                . We will respond to your request within the timeframe required by
                applicable law.
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">
                9.3 Opt-Out Preferences
              </h3>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Communications: You may opt out of receiving promotional
                  communications by following the unsubscribe instructions provided
                  in such emails.
                </li>
                <li>
                  Cookies: You can set your browser to refuse all or some browser
                  cookies or to alert you when cookies are being set.
                </li>
              </ul>
            </section>

            {/* 10. Security Measures */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                10. Security Measures
              </h2>
              <p>
                We implement appropriate technical and organizational measures to
                protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Data Encryption: Utilizing encryption protocols for data in transit
                  and at rest where applicable.
                </li>
                <li>
                  Secure Infrastructure: Hosting data on servers with advanced
                  security features and regular security assessments.
                </li>
                <li>
                  Access Controls: Restricting access to personal information to
                  authorized personnel who are bound by confidentiality obligations.
                </li>
              </ul>
              <p className="mt-2">
                Despite our efforts, no security measures are entirely foolproof, and
                we cannot guarantee absolute security.
              </p>
            </section>

            {/* 11. International Data Transfers */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                11. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to, stored, and processed in
                countries other than your own, where data protection laws may differ.
                By using the Service, you consent to the transfer of information to
                countries outside your country of residence.
              </p>
            </section>

            {/* 12. Legal Basis for Processing (GDPR Compliance) */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                12. Legal Basis for Processing (GDPR Compliance)
              </h2>
              <p>
                For individuals located within the European Economic Area (EEA), we
                process your personal data under the following legal bases:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Consent: You have provided explicit consent for the processing of
                  your personal data for one or more specific purposes.
                </li>
                <li>
                  Contractual Necessity: Processing is necessary for the performance
                  of a contract to which you are a party.
                </li>
                <li>
                  Legal Obligation: Processing is necessary for compliance with a
                  legal obligation to which we are subject.
                </li>
                <li>
                  Legitimate Interests: Processing is necessary for the purposes of
                  our legitimate interests, except where overridden by your fundamental
                  rights and freedoms.
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-4 mb-2">
                12.1 GDPR Rights
              </h3>
              <p>
                Under the General Data Protection Regulation (GDPR), you are entitled
                to the following rights:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Right of Access: To request confirmation as to whether we are
                  processing your personal data and access to such data.
                </li>
                <li>
                  Right to Rectification: To request correction of inaccurate or
                  incomplete personal data.
                </li>
                <li>
                  Right to Erasure (&quot;Right to Be Forgotten&quot;): To request the deletion
                  of your personal data under certain conditions.
                </li>
                <li>
                  Right to Restrict Processing: To request the limitation of
                  processing your personal data under specific circumstances.
                </li>
                <li>
                  Right to Data Portability: To receive your personal data in a
                  structured, commonly used, and machine-readable format.
                </li>
                <li>
                  Right to Object: To object to the processing of your personal data
                  based on legitimate interests or for direct marketing purposes.
                </li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, please contact us at{" "}
                <a href="mailto:memocurve@gmail.com" className="underline">
                  memocurve@gmail.com
                </a>
                .
              </p>
            </section>

            {/* 13. Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                13. Children&apos;s Privacy
              </h2>
              <p>
                Our Service is accessible to users of all ages. However, for
                individuals under the age of 13, we require verifiable parental or
                guardian consent before collecting any personal information. We do
                not knowingly collect personal data from children under 13 without
                such consent.
              </p>
              <p className="mt-2">
                If you are a parent or guardian and become aware that your child
                under the age of 13 has provided us with personal information without
                your consent, please contact us at{" "}
                <a href="mailto:memocurve@gmail.com" className="underline">
                  memocurve@gmail.com
                </a>
                . We will take immediate steps to remove such information from our
                records.
              </p>
            </section>

            {/* 14. Changes to This Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                14. Changes to This Policy
              </h2>
              <p>
                We reserve the right to amend this Privacy Policy at our discretion
                and at any time. When changes are made, we will update the &quot;Last
                Updated&quot; date at the top of this Policy. Your continued use of the
                Service following the posting of changes constitutes your acceptance
                of such changes.
              </p>
            </section>

            {/* 15. Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-2">
                15. Contact Information
              </h2>
              <p>
                If you have any questions, comments, or concerns about this Privacy
                Policy or our privacy practices, please contact us at:
              </p>
              <p className="mt-2">Email: memocurve@gmail.com</p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
