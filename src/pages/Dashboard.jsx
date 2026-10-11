import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Vehicle3DViewer from "../components/Vehicle3DViewer";
import InteractiveRouteMap from "../components/InteractiveRouteMap";
import AddVehicleModal from "../components/AddVehicleModal";
import BookRentalModal from "../components/BookRentalModal";
import VehicleLibraryModal from "../components/VehicleLibraryModal";
import DiagnosticDetailModal from "../components/DiagnosticDetailModal";
import AiTripBudgetModal from "../components/AiTripBudgetModal";
import AiChatAssistant from "../components/AiChatAssistant";
import { useGarage } from "../context/GarageContext";

const COLOR_OPTIONS = [
  { name: "Silver", hex: "#b4b8be" },
  { name: "Napoli Black", hex: "#1c1c1f" },
  { name: "Red Rage", hex: "#dc2626" },
  { name: "Aqua Marine", hex: "#0891b2" },
  { name: "Desert Sand", hex: "#c2a688" },
  { name: "Everest White", hex: "#f1f5f9" },
  { name: "Olive Green", hex: "#4b5945" }
];

export default function Dashboard() {
  const {
    fleet,
    activeVehicle,
    selectVehicle,
    updateVehicleColor,
    totalSpend,
    getAiRecommendation
  } = useGarage();

  // Active workspace tab for high productivity: 'studio' | 'map' | 'fleet'
  const [activeTab, setActiveTab] = useState("studio");

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState(null);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);

  // Fleet tab filters
  const [fleetCategoryFilter, setFleetCategoryFilter] = useState("ALL");
  const [fleetSearch, setFleetSearch] = useState("");

  const [aiFeedbackMessage, setAiFeedbackMessage] = useState(
    activeVehicle?.aiRecommendation ||
      "All fluids and mechanical systems verified. Unlimited km package applied with 24/7 roadside assistance."
  );

  const currentScore = activeVehicle?.aiScore || 97;

  const handleColorSelect = (color) => {
    updateVehicleColor(color.name, color.hex);
    setColorDropdownOpen(false);
  };

  const handleAiPrompt = (query) => {
    const res = getAiRecommendation(query);
    if (res) {
      setAiFeedbackMessage(res.reason);
    }
  };

  const handleOpenBookModalWithVehicle = (v) => {
    setSelectedVehicleForBooking(v);
    selectVehicle(v.id);
    setIsBookModalOpen(true);
  };

  const handleInspectInStudio = (v) => {
    selectVehicle(v.id);
    setActiveTab("studio");
  };

  const filteredFleet = fleet.filter((item) => {
    const matchesCategory =
      fleetCategoryFilter === "ALL" ||
      (fleetCategoryFilter === "SUV" && (item.category.includes("SUV") || item.category.includes("4x4"))) ||
      (fleetCategoryFilter === "CAR" && (item.category.includes("Sedan") || item.category.includes("Hatchback") || item.category.includes("MPV"))) ||
      (fleetCategoryFilter === "BIKE" && item.type === "BIKE") ||
      (fleetCategoryFilter === "EV" && (item.fuelType === "Electric" || item.fuelType === "Strong Hybrid"));

    const matchesSearch =
      item.brand.toLowerCase().includes(fleetSearch.toLowerCase()) ||
      item.model.toLowerCase().includes(fleetSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(fleetSearch.toLowerCase()) ||
      (item.plate && item.plate.toLowerCase().includes(fleetSearch.toLowerCase())) ||
      (item.state && item.state.toLowerCase().includes(fleetSearch.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="autosphere-dashboard-layout">
      {/* Top Navigation */}
      <Navbar
        onOpenAddVehicle={() => setIsAddVehicleOpen(true)}
        onOpenBudgetPlanner={() => setIsBudgetModalOpen(true)}
      />

      <main className="cockpit-container">
        {/* HERO BANNER CARD */}
        <section className="hero-intelligence-card">
          <div className="hero-left-content">
            <div className="live-status-badge">
              <span className="live-pulsing-dot"></span>
              <span>LIVE VEHICLE INTELLIGENCE • PAN-INDIA FLEET</span>
            </div>

            <h1 className="hero-main-heading">
              Your garage,<br />
              in one intelligent view.
            </h1>

            <p className="hero-description">
              AutoSphere powers your journey across India. Discover 20 verified real cars & bikes, plan custom routes with along-the-way fuel stops, dhabas & 24/7 service points, and inspect vehicles on an asphalt 3D road stage.
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

              <button
                onClick={() => setActiveTab("map")}
                className="feature-pill"
                style={{
                  cursor: "pointer",
                  color: "#38bdf8",
                  borderColor: "rgba(56, 189, 248, 0.4)"
                }}
              >
                <span>🗺️ Interactive Route Map</span>
              </button>

              <div className="feature-pill">
                <span>{fleet.length} Real Indian Models</span>
              </div>
            </div>
          </div>

          {/* HERO RIGHT: CIRCULAR GAUGE & CURRENT VEHICLE */}
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
                  strokeDasharray={`${(currentScore / 100) * 263.89} 263.89`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="gauge-inner-label">
                <span className="gauge-score">{currentScore}</span>
                <span className="gauge-text">HEALTH</span>
              </div>
            </div>

            <div className="current-vehicle-meta">
              <span className="meta-sub">ACTIVE COCKPIT VEHICLE</span>
              <h2 className="meta-name">{activeVehicle?.displayName || activeVehicle?.name}</h2>
              <span className="meta-plate">
                {activeVehicle?.plate} • {activeVehicle?.state || "India"}
              </span>
              <span className="text-[11px] text-cyan-400 font-mono mt-0.5">
                {activeVehicle?.fuelType} ({activeVehicle?.fuelEconomy}) • {activeVehicle?.pricePerDay}/day
              </span>
            </div>
          </div>
        </section>

        {/* METRIC STRIP (Clean & Non-Clumsy) */}
        <section className="stats-metric-row">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <span className="text-cyan-400 text-sm">🏎️</span>
              </div>
              <span className="stat-label">Indian Fleet</span>
            </div>
            <div className="stat-number">{fleet.length} Ready</div>
            <div className="stat-subtext">real Indian cars, 4x4 SUVs & bikes</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <span className="text-cyan-400 text-sm">🏷️</span>
              </div>
              <span className="stat-label">FASTag & Pan-India RSA</span>
            </div>
            <div className="stat-number">100% Active</div>
            <div className="stat-subtext">commercial AITP permit & RFID</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <span className="rupee-icon">₹</span>
              </div>
              <span className="stat-label">Recorded Spend</span>
            </div>
            <div className="stat-number">₹{totalSpend.toLocaleString("en-IN")}</div>
            <div className="stat-subtext">from service & trip telemetry</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <span className="text-cyan-400 text-sm">🧭</span>
              </div>
              <span className="stat-label">Ground Clearance</span>
            </div>
            <div className="stat-number">{activeVehicle?.groundClearance || "226 mm"}</div>
            <div className="stat-subtext">terrain certified for Indian roads</div>
          </div>
        </section>

        {/* WORKSPACE PRODUCTIVITY CONTROL TABS */}
        <section className="nav-segmented-tabs-bar">
          <div className="nav-segmented-tabs">
            <button
              type="button"
              onClick={() => setActiveTab("studio")}
              className={`nav-segmented-tab ${activeTab === "studio" ? "active" : ""}`}
            >
              <span>🏎️ 3D Studio Cockpit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("map")}
              className={`nav-segmented-tab ${activeTab === "map" ? "active" : ""}`}
            >
              <span>🗺️ Route & Waypoint Map</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("fleet")}
              className={`nav-segmented-tab ${activeTab === "fleet" ? "active" : ""}`}
            >
              <span>📋 Indian Fleet ({fleet.length})</span>
            </button>
          </div>

          {/* Quick Action Button */}
          <div>
            <button
              type="button"
              onClick={() => handleOpenBookModalWithVehicle(activeVehicle)}
              className="btn-cyber-rent-banner"
            >
              <span>⚡ Rent {activeVehicle?.displayName} ({activeVehicle?.pricePerDay}) →</span>
            </button>
          </div>
        </section>

        {/* TAB 1: 3D STUDIO COCKPIT */}
        {activeTab === "studio" && (
          <section className="studio-timeline-grid animate-fadeIn">
            {/* LEFT: REAL-WORLD VEHICLE STUDIO */}
            <div className="studio-card">
              <div className="studio-card-header">
                <div className="studio-vehicle-meta">
                  <span className="studio-pretitle">REAL-WORLD VEHICLE COCKPIT STUDIO</span>
                  <h3 className="studio-vehicle-name">{activeVehicle?.displayName || activeVehicle?.name}</h3>
                  <span className="studio-vehicle-subtitle">
                    {activeVehicle?.year} • {activeVehicle?.category} • {activeVehicle?.plate} ({activeVehicle?.state || "India"})
                  </span>

                  {/* Indian Spec Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      {activeVehicle?.isFastagActive ? "FASTag RFID Active" : "Toll-Free NHAI"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
                      {activeVehicle?.fuelType} ({activeVehicle?.fuelEconomy})
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700/60">
                      Clearance: {activeVehicle?.groundClearance}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700/60">
                      {activeVehicle?.specs?.seating}
                    </span>
                  </div>
                </div>

                <div className="studio-header-actions">
                  {/* Color Selector Dropdown */}
                  <div className="color-selector-wrapper">
                    <button
                      onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                      className="color-dropdown-trigger"
                    >
                      <span>{activeVehicle?.color || "Silver"}</span>
                      <span className="dropdown-caret">⌄</span>
                    </button>

                    {colorDropdownOpen && (
                      <div className="color-dropdown-menu">
                        {COLOR_OPTIONS.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => handleColorSelect(c)}
                            className="color-dropdown-item"
                          >
                            <span className="color-menu-dot" style={{ backgroundColor: c.hex }}></span>
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fleet Switcher Button */}
                  <button
                    onClick={() => setActiveTab("fleet")}
                    className="btn-vehicle-library"
                  >
                    Switch Model ({fleet.length})
                  </button>
                </div>
              </div>

              {/* Studio Sub-Header */}
              <div className="studio-subheader">
                <div className="live-studio-badge">
                  <span className="live-pulsing-dot"></span>
                  <span>ASPHALT HIGHWAY ROAD INTERACTION</span>
                </div>
                <button
                  onClick={() => setIsLibraryOpen(true)}
                  className="studio-source-btn"
                >
                  <span>↗</span> RTO Registry
                </button>
              </div>

              {/* 3D INTERACTIVE CANVAS VIEWPORT ON ASPHALT ROAD */}
              <div className="studio-viewport-area">
                <Vehicle3DViewer
                  color={activeVehicle?.colorHex || "#b4b8be"}
                  vehicleName={activeVehicle?.name || "mahindra thar"}
                  displayName={activeVehicle?.displayName || activeVehicle?.name}
                  vehicleType={activeVehicle?.type}
                  onSelectSystem={(key) => setSelectedSystem(key)}
                  highlightedSystem={selectedSystem}
                />
              </div>

              {/* TAP A VEHICLE SYSTEM INTERACTIVE BAR */}
              <div className="system-telemetry-bar">
                <span className="tap-hint-text">TAP A VEHICLE SYSTEM FOR AI DIAGNOSTICS</span>
                <div className="system-chips-row">
                  {["engine", "brakes", "transmission", "suspension", "battery", "tires"].map((sys) => {
                    const isActive = selectedSystem === sys;
                    return (
                      <button
                        key={sys}
                        onClick={() => setSelectedSystem(sys)}
                        className={`system-chip-btn ${isActive ? "active" : ""}`}
                      >
                        {sys.charAt(0).toUpperCase() + sys.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: SERVICE TIMELINE & AI COPILOT */}
            <div className="timeline-card">
              <div className="timeline-card-header">
                <div>
                  <span className="timeline-pretitle">SERVICE & TELEMETRY</span>
                  <h3 className="timeline-main-title">Handover inspection → Return status</h3>
                </div>
                <div className="timeline-wrench-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
              </div>

              {/* CONNECTED SERVICE CARDS */}
              <div className="timeline-flow-container">
                <div className="timeline-subcard">
                  <span className="timeline-box-label">LAST SERVICE</span>
                  <div className="timeline-box-date">25 Mar 2025</div>
                  <div className="timeline-box-desc">
                    General Service • {activeVehicle?.odometer || 14} km
                  </div>
                </div>

                <div className="timeline-arrow-connector">
                  <span>→</span>
                </div>

                <div className="timeline-subcard">
                  <span className="timeline-box-label">NEXT SERVICE</span>
                  <div className="timeline-box-date">30 Dec 2027</div>
                  <div className="timeline-box-status">
                    <span className="status-badge-schedule">On schedule</span>
                  </div>
                </div>
              </div>

              {/* Action: Rent Vehicle Button */}
              <div className="timeline-actions-footer">
                <button
                  onClick={() => handleOpenBookModalWithVehicle(activeVehicle)}
                  className="btn-log-service"
                >
                  + Rent {activeVehicle?.brand} {activeVehicle?.model} ({activeVehicle?.pricePerDay})
                </button>
              </div>

              {/* AI GARAGE & RENTAL CONTEXT ADVISORY CARD */}
              <div className="maintenance-advisor-card">
                <div className="advisor-header">
                  <span className="advisor-dot"></span>
                  <span className="advisor-title">AutoSphere AI Trip & Vehicle Concierge</span>
                </div>
                <p className="advisor-text">{aiFeedbackMessage}</p>

                {/* Quick Route Presets */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">
                    AI ROUTE MATCHER:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => handleAiPrompt("ladakh")}
                      className="studio-angle-btn"
                    >
                      🏔️ Ladakh 4x4
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAiPrompt("goa")}
                      className="studio-angle-btn"
                    >
                      🏖️ Goa Beach Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAiPrompt("hycross")}
                      className="studio-angle-btn"
                    >
                      👑 Innova Hybrid
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAiPrompt("himalayan")}
                      className="studio-angle-btn"
                    >
                      🏍️ Himalayan 450
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAiPrompt("swift")}
                      className="studio-angle-btn"
                    >
                      ⚡ Budget Swift
                    </button>
                  </div>
                </div>

                {/* Route Map & Budget Triggers */}
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("map")}
                    className="btn-card-inspect flex-1 flex items-center justify-center gap-1"
                    style={{ padding: "8px 12px" }}
                  >
                    <span>🗺️ Route Amenities</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="btn-card-rent flex-1 flex items-center justify-center gap-1"
                    style={{ padding: "8px 12px" }}
                  >
                    <span>📊 Trip Budget Engine</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: INTERACTIVE ROUTE & WAYPOINT MAP */}
        {activeTab === "map" && (
          <section className="my-2 animate-fadeIn">
            <InteractiveRouteMap
              onSelectVehicleForBooking={(v) => handleOpenBookModalWithVehicle(v)}
              onInspectInStudio={(v) => handleInspectInStudio(v)}
            />
          </section>
        )}

        {/* TAB 3: INDIAN FLEET CATALOG */}
        {activeTab === "fleet" && (
          <section className="garage-vehicles-section animate-fadeIn">
            <div className="section-header-row">
              <div>
                <span className="section-pretitle">VERIFIED INDIAN FLEET CATALOG</span>
                <h2 className="section-main-title">
                  Real Cars & Bikes ({filteredFleet.length} Available)
                </h2>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="btn-add-vehicle"
              >
                ✨ Plan Trip Budget
              </button>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="fleet-filter-bar">
              <input
                type="text"
                placeholder="Search by make, model, city, plate, or features (e.g. Thar, Fortuner, Himalayan, Swift, 4x4)..."
                value={fleetSearch}
                onChange={(e) => setFleetSearch(e.target.value)}
                className="fleet-search-input"
              />

              <div className="fleet-filter-pills-row">
                {[
                  { key: "ALL", label: `All Fleet (${fleet.length})` },
                  { key: "SUV", label: "4x4 & SUVs" },
                  { key: "CAR", label: "Sedans & Hatchbacks" },
                  { key: "BIKE", label: "Bikes & Superbikes" },
                  { key: "EV", label: "EV & Hybrid" }
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setFleetCategoryFilter(c.key)}
                    className={`filter-pill-btn ${fleetCategoryFilter === c.key ? "active" : ""}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fleet Cards Grid with Real Photography on Top (Replica of Reference UI) */}
            <div className="cyber-fleet-grid">
              {filteredFleet.map((v) => {
                const isSelected = activeVehicle?.id === v.id;
                return (
                  <div
                    key={v.id}
                    className={`vehicle-cyber-card ${isSelected ? "active-selected" : ""}`}
                  >
                    {/* Real-Life Vehicle Photo on Top */}
                    <div className="card-photo-wrapper">
                      <img
                        src={v.image || `/vehicles/${v.name.includes("bike") || v.type === "BIKE" ? "himalayan.jpg" : "thar.jpg"}`}
                        alt={v.displayName}
                        className="card-photo-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = `/vehicles/${v.type === "BIKE" ? "himalayan.jpg" : "thar.jpg"}`;
                        }}
                      />
                      <div className="card-photo-gradient" />

                      {/* Top Badges */}
                      <span className="card-badge-category">{v.category}</span>
                      <div className="card-badge-status">
                        <span className="card-badge-dot"></span>
                        <span>Available</span>
                      </div>
                      <span className="card-badge-type">{v.type} • {v.plate}</span>
                    </div>

                    {/* Card Body & Specs */}
                    <div className="card-body-content">
                      <div className="card-title-row">
                        <div>
                          <h4 className="card-vehicle-title">{v.displayName || `${v.brand} ${v.model}`}</h4>
                          <div className="card-vehicle-sub">{v.subtitle || `${v.brand} • ${v.year}`}</div>
                        </div>
                        {v.state && (
                          <span className="card-vehicle-plate">📍 {v.state}</span>
                        )}
                      </div>

                      {/* 4-Column Spec Strip */}
                      <div className="specs-quad-strip">
                        <div className="spec-mini-item">
                          <span className="spec-mini-lbl">Power</span>
                          <span className="spec-mini-val">{v.powerHp || "140 HP"}</span>
                        </div>
                        <div className="spec-mini-item">
                          <span className="spec-mini-lbl">Fuel</span>
                          <span className="spec-mini-val">{v.fuelType}</span>
                        </div>
                        <div className="spec-mini-item">
                          <span className="spec-mini-lbl">Economy</span>
                          <span className="spec-mini-val">{v.fuelEconomy}</span>
                        </div>
                        <div className="spec-mini-item">
                          <span className="spec-mini-lbl">Clearance</span>
                          <span className="spec-mini-val">{v.groundClearance}</span>
                        </div>
                      </div>

                      {/* AI Description */}
                      <p className="card-ai-excerpt" title={v.aiRecommendation}>
                        {v.aiRecommendation}
                      </p>

                      {/* Footer Actions & Price */}
                      <div className="card-footer-row">
                        <div className="card-price-block">
                          <div>
                            <span className="card-price-val">{v.pricePerDay}</span>
                            <span className="card-price-period">/day</span>
                          </div>
                          <span className="card-ai-score-pill">
                            AI Match: {v.aiScore}% • {v.type === "BIKE" ? "Toll-Free" : "FASTag Active"}
                          </span>
                        </div>

                        <div className="card-actions-group">
                          <button
                            type="button"
                            onClick={() => handleInspectInStudio(v)}
                            className="btn-card-inspect"
                            title="Inspect in 3D Highway Studio"
                          >
                            🏎️ 3D View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenBookModalWithVehicle(v)}
                            className="btn-card-rent"
                          >
                            Rent Now →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* SLEEK FLOATING AI CHAT COPILOT */}
      <AiChatAssistant
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenBookModal={(v) => handleOpenBookModalWithVehicle(v)}
      />

      {/* AI TRIP BUDGET & REVENUE ENGINE MODAL */}
      <AiTripBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onOpenBookModal={(v) => handleOpenBookModalWithVehicle(v)}
      />

      {/* MODALS */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
      />

      <BookRentalModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedVehicleForBooking(null);
        }}
        preselectedVehicle={selectedVehicleForBooking || activeVehicle}
      />

      <VehicleLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />

      <DiagnosticDetailModal
        systemKey={selectedSystem}
        onClose={() => setSelectedSystem(null)}
      />
    </div>
  );
}
