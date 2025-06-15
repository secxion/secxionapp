import React from 'react';
import CommunityFeed from '../Components/CommunityFeed';
import CreatePostCard from '../Components/CreatePostCard';

const Buzz = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white shadow border mt-12 border-gray-200 overflow-hidden flex flex-col z-40">
      {/* Create Post Section */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <CreatePostCard />
      </div>

      {/* Scrollable Feed */}
      <div className="overflow-y-auto flex-grow">
        <CommunityFeed />
      </div>
    </div>
  );
};

export default Buzz;