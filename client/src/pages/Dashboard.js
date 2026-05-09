import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../utils/api";
import "./AdminDashboard.css";

const CATEGORIES = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Sustainability",
  "E-Commerce",
  "Social Impact",
  "Other",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const emptyForm = {
  title: "",
  description: "",
  category: CATEGORIES[0],
  difficulty: DIFFICULTIES[0],
  tags: "",
  estimatedTime: "",
  resources: "",
};

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [stats, setStats] = useState({ total: 0, categories: {}, newest: null });

  // ── Auth Guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // ── Fetch Ideas ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (user?.role === "admin") fetchIdeas();
  }, [user]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/ideas");
      const data = res.data;
      setIdeas(data);

      // Compute quick stats
      const cats = {};
      data.forEach((idea) => {
        cats[idea.category] = (cats[idea.category] || 0) + 1;
      });
      setStats({
        total: data.length,
        categories: cats,
        newest: data[0]?.title || "—",
      });
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Form Handlers ────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      resources: form.resources
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
    };

    setSubmitting(true);
    try {
      const res = await api.post("/admin/ideas", payload);
      setIdeas((prev) => [res.data, ...prev]);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        categories: {
          ...prev.categories,
          [payload.category]: (prev.categories[payload.category] || 0) + 1,
        },
        newest: res.data.title,
      }));
      setForm(emptyForm);
      setFormSuccess(`"${res.data.title}" added successfully!`);
      setShowForm(false);
      setTimeout(() => setFormSuccess(""), 4000);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to add idea. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete Handler ────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/admin/ideas/${id}`);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete idea.");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  // ── Filtered Ideas ────────────────────────────────────────────────────────────
  const filteredIdeas = ideas.filter((idea) => {
    const matchSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      filterCategory === "All" || idea.category === filterCategory;
    return matchSearch && matchCat;
  });

  // ── Guard render ──────────────────────────────────────────────────────────────
  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-root">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <span className="admin-logo-mark">E</span>
          <div>
            <p className="admin-logo-title">EntreSkill</p>
            <p className="admin-logo-sub">Admin Console</p>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          <button className="admin-nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </button>
          <button className="admin-nav-item" onClick={() => navigate("/")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Back to Site
          </button>
        </nav>

        <div className="admin-sidebar__user">
          <div className="admin-avatar">
            {user.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div>
            <p className="admin-user-name">{user.name || "Admin"}</p>
            <p className="admin-user-role">Administrator</p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-header__title">Business Ideas</h1>
            <p className="admin-header__sub">
              Manage and curate ideas for the EntreSkill community
            </p>
          </div>
          <button
            className="admin-btn-primary"
            onClick={() => {
              setShowForm((v) => !v);
              setFormError("");
              setFormSuccess("");
            }}
          >
            {showForm ? (
              <>
                <span>✕</span> Cancel
              </>
            ) : (
              <>
                <span>+</span> New Idea
              </>
            )}
          </button>
        </header>

        {/* Global success toast */}
        {formSuccess && (
          <div className="admin-toast admin-toast--success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {formSuccess}
          </div>
        )}

        {/* ── Stats Row ── */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Total Ideas</p>
            <p className="admin-stat-card__value">{stats.total}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Categories</p>
            <p className="admin-stat-card__value">
              {Object.keys(stats.categories).length}
            </p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Latest Added</p>
            <p
              className="admin-stat-card__value admin-stat-card__value--sm"
              title={stats.newest}
            >
              {stats.newest && stats.newest.length > 20
                ? stats.newest.slice(0, 20) + "…"
                : stats.newest}
            </p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Showing</p>
            <p className="admin-stat-card__value">{filteredIdeas.length}</p>
          </div>
        </section>

        {/* ── Add Idea Form ── */}
        {showForm && (
          <section className="admin-form-card">
            <h2 className="admin-form-card__title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Add New Business Idea
            </h2>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form__row">
                <div className="admin-form__group admin-form__group--full">
                  <label>Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., AI-Powered Resume Builder"
                    required
                  />
                </div>
              </div>

              <div className="admin-form__row">
                <div className="admin-form__group admin-form__group--full">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the business idea, target market, and value proposition..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form__group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form__group">
                  <label>Estimated Time</label>
                  <input
                    name="estimatedTime"
                    value={form.estimatedTime}
                    onChange={handleChange}
                    placeholder="e.g., 3–6 months"
                  />
                </div>
              </div>

              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label>Tags (comma-separated)</label>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="AI, SaaS, B2B"
                  />
                </div>
                <div className="admin-form__group">
                  <label>Resources (comma-separated URLs)</label>
                  <input
                    name="resources"
                    value={form.resources}
                    onChange={handleChange}
                    placeholder="https://example.com, https://..."
                  />
                </div>
              </div>

              {formError && (
                <p className="admin-form__error">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {formError}
                </p>
              )}

              <div className="admin-form__actions">
                <button
                  type="button"
                  className="admin-btn-ghost"
                  onClick={() => {
                    setShowForm(false);
                    setForm(emptyForm);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="admin-spinner" />
                  ) : (
                    "Add Idea"
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ── Filters ── */}
        <section className="admin-filters">
          <div className="admin-search-wrap">
            <svg className="admin-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="admin-search"
              placeholder="Search ideas…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-filter-tabs">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                className={`admin-filter-tab ${filterCategory === cat ? "active" : ""}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
                {cat !== "All" && stats.categories[cat] ? (
                  <span className="admin-filter-badge">
                    {stats.categories[cat]}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </section>

        {/* ── Ideas Table ── */}
        <section className="admin-table-wrap">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading__spinner" />
              <p>Loading ideas…</p>
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="admin-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <p>No ideas found</p>
              <span>
                {searchTerm || filterCategory !== "All"
                  ? "Try adjusting your filters"
                  : "Add your first business idea above"}
              </span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Tags</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeas.map((idea, idx) => (
                  <tr key={idea._id} className="admin-table__row">
                    <td className="admin-table__num">{idx + 1}</td>
                    <td className="admin-table__title">
                      <p>{idea.title}</p>
                      <span className="admin-table__desc">
                        {idea.description?.slice(0, 80)}
                        {idea.description?.length > 80 ? "…" : ""}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge--cat`}>
                        {idea.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--diff admin-badge--${idea.difficulty?.toLowerCase()}`}
                      >
                        {idea.difficulty}
                      </span>
                    </td>
                    <td className="admin-table__tags">
                      {Array.isArray(idea.tags) && idea.tags.length > 0
                        ? idea.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="admin-tag">
                              {tag}
                            </span>
                          ))
                        : "—"}
                    </td>
                    <td className="admin-table__date">
                      {idea.createdAt
                        ? new Date(idea.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="admin-btn-delete"
                        onClick={() => setConfirmDelete(idea._id)}
                        disabled={deletingId === idea._id}
                        title="Delete idea"
                      >
                        {deletingId === idea._id ? (
                          <span className="admin-spinner admin-spinner--sm" />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {/* ── Delete Confirm Modal ── */}
      {confirmDelete && (
        <div
          className="admin-modal-overlay"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3>Delete this idea?</h3>
            <p>
              This action is permanent and cannot be undone. The idea will be
              removed for all users.
            </p>
            <div className="admin-modal__actions">
              <button
                className="admin-btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn-danger"
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
              >
                {deletingId === confirmDelete ? (
                  <span className="admin-spinner admin-spinner--sm" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}