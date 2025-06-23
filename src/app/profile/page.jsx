'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

function ChangePasswordBlock() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    if (newPassword !== confirmPassword) {
      setMsg('New passwords do not match.');
      return;
    }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      setMsg('Current password is incorrect.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setMsg('Failed to change password: ' + error.message);
    } else {
      setMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow mt-8">
      <h2 className="text-xl font-bold text-primary dark:text-primary-dark mb-4">Change Password</h2>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg"
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg"
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-accent dark:bg-accent-dark text-white font-bold py-3 rounded-xl transition text-lg"
      >
        {loading ? 'Changing...' : 'Change Password'}
      </button>
      {msg && (
        <div className="text-center text-lg mt-2" style={{ color: msg.includes('success') ? '#16a34a' : '#dc2626' }}>
          {msg}
        </div>
      )}
    </form>
  );
}

function SocialInput({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block font-semibold mb-1 text-text-light dark:text-text-dark">{label}</label>
      <input
        name={name}
        type="url"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg"
      />
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary dark:text-primary-dark underline text-sm mt-1 inline-block"
        >
          Visit {label}
        </a>
      )}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    codechef_url: '',
    codeforces_url: '',
    geekforgeeks_url: '',
    github_url: '',
    leetcode_url: '',
    linkedin_url: '',
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrCreateProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email);
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!profile) {
        const { data: created } = await supabase
          .from('profiles')
          .insert({ id: user.id })
          .select()
          .single();
        profile = created;
      }
      setProfile(profile);
      setForm({
        display_name: profile?.display_name || '',
        bio: profile?.bio || '',
        codechef_url: profile?.codechef_url || '',
        codeforces_url: profile?.codeforces_url || '',
        geekforgeeks_url: profile?.geekforgeeks_url || '',
        github_url: profile?.github_url || '',
        leetcode_url: profile?.leetcode_url || '',
        linkedin_url: profile?.linkedin_url || '',
      });
      setLoading(false);
    }
    fetchOrCreateProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update(form).eq('id', user.id);
    setLoading(false);
    alert('Profile updated!');
  };

  if (loading) return <div className="text-center text-gray-500 dark:text-gray-400">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-8 flex flex-col gap-8">
      <form onSubmit={handleSave} className="flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold text-primary dark:text-primary-dark mb-2">Profile</h1>
        {/* Basic Info */}
        <section>
          <h2 className="text-xl font-bold text-primary dark:text-primary-dark mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-text-light dark:text-text-dark">Name</label>
              <input
                name="display_name"
                value={form.display_name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-text-light dark:text-text-dark">Email</label>
              <input
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-lg cursor-not-allowed"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block font-semibold mb-1 text-text-light dark:text-text-dark">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg min-h-[120px]"
              rows={3}
            />
          </div>
        </section>
        {/* Social Links */}
        <section>
          <h2 className="text-xl font-bold text-primary dark:text-primary-dark mb-4">Social & Coding Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SocialInput label="Codechef" name="codechef_url" value={form.codechef_url} onChange={handleChange} placeholder="https://www.codechef.com/users/yourid" />
            <SocialInput label="Codeforces" name="codeforces_url" value={form.codeforces_url} onChange={handleChange} placeholder="https://codeforces.com/profile/yourid" />
            <SocialInput label="GeeksforGeeks" name="geekforgeeks_url" value={form.geekforgeeks_url} onChange={handleChange} placeholder="https://www.geeksforgeeks.org/user/yourid" />
            <SocialInput label="GitHub" name="github_url" value={form.github_url} onChange={handleChange} placeholder="https://github.com/yourid" />
            <SocialInput label="LeetCode" name="leetcode_url" value={form.leetcode_url} onChange={handleChange} placeholder="https://leetcode.com/yourid" />
            <SocialInput label="LinkedIn" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/yourid" />
          </div>
        </section>
        <button
          disabled={loading}
          type="submit"
          className="bg-primary dark:bg-primary-dark text-white font-bold py-3 rounded-xl transition text-xl mt-4"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
      <ChangePasswordBlock />
    </div>
  );
}
