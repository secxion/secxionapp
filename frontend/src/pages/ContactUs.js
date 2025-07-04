import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navigation from '../Components/Navigation'; // Assuming this path is correct for your project structure
import SummaryApi from '../common'; // Assuming this path is correct for your API endpoints
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and ToastContainer is set up in your root component

const ContactUs = () => {
  // State to manage form data inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '', // Optional Telegram number
    reason: '',      // User's message or reason for contact
  });
  // State to manage submission status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Animation variants for Framer Motion container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for child elements
      }
    }
  };

  // Animation variants for individual items within the container
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Handles changes to form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set submitting state to true
    setSubmissionSuccess(false); // Reset success state
    setSubmissionError(''); // Clear any previous errors

    console.log('Submitting form with data:', formData);

    try {
      // Make a POST request to the contactUsMessage API endpoint
      const response = await fetch(SummaryApi.contactUsMessage.url, {
        method: SummaryApi.contactUsMessage.method || 'POST', // Use method from SummaryApi or default to POST
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(formData), // Send form data as JSON string
      });

      console.log('Contact us message response:', response); 

      const responseData = await response.json(); // Parse the JSON response
      console.log('Contact us message response data:', responseData);

      // Check if the response was successful (HTTP status 2xx)
      if (response.ok) {
        setSubmissionSuccess(true); // Set submission success state
        setFormData({ name: '', email: '', phoneNumber: '', reason: '' }); // Clear form fields
        toast.success(responseData.message || 'Thanks for contacting us! We will get back to you ASAP.'); // Show success toast
      } else {
        // Handle API errors
        setSubmissionError(responseData.message || 'An error occurred while submitting your message. Please try again later.');
        toast.error(responseData.message || 'Submission failed. Please try again.'); // Show error toast
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error('Submission Error:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
      toast.error('Submission failed. Please try again.'); // Show generic error toast
    } finally {
      setIsSubmitting(false); // Reset submitting state regardless of success or failure
    }
  };

  return (
    <motion.div
      // Changed min-h-screen to h-full and added flex flex-col to enable proper scrolling of content
      className="h-full flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navigation component for consistent site layout */}
      <Navigation currentPage="contact" />
      
      {/* Geometric Background Elements for visual flair - colors updated for black theme */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-gray-700/30 rotate-45 animate-spin [animation-duration:20s]"></div>
        <div className="absolute top-1/3 right-20 w-20 h-20 bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 border-2 border-gray-700/30 rounded-full animate-bounce [animation-duration:3s]"></div>
      </div>

      {/* Main content area, now flex-1 to take available space and overflow-y-auto for scrolling */}
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header section for the Contact Us page */}
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            {/* Header icon with black and yellow gradient background */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-black to-yellow-700 rounded-2xl mb-6 shadow-lg">
              <Mail className="h-8 w-8 text-yellow-400" /> {/* Mail icon in yellow */}
            </div>
            {/* Page title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
              Contact Us
            </h1>
            {/* Page description */}
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          {/* Contact Information Cards section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={itemVariants}
          >
            {/* Email Us Card */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl mb-4">
                <Mail className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Email Us</h3>
              <p className="text-gray-300 text-sm mb-3">Send us an email anytime</p>
              <a href="mailto:Secxion@mail.com" className="text-yellow-500 hover:text-yellow-400 font-medium">
                Secxion@mail.com
              </a>
            </div>

            {/* Support Card */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl mb-4">
                <Phone className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Support</h3>
              <p className="text-gray-300 text-sm mb-3">24/7 customer support</p>
              <span className="text-yellow-500 font-medium">Available 24/7</span>
            </div>
             {/* Quick Response Card - Added to fill the 3-column layout */}
             <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl mb-4">
                    <CheckCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Quick Response</h3>
                <p className="text-gray-300 text-sm mb-3">We aim to reply within 24 hours</p>
                <span className="text-yellow-500 font-medium">Fast & Efficient</span>
            </div>
          </motion.div>

          {/* Contact Form section */}
          <motion.div
            className="bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12"
            variants={itemVariants}
          >
            {/* Success Message display */}
            {submissionSuccess && (
              <motion.div
                className="mb-8 p-6 bg-green-900 border border-green-700 rounded-2xl flex items-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="h-6 w-6 text-green-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-200">Message Sent Successfully!</h3>
                  <p className="text-green-300">Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              </motion.div>
            )}

            {/* Error Message display */}
            {submissionError && (
              <motion.div
                className="mb-8 p-6 bg-red-900 border border-red-700 rounded-2xl flex items-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-6 w-6 text-red-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-200">Error Sending Message</h3>
                  <p className="text-red-300">{submissionError}</p>
                </div>
              </motion.div>
            )}

            {/* The contact form itself */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name input field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-100 mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-200 text-gray-100 placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Address input field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-100 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-200 text-gray-100 placeholder-gray-400"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Telegram Number (Optional) input field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-100 mb-3">
                  Telegram Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-200 text-gray-100 placeholder-gray-400"
                  placeholder="Enter your telegram number"
                />
              </div>

              {/* Message textarea field */}
              <div>
                <label htmlFor="reason" className="block text-sm font-semibold text-gray-100 mb-3">
                  Message
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-200 text-gray-100 placeholder-gray-400 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Submit Button with loading spinner */}
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-black to-yellow-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400 mr-3"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-3" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Additional Information section */}
          <motion.div
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-400 mb-4">
              Need immediate assistance? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                Response time: Within 24 hours
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                Available: Monday - Sunday
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default ContactUs;
