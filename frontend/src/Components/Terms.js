import React from 'react';

const Terms = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-700 pt-24 px-4 md:px-8">
      <section className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Terms of Service</h1>
          <p className="text-sm text-gray-500 mt-2">Last Updated: April 16, 2025</p>
        </header>

        <article className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <p className="leading-relaxed">
              Please read these Terms of Service ("Terms") carefully before using the secxion.com website
              (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
              If you do not agree to all of the terms and conditions set forth below, then you may not
              access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              These Terms constitute a legally binding agreement between you and Secxion.com. You
              acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">2. Description of Service</h2>
            <p className="leading-relaxed">
              Secxion.com currently provides a platform that allows users to sell their valid gift cards
              to us at rates determined by Secxion.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">3. User Obligations</h2>
            <p className="leading-relaxed mb-2">By using the Service, you represent and warrant that:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You are at least the legal age of majority in your jurisdiction.</li>
              <li>You have the legal right and authority to sell the gift cards you submit.</li>
              <li>The gift cards you submit are valid and unredeemed.</li>
              <li>You will provide accurate and complete information during the transaction process.</li>
              <li>You will comply with all applicable laws and regulations.</li>
              <li>You will not engage in any fraudulent or unlawful activities through the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">4. Gift Card Transactions</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>When you submit a gift card for sale, you are offering to sell it to Secxion.com at the quoted rate.</li>
              <li>Secxion.com reserves the right to accept or reject any gift card submission for any reason.</li>
              <li>The final payout amount for your gift card will be determined by Secxion.com based on various factors.</li>
              <li>Payment will be processed using the methods specified on the Service. Processing times may vary.</li>
              <li>Secxion.com is not responsible for any errors in payment information provided by the user.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">5. Intellectual Property</h2>
            <p className="leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive
              property of Secxion.com and its licensors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">6. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SECXION.COM MAKES NO WARRANTIES,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">7. Limitation of Liability</h2>
            <p className="leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SECXION.COM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">8. Indemnification</h2>
            <p className="leading-relaxed">
              You agree to indemnify and hold harmless Secxion.com and its affiliates from any claims arising out of
              your use of the Service or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">9. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by the laws of Nigeria, without regard to its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">10. Changes to These Terms</h2>
            <p className="leading-relaxed">
              Secxion.com reserves the right to update these Terms at any time without prior notice. Continued use
              of the Service constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">11. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions, contact us at <a href="mailto:Secxion@mail.com" className="text-blue-600 hover:underline">Secxion@mail.com</a>.
            </p>
          </section>
        </article>

        <footer className="text-center text-sm text-gray-500 mt-12">
          © 2025 Secxion.com. All rights reserved.
        </footer>
      </section>
    </main>
  );
};

export default Terms;
