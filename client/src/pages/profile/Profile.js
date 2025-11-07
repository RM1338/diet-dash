import React, { useState, useEffect } from 'react';
import { gamificationAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StarIcon, TrophyIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user, updateUser, triggerBadgeRefresh } = useAuth();
  const [badges, setBadges] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.profile?.avatar || '🧑'
  });

  const avatars = ['🧑', '👦', '👧', '🧒', '👨', '👩', '🧑‍🎓', '👨‍🎓', '👩‍🎓'];

  useEffect(() => {
    if (user && user._id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      if (!user || !user._id) {
        console.error('No valid user ID found');
        setLoading(false);
        return;
      }

      const userId = user._id;
      
      try {
        const badgesResponse = await gamificationAPI.getUserBadges(userId);
        setBadges(badgesResponse.data.data || []);
        
        // FIXED: Trigger refresh in Dashboard after fetching badges
        triggerBadgeRefresh();
      } catch (badgeError) {
        console.error('Error fetching badges:', badgeError);
        setBadges([]);
      }

      try {
        const progressResponse = await gamificationAPI.getUserProgress(userId);
        setProgress(progressResponse.data.data || null);
      } catch (progressError) {
        console.error('Error fetching progress:', progressError);
        setProgress(null);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSaving(true);

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        profile: {
          avatar: formData.avatar
        }
      };

      console.log('Updating profile with:', updateData);

      const response = await userAPI.updateProfile(updateData);
      
      console.log('Profile update response:', response.data);

      if (response.data && response.data.user) {
        updateUser(response.data.user);
        setSuccessMessage('Profile updated successfully! ✓');
        
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMessage('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-readable">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
      {/* Profile Header */}
      <div className="glass-card p-8 mb-8 stagger-item">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-7xl">{user.profile?.avatar || '🧑'}</div>
            <div>
              <h1 className="text-4xl font-bold text-readable mb-2">
                {user.username}
              </h1>
              <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setError('');
              setSuccessMessage('');
            }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="glass-card p-8 mb-8 stagger-item">
          <h2 className="text-2xl font-bold text-readable mb-6">Edit Profile</h2>
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-readable mb-2">
                Choose Your Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, avatar });
                      setError('');
                      setSuccessMessage('');
                    }}
                    className={`text-3xl p-3 rounded-xl transition-all duration-300 ${
                      formData.avatar === avatar
                        ? 'bg-primary bg-opacity-20 ring-2 ring-primary scale-110'
                        : 'glass hover:bg-surface'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-readable mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl glass-strong border border-border focus:outline-none focus:border-primary transition-colors text-readable"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-readable mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl glass-strong border border-border focus:outline-none focus:border-primary transition-colors text-readable"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 stagger-item">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <StarIcon className="w-12 h-12 text-yellow-500" />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Total Points
            </p>
            <p className="text-3xl font-bold text-primary mt-2">
              {user.gamification?.totalPoints || 0}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 stagger-item">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <TrophyIcon className="w-12 h-12 text-accent" />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Current Level
            </p>
            <p className="text-3xl font-bold text-accent mt-2">
              Level {user.gamification?.level || 1}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 stagger-item">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <ShieldCheckIcon className="w-12 h-12 text-secondary" />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Badges Earned
            </p>
            <p className="text-3xl font-bold text-secondary mt-2">
              {badges.filter(b => b.isUnlocked).length}
            </p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="glass-card p-8 stagger-item">
        <h2 className="text-2xl font-bold text-readable mb-6">Your Badges</h2>
        
        {badges.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <ShieldCheckIcon className="w-20 h-20 text-gray-400" />
            </div>
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              No badges yet. Start playing games to earn badges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((badge, index) => (
              <div
                key={badge._id || index}
                className={`glass-card p-6 text-center transition-all duration-300 ${
                  badge.isUnlocked ? 'hover:scale-105' : 'opacity-50'
                }`}
              >
                <div className="text-5xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-readable mb-1">{badge.name}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {badge.description}
                </p>
                {badge.isUnlocked && (
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold">
                      Unlocked ✓
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;