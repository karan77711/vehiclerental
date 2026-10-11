import axios from "axios";

// ✅ Base URL for your Spring Boot backend
const API_BASE_URL = "http://localhost:8082";

// ✅ Fetch all rentals
export async function fetchRentals() {
  const response = await axios.get(`${API_BASE_URL}/rentals`);
  return response.data;
}

// ✅ Create a new rental
export async function createRental(rentalData) {
  const response = await axios.post(`${API_BASE_URL}/rentals`, rentalData);
  return response.data;
}

// ✅ Fetch cars from external API (CarsXE) using .env key
export async function searchCar(query) {
  const API_KEY = import.meta.env.VITE_CARSXE_API_KEY; // 🔑 loaded from .env
  const response = await axios.get(
    `https://api.carsxe.com/images?make=${query}&api_key=${API_KEY}`
  );
  return response.data;
}
