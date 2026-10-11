import React from "react";

export default function CarCard({ car, onRent }) {
  return (
    <div className="car-card">
      <img src={car.imageUrl} alt={car.name} />
      <h3>{car.name}</h3>
      <p>{car.price} / day</p>
      <div className="buttons">
        <button onClick={onRent}>Rent Now</button>
        <a href={car.manufacturerUrl} target="_blank" rel="noreferrer">Learn More</a>
      </div>
    </div>
  );
}
