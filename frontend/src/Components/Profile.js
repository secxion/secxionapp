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

    useEffect(() => {
        fetchUserProfile();
        fetchUserDetails();
    }, [fetchUserProfile, fetchUserDetails]);

    if (loadingProfile) {
        return (
            <div className="mt-28 p-6 max-w-3xl mx-auto bg-white rounded-lg shadow animate-pulse">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-300"></div>
                    <div className="flex-grow space-y-3">
                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (errorProfile) {
        return (
            <div className="mt-28 p-6 max-w-3xl mx-auto bg-red-100 border border-red-500 text-red-700 rounded-md">
                <p>{errorProfile}</p>
            </div>
        );
    }

    if (profileData) {
        return (
            <div className="mt-28 p-6 max-w-3xl mx-auto bg-white rounded-lg shadow space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow">
                            {profileData?.profilePic ? (
                                <img
                                    src={profileData.profilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <PiUserSquare size={48} className="text-blue-700" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {profileData.name || 'No Name'}
                            </h2>
                            {profileData.email && <p className="text-gray-600 text-sm">Email: {profileData.email}</p>}
                            {profileData.tag && <p className="text-gray-600 text-sm">Tag: {profileData.tag}</p>}
                            {profileData.telegramNumber && (
                                <p className="text-gray-600 text-sm">Telegram: {profileData.telegramNumber}</p>
                            )}
                            {profileData.createdAt && (
                                <p className="text-gray-500 text-sm">
                                    Member Since: {moment(profileData.createdAt).format('MMMM D, YYYY')}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleEditProfile}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
                    >
                        <FaEdit />
                        Edit Profile
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default Profile;
