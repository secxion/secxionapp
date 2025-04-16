import React from 'react';

const Terms = () => {
  return (
    <div className="fixed top-0 bg-gray-100 py-20 h-screen overflow-auto">
      <div className=" mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Terms of Service for Secxion.com</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-sm text-gray-500 mb-4">
            <strong>Last Updated:</strong> April 16, 2025
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Please read these Terms of Service ("Terms") carefully before using the secxion.com website (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to all of the terms and conditions set forth below, then you may not access or use the Service.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms constitute a legally binding agreement between you and Secxion.com. You acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Description of Service</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Secxion.com currently provides a platform that allows users to sell their valid gift cards to us at rates determined by Secxion.com.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">3. User Obligations</h3>
          <p className="text-gray-700 leading-relaxed mb-2">By using the Service, you represent and warrant that:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4">
            <li>You are at least the legal age of majority in your jurisdiction.</li>
            <li>You have the legal right and authority to sell the gift cards you submit.</li>
            <li>The gift cards you submit are valid, unredeemed, and obtained through legitimate means.</li>
            <li>You will provide accurate and complete information during the transaction process.</li>
            <li>You will comply with all applicable laws and regulations.</li>
            <li>You will not engage in any fraudulent or unlawful activities through the Service.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Gift Card Transactions</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4">
            <li>When you submit a gift card for sale, you are offering to sell it to Secxion.com at the quoted rate.</li>
            <li>Secxion.com reserves the right to accept or reject any gift card submission for any reason.</li>
            <li>The final payout amount for your gift card will be determined by Secxion.com based on various factors, including but not limited to the gift card brand and current market value.</li>
            <li>Payment will be processed using the methods specified on the Service. Processing times may vary.</li>
            <li>Secxion.com is not responsible for any errors in payment information provided by the user.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Intellectual Property</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Service and its original content, features, and functionality (including but not limited to text, graphics, logos, and software) are and will remain the exclusive property of Secxion.com and its licensors.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">6. Disclaimer of Warranties</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SECXION.COM MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. SECXION.COM DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">7. Limitation of Liability</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SECXION.COM, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES) ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF SECXION.COM HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO SECXION.COM (IF ANY) IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">8. Indemnification</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree to indemnify and hold harmless Secxion.com, its affiliates, officers, directors, employees, agents, and suppliers from and against any and all claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or relating to your use of the Service, your violation of these Terms, or your violation of any rights of another party.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">9. Governing Law</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">10. Changes to These Terms</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Secxion.com reserves the right to modify or revise these Terms at any time without prior notice. By continuing to access or use the Service after any such modifications or revisions become effective, you agree to be bound by the revised Terms. It is your responsibility to review these Terms periodically for changes.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">11. Contact Us</h3>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms, please contact us at [Secxion@mail.com].
          </p>
        </div>
      </div>
      <div className=" mx-auto px-4 mt-8 text-center text-gray-500">
        © 2025 secxion.com. All rights reserved.
      </div>
    </div>
  );
};

export default Terms;