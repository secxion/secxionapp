import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setSubmissionError('');

    console.log('Submitting form with data:', formData); // Log form data before sending

    try {
      const response = await fetch(SummaryApi.contactUsMessage.url, {
        method: SummaryApi.contactUsMessage.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Contact us message response:', response); // Log the raw response

      const responseData = await response.json();
      console.log('Contact us message response data:', responseData); // Log the parsed JSON response

      if (response.ok) {
        setSubmissionSuccess(true);
        setFormData({ name: '', email: '', phoneNumber: '', reason: '' });
        toast.success(responseData.message || 'Thanks for contacting us! We will get back to you ASAP.');
      } else {
        setSubmissionError(responseData.message || 'An error occurred while submitting your message. Please try again later.');
        toast.error(responseData.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container -mt-16 bg-gray-100 py-16">
      <div className=" mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white rounded-md shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Contact Us</h2>

          {submissionSuccess ? (
            <div className="bg-green-200 text-green-800 py-3 px-4 rounded-md mb-4">
              Thanks for contacting us! We will get back to you ASAP.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ... your form inputs ... */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="reason" className="block text-gray-700 text-sm font-bold mb-2">
                  Message
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                ></textarea>
              </div>

              {submissionError && (
                <div className="bg-red-200 text-red-800 py-3 px-4 rounded-md mb-4">
                  {submissionError}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactUs;