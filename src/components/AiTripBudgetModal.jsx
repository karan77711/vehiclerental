import React, { useState, useMemo } from "react";
import { useGarage } from "../context/GarageContext";
import { INDIAN_ROUTE_PRESETS, INDIAN_FUEL_RATES } from "../data/indianVehicles";

export default function AiTripBudgetModal({ isOpen, onClose, onOpenBookModal }) {
  const { fleet, selectVehicle } = useGarage();

  const [selectedRouteId, setSelectedRouteId] = useState("delhi-manali");
  const [customDistance, setCustomDistance] = useState(1080);
  const [tripDays, setTripDays] = useState(5);
  const [travelers, setTravelers] = useState(4);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("ALL"); // ALL, CAR, BIKE
  const [budgetTier, setBudgetTier] = useState("ALL"); // ALL, BUDGET, MID, LUXURY

  const activeRoute = useMemo(() => {
    return INDIAN_ROUTE_PRESETS.find((r) => r.id === selectedRouteId) || INDIAN_ROUTE_PRESETS[0];
  }, [selectedRouteId]);

  // When route preset changes, update days and distance (round trip)
  const handleRouteChange = (routeId) => {
    setSelectedRouteId(routeId);
    const r = INDIAN_ROUTE_PRESETS.find((item) => item.id === routeId);
    if (r) {
      setTripDays(r.suggestedDays);
      setCustomDistance(r.distanceKm * 2); // Round trip
    }
  };

  // Calculate budget breakdown for any vehicle
  const calculateVehicleBudget = (v) => {
    const rentalTotal = v.priceNum * tripDays;
    const fuelRate = INDIAN_FUEL_RATES[v.fuelType] || 104;
    const fuelLiters = Math.round((customDistance / (v.fuelKmPerUnit || 15)) * 10) / 10;
    const fuelCost = Math.round(fuelLiters * fuelRate);
    
    // In India, NHAI national highways exempt 2-wheelers from toll charges!
    const tollCost = v.type === "BIKE" ? 0 : Math.round(customDistance * 1.45);
    const grandTotal = rentalTotal + fuelCost + tollCost;
    const perPersonCost = Math.round(grandTotal / (travelers || 1));

    return {
      rentalTotal,
      fuelCost,
      fuelLiters,
      tollCost,
      deposit: v.deposit,
      grandTotal,
      perPersonCost
    };
  };

  // Filter and score vehicles based on trip parameters
  const rankedVehicles = useMemo(() => {
    let pool = fleet.filter((v) => {
      // Vehicle type filter
      if (vehicleTypeFilter === "CAR" && v.type !== "CAR") return false;
      if (vehicleTypeFilter === "BIKE" && v.type !== "BIKE") return false;

      // Traveler capacity constraint
      if (travelers > 2 && v.type === "BIKE") return false;
      if (travelers > 5 && !["toyota fortuner", "mahindra scorpio", "tata safari", "toyota innova hycross", "mahindra xuv700"].includes(v.name)) return false;

      // Budget tier filter
      if (budgetTier === "BUDGET" && v.priceNum > 3000) return false;
      if (budgetTier === "MID" && (v.priceNum < 3000 || v.priceNum > 5500)) return false;
      if (budgetTier === "LUXURY" && v.priceNum <= 5500) return false;

      return true;
    });

    if (pool.length === 0) {
      pool = fleet;
    }

    return pool.map((v) => {
      const budget = calculateVehicleBudget(v);
      let matchScore = 80;

      // Route category match
      if (activeRoute.recommendedCategory.includes(v.category)) {
        matchScore += 12;
      }

      // 4x4 bonus for mountains/offroad
      if ((activeRoute.terrain.includes("Altitude") || activeRoute.terrain.includes("Off-road")) && v.category.includes("4x4")) {
        matchScore += 8;
      }

      // Hybrid/economy bonus for long distance
      if (customDistance > 600 && (v.fuelType === "Strong Hybrid" || v.fuelKmPerUnit > 20)) {
        matchScore += 6;
      }

      // Group capacity fit
      if (travelers >= 5 && v.specs?.seating?.includes("7")) {
        matchScore += 5;
      }

      matchScore = Math.min(matchScore, 99);

      return {
        vehicle: v,
        budget,
        matchScore
      };
    }).sort((a, b) => b.matchScore - a.matchScore || a.budget.grandTotal - b.budget.grandTotal);
  }, [fleet, activeRoute, tripDays, customDistance, travelers, vehicleTypeFilter, budgetTier]);

  if (!isOpen) return null;

  const topPick = rankedVehicles[0];
  const runnerUps = rankedVehicles.slice(1, 4);

  const handleSelectStudio = (v) => {
    selectVehicle(v.id);
    onClose();
  };

  const handleBookVehicle = (v) => {
    onClose();
    if (onOpenBookModal) {
      onOpenBookModal(v);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card wide"
        style={{ maxWidth: "920px", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>AI TRIP PLANNER & EXPENSE BUDGET ENGINE</span>
            </div>
            <h3 className="modal-title">Indian Road Trip & Budget Intelligence</h3>
            <p className="modal-subtitle">
              Calculates real rental fees, fuel costs at Indian rates, FASTag tolls & splits expenses per person
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        {/* Route Selector Presets */}
        <div className="mb-4">
          <label className="text-[11.5px] font-semibold text-slate-300 block mb-1.5">
            Select a Popular Indian Route or Destination:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {INDIAN_ROUTE_PRESETS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRouteChange(r.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all text-left border ${
                  selectedRouteId === r.id
                    ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20"
                    : "bg-[#111624] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-white">{r.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {r.distanceKm * 2} km RT • {r.suggestedDays} days
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Route Intelligence Alert Banner */}
        <div className="p-3 rounded-lg bg-slate-900/90 border border-cyan-900/40 mb-4 flex items-start gap-2.5">
          <span className="text-base">📍</span>
          <div className="text-xs">
            <span className="font-semibold text-cyan-300">{activeRoute.from} → {activeRoute.to}: </span>
            <span className="text-slate-300">{activeRoute.terrain}. </span>
            <span className="text-slate-400 font-mono text-[11px] block mt-0.5">
              ⚠️ Note: {activeRoute.roadConditionNote}
            </span>
          </div>
        </div>

        {/* Interactive Trip Controls Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 p-3 rounded-xl bg-[#0b101d] border border-slate-800">
          {/* Days */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 block mb-1">
              TRIP DURATION: <span className="text-cyan-400 font-mono">{tripDays} Days</span>
            </label>
            <input
              type="range"
              min="1"
              max="14"
              value={tripDays}
              onChange={(e) => setTripDays(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>1d</span>
              <span>7d</span>
              <span>14d</span>
            </div>
          </div>

          {/* Distance */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 block mb-1">
              ROUND TRIP: <span className="text-cyan-400 font-mono">{customDistance} km</span>
            </label>
            <input
              type="range"
              min="50"
              max="3000"
              step="50"
              value={customDistance}
              onChange={(e) => setCustomDistance(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>50km</span>
              <span>1500km</span>
              <span>3000km</span>
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 block mb-1">
              TRAVELERS: <span className="text-cyan-400 font-mono">{travelers} {travelers === 1 ? "Person" : "People"}</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 4, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setTravelers(num)}
                  className={`flex-1 py-1 rounded text-xs font-semibold ${
                    travelers === num
                      ? "bg-cyan-500 text-black"
                      : "bg-[#161d2f] text-slate-400 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type & Budget Tier */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 block mb-1">
              FLEET FILTER:
            </label>
            <div className="flex gap-1 mb-1">
              {["ALL", "CAR", "BIKE"].map((type) => (
                <button
                  key={type}
                  onClick={() => setVehicleTypeFilter(type)}
                  className={`flex-1 py-1 rounded text-[10.5px] font-semibold ${
                    vehicleTypeFilter === type
                      ? "bg-cyan-500 text-black"
                      : "bg-[#161d2f] text-slate-400 hover:text-white"
                  }`}
                >
                  {type === "ALL" ? "All" : type === "CAR" ? "Cars" : "Bikes"}
                </button>
              ))}
            </div>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              className="w-full bg-[#161d2f] text-slate-300 border border-slate-700/60 rounded px-2 py-0.5 text-[10.5px] outline-none"
            >
              <option value="ALL">All Budget Tiers</option>
              <option value="BUDGET">Budget Friendly (&lt; ₹3,000/day)</option>
              <option value="MID">Mid Adventure (₹3k - ₹5.5k)</option>
              <option value="LUXURY">Luxury VIP (&gt; ₹5,500/day)</option>
            </select>
          </div>
        </div>

        {/* TOP AI RECOMMENDATION CARD */}
        {topPick && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#11192d] to-[#0d1424] border-2 border-cyan-500/60 shadow-lg shadow-cyan-950/40 mb-4">
            {/* Real Vehicle Photography Banner */}
            <div className="relative rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800" style={{ height: "160px" }}>
              <img
                src={topPick.vehicle.image || `/vehicles/${topPick.vehicle.type === "BIKE" ? "himalayan.jpg" : "thar.jpg"}`}
                alt={topPick.vehicle.displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `/vehicles/${topPick.vehicle.type === "BIKE" ? "himalayan.jpg" : "thar.jpg"}`;
                }}
              />
              <div className="card-photo-gradient" style={{ height: "50px" }} />
              <div className="absolute top-2.5 left-2.5 flex gap-2">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-cyan-300 font-mono text-[10.5px] border border-cyan-500/40 font-bold">
                  ★ {topPick.matchScore}% Top Match
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/90 backdrop-blur-md text-black font-mono text-[10.5px] font-bold">
                  {topPick.vehicle.type === "BIKE" ? "Toll-Free NHAI" : "FASTag Active"}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500 text-black font-extrabold text-[10px] tracking-wider uppercase">
                    🏆 #1 AI TRIP MATCH
                  </span>
                  <span className="text-cyan-400 font-mono font-bold text-xs">
                    {topPick.matchScore}% Match Score
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    • {topPick.vehicle.plate} ({topPick.vehicle.state})
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mt-1">
                  {topPick.vehicle.displayName || topPick.vehicle.name}
                </h4>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>Category: <strong className="text-slate-200">{topPick.vehicle.category}</strong></span>
                  <span>•</span>
                  <span>Fuel: <strong className="text-slate-200">{topPick.vehicle.fuelType} ({topPick.vehicle.fuelEconomy})</strong></span>
                  <span>•</span>
                  <span>Clearance: <strong className="text-slate-200">{topPick.vehicle.groundClearance}</strong></span>
                </div>
              </div>

              {/* Price Callout */}
              <div className="text-left md:text-right bg-slate-900/80 px-3.5 py-2 rounded-lg border border-slate-700/60">
                <div className="text-[10px] text-slate-400 uppercase font-mono">ESTIMATED TOTAL TRIP COST</div>
                <div className="text-2xl font-black text-cyan-400">
                  ₹{topPick.budget.grandTotal.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold font-mono">
                  ₹{topPick.budget.perPersonCost.toLocaleString("en-IN")} / person ({travelers} pax)
                </div>
              </div>
            </div>

            {/* Complete Budget Breakdown Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-3.5">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">RENTAL FEE ({tripDays} DAYS)</span>
                <span className="text-sm font-bold text-white">₹{topPick.budget.rentalTotal.toLocaleString("en-IN")}</span>
                <span className="text-[9.5px] text-slate-400 block font-mono">{topPick.vehicle.pricePerDay}/day</span>
              </div>

              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">ESTIMATED FUEL ({customDistance} KM)</span>
                <span className="text-sm font-bold text-amber-300">₹{topPick.budget.fuelCost.toLocaleString("en-IN")}</span>
                <span className="text-[9.5px] text-slate-400 block font-mono">~{topPick.budget.fuelLiters} Litres @ Indian avg</span>
              </div>

              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">FASTAG TOLLS EST.</span>
                <span className="text-sm font-bold text-cyan-300">
                  {topPick.budget.tollCost > 0 ? `₹${topPick.budget.tollCost.toLocaleString("en-IN")}` : "₹0 (Toll Exempt)"}
                </span>
                <span className="text-[9.5px] text-slate-400 block font-mono">
                  {topPick.vehicle.type === "BIKE" ? "2-Wheelers NHAI Free" : "Automated RFID FASTag"}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">SECURITY DEPOSIT</span>
                <span className="text-sm font-bold text-slate-300">₹{topPick.budget.deposit.toLocaleString("en-IN")}</span>
                <span className="text-[9.5px] text-emerald-400 block font-mono">100% Refundable on return</span>
              </div>
            </div>

            {/* AI Recommendation Reason */}
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0b101c] p-2.5 rounded border border-slate-800/80">
              💡 <strong className="text-cyan-300">Why AutoSphere AI selected this:</strong> {topPick.vehicle.aiRecommendation}
            </p>

            {/* Actions */}
            <div className="flex gap-2.5 mt-3.5">
              <button
                type="button"
                onClick={() => handleSelectStudio(topPick.vehicle)}
                className="btn-card-inspect flex-1 flex items-center justify-center gap-1.5"
                style={{ padding: "9px 16px" }}
              >
                <span>🔍 Inspect in 3D Studio</span>
              </button>
              <button
                type="button"
                onClick={() => handleBookVehicle(topPick.vehicle)}
                className="btn-card-rent flex-1 flex items-center justify-center gap-1.5"
                style={{ padding: "9px 16px" }}
              >
                <span>⚡ Reserve {topPick.vehicle.brand} {topPick.vehicle.model} →</span>
              </button>
            </div>
          </div>
        )}

        {/* RUNNER-UP ALTERNATIVE VEHICLES */}
        {runnerUps.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              Alternative Matches for this Trip:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {runnerUps.map(({ vehicle, budget, matchScore }) => (
                <div
                  key={vehicle.id}
                  className="p-3 rounded-lg bg-[#0e1424] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                        {matchScore}% Match
                      </span>
                      <span className="text-xs font-bold text-white">{vehicle.pricePerDay}</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">{vehicle.displayName}</h5>
                    <div className="text-[10.5px] text-slate-400 mt-0.5">
                      {vehicle.category} • {vehicle.fuelEconomy}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 block font-mono">TOTAL TRIP EST.</span>
                      <span className="text-xs font-bold text-cyan-400">
                        ₹{budget.grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSelectStudio(vehicle)}
                        className="px-2 py-1 rounded text-[10.5px] bg-slate-800 text-slate-300 hover:text-white"
                        title="View in 3D"
                      >
                        3D View
                      </button>
                      <button
                        onClick={() => handleBookVehicle(vehicle)}
                        className="px-2 py-1 rounded text-[10.5px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black font-semibold"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
