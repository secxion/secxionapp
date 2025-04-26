import React from 'react';

const Privacy = () => {
  return (
    <div className="container fixed top-0 bg-gray-100 py-20 h-screen overflow-auto">
      <div className=" mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Privacy Policy for Secxion.com</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-sm text-gray-500 mb-4">
            <strong>Last Updated:</strong> April 16, 2025
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            This Privacy Policy describes how Secxion.com (the "Service," "we," "us," or "our") collects, uses, and shares your personal information when you use our website secxion.com.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h3>
          <p className="text-gray-700 leading-relaxed mb-2">We may collect the following types of information from you:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4">
            <li>
              <strong className="font-semibold text-gray-800">Information You Provide Directly:</strong> This includes information you provide when you create an account (if applicable), submit a gift card for sale, or contact us, such as your name, email address, phone number, and payment details.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">Information About Your Transactions:</strong> We collect information about the gift cards you sell through our Service, including the brand, value, and transaction details.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">Usage Data:</strong> We may collect information about how you access and use the Service, such as your IP address, browser type, operating system, referring URLs, pages visited, and the dates and times of your access.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">Cookies and Similar Technologies:</strong> We may use cookies and similar tracking technologies to collect information about your browsing activity on our Service. You can manage your cookie preferences through your browser settings.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h3>
          <p className="text-gray-700 leading-relaxed mb-2">We may use your information for the following purposes:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4">
            <li>To provide and maintain the Service.</li>
            <li>To process your gift card transactions and facilitate payments.</li>
            <li>To communicate with you, including responding to your inquiries and providing updates about your transactions.</li>
            <li>To personalize your experience on the Service.</li>
            <li>To monitor and analyze usage of the Service and improve its functionality.</li>
            <li>To detect, prevent, and address fraud and other illegal activities.</li>
            <li>To comply with applicable laws and regulations.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">3. How We Share Your Information</h3>
          <p className="text-gray-700 leading-relaxed mb-2">We may share your information with the following categories of recipients:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4">
            <li>
              <strong className="font-semibold text-gray-800">Payment Processors:</strong> We share necessary payment information with third-party payment processors to facilitate your transactions.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">Service Providers:</strong> We may engage third-party service providers to assist us with various functions, such as website hosting, data analysis, email delivery, and customer support. These service providers will have access to your information only to the extent necessary to perform their services and are obligated to maintain its confidentiality.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">Legal Authorities:</strong> We may disclose your information to law enforcement agencies, government bodies, or other third parties if required by law or legal process, or if we believe in good faith that such disclosure is necessary to protect our rights, property, or safety, or the rights, property, or safety of others.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity. We will provide notice if your personal information becomes subject to a different privacy policy as a result of such a transaction.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Security of Your Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee the absolute security of your information.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Your Rights</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your information. Please contact us at [Insert Contact Email Address Here] if you would like to exercise any of these rights. We may require you to verify your identity before responding to your request.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">6. Data Retention</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">7. Children's Privacy</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our Service is not intended for children under the age of [Insert Minimum Age, e.g., 16]. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">8. Changes to This Privacy Policy</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website. You are advised to review this Privacy Policy periodically for any changes. The "Last Updated" date at the top of this Privacy Policy indicates when it was last revised.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">9. Contact Us</h3>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            <a href="mailto:secxion@mail.com" className="text-blue-500 hover:underline">secxion@mail.com</a>
          </p>
        </div>
      </div>
      <div className="mx-auto px-4 mt-8 text-center text-gray-500">
        © 2025 secxion.com. All rights reserved.
      </div>
    </div>
  );
};

export default Privacy;