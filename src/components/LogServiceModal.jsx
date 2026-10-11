import React, { useState } from "react";
import { useGarage } from "../context/GarageContext";

export default function LogServiceModal({ isOpen, onClose }) {
  const { activeVehicle, logService } = useGarage();
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    type: "General Service",
    odometer: activeVehicle?.odometer ? activeVehicle.odometer + 500 : 1500,
    cost: 5500,
    center: "Mahindra Authorized Service Center",
    notes: "Synthetic engine oil flush, oil filter, brake inspection, multi-point check.",
    nextServiceDate: "30 Dec 2027"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    logService(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Log Maintenance Service</h3>
            <p className="modal-subtitle">Recording service for: <span className="text-white font-semibold">{activeVehicle?.name}</span> ({activeVehicle?.plate})</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Service Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="25 Mar 2025"
                required
              />
            </div>
            <div className="form-group">
              <label>Service Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="General Service">General Service</option>
                <option value="Engine Oil & Filter Flush">Engine Oil & Filter Flush</option>
                <option value="Brake Pad & Rotor Service">Brake Pad & Rotor Service</option>
                <option value="Transmission / 4x4 Fluid">Transmission / 4x4 Fluid</option>
                <option value="Battery Replacement">Battery Replacement</option>
                <option value="Tire Rotation & Wheel Alignment">Tire Rotation & Alignment</option>
                <option value="Major Inspection (20,000 km)">Major Inspection</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Odometer at Service (km)</label>
              <input
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: Number(e.target.value) })}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Cost / Invoice Amount (₹)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Service Center / Workshop</label>
            <input
              type="text"
              value={formData.center}
              onChange={(e) => setFormData({ ...formData, center: e.target.value })}
              placeholder="e.g. Authorized Dealership Workshop"
              required
            />
          </div>

          <div className="form-group">
            <label>Next Recommended Service Date</label>
            <input
              type="text"
              value={formData.nextServiceDate}
              onChange={(e) => setFormData({ ...formData, nextServiceDate: e.target.value })}
              placeholder="30 Dec 2027"
              required
            />
          </div>

          <div className="form-group">
            <label>Maintenance Notes & Diagnostics</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="List parts replaced, fluids filled, and mechanics comments..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary-action">
              Save Service Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
