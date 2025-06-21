import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Users, Mail, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import Navigation from './Navigation';

const Terms = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const Section = ({ id, title, children, icon: Icon, isExpandable = false }) => (
    <motion.div variants={itemVariants} className="mb-8">
      <div 
        className={`flex items-center justify-between mb-4 ${isExpandable ? 'cursor-pointer' : ''}`}
        onClick={isExpandable ? () => toggleSection(id) : undefined}
      >
        <div className="flex items-center">
          {Icon && <Icon className="h-6 w-6 text-blue-600 mr-3" />}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {isExpandable && (
          <div className="text-gray-400">
            {expandedSections[id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        )}
      </div>
      <div className={`text-gray-700 leading-relaxed space-y-4 ${isExpandable && !expandedSections[id] ? 'hidden' : ''}`}>
        {children}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Navigation currentPage="terms" />
      
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-200/30 rotate-45 animate-spin [animation-duration:20s]"></div>
        <div className="absolute top-1/3 right-20 w-20 h-20 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 border-2 border-indigo-200/30 rounded-full animate-bounce [animation-duration:3s]"></div>
      </div>

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Understanding our terms helps create a transparent and trustworthy experience for everyone.
            </p>
            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              Last Updated: April 16, 2025
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 relative overflow-hidden"
            variants={itemVariants}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-50 to-cyan-50 rounded-full transform -translate-x-12 translate-y-12 opacity-50"></div>

            <div className="relative z-10">
              <motion.p
                className="text-lg text-gray-700 leading-relaxed mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500"
                variants={itemVariants}
              >
                Please read these Terms of Service ("Terms") carefully before using the secxion.com website
                (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
                If you do not agree to all of the terms and conditions set forth below, then you may not
                access or use the Service.
              </motion.p>

              <Section id="acceptance" title="1. Acceptance of Terms" icon={Shield} isExpandable={true}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    These Terms constitute a legally binding agreement between you and Secxion.com. You
                    acknowledge that you have read, understood, and agree to be bound by these Terms.
                  </p>
                </div>
              </Section>

              <Section id="service" title="2. Description of Service" icon={FileText} isExpandable={true}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    Secxion.com currently provides a platform that allows users to sell their valid gift cards
                    to us at rates determined by Secxion.com.
                  </p>
                </div>
              </Section>

              <Section id="obligations" title="3. User Obligations" icon={Users} isExpandable={true}>
                <p className="mb-4">By using the Service, you represent and warrant that:</p>
                <div className="space-y-3">
                  {[
                    "You are at least the legal age of majority in your jurisdiction.",
                    "You have the legal right and authority to sell the gift cards you submit.",
                    "The gift cards you submit are valid and unredeemed.",
                    "You will provide accurate and complete requirements during the transaction process.",
                    "You will comply with all applicable laws and regulations.",
                    "You will not engage in any fraudulent or unlawful activities through the Service."
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="transactions" title="4. Gift Card Transactions" icon={FileText} isExpandable={true}>
                <div className="space-y-3">
                  {[
                    "When you submit a gift card for sale, you are offering to sell it to Secxion.com at the quoted rate.",
                    "Secxion.com reserves the right to accept or reject any gift card submission for any reason.",
                    "The final payout amount for your gift card will be determined by Secxion.com based on various factors.",
                    "Payment will be processed using the methods specified on the Service. Processing times may vary.",
                    "Secxion.com is not responsible for any errors in payment information provided by the user."
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="intellectual" title="5. Intellectual Property" icon={Shield} isExpandable={true}>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive
                    property of Secxion.com and its licensors.
                  </p>
                </div>
              </Section>

              <Section id="warranties" title="6. Disclaimer of Warranties" icon={FileText} isExpandable={true}>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p>
                    THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SECXION.COM MAKES NO WARRANTIES,
                    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                    PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                </div>
              </Section>

              <Section id="liability" title="7. Limitation of Liability" icon={Shield} isExpandable={true}>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, SECXION.COM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                    SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
                  </p>
                </div>
              </Section>

              <Section id="indemnification" title="8. Indemnification" icon={Users} isExpandable={true}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    You agree to indemnify and hold harmless Secxion.com and its affiliates from any claims arising out of
                    your use of the Service or your violation of these Terms.
                  </p>
                </div>
              </Section>

              <Section id="governing" title="9. Governing Law" icon={FileText} isExpandable={true}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    These Terms shall be governed by the laws of Nigeria, without regard to its conflict of law principles.
                  </p>
                </div>
              </Section>

              <Section id="changes" title="10. Changes to These Terms" icon={FileText} isExpandable={true}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    Secxion.com reserves the right to update these Terms at any time without prior notice. Continued use
                    of the Service constitutes your acceptance of the revised Terms.
                  </p>
                </div>
              </Section>

              <Section title="11. Contact Us" icon={Mail}>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <p className="mb-4">
                    If you have questions or concerns about these Terms of Service, please reach out to us:
                  </p>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-3" />
                    <a href="mailto:Secxion@mail.com" className="text-blue-600 hover:text-blue-800 font-medium underline">
                      Secxion@mail.com
                    </a>
                  </div>
                </div>
              </Section>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="text-center text-gray-500 text-sm mt-12"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-64"></div>
            </div>
            <p>© 2025 Secxion.com. All rights reserved.</p>
          </motion.footer>
        </div>
      </main>
    </motion.div>
  );
};

export default Terms;