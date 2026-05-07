import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>EntreSkill Hub</h1>
        <div style={styles.navBtns}>
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>Login</button>
          <button onClick={() => navigate('/register')} style={styles.registerBtn}>Get Started Free</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Turn Your Skills Into a Business 🚀</h1>
        <p style={styles.heroSubtitle}>
          Discover business ideas matched to your skills, follow step-by-step roadmaps,
          and connect with mentors to launch your micro-enterprise.
        </p>
        <div style={styles.heroBtns}>
          <button onClick={() => navigate('/register')} style={styles.ctaBtn}>Start Your Journey →</button>
          <button onClick={() => navigate('/login')} style={styles.secondaryBtn}>Already a member? Login</button>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}><h2 style={styles.statNum}>15+</h2><p style={styles.statLabel}>Business Ideas</p></div>
        <div style={styles.statItem}><h2 style={styles.statNum}>100%</h2><p style={styles.statLabel}>Free to Use</p></div>
        <div style={styles.statItem}><h2 style={styles.statNum}>Step-by-Step</h2><p style={styles.statLabel}>Roadmaps</p></div>
        <div style={styles.statItem}><h2 style={styles.statNum}>Expert</h2><p style={styles.statLabel}>Mentors</p></div>
      </div>

      <div style={styles.features}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Discover Ideas</h3>
            <p style={styles.featureDesc}>Tell us your skills and interests. We match you with the perfect business ideas.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🗺️</div>
            <h3 style={styles.featureTitle}>Follow Roadmap</h3>
            <p style={styles.featureDesc}>Get a detailed step-by-step roadmap covering legal, financial and marketing aspects.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📚</div>
            <h3 style={styles.featureTitle}>Learn & Grow</h3>
            <p style={styles.featureDesc}>Access curated learning resources, videos and articles for your business.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👨‍🏫</div>
            <h3 style={styles.featureTitle}>Get Mentored</h3>
            <p style={styles.featureDesc}>Connect with experienced entrepreneurs and mentors for guidance.</p>
          </div>
        </div>
      </div>

      <div style={styles.categories}>
        <h2 style={styles.sectionTitle}>Business Categories</h2>
        <div style={styles.categoryGrid}>
          {['Fashion & Clothing', 'Food & Beverage', 'Digital Services', 'Beauty & Wellness', 'Education', 'Agriculture & Farming', 'Events & Entertainment', 'Health & Wellness'].map((cat, i) => (
            <div key={i} style={styles.categoryChip}>{cat}</div>
          ))}
        </div>
      </div>

      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Business Journey?</h2>
        <p style={styles.ctaDesc}>Join thousands of aspiring entrepreneurs who are turning their skills into income.</p>
        <button onClick={() => navigate('/register')} style={styles.ctaBtn}>Create Free Account →</button>
      </div>

      <footer style={styles.footer}>
        <p>© 2026 EntreSkill Hub. Empowering grassroots entrepreneurs.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f5f7fa' },
  navbar: { background: 'white', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { color: '#667eea', margin: 0, fontSize: '22px' },
  navBtns: { display: 'flex', gap: '12px' },
  loginBtn: { background: 'none', border: '1px solid #667eea', color: '#667eea', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  registerBtn: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  hero: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '80px 48px', textAlign: 'center', color: 'white' },
  heroTitle: { fontSize: '48px', margin: '0 0 20px', fontWeight: '700' },
  heroSubtitle: { fontSize: '18px', margin: '0 0 40px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' },
  heroBtns: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtn: { background: 'white', color: '#667eea', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' },
  secondaryBtn: { background: 'transparent', color: 'white', border: '2px solid white', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'white', padding: '40px 48px', gap: '20px' },
  statItem: { textAlign: 'center' },
  statNum: { color: '#667eea', fontSize: '32px', margin: '0 0 8px', fontWeight: '700' },
  statLabel: { color: '#888', margin: 0, fontSize: '14px' },
  features: { padding: '60px 48px', maxWidth: '1100px', margin: '0 auto' },
  sectionTitle: { textAlign: 'center', color: '#333', fontSize: '32px', marginBottom: '40px' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' },
  featureCard: { background: 'white', padding: '32px 24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  featureIcon: { fontSize: '40px', marginBottom: '16px' },
  featureTitle: { color: '#333', margin: '0 0 12px', fontSize: '18px' },
  featureDesc: { color: '#666', margin: 0, fontSize: '14px', lineHeight: '1.6' },
  categories: { padding: '40px 48px', background: 'white' },
  categoryGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' },
  categoryChip: { background: '#f0f0ff', color: '#667eea', padding: '10px 20px', borderRadius: '25px', fontSize: '14px', fontWeight: '500' },
  cta: { padding: '80px 48px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' },
  ctaTitle: { fontSize: '36px', margin: '0 0 16px' },
  ctaDesc: { fontSize: '16px', margin: '0 0 32px', opacity: 0.9 },
  footer: { background: '#333', color: '#aaa', padding: '24px', textAlign: 'center', fontSize: '14px' }
};

export default Landing;