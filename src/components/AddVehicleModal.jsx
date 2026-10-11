import React, { useState } from "react";
import { useGarage } from "../context/GarageContext";

const COLOR_PRESETS = [
  { name: "Silver", hex: "#b4b8be" },
  { name: "Napoli Black", hex: "#1c1c1f" },
  { name: "Red Rage", hex: "#dc2626" },
  { name: "Aqua Marine", hex: "#0891b2" },
  { name: "Desert Sand", hex: "#c2a688" },
  { name: "Everest White", hex: "#f1f5f9" },
  { name: "Olive Green", hex: "#4b5945" }
];

export default function AddVehicleModal({ isOpen, onClose }) {
  const { addVehicle } = useGarage();
  const [formData, setFormData] = useState({
    brand: "Mahindra",
    model: "Thar 4x4",
    year: 2023,
    plate: "TS03US4107",
    odometer: 14,
    type: "CAR",
    color: "Silver",
    colorHex: "#b4b8be",
    health: 94,
    spend: 5500,
    lastServiceDate: "25 Mar 2025",
    nextServiceDate: "30 Dec 2027"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addVehicle({
      ...formData,
      name: `${formData.brand} ${formData.model}`.toLowerCase()
    });
    onClose();
  };

  const selectColor = (c) => {
    setFormData((prev) => ({ ...prev, color: c.name, colorHex: c.hex }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Add Vehicle to Garage</h3>
            <p className="modal-subtitle">AutoSphere tracks maintenance, telemetry and 3D visual status</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Make / Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Mahindra, Tata, Kawasaki"
                required
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Thar, Harrier, Swift"
                required
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                min="1990"
                max="2030"
                required
              />
            </div>
            <div className="form-group">
              <label>Vehicle Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="CAR">Car</option>
                <option value="BIKE">Bike</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
            <div className="form-group">
              <label>License Plate</label>
              <input
                type="text"
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                placeholder="TS03US4107"
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Current Odometer (km)</label>
              <input
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Initial Health Score (%)</label>
              <input
                type="number"
                value={formData.health}
                onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                min="50"
                max="100"
                required
              />
            </div>
          </div>

          {/* Color Selection */}
          <div className="form-group">
            <label>Exterior Paint: <span className="text-white font-medium">{formData.color}</span></label>
            <div className="color-swatches-row">
              {COLOR_PRESETS.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => selectColor(c)}
                  className={`color-swatch-item ${formData.color === c.name ? "selected" : ""}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary-action">
              Save Vehicle to Garage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
