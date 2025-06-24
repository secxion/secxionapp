import { useState } from 'react';
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
    const [showEmailModal, setShowEmailModal] = useState(false);

    const handleUploadPic = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            toast.info("Uploading image...");
            const uploadedImage = await uploadImage(file);
            setNewlyUploadedPic(URL.createObjectURL(file));
            setProfilePic(uploadedImage.url);
            toast.success("Profile picture updated!");
        } catch (error) {
            toast.error("Failed to upload image.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setError('');

        try {
            const payload = {};
            if (name !== state?.name) payload.name = name.trim();
            if (tag !== state?.tag) payload.tag = tag.trim();
            if (telegramNumber !== state?.telegramNumber) payload.telegramNumber = telegramNumber.trim();
            if (profilePic !== state?.profilePic) payload.profilePic = profilePic;

            if (password && newPassword) {
                payload.password = password;
                payload.newPassword = newPassword;
            } else if (password || newPassword) {
                toast.error("Please fill both current and new password fields to change password.");
                setLoading(false);
                return;
            }

            if (Object.keys(payload).length === 0) {
                toast.info("No changes to save.");
                setLoading(false);
                navigate("/profile");
                return;
            }

            const response = await fetch(SummaryApi.editProfile.url, {
                method: SummaryApi.editProfile.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update profile");

            toast.success(data.message || "Profile updated!");
            dispatch(setUserDetails(data.data));
            navigate("/profile");
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
            setPassword('');
            setNewPassword('');
        }
    };

    return (
        <div className="mt-16 px-6 py-8 max-w-xl mx-auto bg-white rounded-lg shadow-lg space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">Edit Profile</h2>
            {error && <p className="text-red-600 text-center font-medium">{error}</p>}

            <div className="text-center">
                <label className="block text-gray-700 mb-2 font-medium">Profile Picture</label>
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center mb-3">
                    {newlyUploadedPic ? (
                        <img src={newlyUploadedPic} alt="Preview" className="w-full h-full object-cover" />
                    ) : profilePic ? (
                        <img src={profilePic} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                        <FaUserCircle size={56} className="text-gray-400" />
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPic}
                    className="mx-auto block w-full max-w-xs cursor-pointer text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0 file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {uploadingImage && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Tag</label>
                    <input
                        type="text"
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                        className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Email</label>
                    <input
                        type="text"
                        value={state?.email || ''}
                        readOnly
                        onClick={() => setShowEmailModal(true)}
                        className="input w-full bg-gray-100 text-gray-500 cursor-pointer border border-gray-300 rounded px-3 py-2"
                        title="Email cannot be changed here"
                    />
                    <p className="text-xs text-gray-500 mt-1 italic">Click to contact support for email change.</p>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Telegram</label>
                    <input
                        type="text"
                        value={telegramNumber}
                        onChange={e => setTelegramNumber(e.target.value)}
                        className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        autoComplete="current-password"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        autoComplete="new-password"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
                <button
                    onClick={() => navigate("/profile")}
                    disabled={loading || uploadingImage}
                    className="btn-gray px-6 py-2 rounded border text-red-600 border-gray-400 hover:bg-gray-100 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSaveChanges}
                    disabled={loading || uploadingImage}
                    className="btn-indigo px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>


            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Change Email?</h3>
                        <p className="text-gray-700 mb-6">To change your email, please contact support via the Report section.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => navigate("/report")}
                                className="px-5 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                Go to Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
