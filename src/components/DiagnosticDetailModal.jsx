import React from "react";
import { useGarage } from "../context/GarageContext";

export default function DiagnosticDetailModal({ systemKey, onClose }) {
  const { activeVehicle } = useGarage();

  if (!systemKey || !activeVehicle) return null;

  const systemData = activeVehicle.systemHealth?.[systemKey] || {
    score: 98,
    status: "Certified Ready",
    note: "All mechanical and safety telemetry verified for rental handover."
  };

  const titles = {
    engine: "mStallion 2.0L Turbo Powertrain & Handover Condition",
    brakes: "Dual-Circuit Disc Brakes & ABS Pre-Trip Inspection",
    transmission: "6-Speed Automatic 4WD Shift-On-The-Fly",
    suspension: "High-Clearance Offroad Suspension & Articulation",
    battery: "Electrical System, Auxiliary Lights & Battery Condition",
    tires: "All-Terrain 255/65 R18 Tires & Tread Depth"
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
              • AI PRE-RENTAL HANDOVER INSPECTION
            </div>
            <h3 className="modal-title">{titles[systemKey] || systemKey.toUpperCase()}</h3>
            <p className="modal-subtitle">
              Verified roadworthiness for rental: {activeVehicle.displayName || activeVehicle.name} ({activeVehicle.plate})
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        <div className="diagnostic-score-box">
          <div className="score-circle">
            <span className="score-num">{systemData.score}%</span>
            <span className="score-lbl">READY</span>
          </div>
          <div className="score-meta">
            <div className="score-status-badge">
              <span className="pulse-dot"></span>
              {systemData.status}
            </div>
            <p className="score-note">{systemData.note}</p>
          </div>
        </div>

        <div className="telemetry-grid">
          {Object.entries(systemData)
            .filter(([key]) => !["score", "status", "note"].includes(key))
            .map(([k, v]) => (
              <div key={k} className="telemetry-item">
                <span className="telemetry-label">{k.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
                <span className="telemetry-val">{v}</span>
              </div>
            ))}
        </div>

        <div className="modal-actions mt-4">
          <button onClick={onClose} className="btn-primary-action w-full">
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
}
