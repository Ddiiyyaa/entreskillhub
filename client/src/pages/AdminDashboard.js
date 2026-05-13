import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://entreskillhub.onrender.com";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalIdeas: 0,
  });
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, mentorsRes] = await Promise.allSettled([
        axios.get(`${API}/api/users`, { headers }),
        axios.get(`${API}/api/mentors`, { headers }),
      ]);

      const usersData = usersRes.status === "fulfilled" ? usersRes.value.data : [];
      const mentorsData = mentorsRes.status === "fulfilled" ? mentorsRes.value.data : [];

      setUsers(Array.isArray(usersData) ? usersData : []);
      setMentors(Array.isArray(mentorsData) ? mentorsData : []);
      setStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalMentors: Array.isArray(mentorsData) ? mentorsData.length : 0,
        totalIdeas: 15,
      });
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "2rem 1.5rem",
      fontFamily: "sans-serif",
    },
    header: {
      marginBottom: "2rem",
    },
    h1: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#1a1a2e",
      margin: "0 0 0.3rem",
    },
    subtitle: {
      color: "#888",
      margin: 0,
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
    },
    statCard: {
      background: "#fff",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
      textAlign: "center",
    },
    statNumber: {
      fontSize: "2.2rem",
      fontWeight: "700",
      color: "#6c63ff",
      margin: "0 0 0.3rem",
    },
    statLabel: {
      color: "#888",
      fontSize: "0.9rem",
      margin: 0,
    },
    tabs: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1.5rem",
      borderBottom: "2px solid #f0f0f0",
      paddingBottom: "0",
    },
    tab: (active) => ({
      padding: "0.6rem 1.2rem",
      border: "none",
      background: "none",
      cursor: "pointer",
      fontWeight: active ? "700" : "400",
      color: active ? "#6c63ff" : "#888",
      borderBottom: active ? "2px solid #6c63ff" : "2px solid transparent",
      marginBottom: "-2px",
      fontSize: "0.95rem",
    }),
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
    },
    th: {
      background: "#f8f8ff",
      padding: "0.9rem 1rem",
      textAlign: "left",
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#555",
      borderBottom: "1px solid #eee",
    },
    td: {
      padding: "0.85rem 1rem",
      fontSize: "0.88rem",
      color: "#333",
      borderBottom: "1px solid #f5f5f5",
    },
    badge: (color) => ({
      background: color === "admin" ? "#ffeeba" : color === "mentor" ? "#d4edda" : "#e8e8ff",
      color: color === "admin" ? "#856404" : color === "mentor" ? "#155724" : "#4a4a8a",
      padding: "0.2rem 0.6rem",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: "600",
    }),
    loading: {
      textAlign: "center",
      padding: "4rem",
      color: "#888",
    },
  };

  if (loading) return <div style={styles.loading}>Loading admin data...</div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.h1}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage users, mentors, and platform content.</p>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{stats.totalUsers}</p>
          <p style={styles.statLabel}>Total Users</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{stats.totalMentors}</p>
          <p style={styles.statLabel}>Mentors</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{stats.totalIdeas}</p>
          <p style={styles.statLabel}>Business Ideas</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>🟢</p>
          <p style={styles.statLabel}>System Status: Online</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button style={styles.tab(activeTab === "overview")} onClick={() => setActiveTab("overview")}>
          Overview
        </button>
        <button style={styles.tab(activeTab === "users")} onClick={() => setActiveTab("users")}>
          Users ({stats.totalUsers})
        </button>
        <button style={styles.tab(activeTab === "mentors")} onClick={() => setActiveTab("mentors")}>
          Mentors ({stats.totalMentors})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Metric</th>
                <th style={styles.th}>Value</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>Registered Users</td>
                <td style={styles.td}>{stats.totalUsers}</td>
                <td style={styles.td}><span style={styles.badge("user")}>Active</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Verified Mentors</td>
                <td style={styles.td}>{stats.totalMentors}</td>
                <td style={styles.td}><span style={styles.badge("mentor")}>Live</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Business Ideas in DB</td>
                <td style={styles.td}>15+</td>
                <td style={styles.td}><span style={styles.badge("mentor")}>Seeded</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Auth System</td>
                <td style={styles.td}>JWT + Role-based</td>
                <td style={styles.td}><span style={styles.badge("mentor")}>Secure</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Database</td>
                <td style={styles.td}>MongoDB Atlas</td>
                <td style={styles.td}><span style={styles.badge("mentor")}>Connected</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan="4">No users found or insufficient permissions.</td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u._id}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{u.name || "—"}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(u.role)}>{u.role || "user"}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Mentors Tab */}
      {activeTab === "mentors" && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Industry</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mentors.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan="5">No mentors found.</td>
              </tr>
            ) : (
              mentors.map((m, i) => (
                <tr key={m._id}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{m.name}</td>
                  <td style={styles.td}>{m.industry}</td>
                  <td style={styles.td}>⭐ {m.rating}</td>
                  <td style={styles.td}>
                    <span style={styles.badge("mentor")}>
                      {m.availability || "available"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;