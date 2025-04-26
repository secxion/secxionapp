import React from 'react';

const Aboutus = () => {
  return (
    <div className="container fixed top-0 bg-gray-100 py-20 h-screen">
      <div className=" mx-auto h-full px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">About Secxion.com</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong className="font-semibold text-gray-800">Welcome to Secxion.com!</strong>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Secxion.com, our current focus is simple: to provide a reliable and efficient platform for individuals to sell their unwanted gift cards at competitive rates. We understand the value of your unused gift cards and strive to offer a straightforward process to convert them into cash.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            For now, our services are specifically centered around gift card purchasing. We are committed to offering good rates and a seamless experience for our users.
          </p>
          <p className="text-gray-700 leading-relaxed">
            As Secxion.com evolves, we may expand our services to better serve your needs. Please stay tuned for future updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;