import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RotatingPanel from "./RotatingPanel"; // ✅ use the external component

export default function ThreeScene() {
  return (
    <Canvas style={{ height: "100vh", background: "#111" }}>
      {/* ✅ Lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />

      {/* ✅ Camera controls */}
      <OrbitControls enableZoom={false} />

      {/* ✅ Panels */}
      <RotatingPanel color="#0077b6" position={[0, 0, 0]} />
      <RotatingPanel color="#00b4d8" position={[3, 0, 0]} />
      <RotatingPanel color="#90e0ef" position={[-3, 0, 0]} />
    </Canvas>
  );
}
