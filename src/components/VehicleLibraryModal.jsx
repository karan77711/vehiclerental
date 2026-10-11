import React, { useState } from "react";
import { useGarage } from "../context/GarageContext";

export default function VehicleLibraryModal({ isOpen, onClose }) {
  const { fleet, selectVehicle, activeVehicle } = useGarage();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const categories = [
    { key: "ALL", label: `All Fleet (${fleet.length})` },
    { key: "SUV", label: "4x4 & SUVs" },
    { key: "CAR", label: "Sedans & Hatchbacks" },
    { key: "BIKE", label: "Bikes & Superbikes" }
  ];

  const filteredFleet = fleet.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" ||
      (selectedCategory === "SUV" && (item.category.includes("SUV") || item.category.includes("4x4"))) ||
      (selectedCategory === "CAR" && (item.category.includes("Sedan") || item.category.includes("Hatchback"))) ||
      (selectedCategory === "BIKE" && item.type === "BIKE");

    const matchesSearch =
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSelectReference = (v) => {
    selectVehicle(v.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
              • 31+ REAL 3D FLEET REFERENCE MODELS
            </div>
            <h3 className="modal-title">Vehicle Rental Fleet Library</h3>
            <p className="modal-subtitle">
              Choose from verified 4x4 SUVs, luxury executive sedans, and high-performance superbikes
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="fleet-filter-bar mb-4">
          <input
            type="text"
            placeholder="Search by model, brand, or category (e.g. Fortuner, Ninja, BMW, 4x4)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fleet-search-input"
          />

          <div className="fleet-filter-pills-row">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelectedCategory(c.key)}
                className={`filter-pill-btn ${selectedCategory === c.key ? "active" : ""}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid with Real Photography */}
        <div className="cyber-fleet-grid" style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: "4px" }}>
          {filteredFleet.map((item) => {
            const isCurrent = activeVehicle?.id === item.id;
            return (
              <div
                key={item.id}
                className={`vehicle-cyber-card ${isCurrent ? "active-selected" : ""}`}
                onClick={() => handleSelectReference(item)}
                style={{ cursor: "pointer" }}
              >
                {/* Real-Life Vehicle Photo on Top */}
                <div className="card-photo-wrapper" style={{ height: "150px" }}>
                  <img
                    src={item.image || `/vehicles/${item.type === "BIKE" ? "himalayan.jpg" : "thar.jpg"}`}
                    alt={item.displayName}
                    className="card-photo-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `/vehicles/${item.type === "BIKE" ? "himalayan.jpg" : "thar.jpg"}`;
                    }}
                  />
                  <div className="card-photo-gradient" />
                  <span className="card-badge-category">{item.category}</span>
                  <div className="card-badge-status">
                    <span className="card-badge-dot"></span>
                    <span>{isCurrent ? "Active in Cockpit" : "Available"}</span>
                  </div>
                  <span className="card-badge-type">{item.type} • {item.plate}</span>
                </div>

                <div className="card-body-content">
                  <div className="card-title-row">
                    <div>
                      <h4 className="card-vehicle-title" style={{ fontSize: "15px" }}>{item.displayName || `${item.brand} ${item.model}`}</h4>
                      <div className="card-vehicle-sub">{item.subtitle || `${item.brand} • ${item.year}`}</div>
                    </div>
                    {item.state && (
                      <span className="card-vehicle-plate">📍 {item.state}</span>
                    )}
                  </div>

                  <div className="specs-quad-strip">
                    <div className="spec-mini-item">
                      <span className="spec-mini-lbl">Power</span>
                      <span className="spec-mini-val">{item.powerHp || "140 HP"}</span>
                    </div>
                    <div className="spec-mini-item">
                      <span className="spec-mini-lbl">Fuel</span>
                      <span className="spec-mini-val">{item.fuelType}</span>
                    </div>
                    <div className="spec-mini-item">
                      <span className="spec-mini-lbl">Mileage</span>
                      <span className="spec-mini-val">{item.fuelEconomy}</span>
                    </div>
                    <div className="spec-mini-item">
                      <span className="spec-mini-lbl">Clearance</span>
                      <span className="spec-mini-val">{item.groundClearance}</span>
                    </div>
                  </div>

                  <div className="card-footer-row">
                    <div className="card-price-block">
                      <span className="card-price-val" style={{ fontSize: "16px" }}>{item.pricePerDay}</span>
                      <span className="card-ai-score-pill">AI Score: {item.aiScore}%</span>
                    </div>
                    <button
                      type="button"
                      className="btn-card-rent"
                      style={{ padding: "6px 14px", fontSize: "11px" }}
                    >
                      {isCurrent ? "✓ Active in 3D" : "Load into 3D →"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
