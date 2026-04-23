import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [interests, setInterests] = useState(user?.interests?.join(', ') || '');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    toast.success('Profile updated successfully!');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>EntreSkill Hub</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </nav>

      <div style={styles.content}>
        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 style={styles.userName}>{user?.name}</h2>
            <span style={styles.roleBadge}>{user?.role}</span>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.infoItem}>
              <label style={styles.label}>Email</label>
              <p style={styles.infoValue}>{user?.email}</p>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.label}>Your Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                style={styles.input}
                placeholder="e.g. tailoring, cooking, coding"
              />
              <small style={styles.hint}>Separate skills with commas</small>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.label}>Your Interests</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                style={styles.input}
                placeholder="e.g. fashion, food, technology"
              />
              <small style={styles.hint}>Separate interests with commas</small>
            </div>

            <button onClick={handleSave} style={styles.saveBtn}>
              Save Profile
            </button>
          </div>
        </div>

        <div style={styles.actionsCard}>
          <h3 style={styles.actionsTitle}>Quick Actions</h3>
          <div style={styles.actionButtons}>
            <button onClick={() => navigate('/ideas')} style={styles.actionBtn}>
              💡 Browse Ideas
            </button>
            <button onClick={() => navigate('/mentors')} style={styles.actionBtn}>
              👨‍🏫 Find Mentors
            </button>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f5f7fa' },
  navbar: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { color: '#667eea', margin: 0, fontSize: '22px' },
  backBtn: { background: 'none', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', color: '#555' },
  content: { maxWidth: '700px', margin: '0 auto', padding: '32px 24px' },
  profileCard: { background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '24px' },
  avatarSection: { textAlign: 'center', marginBottom: '32px' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  userName: { color: '#333', margin: '0 0 8px', fontSize: '22px' },
  roleBadge: { background: '#f0f0ff', color: '#667eea', padding: '4px 16px', borderRadius: '20px', fontSize: '13px', textTransform: 'capitalize' },
  infoSection: { display: 'flex', flexDirection: 'column', gap: '20px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#555', fontSize: '14px', fontWeight: '600' },
  infoValue: { color: '#333', margin: 0, fontSize: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
  hint: { color: '#aaa', fontSize: '12px' },
  saveBtn: { padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  actionsCard: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  actionsTitle: { color: '#333', margin: '0 0 16px', fontSize: '16px' },
  actionButtons: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  actionBtn: { padding: '12px 20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#555' },
  logoutBtn: { padding: '12px 20px', background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#e74c3c' }
};

export default Profile;