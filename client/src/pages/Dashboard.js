import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ideasAPI, progressAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ideasRes, progressRes] = await Promise.all([
        ideasAPI.getAll(),
        progressAPI.getAll()
      ]);
      setIdeas(ideasRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>EntreSkill Hub</h1>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/ideas')} style={styles.navBtn}>Ideas</button>
          <button onClick={() => navigate('/mentors')} style={styles.navBtn}>Mentors</button>
          <button onClick={() => navigate('/profile')} style={styles.navBtn}>Profile</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.welcome}>
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>Continue your entrepreneurship journey</p>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{ideas.length}</h3>
            <p style={styles.statLabel}>Business Ideas</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{progress.length}</h3>
            <p style={styles.statLabel}>In Progress</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>
              {progress.filter(p => p.status === 'completed').length}
            </h3>
            <p style={styles.statLabel}>Completed</p>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recommended Business Ideas</h3>
          <div style={styles.ideasGrid}>
            {ideas.slice(0, 3).map((idea) => (
              <div key={idea._id} style={styles.ideaCard}>
                <h4 style={styles.ideaTitle}>{idea.title}</h4>
                <p style={styles.ideaDesc}>{idea.description.substring(0, 100)}...</p>
                <div style={styles.ideaTags}>
                  {idea.requiredSkills?.slice(0, 3).map((skill, i) => (
                    <span key={i} style={styles.tag}>{skill}</span>
                  ))}
                </div>
                <div style={styles.ideaFooter}>
                  <span style={styles.cost}>{idea.estimatedCost}</span>
                  <button
                    onClick={() => navigate(`/roadmap/${idea._id}`)}
                    style={styles.viewBtn}
                  >
                    View Roadmap
                  </button>
                </div>
              </div>
            ))}
          </div>
          {ideas.length > 3 && (
            <button onClick={() => navigate('/ideas')} style={styles.seeAllBtn}>
              See All Ideas →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f5f7fa' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' },
  navbar: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { color: '#667eea', margin: 0, fontSize: '22px' },
  navLinks: { display: 'flex', gap: '12px', alignItems: 'center' },
  navBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '15px', padding: '8px 12px', borderRadius: '6px' },
  logoutBtn: { background: '#ff4757', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  welcome: { marginBottom: '32px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: { background: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  statNumber: { fontSize: '36px', color: '#667eea', margin: '0 0 8px' },
  statLabel: { color: '#888', margin: 0, fontSize: '14px' },
  section: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  sectionTitle: { color: '#333', marginBottom: '20px', fontSize: '18px' },
  ideasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  ideaCard: { border: '1px solid #eee', borderRadius: '10px', padding: '20px' },
  ideaTitle: { color: '#333', margin: '0 0 8px', fontSize: '16px' },
  ideaDesc: { color: '#666', fontSize: '14px', lineHeight: '1.5', margin: '0 0 12px' },
  ideaTags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  tag: { background: '#f0f0ff', color: '#667eea', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  ideaFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cost: { color: '#888', fontSize: '13px' },
  viewBtn: { background: '#667eea', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  seeAllBtn: { marginTop: '16px', background: 'none', border: '1px solid #667eea', color: '#667eea', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }
};

export default Dashboard;