import React from 'react';
import CommunityFeed from '../Components/CommunityFeed';
import CreatePostCard from '../Components/CreatePostCard'; 

const Buzz = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white shadow border mt-14 border-gray-200 overflow-hidden flex flex-col z-40">
      {/* Header */}
      <div className="bg-white w-full font-semibold text-lg text-gray-800 pt-3 mt-1 px-6 border-b border-gray-200 flex items-cente justify-center">
        BUZZ
      </div>

      {/* Create Post Section (Fixed at the top below the header) */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <CreatePostCard />
      </div>

      {/* FEED (Scrollable Content) */}
      <div className="overflow-y-auto flex-grow mt-0">
        <CommunityFeed />
      </div>
    </div>
  );
};

export default Buzz;