'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Pencil, Sparkles, File, FolderKanban, Upload, X, Check, Mail, Lock, Crown, Shield, Camera, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import { ErrorToast, SuccessToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import Image from 'next/image';


function UserProfilePage() {
  const { data: user, isLoading, refetch } = useUser();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const router = useRouter();

  // Initialize newName when user data is loaded
  useEffect(() => {
    if (user?.fullName) {
      setNewName(user.fullName);
    }
  }, [user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
<Loader/>
      </div>
    );
  }

  // Show error state if no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load profile</h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/avatar`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      const parsedResp = await res.json();
      if (!res.ok) {
        ErrorToast(parsedResp.message || "Failed to update avatar.");
      } else {
        SuccessToast(parsedResp.message || "Avatar updated!");
        refetch();
        setShowImageUpload(false);
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An error occurred while uploading your avatar.");
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update-email/request`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email: newEmail }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const parsedResp = await res.json();
      if (!res.ok) {
        ErrorToast(parsedResp.message || "Failed to send OTP.");
      } else {
        SuccessToast(parsedResp.message || "OTP sent!");
        setOtpSent(true);
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An error occurred while sending OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update-email/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newEmail, otp })
      });

      const parsedResp = await res.json();
      if (!res.ok) {
        ErrorToast(parsedResp.message || "Failed to verify OTP.");
      } else {
        SuccessToast(parsedResp.message || "Email updated!");
        setOtpSent(false);
        setOtp('');
        setNewEmail('');
        setEditingEmail(false);
        refetch();
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An error occurred while verifying OTP.");
    }
  };

  const handleRequestPasswordOtp = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update-password/request`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email: user.email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const parsedResp = await res.json();
      if (!res.ok) {
        ErrorToast(parsedResp.message || "Failed to send password reset OTP.");
      } else {
        SuccessToast(parsedResp.message || "Password reset OTP sent!");
        setOtpSent(true);
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An error occurred while sending password reset OTP.");
    }
  };

  const handleVerifyPasswordOtp = async () => {
    if (newPassword !== confirmPassword) {
      ErrorToast("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update-password/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: user.email, otp, newPassword })
      });

      const parsedResp = await res.json();
      if (!res.ok) {
        ErrorToast(parsedResp.message || "Failed to verify OTP or update password.");
      } else {
        SuccessToast(parsedResp.message || "Password updated successfully!");
        setOtpSent(false);
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setEditingPassword(false);
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An error occurred while updating password.");
    }
  };

  const handleSaveName = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/full-name`, {
        credentials: 'include',
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: newName })
      });

      const parsedResp = await res.json();
      if (!res.ok) {
        ErrorToast(parsedResp.message || "Failed to update name.");
      } else {
        refetch();
        setEditingName(false);
        SuccessToast(parsedResp.message || "Name updated!");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An error occurred while saving your name.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <button onClick={() => router.push("/dashboard")} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 gap-4 p-1 rounded-full">
          {[
            { id: 'profile', label: 'Profile', icon: Shield },
            { id: 'settings', label: 'Settings', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center rounded-full gap-2 px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-[#141414]'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-[#000000] rounded-4xl border border-[#171717] p-8">
              <div className="flex items-center gap-6">
                <div className="relative group" style={{ height: '80px', width: '80px', minHeight: '80px', minWidth: '80px' }}>
                  <Image
                    src={user.avatar && user.avatar.trim() !== "" ? user.avatar : "/default-user-avatar.svg"}
                    alt="avatar"
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-gray-700 object-cover"
                    priority
                  />
                  <button
                    onClick={() => setShowImageUpload(true)}
                    className="absolute inset-0 rounded-full bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    title="Change Avatar"
                  >
                    <Camera size={20} />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {editingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="bg-[#000000] border border-gray-700 rounded-lg px-3 py-2 text-lg font-medium focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveName}
                          className="p-2 text-green-400 bg-green-400/20 rounded-lg transition-colors"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h1 className="text-4xl tracking-tight font-medium">{user.fullName}</h1>
                        <button
                          onClick={() => setEditingName(true)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                          title="Edit Name"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400">{user.email}</p>
                    {user.isVerified && (
                      <div className="flex items-center gap-1 text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">
                        <Check size={12} />
                        Verified
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-[#000000] p-6 rounded-4xl border border-[#171717]">
              <h2 className="text-lg font-semibold mb-6">Account Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Plan</span>
                  <div className="flex items-center gap-3">
        <span className="text-sm capitalize rounded-full backdrop-blur-2xl px-4 py-1.5 text-white font-semibold flex items-center gap-1 group relative overflow-hidden">
          <div className="absolute inset-0 -z-30 bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] blur-[0px]"></div>
          <Sparkles size={14} className="text-white relative z-10" />
          <span className="relative z-10">{user.plan}</span>
        </span>

            
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Subscription</span>
                  <span className="text-sm capitalize rounded-full bg-green-500/20 text-green-400 px-3 py-1">{user.subscriptionStatus}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-sm">{new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-medium tracking-tight">Usage Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Sparkles, label: 'Tokens Used', value: user.usage?.tokensUsed || 0, color: 'purple' },
                  { icon: File, label: 'Files Uploaded', value: user.usage?.filesUploaded || 0, color: 'blue' },
                  { icon: FolderKanban, label: 'Projects Created', value: user.usage?.projectsCreated || 0, color: 'green' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-[#000000] p-6 rounded-4xl border border-[#171717] hover:border-gray-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          item.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                          item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                          <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium tracking-tight">Account Settings</h2>
            
            {/* Email Settings */}
            <div className="bg-[#000000] rounded-4xl p-6 border border-[#171717]">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-blue-400" size={20} />
                <h3 className="text-lg font-semibold">Email Settings</h3>
              </div>
              
              {!editingEmail ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setEditingEmail(true)}
                    className="px-4 py-2 bg-[#0f0f0f] hover:bg-[#1e1e1e] border border-[#252525] rounded-full transition-colors"
                  >
                    Change Email
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!otpSent ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">New Email Address</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full bg-[#000000] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                          placeholder="Enter new email address"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSendOtp}
                          disabled={!newEmail}
                          className="px-4 py-2 bg-white text-black font-medium hover:bg-[#d6d6d6] disabled:bg-[#a0a0a0] disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          Send OTP
                        </button>
                        <button
                          onClick={() => {
                            setEditingEmail(false);
                            setNewEmail('');
                          }}
                          className="px-4 py-2 bg-[#000000] border border-[#1f1f1f] rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Enter OTP sent to {newEmail}
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-[#000000] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleVerifyOtp}
                          disabled={otp.length !== 6}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          Verify & Update
                        </button>
                        <button
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                          }}
                          className="px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Password Settings */}
            <div className="bg-[#000000] p-6 rounded-4xl border border-[#171717]">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-red-400" size={20} />
                <h3 className="text-lg font-semibold">Password Settings</h3>
              </div>
              
              {!editingPassword ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Password</p>
                    <p className="font-medium">••••••••••••</p>
                  </div>
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-400/30 rounded-lg transition-colors"
                  >
                    Reset Password
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!otpSent ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Current Email</label>
                        <p className="w-full bg-[#000000] border border-gray-700 rounded-lg px-4 py-3 text-gray-400">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleRequestPasswordOtp}
                          className="px-4 py-2 bg-white text-black font-medium hover:bg-[#d6d6d6] rounded-lg transition-colors"
                        >
                          Send OTP
                        </button>
                        <button
                          onClick={() => {
                            setEditingPassword(false);
                          }}
                          className="px-4 py-2 bg-[#000000] border border-[#1f1f1f] rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Enter OTP sent to {user.email}
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-[#000000] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#000000] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-[#000000] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleVerifyPasswordOtp}
                          disabled={otp.length !== 6 || !newPassword || !confirmPassword}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          Verify & Update
                        </button>
                        <button
                          onClick={handleRequestPasswordOtp}
                          className="px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Change Profile Picture</h3>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-4 text-gray-400" size={40} />
                <p className="text-gray-400 mb-4">Drop your image here or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors inline-block"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;