import React, { useState, useMemo } from "react";
import { useGarage } from "../context/GarageContext";
import { INDIAN_FUEL_RATES } from "../data/indianVehicles";

// Key Indian Cities Coordinates and Highway Distances
const INDIAN_CITIES = [
  { name: "Mumbai", state: "Maharashtra", lat: 18.92, lng: 72.83 },
  { name: "Pune", state: "Maharashtra", lat: 18.52, lng: 73.85 },
  { name: "Goa", state: "Goa", lat: 15.29, lng: 74.12 },
  { name: "Delhi", state: "Delhi NCR", lat: 28.61, lng: 77.20 },
  { name: "Manali", state: "Himachal Pradesh", lat: 32.24, lng: 77.18 },
  { name: "Chandigarh", state: "Punjab/Haryana", lat: 30.73, lng: 76.77 },
  { name: "Shimla", state: "Himachal Pradesh", lat: 31.10, lng: 77.17 },
  { name: "Spiti Valley", state: "Himachal Pradesh", lat: 32.22, lng: 78.05 },
  { name: "Leh Ladakh", state: "Ladakh", lat: 34.15, lng: 77.57 },
  { name: "Bangalore", state: "Karnataka", lat: 12.97, lng: 77.59 },
  { name: "Coorg", state: "Karnataka", lat: 12.33, lng: 75.80 },
  { name: "Ooty", state: "Tamil Nadu", lat: 11.41, lng: 76.69 },
  { name: "Mysore", state: "Karnataka", lat: 12.29, lng: 76.63 },
  { name: "Hyderabad", state: "Telangana", lat: 17.38, lng: 78.48 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.08, lng: 80.27 },
  { name: "Pondicherry", state: "Puducherry", lat: 11.94, lng: 79.80 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.91, lng: 75.78 },
  { name: "Jaisalmer", state: "Rajasthan", lat: 26.91, lng: 70.90 },
  { name: "Rishikesh", state: "Uttarakhand", lat: 30.08, lng: 78.26 },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.31, lng: 78.03 },
  { name: "Kolkata", state: "West Bengal", lat: 22.57, lng: 88.36 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.02, lng: 72.57 }
];

// Distance matrix lookup for popular routes
const ROUTE_DISTANCES = {
  "mumbai-goa": { km: 590, hours: "10h 30m", terrain: "Coastal Highway & Amboli Ghats", recommendedType: "4x4 Off-Road SUV" },
  "pune-goa": { km: 460, hours: "8h 15m", terrain: "NH-48 Expressway & Western Ghats", recommendedType: "Luxury Cruiser 5-Seater SUV" },
  "delhi-manali": { km: 540, hours: "11h 00m", terrain: "High Altitude Passes & Atal Tunnel", recommendedType: "4x4 Off-Road SUV" },
  "delhi-jaipur": { km: 280, hours: "4h 30m", terrain: "Delhi-Mumbai Mega Expressway", recommendedType: "Executive Luxury Sedan" },
  "bangalore-coorg": { km: 260, hours: "5h 15m", terrain: "Coffee Plantations & Hairpin Curves", recommendedType: "7-Seater 4x4 SUV" },
  "bangalore-ooty": { km: 280, hours: "6h 00m", terrain: "Bandipur Forest Reserve & 36 Hairpins", recommendedType: "Dual-Sport Adventure Bike" },
  "bangalore-goa": { km: 560, hours: "10h 00m", terrain: "Hubli Highway & Anmod Ghats", recommendedType: "VIP Hybrid Luxury MPV" },
  "chandigarh-spiti": { km: 480, hours: "13h 30m", terrain: "Extreme Rocky Trails & River Crossings", recommendedType: "Compact 4x4 Off-Roader" },
  "chennai-pondicherry": { km: 160, hours: "3h 15m", terrain: "East Coast Road (ECR) Scenic Oceanway", recommendedType: "Classic Heritage Cruiser" },
  "delhi-rishikesh": { km: 240, hours: "4h 45m", terrain: "Upper Ganga Canal Expressway", recommendedType: "Compact Premium SUV" },
  "jaipur-jaisalmer": { km: 560, hours: "9h 30m", terrain: "Thar Desert Expressway & Sand Trails", recommendedType: "Full-Size 4x4 SUV" }
};

export default function InteractiveRouteMap({ onSelectVehicleForBooking, onInspectInStudio }) {
  const { fleet, selectVehicle } = useGarage();

  const [startCity, setStartCity] = useState("Mumbai");
  const [destCity, setDestCity] = useState("Goa");
  const [activeAmenity, setActiveAmenity] = useState("ALL"); // ALL, FUEL, FOOD, SERVICE, REST
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);

  // Calculate route distance and characteristics
  const routeData = useMemo(() => {
    const key = `${startCity.toLowerCase()}-${destCity.toLowerCase()}`;
    const reverseKey = `${destCity.toLowerCase()}-${startCity.toLowerCase()}`;

    if (ROUTE_DISTANCES[key]) {
      return ROUTE_DISTANCES[key];
    }
    if (ROUTE_DISTANCES[reverseKey]) {
      return ROUTE_DISTANCES[reverseKey];
    }

    // Dynamic distance calculation using lat/long approximation
    const c1 = INDIAN_CITIES.find((c) => c.name.toLowerCase() === startCity.toLowerCase());
    const c2 = INDIAN_CITIES.find((c) => c.name.toLowerCase() === destCity.toLowerCase());

    if (c1 && c2) {
      const dLat = (c2.lat - c1.lat) * 111;
      const dLng = (c2.lng - c1.lng) * 96;
      const directKm = Math.sqrt(dLat * dLat + dLng * dLng);
      const roadKm = Math.round(directKm * 1.35); // 1.35x road curvature factor
      const hrs = Math.round((roadKm / 55) * 10) / 10;
      return {
        km: roadKm,
        hours: `${Math.floor(hrs)}h ${Math.round((hrs % 1) * 60)}m`,
        terrain: roadKm > 400 ? "Interstate National Highway & Expressways" : "Regional Highway & Scenic Corridors",
        recommendedType: roadKm > 500 ? "Full-Size 4x4 SUV" : "Compact Premium SUV"
      };
    }

    // Fallback
    return {
      km: 420,
      hours: "7h 45m",
      terrain: "National Highway Multi-Lane Corridor",
      recommendedType: "4x4 Off-Road SUV"
    };
  }, [startCity, destCity]);

  // Generate realistic along-the-route waypoints based on route distance
  const waypoints = useMemo(() => {
    const totalKm = routeData.km;
    return [
      {
        id: "w1",
        category: "FUEL",
        name: "Indian Oil Swastik Highway Hub",
        type: "Petrol • XP95 • Diesel • Nitrogen Air",
        kmMarker: Math.round(totalKm * 0.18),
        location: `KM ${Math.round(totalKm * 0.18)} from ${startCity}`,
        rating: 4.8,
        amenities: ["Clean Washrooms", "24/7 Nitrogen Tire Inflation", "EV 60kW DC Fast Charger", "ATM"]
      },
      {
        id: "w2",
        category: "FOOD",
        name: "CCD Express & Highway Dhaba Plaza",
        type: "Multi-Cuisine • Pure Veg Section • Fresh Filter Coffee",
        kmMarker: Math.round(totalKm * 0.38),
        location: `KM ${Math.round(totalKm * 0.38)} Mid-Point Plaza`,
        rating: 4.9,
        amenities: ["Air-Conditioned Dining", "Quick Takeaway", "Kids Play Area", "Clean Baby Care"]
      },
      {
        id: "w3",
        category: "SERVICE",
        name: "AutoSphere 24/7 Authorized Quick Care",
        type: "Mahindra • Toyota • Tata • RE Emergency Bay",
        kmMarker: Math.round(totalKm * 0.55),
        location: `KM ${Math.round(totalKm * 0.55)} Highway Junction`,
        rating: 4.9,
        amenities: ["Diagnostic Scan Tool", "Engine Oil Top-Up", "Brake Fluid Check", "24/7 Flatbed Towing Van"]
      },
      {
        id: "w4",
        category: "REST",
        name: "NHAI WaySide Oasis Rest Plaza",
        type: "NHAI Certified Clean Highway Rest Stop",
        kmMarker: Math.round(totalKm * 0.72),
        location: `KM ${Math.round(totalKm * 0.72)} Ghat Entry Point`,
        rating: 4.7,
        amenities: ["Sanitized Restrooms", "24/7 Pharmacy", "Vehicle Cooling Shed", "Fresh Snacks Counter"]
      },
      {
        id: "w5",
        category: "FUEL",
        name: "Tata Power & HP Supercharge Station",
        type: "120kW Dual-Gun DC Fast Charger & Turbo Diesel",
        kmMarker: Math.round(totalKm * 0.88),
        location: `KM ${Math.round(totalKm * 0.88)} Near Destination Approach`,
        rating: 4.8,
        amenities: ["CCS2 EV Charger (10-80% in 35 mins)", "Convenience Store", "Tire Pressure Station"]
      }
    ];
  }, [routeData, startCity]);

  // Filtered waypoints
  const filteredWaypoints = useMemo(() => {
    if (activeAmenity === "ALL") return waypoints;
    return waypoints.filter((w) => w.category === activeAmenity);
  }, [waypoints, activeAmenity]);

  // Recommended matching vehicle from fleet for this route
  const recommendedVehicle = useMemo(() => {
    return (
      fleet.find((v) => v.category === routeData.recommendedType) ||
      fleet.find((v) => v.name.includes("thar")) ||
      fleet[0]
    );
  }, [fleet, routeData]);

  // Calculate live route budget for the recommended vehicle
  const estimatedFuelLiters = Math.round((routeData.km / (recommendedVehicle.fuelKmPerUnit || 15)) * 10) / 10;
  const fuelRate = INDIAN_FUEL_RATES[recommendedVehicle.fuelType] || 104;
  const estimatedFuelCost = Math.round(estimatedFuelLiters * fuelRate);
  const estimatedTolls = recommendedVehicle.type === "BIKE" ? 0 : Math.round(routeData.km * 1.45);
  const totalTripEstimate = recommendedVehicle.priceNum + estimatedFuelCost + estimatedTolls;

  const handleSwap = () => {
    const temp = startCity;
    setStartCity(destCity);
    setDestCity(temp);
  };

  return (
    <div className="route-map-panel select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00f0ff", display: "inline-block", boxShadow: "0 0 8px #00f0ff" }}></span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#00f0ff", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              INTERACTIVE PAN-INDIA HIGHWAY ROUTE NAVIGATOR
            </span>
          </div>
          <h2 className="route-map-title">
            Route Amenities, Fuel Stops & Waypoint Intelligence
          </h2>
          <p className="route-map-desc">
            Enter any Indian start and destination to discover certified fuel stations, EV chargers, restaurants, and 24/7 service points
          </p>
        </div>

        {/* Live Route Summary Badge */}
        <div className="route-stat-box">
          <div>
            <span style={{ fontSize: "9.5px", color: "#94a3b8", fontFamily: "monospace", fontWeight: 700, display: "block" }}>TOTAL HIGHWAY DISTANCE</span>
            <span style={{ fontSize: "19px", fontWeight: 900, color: "#00f0ff", fontFamily: "monospace" }}>{routeData.km} km</span>
          </div>
          <div style={{ width: "1px", height: "32px", background: "rgba(255, 255, 255, 0.12)" }}></div>
          <div>
            <span style={{ fontSize: "9.5px", color: "#94a3b8", fontFamily: "monospace", fontWeight: 700, display: "block" }}>DRIVE TIME EST.</span>
            <span style={{ fontSize: "19px", fontWeight: 800, color: "#ffffff", fontFamily: "monospace" }}>{routeData.hours}</span>
          </div>
        </div>
      </div>

      {/* Start & End City Selector Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-4 items-center" style={{ margin: "18px 0" }}>
        {/* Start City */}
        <div className="md:col-span-5 relative">
          <label className="route-input-label">
            DEPARTURE ORIGIN (FROM):
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "10px", fontSize: "14px" }}>📍</span>
            <input
              type="text"
              value={startCity}
              onChange={(e) => setStartCity(e.target.value)}
              placeholder="e.g. Mumbai, Delhi, Bangalore, Hyderabad..."
              list="cities-list"
              className="route-city-input"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-2 flex justify-center pt-4 md:pt-4" style={{ display: "flex", justifyContent: "center", paddingTop: "16px" }}>
          <button
            type="button"
            onClick={handleSwap}
            className="cyber-map-swap-btn"
            title="Swap Origin and Destination"
          >
            ⇄
          </button>
        </div>

        {/* Destination City */}
        <div className="md:col-span-5 relative">
          <label className="route-input-label">
            DESTINATION ARRIVAL (TO):
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "10px", fontSize: "14px" }}>🏁</span>
            <input
              type="text"
              value={destCity}
              onChange={(e) => setDestCity(e.target.value)}
              placeholder="e.g. Goa, Manali, Coorg, Leh Ladakh, Ooty..."
              list="cities-list"
              className="route-city-input"
            />
          </div>
        </div>

        <datalist id="cities-list">
          {INDIAN_CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.state}
            </option>
          ))}
        </datalist>
      </div>

      {/* Popular Route Fast-Chips */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px", alignItems: "center" }}>
        <span style={{ fontSize: "10.5px", color: "#94a3b8", fontFamily: "monospace", fontWeight: 800, whiteSpace: "nowrap" }}>
          QUICK INDIAN ROUTES:
        </span>
        {[
          { from: "Mumbai", to: "Goa" },
          { from: "Delhi", to: "Manali" },
          { from: "Bangalore", to: "Coorg" },
          { from: "Chandigarh", to: "Spiti Valley" },
          { from: "Chennai", to: "Pondicherry" },
          { from: "Jaipur", to: "Jaisalmer" },
          { from: "Delhi", to: "Rishikesh" }
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setStartCity(item.from);
              setDestCity(item.to);
            }}
            className="filter-pill-btn"
            style={{ padding: "5px 12px", fontSize: "11px", color: "#cbd5e1" }}
          >
            {item.from} → {item.to}
          </button>
        ))}
      </div>

      {/* AMENITY FILTER TOGGLES */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveAmenity("ALL")}
            className={`cyber-amenity-chip ${activeAmenity === "ALL" ? "active" : ""}`}
          >
            All Waypoints ({waypoints.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveAmenity("FUEL")}
            className={`cyber-amenity-chip ${activeAmenity === "FUEL" ? "active" : ""}`}
          >
            <span>⛽ Fuel & EV Chargers</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveAmenity("FOOD")}
            className={`cyber-amenity-chip ${activeAmenity === "FOOD" ? "active" : ""}`}
          >
            <span>🍽️ Dhabas & Dining</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveAmenity("SERVICE")}
            className={`cyber-amenity-chip ${activeAmenity === "SERVICE" ? "active" : ""}`}
          >
            <span>🔧 24/7 Car Service</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveAmenity("REST")}
            className={`cyber-amenity-chip ${activeAmenity === "REST" ? "active" : ""}`}
          >
            <span>🚻 Clean Restrooms</span>
          </button>
        </div>

        <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>
          Terrain: <strong style={{ color: "#38bdf8", fontWeight: 700 }}>{routeData.terrain}</strong>
        </span>
      </div>

      {/* INTERACTIVE HIGHWAY CORRIDOR VISUAL MAP */}
      <div className="route-corridor-canvas">
        {/* Asphalt Highway Graphic Lane in Center */}
        <div style={{ position: "relative", padding: "30px 16px" }}>
          {/* Highway Road Line */}
          <div className="route-road-track">
            {/* Dashed Center Road Markings */}
            <div className="route-center-line"></div>

            {/* Start Pin */}
            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#00f0ff",
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 12px rgba(0, 240, 255, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  color: "#000000",
                  fontWeight: 900
                }}
              >
                A
              </span>
              <span className="route-city-marker-text">
                {startCity} (KM 0)
              </span>
            </div>

            {/* Waypoint Pins Placed Along the Road */}
            {waypoints.map((wp) => {
              const posPercent = (wp.kmMarker / routeData.km) * 100;
              const isSelected = selectedWaypoint?.id === wp.id;
              const isMatch = activeAmenity === "ALL" || activeAmenity === wp.category;

              if (!isMatch) return null;

              const badgeColors = {
                FUEL: { bg: "#f59e0b", color: "#000000" },
                FOOD: { bg: "#10b981", color: "#000000" },
                SERVICE: { bg: "#3b82f6", color: "#ffffff" },
                REST: { bg: "#6366f1", color: "#ffffff" }
              };

              const icons = {
                FUEL: "⛽",
                FOOD: "🍽️",
                SERVICE: "🔧",
                REST: "🚻"
              };

              const currentTheme = badgeColors[wp.category] || { bg: "#3b82f6", color: "#ffffff" };

              return (
                <div
                  key={wp.id}
                  onClick={() => setSelectedWaypoint(wp)}
                  style={{
                    position: "absolute",
                    left: `${Math.min(Math.max(posPercent, 12), 88)}%`,
                    transform: "translateX(-50%)",
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      background: currentTheme.bg,
                      color: currentTheme.color,
                      boxShadow: isSelected ? "0 0 16px #00f0ff" : "0 4px 10px rgba(0, 0, 0, 0.5)",
                      transform: isSelected ? "scale(1.2)" : "scale(1)",
                      border: isSelected ? "2px solid #ffffff" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {icons[wp.category]}
                  </div>

                  <span className="route-waypoint-label" style={{ color: isSelected ? "#00f0ff" : "#f1f5f9" }}>
                    {wp.kmMarker} km
                  </span>
                </div>
              );
            })}

            {/* End Pin */}
            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#10b981",
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 12px rgba(16, 185, 129, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  color: "#000000",
                  fontWeight: 900
                }}
              >
                B
              </span>
              <span className="route-city-marker-text">
                {destCity} (KM {routeData.km})
              </span>
            </div>
          </div>
        </div>

        {/* Selected Waypoint Detail Card */}
        {selectedWaypoint && (
          <div className="route-waypoint-popup">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "10px", fontFamily: "monospace", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", background: "#00f0ff", color: "#000000", textTransform: "uppercase" }}>
                  {selectedWaypoint.category} STOP
                </span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>{selectedWaypoint.name}</span>
                <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 700 }}>★ {selectedWaypoint.rating}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWaypoint(null)}
                style={{ color: "#94a3b8", background: "transparent", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", cursor: "pointer" }}
              >
                Close ✕
              </button>
            </div>
            <p style={{ fontSize: "12px", color: "#cbd5e1", margin: "4px 0 0 0" }}>{selectedWaypoint.type} • {selectedWaypoint.location}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
              {selectedWaypoint.amenities.map((am, i) => (
                <span
                  key={i}
                  style={{ fontSize: "11px", fontFamily: "monospace", padding: "3px 8px", borderRadius: "6px", background: "#090e1a", color: "#cbd5e1", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  ✓ {am}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ROUTE VEHICLE RECOMMENDATION & TRIP BUDGET STRIP */}
      <div className="route-recommendation-bar">
        {/* Recommended Vehicle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "260px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#090e1a",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}
          >
            {recommendedVehicle.type === "BIKE" ? "🏍️" : "🚙"}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "9.5px", fontFamily: "monospace", fontWeight: 800, color: "#00f0ff", textTransform: "uppercase" }}>
                ★ TOP MATCH FOR {startCity.toUpperCase()} → {destCity.toUpperCase()}
              </span>
              <span style={{ fontSize: "10px", color: "#10b981", fontFamily: "monospace", fontWeight: 700 }}>
                {recommendedVehicle.type === "BIKE" ? "Toll-Free NHAI" : "FASTag Active"}
              </span>
            </div>
            <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff", margin: "2px 0 0 0" }}>
              {recommendedVehicle.displayName || `${recommendedVehicle.brand} ${recommendedVehicle.model}`}
            </h4>
            <span style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginTop: "2px" }}>
              {recommendedVehicle.pricePerDay}/day • {recommendedVehicle.fuelType} ({recommendedVehicle.fuelEconomy}) • Ground Clearance: {recommendedVehicle.groundClearance}
            </span>
          </div>
        </div>

        {/* Live Trip Cost Estimator for this Route */}
        <div className="route-cost-summary-box">
          <div>
            <span style={{ fontSize: "9.5px", color: "#94a3b8", fontFamily: "monospace", fontWeight: 700, display: "block" }}>ESTIMATED FUEL</span>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#fcd34d", fontFamily: "monospace", display: "block" }}>₹{estimatedFuelCost.toLocaleString("en-IN")}</span>
            <span style={{ fontSize: "9.5px", color: "#64748b", fontFamily: "monospace", display: "block" }}>~{estimatedFuelLiters}L</span>
          </div>

          <div style={{ width: "1px", height: "32px", background: "rgba(255, 255, 255, 0.12)" }}></div>

          <div>
            <span style={{ fontSize: "9.5px", color: "#94a3b8", fontFamily: "monospace", fontWeight: 700, display: "block" }}>FASTAG TOLLS</span>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#38bdf8", fontFamily: "monospace", display: "block" }}>
              {estimatedTolls > 0 ? `₹${estimatedTolls.toLocaleString("en-IN")}` : "₹0 (Free)"}
            </span>
            <span style={{ fontSize: "9.5px", color: "#64748b", fontFamily: "monospace", display: "block" }}>Automated RFID</span>
          </div>

          <div style={{ width: "1px", height: "32px", background: "rgba(255, 255, 255, 0.12)" }}></div>

          <div>
            <span style={{ fontSize: "9.5px", color: "#94a3b8", fontFamily: "monospace", fontWeight: 700, display: "block" }}>TOTAL ESTIMATE</span>
            <span style={{ fontSize: "17px", fontWeight: 900, color: "#ffffff", fontFamily: "monospace", display: "block" }}>₹{totalTripEstimate.toLocaleString("en-IN")}</span>
            <span style={{ fontSize: "9.5px", color: "#10b981", fontFamily: "monospace", display: "block" }}>Rental + Fuel + Tolls</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              if (onInspectInStudio) onInspectInStudio(recommendedVehicle);
            }}
            className="btn-card-inspect"
          >
            3D Studio
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSelectVehicleForBooking) onSelectVehicleForBooking(recommendedVehicle);
            }}
            className="btn-card-rent"
          >
            Rent for this Route →
          </button>
        </div>
      </div>
    </div>
  );
}
