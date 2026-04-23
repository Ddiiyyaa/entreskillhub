import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mentorAPI } from '../utils/api';

const Mentors = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await mentorAPI.getAll();
      setMentors(res.data);
    } catch (error) {
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise?.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div style={styles.loading}>Loading mentors...</div>;

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>EntreSkill Hub</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </nav>

      <div style={styles.content}>
        <h2 style={styles.pageTitle}>Find a Mentor</h2>
        <p style={styles.pageSubtitle}>Connect with experienced entrepreneurs and trainers</p>

        <input
          type="text"
          placeholder="Search by name or expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {filteredMentors.length === 0 ? (
          <div style={styles.empty}>
            <h3>No mentors available yet</h3>
            <p>Check back soon — mentors are being onboarded!</p>
          </div>
        ) : (
          <div style={styles.mentorsGrid}>
            {filteredMentors.map((mentor) => (
              <div key={mentor._id} style={styles.mentorCard}>
                <div style={styles.mentorAvatar}>
                  {mentor.user?.name?.charAt(0).toUpperCase()}
                </div>
                <h3 style={styles.mentorName}>{mentor.user?.name}</h3>
                <p style={styles.mentorExp}>{mentor.experience}</p>
                <p style={styles.mentorBio}>{mentor.bio}</p>
                <div style={styles.expertiseTags}>
                  {mentor.expertise?.map((exp, i) => (
                    <span key={i} style={styles.tag}>{exp}</span>
                  ))}
                </div>
                <div style={styles.mentorFooter}>
                  <span style={styles.availability(mentor.availability)}>
                    ● {mentor.availability}
                  </span>
                  <button style={styles.connectBtn}>Connect</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f5f7fa' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' },
  navbar: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { color: '#667eea', margin: 0, fontSize: '22px' },
  backBtn: { background: 'none', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', color: '#555' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  pageTitle: { color: '#333', marginBottom: '8px', fontSize: '24px' },
  pageSubtitle: { color: '#888', marginBottom: '24px', fontSize: '15px' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', marginBottom: '24px', boxSizing: 'border-box' },
  mentorsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  mentorCard: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' },
  mentorAvatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  mentorName: { color: '#333', margin: '0 0 4px', fontSize: '18px' },
  mentorExp: { color: '#667eea', fontSize: '13px', margin: '0 0 8px', fontWeight: '600' },
  mentorBio: { color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px' },
  expertiseTags: { display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '16px' },
  tag: { background: '#f0f0ff', color: '#667eea', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  mentorFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  availability: (status) => ({
    fontSize: '12px',
    color: status === 'available' ? '#2ecc71' : status === 'busy' ? '#f39c12' : '#e74c3c'
  }),
  connectBtn: { background: '#667eea', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888' }
};

export default Mentors;