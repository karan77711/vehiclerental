import React, { useState } from "react";
import Navbar from "../components/Navbar";
import AddVehicleModal from "../components/AddVehicleModal";
import BookRentalModal from "../components/BookRentalModal";
import AiTripBudgetModal from "../components/AiTripBudgetModal";
import AiChatAssistant from "../components/AiChatAssistant";
import { useGarage } from "../context/GarageContext";

export default function Rentals() {
  const { user, fleet, rentals, selectVehicle } = useGarage();
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedFleetCar, setSelectedFleetCar] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const openBookModal = (car) => {
    setSelectedFleetCar(car);
    selectVehicle(car.id);
    setIsBookingModalOpen(true);
  };

  const categories = [
    { key: "ALL", label: `All Fleet (${fleet.length})` },
    { key: "SUV", label: "4x4 & SUVs" },
    { key: "CAR", label: "Sedans & Hatchbacks" },
    { key: "BIKE", label: "Bikes & Superbikes" },
    { key: "EV", label: "EV & Hybrid" }
  ];

  const filteredFleet = fleet.filter((item) => {
    const matchesCategory =
      categoryFilter === "ALL" ||
      (categoryFilter === "SUV" && (item.category.includes("SUV") || item.category.includes("4x4"))) ||
      (categoryFilter === "CAR" && (item.category.includes("Sedan") || item.category.includes("Hatchback") || item.category.includes("MPV"))) ||
      (categoryFilter === "BIKE" && item.type === "BIKE") ||
      (categoryFilter === "EV" && (item.fuelType === "Electric" || item.fuelType === "Strong Hybrid"));

    const matchesSearch =
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.plate && item.plate.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.state && item.state.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="autosphere-dashboard-layout">
      {/* Top Navbar */}
      <Navbar
        onOpenAddVehicle={() => setIsAddVehicleOpen(true)}
        onOpenBudgetPlanner={() => setIsBudgetModalOpen(true)}
      />

      <main className="cockpit-container">
        {/* RENTALS HERO BANNER */}
        <section className="hero-intelligence-card">
          <div className="hero-left-content">
            <div className="live-status-badge">
              <span className="live-pulsing-dot"></span>
              <span>LIVE FLEET RENTAL INTELLIGENCE • PAN-INDIA</span>
            </div>

            <h1 className="hero-main-heading">
              Vehicle rentals,<br />
              on-demand & confirmed.
            </h1>

            <p className="hero-description">
              Browse {fleet.length}+ verified Indian 4x4 SUVs, sedans, and superbikes. Calculate full trip budgets with automated fuel & FASTag estimations or book instantly with zero security hassles.
            </p>

            <div className="hero-feature-pills">
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="feature-pill"
                style={{
                  cursor: "pointer",
                  color: "#00f0ff",
                  background: "rgba(0, 240, 255, 0.12)",
                  borderColor: "rgba(0, 240, 255, 0.45)",
                  fontWeight: "600"
                }}
              >
                <span>✨ AI Trip & Budget Planner</span>
              </button>

              <div className="feature-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>{fleet.length} Real Indian Vehicles</span>
              </div>
              <div className="feature-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>All India Tourist Permit</span>
              </div>
              <div className="feature-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 14 14"></polyline>
                </svg>
                <span>FASTag Included</span>
              </div>
            </div>
          </div>

          <div className="hero-right-gauge">
            <div className="circular-health-meter">
              <svg className="gauge-svg" viewBox="0 0 100 100">
                <circle className="gauge-bg" cx="50" cy="50" r="42" strokeWidth="5.5" fill="none" />
                <circle
                  className="gauge-progress"
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="5.5"
                  strokeDasharray={`${(rentals.length > 0 ? 100 : 0) * 2.63} 263.89`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="gauge-inner-label">
                <span className="gauge-score">{rentals.length}</span>
                <span className="gauge-text">ACTIVE</span>
              </div>
            </div>

            <div className="current-vehicle-meta">
              <span className="meta-sub">CONNECTED USER</span>
              <h2 className="meta-name">{user?.name || "ravi"}</h2>
              <span className="meta-plate">{user?.email || "ravi@gmail.com"}</span>
            </div>
          </div>
        </section>

        {/* 4 STATS ROW */}
        <section className="stats-metric-row">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <span className="stat-label">Active Bookings</span>
            </div>
            <div className="stat-number">{rentals.length}</div>
            <div className="stat-subtext">vehicles reserved</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <span className="rupee-icon">₹</span>
              </div>
              <span className="stat-label">Starting From</span>
            </div>
            <div className="stat-number">₹1,400/day</div>
            <div className="stat-subtext">Yamaha MT-15 to Fortuner & Hayabusa</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                  <circle cx="7" cy="17" r="2"></circle>
                  <circle cx="17" cy="17" r="2"></circle>
                </svg>
              </div>
              <span className="stat-label">Total Indian Fleet</span>
            </div>
            <div className="stat-number">{fleet.length} Ready</div>
            <div className="stat-subtext">cars, 4x4 SUVs & bikes</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <span className="stat-label">Backend Link</span>
            </div>
            <div className="stat-number">Port 8082</div>
            <div className="stat-subtext">Spring Boot connected</div>
          </div>
        </section>

        {/* SECTION: YOUR ACTIVE BOOKINGS */}
        <section className="garage-vehicles-section">
          <div className="section-header-row">
            <div>
              <span className="section-pretitle">YOUR CONTRACTS</span>
              <h2 className="section-main-title">
                {rentals.length === 1 ? "1 Active Rental Contract" : `${rentals.length} Active Rental Contracts`}
              </h2>
            </div>
            <button
              onClick={() => openBookModal(fleet[0])}
              className="btn-add-vehicle"
            >
              + Book New Rental
            </button>
          </div>

          <div className="vehicle-items-list">
            {rentals.map((r) => (
              <div key={r.id} className="vehicle-card-row">
                <div className="vehicle-card-left">
                  <div className="vehicle-badge-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                      <circle cx="7" cy="17" r="2"></circle>
                      <circle cx="17" cy="17" r="2"></circle>
                    </svg>
                  </div>

                  <div className="vehicle-summary-info">
                    <span className="vehicle-type-year">CONTRACT #{r.id} • {r.status || "CONFIRMED"}</span>
                    <h3 className="vehicle-name-title">{r.carName}</h3>
                    <span className="vehicle-plate-km">
                      Rate: <strong className="text-white">{r.pricePerDay}</strong> • Dates: {r.startDate} to {r.endDate}
                    </span>
                  </div>
                </div>

                <div className="vehicle-card-right">
                  <span className="status-badge-schedule">Active Booking</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: AVAILABLE FLEET TO RENT */}
        <section className="garage-vehicles-section mt-4">
          <div className="section-header-row">
            <div>
              <span className="section-pretitle">AVAILABLE RENTAL FLEET</span>
              <h2 className="section-main-title">Select a Vehicle to Rent ({filteredFleet.length} Vehicles)</h2>
            </div>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-1.5"
            >
              <span>✨ Plan Trip Budget & Fuel</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="fleet-filter-bar">
            <input
              type="text"
              placeholder="Search by model, brand, state, or feature (e.g. Fortuner, Thar, Himalayan, Swift, 4x4, Creta)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="fleet-search-input"
            />

            <div className="fleet-filter-pills-row">
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategoryFilter(c.key)}
                  className={`filter-pill-btn ${categoryFilter === c.key ? "active" : ""}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Grid with Real Photography on Top */}
          <div className="cyber-fleet-grid">
            {filteredFleet.map((car) => (
              <div key={car.id} className="vehicle-cyber-card">
                {/* Real-Life Vehicle Photo on Top */}
                <div className="card-photo-wrapper">
                  <img
                    src={car.image || `/vehicles/${car.type === "BIKE" ? "himalayan.jpg" : "thar.jpg"}`}
                    alt={car.displayName}
                    className="card-photo-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `/vehicles/${car.type === "BIKE" ? "himalayan.jpg" : "thar.jpg"}`;
                    }}
                  />
                  <div className="card-photo-gradient" />

                  {/* Top Badges */}
                  <span className="card-badge-category">{car.category}</span>
                  <div className="card-badge-status">
                    <span className="card-badge-dot"></span>
                    <span>Available</span>
                  </div>
                  <span className="card-badge-type">{car.type} • {car.plate}</span>
                </div>

                {/* Card Body & Specs */}
                <div className="card-body-content">
                  <div className="card-title-row">
                    <div>
                      <h4 className="card-vehicle-title">{car.displayName || `${car.brand} ${car.model}`}</h4>
                      <div className="card-vehicle-sub">{car.subtitle || `${car.brand} • ${car.year}`}</div>
                    </div>
                    {car.state && (
                      <span className="card-vehicle-plate">📍 {car.state}</span>
                    )}
                  </div>

                  {/* 4-Column Spec Strip */}
                  <div className="specs-quad-strip">
                    <div className="spec-mini-item">
                      <span className="spec-mini-lbl">Power</span>
                      <span className="spec-mini-val">{car.powerHp || "140 HP"}</span>
                    </div>
                    <div className="spec-mini-item">
                      <span className="spec-mini-lbl">Fuel</span>
                      <span className="spec-mini-val">{car.fuelType}</span>
                    </div>
                    <div className="spec-mini-item">
                      <span className="spec-mini-lbl">Economy</span>
                      <span className="spec-mini-val">{car.fuelEconomy}</span>
                    </div>
                    <div className="spec-mini-item">
                      <span className="spec-mini-lbl">Clearance</span>
                      <span className="spec-mini-val">{car.groundClearance}</span>
                    </div>
                  </div>

                  {/* AI Description */}
                  <p className="card-ai-excerpt" title={car.aiRecommendation}>
                    {car.aiRecommendation}
                  </p>

                  {/* Footer Actions & Price */}
                  <div className="card-footer-row">
                    <div className="card-price-block">
                      <div>
                        <span className="card-price-val">{car.pricePerDay}</span>
                        <span className="card-price-period">/day</span>
                      </div>
                      <span className="card-ai-score-pill">
                        AI Match: {car.aiScore}% • {car.type === "BIKE" ? "Toll-Free" : "FASTag Active"}
                      </span>
                    </div>

                    <div className="card-actions-group">
                      <button
                        type="button"
                        onClick={() => setIsBudgetModalOpen(true)}
                        className="btn-card-inspect"
                        title="Calculate trip budget"
                      >
                        📊 Budget
                      </button>
                      <button
                        type="button"
                        onClick={() => openBookModal(car)}
                        className="btn-card-rent"
                      >
                        Rent Now →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FLOATING AI CHAT COPILOT */}
      <AiChatAssistant
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenBookModal={(v) => openBookModal(v)}
      />

      {/* AI TRIP BUDGET ENGINE MODAL */}
      <AiTripBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onOpenBookModal={(v) => openBookModal(v)}
      />

      {/* BOOKING MODAL */}
      <BookRentalModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedVehicle={selectedFleetCar}
      />

      {/* ADD VEHICLE MODAL */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
      />
    </div>
  );
}
