import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import { PiUserSquare } from "react-icons/pi";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [errorProfile, setErrorProfile] = useState(null);
    const [profileData, setProfileData] = useState(null);

    const fetchUserProfile = useCallback(async () => {
        setLoadingProfile(true);
        setErrorProfile(null);
        try {
            const response = await fetch(SummaryApi.getUserProfile.url, {
                method: SummaryApi.getUserProfile.method,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch profile data');
            }

            const data = await response.json();
            setProfileData(data.data);
        } catch (err) {
            setErrorProfile(err.message);
            toast.error(err.message);
        } finally {
            setLoadingProfile(false);
        }
    }, []);

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await fetch(SummaryApi.current_user.url, {
                method: SummaryApi.current_user.method,
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setProfileData(data.data);
            } else {
                toast.error(data.message || "Failed to fetch updated user details.");
            }
        } catch (error) {
            toast.error("Error fetching updated user details.");
        }
    }, []);

    const handleEditProfile = () => {
        if (profileData) {
            navigate('/settings', {
                state: {
                    name: profileData.name,
                    tag: profileData.tag,
                    telegramNumber: profileData.telegramNumber,
                    email: profileData.email,
                    profilePic: profileData.profilePic,
                },
            });
        }
    };

    // Helper function to truncate text with ellipsis
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    useEffect(() => {
        fetchUserProfile();
        fetchUserDetails();
    }, [fetchUserProfile, fetchUserDetails]);

if (loadingProfile) {
    return (
        <div className="mt-20 p-4 sm:p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 animate-fadeIn">
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                .shimmer {
                    background: linear-gradient(
                        to right,
                        #e0e0e0 0%,
                        #f8f8f8 50%,
                        #e0e0e0 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 1.8s infinite linear;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>

            <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                            <div className="h-24 w-24 bg-gray-200 rounded-full shimmer"></div>
                        </div>

                        <div className="flex-grow min-w-0 text-center sm:text-left">
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-200 rounded w-40 mx-auto sm:mx-0 shimmer"></div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto sm:mx-0 shimmer"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto sm:mx-0 shimmer"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 flex justify-center sm:justify-end">
                        <div className="h-10 w-24 bg-gray-200 rounded shimmer"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="h-6 bg-gray-200 rounded w-20 mx-auto mb-2 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto shimmer"></div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="h-6 bg-gray-200 rounded w-20 mx-auto mb-2 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto shimmer"></div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="h-6 bg-gray-200 rounded w-20 mx-auto mb-2 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto shimmer"></div>
                </div>
            </div>
        </div>
    );
}



    if (errorProfile) {
        return (
            <div className="mt-24 p-4 sm:p-6 max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 rounded-xl">
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <p className="font-medium">Error loading profile</p>
                        <p className="text-sm mt-1">{errorProfile}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (profileData) {
        return (
            <div className="mt-20 p-4 sm:p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
                {/* Header Section */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        {/* Profile Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                                    {profileData?.profilePic ? (
                                        <img
                                            src={profileData.profilePic}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <PiUserSquare size={40} className="text-indigo-600" />
                                    )}
                                </div>
                            </div>
                            
                            {/* User Details */}
                            <div className="flex-grow min-w-0 text-center sm:text-left">
                                <div className="space-y-2">
                                    <h2 
                                        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words leading-tight"
                                        title={profileData.name || 'No Name'} // Show full name on hover
                                    >
                                        <span className="block sm:hidden">
                                            {truncateText(profileData.name || 'No Name', 20)}
                                        </span>
                                        <span className="hidden sm:block lg:hidden">
                                            {truncateText(profileData.name || 'No Name', 25)}
                                        </span>
                                        <span className="hidden lg:block">
                                            {profileData.name || 'No Name'}
                                        </span>
                                    </h2>
                                    
                                    <div className="space-y-1 text-sm text-gray-600">
                                        {profileData.email && (
                                            <p className="flex items-center justify-center sm:justify-start">
                                                <span className="font-medium text-gray-700 mr-2">Email:</span>
                                                <span className="break-all" title={profileData.email}>
                                                    <span className="block sm:hidden">
                                                        {truncateText(profileData.email, 25)}
                                                    </span>
                                                    <span className="hidden sm:block">
                                                        {profileData.email}
                                                    </span>
                                                </span>
                                            </p>
                                        )}
                                        
                                        {profileData.tag && (
                                            <p className="flex items-center justify-center sm:justify-start">
                                                <span className="font-medium text-gray-700 mr-2">Tag:</span>
                                                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    {profileData.tag}
                                                </span>
                                            </p>
                                        )}
                                        
                                        {profileData.telegramNumber && (
                                            <p className="flex items-center justify-center sm:justify-start">
                                                <span className="font-medium text-gray-700 mr-2">Telegram:</span>
                                                <span>{profileData.telegramNumber}</span>
                                            </p>
                                        )}
                                        
                                        {profileData.createdAt && (
                                            <p className="flex items-center justify-center sm:justify-start text-gray-500">
                                                <span className="font-medium mr-2">Member Since:</span>
                                                <span>{moment(profileData.createdAt).format('MMM D, YYYY')}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Edit Button */}
                        <div className="flex-shrink-0 flex justify-center sm:justify-end">
                            <button
                                onClick={handleEditProfile}
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <FaEdit className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Additional Profile Stats or Content */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">
                            {profileData.createdAt ? moment().diff(moment(profileData.createdAt), 'days') : 0}
                        </div>
                        <div className="text-sm text-gray-600">Days Active</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">
                            {profileData.email ? '✓' : '✗'}
                        </div>
                        <div className="text-sm text-gray-600">Email Verified</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">
                            {profileData.profilePic ? '✓' : '✗'}
                        </div>
                        <div className="text-sm text-gray-600">Profile Picture</div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default Profile;