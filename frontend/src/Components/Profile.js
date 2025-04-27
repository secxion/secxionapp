import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { FaUniversity, FaEdit } from 'react-icons/fa';
import { PiUserSquare } from "react-icons/pi";
import BankAccountList from './BankAccountList';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [errorProfile, setErrorProfile] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);
    const [errorBankAccounts, setErrorBankAccounts] = useState('');
    const [isUpdatingBankAccounts, setIsUpdatingBankAccounts] = useState(false);

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
                console.error("Profile.js: fetchUserProfile - Error:", errorData);
                throw new Error(errorData.message || 'Failed to fetch initial profile data');
            }

            const data = await response.json();
            setProfileData(data.data);
        } catch (err) {
            setErrorProfile(err.message);
            toast.error(err.message);
            console.error("Profile.js: fetchUserProfile - Catch error:", err);
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

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setProfileData(data.data);
                } else {
                    console.error("Profile.js: fetchUserDetails - Error:", data.message);
                    toast.error(data.message || "Failed to fetch updated user details.");
                }
            } else {
                const errorData = await response.json();
                console.error("Profile.js: fetchUserDetails - API Error:", errorData);
                toast.error(errorData.message || "Failed to fetch updated user details.");
            }
        } catch (error) {
            console.error("Profile.js: fetchUserDetails - Catch error:", error);
            toast.error("Error fetching updated user details.");
        }
    }, []);


    const fetchBankAccounts = useCallback(async () => {
        if (!user?.id && !user?._id) {
            console.warn('Profile.js: fetchBankAccounts - User not found.');
            setErrorBankAccounts('User authentication details not found.');
            return;
        }

        setIsLoadingBankAccounts(true);
        setErrorBankAccounts('');
        try {
            const response = await fetch(SummaryApi.getUserProfileBankAccounts.url, {
                method: SummaryApi.getUserProfileBankAccounts.method,
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Profile.js: fetchBankAccounts - Error:", errorData);
                throw new Error(errorData.message || 'Failed to fetch bank accounts.');
            }
            const data = await response.json();
            if (data.success) {
                setBankAccounts(data.data);
            } else {
                setErrorBankAccounts(data.message || 'Failed to fetch bank accounts.');
            }
        } catch (err) {
            console.error('Profile.js: fetchBankAccounts - Catch error:', err);
            setErrorBankAccounts('An unexpected error occurred while fetching bank accounts.');
        } finally {
            setIsLoadingBankAccounts(false);
            setIsUpdatingBankAccounts(false);
        }
    }, [user]);

    const handleBankAccountsUpdated = useCallback((newAccounts) => {
        setBankAccounts(newAccounts);
        setIsUpdatingBankAccounts(false);
    }, []);

    const handleBankAccountsUpdating = useCallback((isUpdating) => {
        setIsUpdatingBankAccounts(isUpdating);
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

    useEffect(() => {
        if (user) {
            fetchBankAccounts();
        }
    }, [user, fetchBankAccounts]);

    if (loadingProfile || isLoadingBankAccounts) {
        return (
            <div className="mt-20 flex flex-col p-4 m-5 space-y-4 border-b bg-gray-100 rounded-md shadow">
                <div className="flex items-center justify-between border-b pt-20">
                <div className="w-20 h-20 rounded-full bg-gray-300 animate-pulse mr-5"></div>
                    <div className="flex-grow">
                        <div className="bg-gray-300 h-6 w-3/4 rounded-md animate-pulse mb-2"></div>
                        <div className="bg-gray-300 h-4 w-1/2 rounded-md animate-pulse"></div>
                    </div>
                </div>
                <div className="flex items-center">
                    <FaUniversity className="text-xl text-gray-500 mr-3"/>
                    <div className="bg-gray-300 h-5 w-1/2 rounded-md animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (errorProfile || errorBankAccounts) {
        return (
            <div className="mt-20 p-5 text-red-500 border border-red-500 bg-red-100 rounded-md m-5">
                {errorProfile && <p>Error loading profile: {errorProfile}</p>}
                {errorBankAccounts && <p>Error loading bank accounts: {errorBankAccounts}</p>}
            </div>
        );
    }

    if (profileData) {
        return (
            <div className="container fixed w-screen left-0 right-0 mt-20 flex flex-col p-8 m-5 space-y-6 bg-white rounded-md shadow">
                <div className="flex items-center justify-between border-b pt-24">
                    <div className="flex items-center">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-5 overflow-hidden">
                            {profileData?._id && (
                                <div className="relative">
                                    <div className="cursor-pointer" >
                                        {profileData?.profilePic ? (
                                            <img
                                                src={profileData?.profilePic}
                                                className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow-sm"
                                                alt="Profile"
                                            />
                                        ) : (
                                            <PiUserSquare size={48} className="text-blue-700" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">{profileData.name || 'No Name'}</h2>
                            {profileData.email && <p className="text-gray-600 text-sm mb-1">Email: {profileData.email}</p>}
                            {profileData.tag && <p className="text-gray-600 text-sm mb-1">Tag: {profileData.tag}</p>}
                            {profileData.telegramNumber && <p className="text-gray-600 text-sm mb-1">Telegram: {profileData.telegramNumber}</p>}
                            {profileData.createdAt && (
                                <p className="text-gray-600 text-sm mb-1">
                                    Activated Since: {moment(profileData.createdAt).format('MMMM D, YYYY')}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleEditProfile}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <FaEdit className="mr-2" />
                    </button>
                </div>

                {/* Bank Accounts Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaUniversity className="mr-2 text-gray-500" /> Bank Accounts
                        </h3>
                        {isUpdatingBankAccounts && (
                            <span className="text-gray-500 text-sm italic">Updating accounts...</span>
                        )}
                    </div>
                    <BankAccountList
                        bankAccounts={bankAccounts}
                        onBankAccountsUpdated={handleBankAccountsUpdated}
                        onBankAccountsUpdating={handleBankAccountsUpdating}
                    />
                    {errorBankAccounts && <p className="text-red-500 mt-2">{errorBankAccounts}</p>}
                </div>
            </div>
        );
    }

    return null;
};

export default Profile;