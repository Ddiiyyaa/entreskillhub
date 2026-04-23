import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { roadmapAPI, progressAPI, ideasAPI } from '../utils/api';

const RoadmapPage = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [idea, setIdea] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    fetchData();
  }, [ideaId]);

  const fetchData = async () => {
    try {
      const [roadmapRes, ideaRes, progressRes] = await Promise.all([
        roadmapAPI.getByIdeaId(ideaId),
        ideasAPI.getById(ideaId),
        progressAPI.getAll()
      ]);
      setRoadmap(roadmapRes.data);
      setIdea(ideaRes.data);
      const existingProgress = progressRes.data.find(
        p => p.businessIdea._id === ideaId
      );
      if (existingProgress) {
        setProgress(existingProgress);
        setCompletedSteps(existingProgress.completedSteps || []);
      }
    } catch (error) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRoadmap = async () => {
    try {
      const res = await progressAPI.start({
        businessIdeaId: ideaId,
        roadmapId: roadmap._id
      });
      setProgress(res.data.progress);
      toast.success('Roadmap started! Good luck! 🚀');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start roadmap');
    }
  };

  const handleStepComplete = async (stepNumber) => {
    const updated = completedSteps.includes(stepNumber)
      ? completedSteps.filter(s => s !== stepNumber)
      : [...completedSteps, stepNumber];

    setCompletedSteps(updated);

    if (progress) {
      try {
        const allSteps = roadmap.steps.map(s => s.stepNumber);
        const status = updated.length === allSteps.length ? 'completed' : 'in_progress';
        await progressAPI.update(progress._id, {
          completedSteps: updated,
          status
        });
        if (status === 'completed') {
          toast.success('Congratulations! You completed the roadmap! 🎉');
        }
      } catch (error) {
        toast.error('Failed to update progress');
      }
    }
  };

  if (loading) return <div style={styles.loading}>Loading roadmap...</div>;
  if (!roadmap) return <div style={styles.loading}>No roadmap found for this idea yet.</div>;

  const progressPercent = roadmap.steps.length > 0
    ? Math.round((completedSteps.length / roadmap.steps.length) * 100)
    : 0;

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>EntreSkill Hub</h1>
        <button onClick={() => navigate('/ideas')} style={styles.backBtn}>
          ← Back to Ideas
        </button>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.ideaTitle}>{idea?.title}</h2>
          <p style={styles.ideaDesc}>{idea?.description}</p>
          <div style={styles.ideaMeta}>
            <span>💰 {idea?.estimatedCost}</span>
            <span>⏱ {idea?.timeToStart}</span>
            <span>📈 {idea?.profitPotential} profit</span>
          </div>
        </div>

        <div style={styles.roadmapCard}>
          <div style={styles.roadmapHeader}>
            <div>
              <h3 style={styles.roadmapTitle}>{roadmap.title}</h3>
              <p style={styles.roadmapOverview}>{roadmap.overview}</p>
            </div>
            <div style={styles.roadmapMeta}>
              <span style={styles.badge}>{roadmap.difficulty}</span>
              <span style={styles.duration}>⏱ {roadmap.totalDuration}</span>
            </div>
          </div>

          {progress && (
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {!progress && (
            <button onClick={handleStartRoadmap} style={styles.startBtn}>
              🚀 Start This Roadmap
            </button>
          )}

          <div style={styles.steps}>
            {roadmap.steps.map((step) => (
              <div key={step.stepNumber} style={{
                ...styles.stepCard,
                borderLeft: completedSteps.includes(step.stepNumber)
                  ? '4px solid #2ecc71'
                  : '4px solid #667eea'
              }}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepLeft}>
                    <span style={styles.stepNumber}>Step {step.stepNumber}</span>
                    <h4 style={styles.stepTitle}>{step.title}</h4>
                  </div>
                  {progress && (
                    <input
                      type="checkbox"
                      checked={completedSteps.includes(step.stepNumber)}
                      onChange={() => handleStepComplete(step.stepNumber)}
                      style={styles.checkbox}
                    />
                  )}
                </div>
                <p style={styles.stepDesc}>{step.description}</p>
                <div style={styles.stepMeta}>
                  <span style={styles.stepDuration}>⏱ {step.duration}</span>
                </div>
                {step.resources?.length > 0 && (
                  <div style={styles.resources}>
                    <p style={styles.resourceTitle}>Resources:</p>
                    {step.resources.map((r, i) => (
                      <span key={i} style={styles.resource}>{r}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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
  backBtn: { background: 'none', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', color: '#555' },
  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  header: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  ideaTitle: { color: '#333', margin: '0 0 8px', fontSize: '24px' },
  ideaDesc: { color: '#666', margin: '0 0 16px', lineHeight: '1.6' },
  ideaMeta: { display: 'flex', gap: '20px', color: '#888', fontSize: '14px' },
  roadmapCard: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  roadmapHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  roadmapTitle: { color: '#333', margin: '0 0 8px', fontSize: '20px' },
  roadmapOverview: { color: '#666', margin: 0, fontSize: '14px' },
  roadmapMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  badge: { background: '#667eea', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize' },
  duration: { color: '#888', fontSize: '13px' },
  progressSection: { marginBottom: '24px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '14px', marginBottom: '8px' },
  progressBar: { height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '4px', transition: 'width 0.3s ease' },
  startBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '24px' },
  steps: { display: 'flex', flexDirection: 'column', gap: '16px' },
  stepCard: { padding: '20px', borderRadius: '8px', background: '#f9f9f9', borderLeft: '4px solid #667eea' },
  stepHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  stepLeft: { flex: 1 },
  stepNumber: { color: '#667eea', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' },
  stepTitle: { color: '#333', margin: '4px 0 0', fontSize: '16px' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  stepDesc: { color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '8px 0' },
  stepMeta: { marginBottom: '8px' },
  stepDuration: { color: '#888', fontSize: '13px' },
  resources: { marginTop: '12px' },
  resourceTitle: { color: '#555', fontSize: '13px', fontWeight: '600', margin: '0 0 6px' },
  resource: { display: 'inline-block', background: '#e8f4fd', color: '#2980b9', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', margin: '2px' }
};

export default RoadmapPage;