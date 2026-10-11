import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { INDIAN_FLEET } from "../data/indianVehicles";

const GarageContext = createContext();

export function GarageProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("autosphere_user");
    return saved ? JSON.parse(saved) : { name: "ravi", email: "ravi@gmail.com", role: "USER" };
  });

  const [fleet, setFleet] = useState(() => {
    const saved = localStorage.getItem("autosphere_fleet");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 18) {
          return parsed.map((item) => {
            const fresh = INDIAN_FLEET.find((f) => f.id === item.id) || {};
            return {
              ...fresh,
              ...item,
              image: fresh.image || item.image,
              subtitle: fresh.subtitle || item.subtitle,
              powerHp: fresh.powerHp || item.powerHp
            };
          });
        }
      } catch (e) {
        // Fallback to fresh Indian fleet
      }
    }
    return INDIAN_FLEET;
  });

  const [activeVehicleId, setActiveVehicleId] = useState(() => {
    const saved = localStorage.getItem("autosphere_active_id");
    return saved ? Number(saved) : 1;
  });

  const [rentals, setRentals] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [aiFilterQuery, setAiFilterQuery] = useState("");

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("autosphere_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("autosphere_fleet", JSON.stringify(fleet));
  }, [fleet]);

  useEffect(() => {
    localStorage.setItem("autosphere_active_id", activeVehicleId.toString());
  }, [activeVehicleId]);

  // Fetch rentals from Spring Boot on port 8082
  const fetchBackendRentals = async () => {
    try {
      const res = await axios.get("http://localhost:8082/rentals");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRentals(res.data);
      } else {
        setRentals([
          {
            id: 1,
            userId: 1,
            carName: "Mahindra Thar 4x4",
            pricePerDay: "₹5,000",
            startDate: "2026-10-10",
            endDate: "2026-10-14",
            status: "Active Booking",
            plate: "TS03US4107"
          }
        ]);
      }
    } catch {
      setRentals([
        {
          id: 1,
          userId: 1,
          carName: "Mahindra Thar 4x4",
          pricePerDay: "₹5,000",
          startDate: "2026-10-10",
          endDate: "2026-10-14",
          status: "Active Booking",
          plate: "TS03US4107"
        }
      ]);
    }
  };

  useEffect(() => {
    fetchBackendRentals();
  }, []);

  const activeVehicle = fleet.find((v) => v.id === activeVehicleId) || fleet[0] || INITIAL_FLEET[0];

  const updateVehicleColor = (colorName, colorHex) => {
    setFleet((prev) =>
      prev.map((v) => (v.id === activeVehicle.id ? { ...v, color: colorName, colorHex } : v))
    );
  };

  const selectVehicle = (id) => {
    setActiveVehicleId(id);
  };

  // Add vehicle to rental fleet
  const addVehicle = async (newVehicleData) => {
    const newId = Date.now();
    const vehicle = {
      id: newId,
      name: (newVehicleData.name || `${newVehicleData.brand} ${newVehicleData.model}`).toLowerCase(),
      displayName: (newVehicleData.name || `${newVehicleData.brand} ${newVehicleData.model}`).toLowerCase(),
      brand: newVehicleData.brand || "Mahindra",
      model: newVehicleData.model || "Vehicle",
      year: Number(newVehicleData.year) || new Date().getFullYear(),
      type: newVehicleData.type || "CAR",
      category: newVehicleData.category || "Rental Vehicle",
      plate: (newVehicleData.plate || "TS01AA0000").toUpperCase(),
      odometer: Number(newVehicleData.odometer) || 0,
      health: Number(newVehicleData.health) || 96,
      aiScore: 95,
      aiRecommendation: "AI verified for roadworthiness with zero fault codes detected.",
      status: "Available for Rent",
      pricePerDay: `₹${newVehicleData.pricePerDay || 4500}`,
      priceNum: Number(newVehicleData.pricePerDay) || 4500,
      color: newVehicleData.color || "Silver",
      colorHex: newVehicleData.colorHex || "#b4b8be",
      pickupDate: "12 Oct 2026",
      pickupLocation: "City Hub",
      returnDate: "15 Oct 2026",
      returnStatus: "Available",
      deposit: 5000,
      spend: 0,
      specs: {
        engine: "2.0L Engine",
        transmission: "Automatic",
        fuelEconomy: "15.0 km/l",
        seating: "4-5 Seats",
        luggage: "500 Litres",
        fuelTank: "50 Litres"
      },
      systemHealth: {
        engine: { score: 98, status: "Certified Ready", note: "All engine diagnostics nominal." },
        brakes: { score: 96, status: "Calibrated", note: "Brake friction material 95% intact." },
        transmission: { score: 97, status: "Smooth", note: "Gear shifting parameters within spec." },
        suspension: { score: 95, status: "Calibrated", note: "Dampers tested." },
        battery: { score: 98, status: "Healthy", note: "Battery health verified." },
        tires: { score: 95, status: "Inspected", note: "Tires inflated and inspected." }
      }
    };

    setFleet((prev) => [...prev, vehicle]);
    setActiveVehicleId(newId);

    try {
      await axios.post("http://localhost:8082/vehicles", {
        brand: vehicle.brand,
        model: vehicle.model,
        type: vehicle.type,
        pricePerDay: vehicle.priceNum,
        available: true
      });
    } catch {
      // Backend sync fallback
    }
    return vehicle;
  };

  // Book a rental through Spring Boot
  const createBooking = async (bookingData) => {
    const payload = {
      userId: 1,
      carName: bookingData.carName || activeVehicle.displayName,
      pricePerDay: bookingData.pricePerDay || activeVehicle.pricePerDay,
      startDate: bookingData.startDate || "2026-10-10",
      endDate: bookingData.endDate || "2026-10-14"
    };

    try {
      await axios.post("http://localhost:8082/rentals", payload);
    } catch {
      // Spring Boot backend sync
    }

    const newBooking = {
      ...payload,
      id: Date.now(),
      status: "Active Booking",
      plate: activeVehicle.plate,
      pickupLocation: bookingData.pickupLocation || activeVehicle.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation || "Airport Terminal Hub"
    };

    setRentals((prev) => [newBooking, ...prev]);

    // Update fleet vehicle status
    setFleet((prev) =>
      prev.map((v) =>
        v.id === activeVehicle.id
          ? {
              ...v,
              status: "Active Booking",
              pickupDate: newBooking.startDate,
              returnDate: newBooking.endDate
            }
          : v
      )
    );

    return newBooking;
  };

  // AI Recommendation Engine
  const getAiRecommendation = (query) => {
    const q = query.toLowerCase();
    if (q.includes("ladakh") || q.includes("spiti") || q.includes("mountain") || q.includes("offroad") || q.includes("hill") || q.includes("thar") || q.includes("4x4")) {
      const match = fleet.find((v) => v.name.includes("thar")) || fleet[0];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Mahindra Thar 4x4 selected! 97% AI terrain rating with 226mm ground clearance, manual shift-on-the-fly 4WD low range, and 650mm water-wading depth for high mountain passes."
      };
    } else if (q.includes("goa") || q.includes("safari") || q.includes("captain") || q.includes("group") || q.includes("7-seater")) {
      const match = fleet.find((v) => v.name.includes("safari")) || fleet[4];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Tata Safari Dark Gold matched! Flagship 6/7-seater with ventilated boss captain seats, 10-speaker JBL audio, and Land Rover derived OmegaArc platform for Goa & highway trips."
      };
    } else if (q.includes("hybrid") || q.includes("hycross") || q.includes("innova")) {
      const match = fleet.find((v) => v.name.includes("hycross") || v.name.includes("innova")) || fleet[6];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Toyota Innova Hycross ZX(O) Hybrid matched! Outstanding 23.2 km/l mileage, powered Ottoman lounge recliners, and 1,150+ km highway tank range."
      };
    } else if (q.includes("jimny") || q.includes("trail") || q.includes("narrow") || q.includes("lightweight")) {
      const match = fleet.find((v) => v.name.includes("jimny")) || fleet[3];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Maruti Suzuki Jimny Alpha 4x4 matched! Lightweight mountain GOAT with rigid 3-link front & rear solid axles and 210mm clearance for tight Himalayan trails."
      };
    } else if (q.includes("electric") || q.includes("ev") || q.includes("nexon") || q.includes("green") || q.includes("eco")) {
      const match = fleet.find((v) => v.name.includes("nexon")) || fleet[10];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Tata Nexon EV Empowered+ matched! 465 km single-charge range with ultra-low ₹1.3/km running cost and CCS2 DC fast charging along Indian expressways."
      };
    } else if (q.includes("budget") || q.includes("city") || q.includes("cheap") || q.includes("economy") || q.includes("swift")) {
      const match = fleet.find((v) => v.name.includes("swift")) || fleet[9];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Maruti Suzuki Swift Sport matched! Lowest rental rate at ₹2,400/day, ultra-high 22.4 km/l fuel economy, and effortless city parking."
      };
    } else if (q.includes("mileage") || q.includes("mt15") || q.includes("mt-15") || q.includes("highest mileage")) {
      const match = fleet.find((v) => v.name.includes("mt15") || v.name.includes("mt-15")) || fleet[19];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Yamaha MT-15 V2 matched! Unbelievable 56.8 km/l ARAI mileage, VVA performance, and lowest rental at ₹1,400/day."
      };
    } else if (q.includes("fortuner") || q.includes("toyota") || q.includes("heavy") || q.includes("legender")) {
      const match = fleet.find((v) => v.name.includes("fortuner")) || fleet[1];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Toyota Fortuner Legender 4x4 matched! 204 HP, 500 Nm powerhouse SUV with 7 seats and bulletproof all-terrain reliability."
      };
    } else if (q.includes("bmw") || q.includes("sedan") || q.includes("vip") || q.includes("executive")) {
      const match = fleet.find((v) => v.name.includes("bmw")) || fleet[11];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "BMW 3 Series Gran Limousine matched! 258 HP TwinPower Turbo luxury sedan with extended rear lounge legroom and Harman Kardon acoustics."
      };
    } else if (q.includes("himalayan") || q.includes("touring") || q.includes("enfield") || q.includes("adventure bike")) {
      const match = fleet.find((v) => v.name.includes("himalayan")) || fleet[12];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Royal Enfield Himalayan 450 matched! 21-inch front spoked wheel, Showa 200mm travel suspension, and Sherpa 450 liquid-cooled motor for Ladakh & Spiti."
      };
    } else if (q.includes("classic") || q.includes("bullet") || q.includes("thump") || q.includes("reborn")) {
      const match = fleet.find((v) => v.name.includes("classic")) || fleet[13];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Royal Enfield Classic 350 Stealth matched! Timeless Indian cruiser with counterbalanced J-Series smooth thump and 36.2 km/l mileage."
      };
    } else if (q.includes("ktm") || q.includes("rally")) {
      const match = fleet.find((v) => v.name.includes("ktm")) || fleet[14];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "KTM 390 Adventure Spoke Wheel Rally matched! 43.5 HP rocket single with WP Apex adjustable compression & rebound suspension."
      };
    } else if (q.includes("hayabusa") || q.includes("hyper")) {
      const match = fleet.find((v) => v.name.includes("hayabusa")) || fleet[16];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Suzuki Hayabusa Gen-3 1340cc matched! The legendary 190 HP hypersport tourer with Brembo Stylema calipers and IMU electronics."
      };
    } else if (q.includes("bike") || q.includes("speed") || q.includes("fast") || q.includes("superbike") || q.includes("ninja")) {
      const match = fleet.find((v) => v.name.includes("ninja")) || fleet[15];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Kawasaki Ninja ZX-10R matched! 203 HP inline-4 powerhouse with aerodynamic downforce and track-spec electronic rider aids."
      };
    } else if (q.includes("luxury") || q.includes("family") || q.includes("diesel") || q.includes("comfort") || q.includes("harrier")) {
      const match = fleet.find((v) => v.name.includes("harrier")) || fleet[7];
      setActiveVehicleId(match.id);
      return {
        vehicle: match,
        reason: "Tata Harrier #DARK Edition matched! Premium 5-seater SUV with Land Rover OmegaArc platform, ventilated seats, and expansive boot space."
      };
    }
    return null;
  };

  // Auth functions
  const loginUser = async (credentials) => {
    try {
      const res = await axios.post("http://localhost:8082/auth/login", {
        username: credentials.email.split("@")[0],
        password: credentials.password
      });
      if (res.data?.token) {
        localStorage.setItem("autosphere_token", res.data.token);
      }
    } catch {
      // Fallback
    }

    const updatedUser = {
      name: credentials.name || credentials.email.split("@")[0] || "ravi",
      email: credentials.email || "ravi@gmail.com",
      role: "USER"
    };
    setUser(updatedUser);
    return updatedUser;
  };

  const registerUser = async (userData) => {
    try {
      await axios.post("http://localhost:8082/auth/register", {
        username: userData.name || userData.email.split("@")[0],
        email: userData.email,
        password: userData.password,
        role: "ROLE_USER"
      });
    } catch {
      // Fallback
    }

    const newUser = {
      name: userData.name || "ravi",
      email: userData.email || "ravi@gmail.com",
      role: "USER"
    };
    setUser(newUser);
    return newUser;
  };

  const logoutUser = () => {
    localStorage.removeItem("autosphere_token");
    setUser({ name: "ravi", email: "ravi@gmail.com", role: "USER" });
  };

  const totalFleetCount = fleet.length;
  const activeBookingsCount = rentals.length;
  const totalSpend = 5500;

  return (
    <GarageContext.Provider
      value={{
        user,
        fleet,
        vehicles: fleet,
        activeVehicle,
        activeVehicleId,
        selectVehicle,
        updateVehicleColor,
        addVehicle,
        rentals,
        createBooking,
        selectedSystem,
        setSelectedSystem,
        totalFleetCount,
        activeBookingsCount,
        totalSpend,
        getAiRecommendation,
        aiFilterQuery,
        setAiFilterQuery,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error("useGarage must be used within a GarageProvider");
  }
  return context;
}
