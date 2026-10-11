import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGarage } from "../context/GarageContext";

export default function Navbar({ onOpenAddVehicle, onOpenBudgetPlanner }) {
  const { user, logoutUser } = useGarage();
  const location = useLocation();
  const navigate = useNavigate();

  const isGarageActive = location.pathname === "/" || location.pathname === "/dashboard";
  const isRentalsActive = location.pathname === "/rentals";

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const userInitial = (user?.name || user?.email || "R").charAt(0).toUpperCase();

  return (
    <header className="autosphere-navbar">
      {/* Brand Left */}
      <Link to="/dashboard" className="brand-container">
        <div className="brand-logo-badge">
          <span>A</span>
        </div>
        <div className="brand-text">
          <span className="brand-title">AutoSphere</span>
          <span className="brand-subtitle">VEHICLE INTELLIGENCE</span>
        </div>
      </Link>

      {/* Nav Center Pills */}
      <nav className="nav-pills-center">
        <div className="nav-pills-wrapper">
          <button
            onClick={() => navigate("/dashboard")}
            className={`nav-pill-item ${isGarageActive ? "active" : ""}`}
          >
            Garage
          </button>
          <button
            onClick={() => navigate("/rentals")}
            className={`nav-pill-item ${isRentalsActive ? "active" : ""}`}
          >
            Rentals
          </button>
          <button
            onClick={onOpenBudgetPlanner}
            className="nav-pill-item"
            style={{ color: "#38bdf8", display: "flex", alignItems: "center", gap: "5px" }}
            title="Plan Trip Budget & Route"
          >
            <span>✨</span> AI Trip Planner
          </button>
          <button
            onClick={onOpenAddVehicle}
            className="nav-pill-item"
          >
            Add vehicle
          </button>
        </div>
      </nav>

      {/* User Right */}
      <div className="user-profile-right">
        <div className="user-badge-chip">
          <div className="user-avatar-circle">
            {userInitial}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name || "ravi"}</span>
            <span className="user-email">{user?.email || "ravi@gmail.com"}</span>
          </div>
        </div>

        {/* Logout / Switch Account Icon Button */}
        <button
          onClick={handleLogout}
          className="logout-icon-btn"
          title="Switch Account / Logout"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}
