import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ideasAPI, progressAPI } from '../utils/api';

const Ideas = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await ideasAPI.getAll();
      setIdeas(res.data);
    } catch (error) {
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (ideaId) => {
    try {
      const res = await progressAPI.bookmark(ideaId);
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to bookmark');
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || idea.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(ideas.map(idea => idea.category))];

  if (loading) return <div style={styles.loading}>Loading ideas...</div>;

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>EntreSkill Hub</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </nav>

      <div style={styles.content}>
        <h2 style={styles.pageTitle}>Explore Business Ideas</h2>

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={styles.select}
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.ideasGrid}>
          {filteredIdeas.map((idea) => (
            <div key={idea._id} style={styles.ideaCard}>
              <div style={styles.cardHeader}>
                <span style={styles.category}>{idea.category}</span>
                <span style={{
                  ...styles.profitBadge,
                  background: idea.profitPotential === 'high' ? '#2ecc71' :
                    idea.profitPotential === 'medium' ? '#f39c12' : '#e74c3c'
                }}>
                  {idea.profitPotential} profit
                </span>
              </div>
              <h3 style={styles.ideaTitle}>{idea.title}</h3>
              <p style={styles.ideaDesc}>{idea.description}</p>
              <div style={styles.ideaTags}>
                {idea.requiredSkills?.map((skill, i) => (
                  <span key={i} style={styles.tag}>{skill}</span>
                ))}
              </div>
              <div style={styles.ideaInfo}>
                <span>💰 {idea.estimatedCost}</span>
                <span>⏱ {idea.timeToStart}</span>
              </div>
              <div style={styles.cardActions}>
                <button
                  onClick={() => handleBookmark(idea._id)}
                  style={styles.bookmarkBtn}
                >
                  🔖 Bookmark
                </button>
                <button
                  onClick={() => navigate(`/roadmap/${idea._id}`)}
                  style={styles.roadmapBtn}
                >
                  View Roadmap →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredIdeas.length === 0 && (
          <div style={styles.empty}>
            <p>No ideas found matching your search.</p>
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
  pageTitle: { color: '#333', marginBottom: '24px', fontSize: '24px' },
  filters: { display: 'flex', gap: '16px', marginBottom: '24px' },
  searchInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', minWidth: '180px' },
  ideasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  ideaCard: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  category: { color: '#667eea', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' },
  profitBadge: { color: 'white', fontSize: '11px', padding: '3px 8px', borderRadius: '20px' },
  ideaTitle: { color: '#333', margin: '0 0 8px', fontSize: '18px' },
  ideaDesc: { color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px' },
  ideaTags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  tag: { background: '#f0f0ff', color: '#667eea', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  ideaInfo: { display: 'flex', gap: '16px', color: '#888', fontSize: '13px', marginBottom: '16px' },
  cardActions: { display: 'flex', gap: '10px' },
  bookmarkBtn: { flex: 1, padding: '10px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  roadmapBtn: { flex: 1, padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888' }
};

export default Ideas;