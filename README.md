# 🚗 AutoSphere - Frontend: AI-Powered Vehicle Rental & Fleet Intelligence Platform

> **Next-Generation Interactive Vehicle Rental Experience powered by Three.js & React Three Fiber Digital Twins**

AutoSphere is a state-of-the-art vehicle rental and intelligent fleet management platform. It combines realistic **3D vehicle studios**, interactive color customization, automated FASTag and toll calculations, live fleet tracking, and AI-assisted route planning into a seamless, high-performance web application.

---

## 🌟 Key Features

- **🎮 3D Interactive Vehicle Studio (Digital Twin)**:
  - Real-time 3D vehicle inspection powered by **Three.js** and **React Three Fiber**.
  - Interactive car & motorcycle customization (real-time body color switching, studio lighting, shadow planes, 360° orbit inspection).
  - True-to-life 3D models for popular Indian and global cars and bikes (Thar, Fortuner, Swift, Scorpio, BMW M4, Enfield Classic 350, BMW R1250, etc.).
- **⚡ AI Fleet & Booking Engine**:
  - Comprehensive catalog with live availability status, filterable by category (SUV, Sedan, Hatchback, Luxury, Adventure Bike).
  - Transparent pricing breakdowns with security deposit, duration multiplier, and instant receipt generation.
- **🛣️ Intelligent FASTag & Route Explorer**:
  - Automated toll estimation and FASTag route calculation for intercity trips.
- **🛡️ Secure Customer & Admin Portals**:
  - Multi-role authentication (Customer, Fleet Manager, Admin).
  - Dedicated administrative dashboard for vehicle lifecycle management, reservation tracking, and revenue analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Build** | React 19, Vite 6/8 |
| **3D Graphics & WebGL**| Three.js, `@react-three/fiber`, `@react-three/drei` |
| **UI Components & Styling** | Bootstrap 5, Lucide React Icons |
| **Routing & Forms** | React Router DOM v7, React Hook Form, Yup validation |
| **Networking & State** | Axios, React Toastify |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/karan77711/AutoSphere-Frontend.git
   cd AutoSphere-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_CARSXE_API_KEY=your_carsxe_api_key_here
   VITE_API_BASE_URL=http://localhost:8082
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```

5. Build for Production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
Frontend/
├── public/
│   ├── models/            # 3D GLTF/GLB models for cars and motorcycles
│   └── vite.svg
├── src/
│   ├── components/        # UI components, 3D Canvas, Navbars, Footers
│   ├── pages/             # Home, Vehicles, Booking, Dashboard, FASTag
│   ├── services/          # API integration and Axios clients
│   ├── App.jsx            # Routing configuration
│   └── main.jsx           # App entry point
├── package.json
└── vite.config.js
```

---

## 👨‍💻 Author

- **GitHub**: [@karan77711](https://github.com/karan77711)
- **Institution**: Anurag Group of Institutions
