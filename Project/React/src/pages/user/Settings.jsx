
import { useState } from 'react';
import Footer from '../../component/layouts/Footer';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deleteUserbyId, updateUser } from '../../services/authService';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import axios from '../../services/axios';

export const Settings = () => {

    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [mobileData, setMobileData] = useState({
        newMobile: user?.mobile || ''
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || '',
        mobile: user?.mobile || '',
        profilePhoto: user?.profilePhoto || '',
    });


    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);
        setIsPhotoRemoved(false);

        // temporary preview only
        const previewUrl = URL.createObjectURL(file);

        setPreviewImage(previewUrl);
    };

    const handleRemovePhoto = (e) => {
        e.preventDefault();

        toast((t) => (
            <div className="bg-slate-100 rounded-2xl border border-slate-100 overflow-hidden">

                {/* Top */}
                <div className=" flex items-start ">

                    <div className="w-10 h-10 m-2 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl shrink-0">
                        🗑️
                    </div>

                    <div className="flex-1">

                        <h3 className=" mt-4 text-base font-black text-slate-900">
                            Remove Profile Photo
                        </h3>

                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                            Your profile will switch back to the default avatar.
                        </p>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="px-5 py-4 bg-slate-100   flex justify-end gap-3">

                    <button
                        onClick={() => toast.dismiss(t._id)}
                        className=" rounded-xl px-4 bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {

                            setPreviewImage(null);

                            setSelectedFile(null);

                            setIsPhotoRemoved(true);

                            setProfileData({
                                ...profileData,
                                profilePhoto: ''
                            });

                            toast.dismiss(t.id);

                            toast.success("Profile photo removed");
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition shadow-lg shadow-rose-200 cursor-pointer"
                    >
                        Remove
                    </button>

                </div>
            </div>
        ), {
            duration: Infinity,
            position: "top-center",

            style: {
                background: "transparent",
                boxShadow: "none",
                padding: 0,
            },
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = profileData.profilePhoto || '';

            // upload image if selected
            if (selectedFile) {
                const formData = new FormData();

                formData.append("image", selectedFile);

                const uploadRes = await axios.post(
                    "/upload/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                imageUrl = uploadRes.data.imageUrl;
            }

            const updatedData = {
                fullname: profileData.fullname,
                mobile: profileData.mobile,
                profilePhoto: imageUrl,
            };

            const res = await updateUser(updatedData);

            setUser(res.user);
            setIsPhotoRemoved(false);
            setPreviewImage(null);

            toast.success("Profile updated successfully ✨");

        } catch (err) {
            toast.error(err.message || "Update failed ❌");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });

            toast.error("Passwords do not match ❌");

            return;
        }

        try {
            await updateUser({
                password: passwordData.newPassword,
                currentPassword: passwordData.currentPassword
            });

            setMessage({ type: 'success', text: 'Password updated successfully!' });

            toast.success("Password updated successfully 🔒");

            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

        } catch (err) {
            setMessage({ type: 'error', text: err.message });

            toast.error(err.message || "Something went wrong ❌");
        }
    };

    const handleMobileChange = async (e) => {
        e.preventDefault();

        try {
            await updateUser({ mobile: mobileData.newMobile });

            // ✅ update UI instantly
            setUser(prev => ({
                ...prev,
                mobile: mobileData.newMobile
            }));
            toast.success("Mobile updated successfully 📱");
        } catch (err) {
            toast.error(err.message || "Something went wrong ❌");
        }
    };
    const handleDeleteAccount = async () => {

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        setIsDeleting(true);

        try {
            await deleteUserbyId(user._id);

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Your account has been deleted.',
                timer: 2000,
                showConfirmButton: false
            });

            logout();
            navigate('/');

        } catch (err) {
            setMessage({ type: 'error', text: err.message });

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to delete account',
            });

            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">

            <main className="flex-grow py-12 px-4 md:px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Profile Settings</h1>
                        <p className="text-slate-500 font-medium">Manage your profile, security, contact information, and account status.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


                        <div className="lg:col-span-1">

                            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 lg:sticky lg:top-24">

                                <form
                                    onSubmit={handleProfileUpdate}
                                    className="space-y-6"
                                >

                                    {/* Profile Photo */}
                                    <div className="flex flex-col items-center text-center">

                                        <label className="relative group cursor-pointer select-none">

                                            {!isPhotoRemoved && (previewImage || user?.profilePhoto) ? (
                                                <img
                                                    src={previewImage || user?.profilePhoto}
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-lg cursor-pointer"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-5xl font-black shadow-lg cursor-pointer">
                                                    {user?.fullname?.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold">
                                                Change
                                            </div>

                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>

                                        {!isPhotoRemoved && (previewImage || user?.profilePhoto) && (
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                className="mt-3 text-xs font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                                            >
                                                Remove Photo
                                            </button>
                                        )}

                                        <h2 className="text-2xl font-black text-slate-900 mt-5">
                                            {user?.fullname}
                                        </h2>

                                        <span className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                                            {user?.role}
                                        </span>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            value={profileData?.fullname}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    fullname: e.target.value
                                                })
                                            }
                                            className="w-full px-5 py-4 border text-black border-slate-300 rounded-2xl outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={user?.email}
                                            disabled
                                            className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Account ID */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Account ID
                                        </label>

                                        <div className="w-full px-4 py-3 bg-slate-50 rounded-2xl text-xs text-slate-400 break-all font-mono">
                                            {user?._id}
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-100"
                                    >
                                        Save Profile
                                    </button>

                                </form>
                            </div>
                        </div>

                        {/* Right Column: Forms */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Change Password */}
                            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-xl">🔒</div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Security</h2>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update your password</p>
                                    </div>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full px-6 py-4 bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full px-6 py-4 bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full px-6 py-4 bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:scale-[1.03] active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-100">
                                        Update Password
                                    </button>
                                </form>
                            </section>

                            {/* Change Mobile */}
                            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-xl">📱</div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Contact Info</h2>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update your mobile number</p>
                                    </div>
                                </div>

                                <form onSubmit={handleMobileChange} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={mobileData.newMobile}
                                            onChange={(e) => setMobileData({ ...mobileData, newMobile: e.target.value })}
                                            className="w-full px-6 py-4 bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-sm"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <button type="submit" className="w-full md:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                        Update Mobile
                                    </button>
                                </form>
                            </section>

                            {/* Danger Zone */}
                            <section className="bg-rose-50 rounded-[32px] p-8 border border-rose-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 text-xl">⚠️</div>
                                    <div>
                                        <h2 className="text-xl font-black text-rose-900 tracking-tight">Danger</h2>
                                        <p className="text-xs text-rose-400 font-bold uppercase tracking-widest">Irreversible actions</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-2xl border border-rose-200">
                                    <div>
                                        <p className="font-bold text-slate-800">Delete Account</p>
                                        <p className="text-sm text-slate-500">Permanently remove your account and all associated data.</p>
                                    </div>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                        className="w-full md:w-auto px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-rose-200 disabled:opacity-50"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {user?.role !== "ADMIN" && <Footer />}
        </div>
    );
};


