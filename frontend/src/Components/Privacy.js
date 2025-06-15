import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Privacy Policy for Secxion.com</h1>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-sm text-gray-500 mb-6 text-right">
            <strong>Last Updated:</strong> April 16, 2025
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            This Privacy Policy describes how Secxion.com (the "Service," "we," "us," or "our") collects, uses, and shares your personal information when you use our website secxion.com.
          </p>

          <Section title="1. Information We Collect">
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong className="text-gray-800">Information You Provide Directly:</strong> Information like name, email, phone number, and payment details.
              </li>
              <li>
                <strong className="text-gray-800">Transaction Data:</strong> Details about the gift cards you sell, such as brand, value, and transaction history.
              </li>
              <li>
                <strong className="text-gray-800">Usage Data:</strong> Includes your IP address, browser type, pages visited, and timestamps.
              </li>
              <li>
                <strong className="text-gray-800">Cookies & Similar Tech:</strong> For tracking and improving experience. You can manage this via your browser.
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>To provide and maintain the Service</li>
              <li>To process transactions and payments</li>
              <li>To communicate and respond to inquiries</li>
              <li>To personalize your experience</li>
              <li>To analyze performance and improve usability</li>
              <li>To detect fraud and comply with laws</li>
            </ul>
          </Section>

          <Section title="3. How We Share Your Information">
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong className="text-gray-800">Payment Processors:</strong> To complete your transactions securely.
              </li>
              <li>
                <strong className="text-gray-800">Service Providers:</strong> Third parties who assist with hosting, analytics, customer service, etc.
              </li>
              <li>
                <strong className="text-gray-800">Legal Authorities:</strong> When required by law or necessary for protection.
              </li>
              <li>
                <strong className="text-gray-800">Business Transfers:</strong> In the event of acquisition or merger, data may be transferred.
              </li>
            </ul>
          </Section>

          <Section title="4. Security of Your Information">
            <p className="text-gray-700 leading-relaxed">
              We implement safeguards to protect your data. However, no method of internet transmission is 100% secure.
            </p>
          </Section>

          <Section title="5. Your Rights">
            <p className="text-gray-700 leading-relaxed">
              You may have rights to access, correct, or delete your data. Please contact us at&nbsp;
              <a href="mailto:secxion@mail.com" className="text-blue-600 hover:underline">secxion@mail.com</a>.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p className="text-gray-700 leading-relaxed">
              Your data is retained as long as necessary for business and legal purposes.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 16. If you believe a child has provided personal info, contact us immediately.
            </p>
          </Section>

          <Section title="8. Changes to This Privacy Policy">
            <p className="text-gray-700 leading-relaxed">
              We may update this policy periodically. Continued use of our Service implies agreement to the updated terms.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p className="text-gray-700 leading-relaxed">
              If you have questions or concerns, reach out at:&nbsp;
              <a href="mailto:secxionapp@gmail.com" className="text-blue-600 hover:underline">secxionapp@gmail.com</a>
            </p>
          </Section>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10">
          © 2025 secxion.com. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h2>
    {children}
  </div>
);

export default Privacy;
