import { useEffect, useState } from 'react';
import API from './api';

function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await API.get('/ideas');
        setIdeas(res.data);
      } catch (error) {
        console.error('Failed to load ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  if (loading) {
    return <p>Loading business ideas...</p>;
  }

  return (
    <div style={{ padding: '40px' }}>
      <h2>Business Ideas</h2>

      {ideas.length === 0 ? (
        <p>No business ideas found.</p>
      ) : (
        ideas.map((idea) => (
          <div
            key={idea._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px'
            }}
          >
            <h3>{idea.title}</h3>
            <p><strong>Description:</strong> {idea.description}</p>
            <p><strong>Category:</strong> {idea.category}</p>
            <p><strong>Estimated Cost:</strong> {idea.estimatedCost}</p>
            <p><strong>Profit Potential:</strong> {idea.profitPotential}</p>
            <p><strong>Time to Start:</strong> {idea.timeToStart}</p>
            <p><strong>Skills:</strong> {idea.requiredSkills.join(', ')}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Ideas;