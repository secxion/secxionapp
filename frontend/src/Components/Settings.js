import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import uploadImage from '../helpers/uploadImage';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const dispatch = useDispatch();

    const [name, setName] = useState(state?.name || '');
    const [tag, setTag] = useState(state?.tag || '');
    const [telegramNumber, setTelegramNumber] = useState(state?.telegramNumber || '');
    const [profilePic, setProfilePic] = useState(state?.profilePic || '');
    const [newlyUploadedPic, setNewlyUploadedPic] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleUploadPic = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            toast.info("Uploading image... ⏳");
            const uploadedImage = await uploadImage(file);
            setNewlyUploadedPic(URL.createObjectURL(file)); 
            setProfilePic(uploadedImage.url);
            toast.success("Profile picture updated! 📸");
            console.log("Settings.js: handleUploadPic - New profilePic URL:", uploadedImage.url);
        } catch (error) {
            toast.error("Failed to upload image.");
            console.error("Settings.js: handleUploadPic - Error uploading image:", error);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setError('');
        try {
            const payload = {};
            if (name !== state?.name) payload.name = name;
            if (tag !== state?.tag) payload.tag = tag;
            if (telegramNumber !== state?.telegramNumber) payload.telegramNumber = telegramNumber;
            if (profilePic !== state?.profilePic) payload.profilePic = profilePic;
            if (password && newPassword) {
                payload.password = password;
                payload.newPassword = newPassword;
            }

            console.log("Settings.js: handleSaveChanges - Payload to send:", payload);

            if (Object.keys(payload).length > 0 || (password && newPassword)) {
                const response = await fetch(SummaryApi.editProfile.url, {
                    method: SummaryApi.editProfile.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });

                console.log("Settings.js: handleSaveChanges - Response from editProfile API:", response);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Settings.js: handleSaveChanges - editProfile API error:", errorData);
                    throw new Error(errorData.message || 'Failed to update profile');
                }

                const data = await response.json();
                toast.success(data.message || 'Profile updated successfully!');
                console.log("Settings.js: handleSaveChanges - editProfile API success data:", data);

                dispatch(setUserDetails(data.data));

                navigate('/profile');
            } else {
                toast.info('No changes to save.');
                navigate('/profile');
            }

        } catch (err) {
            console.error('Settings.js: handleSaveChanges - Error updating profile:', err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-16 p-8 m-5 space-y-6 bg-white rounded-md shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture:</label>
                <div className="relative w-24 h-24 rounded-full mx-auto overflow-hidden bg-gray-200 border-2 border-gray-300 mb-2 flex items-center justify-center">
                    {newlyUploadedPic ? (
                        <img
                            src={newlyUploadedPic}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : profilePic ? (
                        <img
                            src={profilePic}
                            alt="Current Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FaUserCircle size={48} className="text-gray-500" />
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPic}
                    className="w-full p-2 border rounded-lg text-sm"
                />
                {uploadingImage && <p className="text-gray-500 text-xs mt-1">Uploading...</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                    type="text"
                    id="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="tag" className="block text-gray-700 text-sm font-bold mb-2">Tag:</label>
                <input
                    type="text"
                    id="tag"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-not-allowed"
                    value={state?.email || ''}
                    readOnly
                />
                <span className="text-gray-500 text-sm">change your email <button onClick={() => navigate('/reset')} className="text-blue-500 hover:underline focus:outline-none">here</button>.</span>
            </div>

            <div className="mb-4">
                <label htmlFor="telegramNumber" className="block text-gray-700 text-sm font-bold mb-2">Telegram:</label>
                <input
                    type="text"
                    id="telegramNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-not-allowed"
                    value={state?.telegramNumber || ''}
                    readOnly
                />
                <span className="text-gray-500 text-sm">change your Telegram number <button onClick={() => navigate('/reset')} className="text-blue-500 hover:underline focus:outline-none">here</button>.</span>
            </div>
            <div className="border-t pt-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2"></h3>
                <button
                    onClick={() => navigate('/reset')}
                    className="text-red-500 hover:underline focus:outline-none text-sm"
                >
                   reset password
                </button>
            </div>

            <div className="flex items-center justify-end">
                <button
                    onClick={() => navigate('/profile')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSaveChanges}
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading || uploadingImage ? 'cursor-not-allowed' : ''}`}
                    disabled={loading || uploadingImage}
                >
                    {loading || uploadingImage ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default Settings;