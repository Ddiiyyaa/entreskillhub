import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Mentors.css";

const API = process.env.REACT_APP_API_URL || "https://entreskillhub.onrender.com";

const EXPERTISE_OPTIONS = [
  "All",
  "E-Commerce",
  "SaaS",
  "Food Business",
  "Fundraising",
  "Fashion & Lifestyle",
  "Digital Marketing",
  "Product Management",
  "Fintech",
];

// ─── Mentor Card Component ───────────────────────────────────────────────────

const MentorCard = ({ mentor }) => {
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mentor-card">
      {mentor.isFeatured && <span className="featured-badge">⭐ Featured</span>}

      <div className="mentor-avatar-wrap">
        {mentor.avatar ? (
          <img src={mentor.avatar} alt={mentor.name} className="mentor-avatar" />
        ) : (
          <div className="mentor-avatar-placeholder">{initials}</div>
        )}
        <span className={`availability-dot ${mentor.availability}`} title={mentor.availability} />
      </div>

      <h3 className="mentor-name">{mentor.name}</h3>
      <p className="mentor-industry">{mentor.industry}</p>
      <p className="mentor-experience">{mentor.experience}</p>
      <p className="mentor-bio">{mentor.bio?.slice(0, 120)}...</p>

      <div className="mentor-tags">
        {mentor.expertise?.slice(0, 3).map((tag) => (
          <span key={tag} className="mentor-tag">{tag}</span>
        ))}
      </div>

      <div className="mentor-footer">
        <div className="mentor-rating">
          {"★".repeat(Math.round(mentor.rating))}
          <span> {mentor.rating} ({mentor.totalReviews})</span>
        </div>
        <div className="mentor-price">
          {mentor.sessionPrice === 0 ? (
            <span className="free-badge">Free Session</span>
          ) : (
            <span>₹{mentor.sessionPrice}/hr</span>
          )}
        </div>
      </div>

      {mentor.linkedIn && (
        <a href={mentor.linkedIn} target="_blank" rel="noreferrer" className="connect-btn">
          Connect on LinkedIn
        </a>
      )}
    </div>
  );
};

// ─── Main Page Component ─────────────────────────────────────────────────────

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");
  const [availability, setAvailability] = useState("");

  // Re-fetch from API whenever expertise or availability filter changes
  useEffect(() => {
    fetchMentors();
  }, [selectedExpertise, availability]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (selectedExpertise !== "All") params.expertise = selectedExpertise;
      if (availability) params.availability = availability;

      const { data } = await axios.get(`${API}/api/mentors`, { params });
      setMentors(data);
    } catch (err) {
      console.error("Mentors fetch error:", err);
      setError("Failed to load mentors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search is done client-side on the already-fetched list (no API call needed)
  const filtered = mentors.filter((m) =>
    search
      ? m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.bio?.toLowerCase().includes(search.toLowerCase()) ||
        m.expertise?.some((e) => e.toLowerCase().includes(search.toLowerCase()))
      : true
  );

  return (
    <div className="mentors-page">
      {/* Header */}
      <div className="mentors-header">
        <h1>Find Your Mentor</h1>
        <p>Connect with experienced entrepreneurs who've built what you're dreaming of.</p>
      </div>

      {/* Filters */}
      <div className="mentors-filters">
        <input
          type="text"
          placeholder="Search by name, skill, or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="filter-chips">
          {EXPERTISE_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`chip ${selectedExpertise === opt ? "active" : ""}`}
              onClick={() => setSelectedExpertise(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="avail-select"
        >
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      {/* Content States */}
      {loading ? (
        <div className="mentors-loading">
          <div className="spinner" />
          <p>Loading mentors...</p>
        </div>
      ) : error ? (
        <div className="mentors-error">
          <p>{error}</p>
          <button onClick={fetchMentors}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mentors-empty">
          <p>No mentors found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <p className="mentors-count">
            {filtered.length} mentor{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="mentors-grid">
            {filtered.map((mentor) => (
              <MentorCard key={mentor._id} mentor={mentor} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Mentors;