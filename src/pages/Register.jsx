import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGarage } from "../context/GarageContext";

export default function Register() {
  const { registerUser } = useGarage();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "Monish",
    email: "ravi@gmail.com",
    password: "••••••••"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-screen">
      {/* Background Orbital Rings & Glow */}
      <div className="auth-ambient-orbit-1"></div>
      <div className="auth-ambient-orbit-2"></div>
      <div className="auth-ambient-glow"></div>

      {/* LEFT BRAND HERO */}
      <div className="auth-hero-pane">
        <div className="auth-badge-smart">
          <span className="smart-star-icon">✦</span>
          <span>A SMART GARAGE FOR REAL-WORLD VEHICLES</span>
        </div>

        <h1 className="auth-hero-heading">
          Your garage.<br />
          <span className="auth-gradient-text">Under control.</span>
        </h1>

        <p className="auth-hero-subtext">
          Track cars, bikes, service dates, mileage, maintenance cost and history from one visual cockpit.
        </p>

        {/* 3 Metrics Row */}
        <div className="auth-metrics-row">
          <div className="auth-metric-item">
            <span className="metric-large-num">31+</span>
            <span className="metric-desc">real 3D reference<br />models</span>
          </div>

          <div className="auth-metric-item">
            <span className="metric-large-num">2</span>
            <span className="metric-desc">vehicle types</span>
          </div>

          <div className="auth-metric-item">
            <span className="metric-large-num">1</span>
            <span className="metric-desc">service timeline</span>
          </div>
        </div>

        {/* Vehicle Category Chips */}
        <div className="auth-category-chips">
          <div className="auth-category-pill">
            <div className="pill-icon-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                <circle cx="7" cy="17" r="2"></circle>
                <path d="M9 17h6"></path>
                <circle cx="17" cy="17" r="2"></circle>
              </svg>
            </div>
            <div className="pill-text-block">
              <span className="pill-main">Cars</span>
              <span className="pill-sub">Mahindra • Tata</span>
            </div>
          </div>

          <div className="auth-category-pill">
            <div className="pill-icon-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                <circle cx="18.5" cy="17.5" r="3.5"></circle>
                <circle cx="5.5" cy="17.5" r="3.5"></circle>
                <circle cx="15" cy="5" r="1"></circle>
                <path d="M12 17.5V14l-3-3 4-3 2 3h2"></path>
              </svg>
            </div>
            <div className="pill-text-block">
              <span className="pill-main">Bikes</span>
              <span className="pill-sub">Kawasaki • Suzuki</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT AUTH CARD */}
      <div className="auth-form-pane">
        <div className="auth-card-container">
          {/* AS Badge */}
          <div className="auth-card-avatar-badge">
            <span>AS</span>
          </div>

          <h2 className="auth-card-title">Create your garage</h2>
          <p className="auth-card-subtitle">Start with your real vehicle profile</p>

          <form onSubmit={handleSubmit} className="auth-actual-form">
            {/* Name Input */}
            <div className="auth-field-group">
              <label>Your name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Monish"
                required
              />
            </div>

            {/* Email Input */}
            <div className="auth-field-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ravi@gmail.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="auth-field-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  title="Toggle visibility"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-auth-submit"
            >
              {loading ? "Creating your garage..." : "Create my account →"}
            </button>

            {/* Spring Boot Port 8082 Note */}
            <div className="auth-backend-security-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Authenticated through your Spring Boot backend on port 8082</span>
            </div>

            {/* Sign in footer link */}
            <div className="auth-footer-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
