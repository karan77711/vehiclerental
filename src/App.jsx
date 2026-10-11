import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GarageProvider } from "./context/GarageContext";
import Dashboard from "./pages/Dashboard";
import Rentals from "./pages/Rentals";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <GarageProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Dashboard view */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Vehicle Rentals view */}
          <Route path="/rentals" element={<Rentals />} />

          {/* Authentication views */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </GarageProvider>
  );
}

export default App;
