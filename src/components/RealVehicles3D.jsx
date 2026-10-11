import React, { useMemo } from "react";
import * as THREE from "three";

// Shared common high-quality materials
function useVehicleMaterials(color, headlightsOn) {
  return useMemo(() => {
    const bodyColor = new THREE.Color(color || "#dc2626");

    const bodyPaint = new THREE.MeshStandardMaterial({
      color: bodyColor,
      metalness: 0.88,
      roughness: 0.18,
      envMapIntensity: 1.5
    });

    const darkAccent = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0c0f17"),
      metalness: 0.5,
      roughness: 0.6
    });

    const matteCladding = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#181c24"),
      roughness: 0.9,
      metalness: 0.1
    });

    const tireRubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#111317"),
      roughness: 0.92,
      metalness: 0.05
    });

    const chrome = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f1f5f9"),
      metalness: 0.96,
      roughness: 0.08
    });

    const darkAlloy = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1e2433"),
      metalness: 0.9,
      roughness: 0.25
    });

    const glass = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0f172a"),
      transparent: true,
      opacity: 0.65,
      roughness: 0.05,
      metalness: 0.15
    });

    const headlightLens = new THREE.MeshStandardMaterial({
      color: headlightsOn ? new THREE.Color("#e0f2fe") : new THREE.Color("#38bdf8"),
      emissive: headlightsOn ? new THREE.Color("#38bdf8") : new THREE.Color("#0369a1"),
      emissiveIntensity: headlightsOn ? 3.2 : 0.4,
      roughness: 0.1
    });

    const taillightLens = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ef4444"),
      emissive: new THREE.Color("#dc2626"),
      emissiveIntensity: 1.4,
      roughness: 0.2
    });

    const leatherSeat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1e1b18"),
      roughness: 0.85,
      metalness: 0.1
    });

    return {
      bodyPaint,
      darkAccent,
      matteCladding,
      tireRubber,
      chrome,
      darkAlloy,
      glass,
      headlightLens,
      taillightLens,
      leatherSeat
    };
  }, [color, headlightsOn]);
}

// ----------------------------------------------------------------------
// 1. MAHINDRA THAR 4x4 & MARUTI JIMNY (Rugged Boxy 4x4 Off-Roader)
// ----------------------------------------------------------------------
export function Thar4x4Model({ color = "#dc2626", headlightsOn = true }) {
  const mats = useVehicleMaterials(color, headlightsOn);
  const wheelR = 0.44;
  const wheelW = 0.28;
  const wheelY = wheelR; // exactly touch ground at y=0

  const renderWheel = (pos) => (
    <group key={pos.join("-")} position={pos}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[wheelR, wheelR, wheelW, 28]} />
        <primitive object={mats.tireRubber} />
      </mesh>
      {/* 5-Spoke Off-Road Alloy Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, wheelW + 0.01, 16]} />
        <primitive object={mats.darkAlloy} />
      </mesh>
      {/* Chrome Wheel Nuts */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, wheelW + 0.02, 12]} />
        <primitive object={mats.chrome} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Wheels: wheelbase ~2.5m, track width ~1.7m */}
      {renderWheel([0.92, wheelY, 1.25])}
      {renderWheel([-0.92, wheelY, 1.25])}
      {renderWheel([0.92, wheelY, -1.25])}
      {renderWheel([-0.92, wheelY, -1.25])}

      {/* REAR SPARE TIRE ON TAILGATE (Iconic Thar Feature) */}
      <group position={[0, wheelY + 0.35, -2.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[wheelR * 0.95, wheelR * 0.95, wheelW, 28]} />
          <primitive object={mats.tireRubber} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, wheelW + 0.02, 16]} />
          <primitive object={mats.darkAlloy} />
        </mesh>
        {/* Spare Mount Bracket */}
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <primitive object={mats.matteCladding} />
        </mesh>
      </group>

      {/* LOWER CHASSIS & LADDER FRAME (High 226mm Ground Clearance) */}
      <mesh position={[0, wheelY + 0.08, 0]}>
        <boxGeometry args={[1.5, 0.25, 3.8]} />
        <primitive object={mats.darkAccent} />
      </mesh>

      {/* FLUSH HEAVY-DUTY FRONT BUMPER WITH SKID PLATE */}
      <group position={[0, wheelY + 0.12, 1.98]}>
        <mesh>
          <boxGeometry args={[1.9, 0.3, 0.32]} />
          <primitive object={mats.matteCladding} />
        </mesh>
        {/* Silver Skid Plate */}
        <mesh position={[0, -0.08, 0.08]}>
          <boxGeometry args={[0.9, 0.16, 0.2]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Round Fog Lamps */}
        <mesh position={[0.65, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
          <primitive object={mats.headlightLens} />
        </mesh>
        <mesh position={[-0.65, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
          <primitive object={mats.headlightLens} />
        </mesh>
      </group>

      {/* REAR BUMPER */}
      <mesh position={[0, wheelY + 0.12, -1.95]}>
        <boxGeometry args={[1.88, 0.26, 0.22]} />
        <primitive object={mats.matteCladding} />
      </mesh>

      {/* FLARED SQUARE OFF-ROAD WHEEL ARCHES (Front & Rear) */}
      <mesh position={[0.92, wheelY + 0.24, 1.25]}>
        <boxGeometry args={[0.25, 0.32, 0.95]} />
        <primitive object={mats.matteCladding} />
      </mesh>
      <mesh position={[-0.92, wheelY + 0.24, 1.25]}>
        <boxGeometry args={[0.25, 0.32, 0.95]} />
        <primitive object={mats.matteCladding} />
      </mesh>
      <mesh position={[0.92, wheelY + 0.24, -1.25]}>
        <boxGeometry args={[0.25, 0.32, 0.95]} />
        <primitive object={mats.matteCladding} />
      </mesh>
      <mesh position={[-0.92, wheelY + 0.24, -1.25]}>
        <boxGeometry args={[0.25, 0.32, 0.95]} />
        <primitive object={mats.matteCladding} />
      </mesh>

      {/* MAIN THAR BODY (Lower Tub) */}
      <mesh position={[0, wheelY + 0.44, 0]}>
        <boxGeometry args={[1.72, 0.52, 3.8]} />
        <primitive object={mats.bodyPaint} />
      </mesh>

      {/* FRONT BONNET / HOOD */}
      <group position={[0, wheelY + 0.72, 1.05]}>
        <mesh>
          <boxGeometry args={[1.56, 0.18, 1.62]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* Hood Side Latches */}
        <mesh position={[0.78, -0.04, 0.3]}>
          <boxGeometry args={[0.04, 0.06, 0.1]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        <mesh position={[-0.78, -0.04, 0.3]}>
          <boxGeometry args={[0.04, 0.06, 0.1]} />
          <primitive object={mats.darkAccent} />
        </mesh>
      </group>

      {/* ICONIC THAR 7-SLOT VERTICAL FRONT GRILLE */}
      <group position={[0, wheelY + 0.55, 1.88]}>
        <mesh>
          <boxGeometry args={[1.48, 0.46, 0.06]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        {/* 7 Vertical Grille Slats */}
        {[-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.035]}>
            <boxGeometry args={[0.055, 0.34, 0.04]} />
            <primitive object={mats.bodyPaint} />
          </mesh>
        ))}
        {/* Twin Retro Round Headlights */}
        <mesh position={[0.58, 0.02, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
          <primitive object={mats.headlightLens} />
        </mesh>
        <mesh position={[-0.58, 0.02, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
          <primitive object={mats.headlightLens} />
        </mesh>
        {/* Chrome Headlight Trim Rings */}
        <mesh position={[0.58, 0.02, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.13, 0.15, 24]} />
          <primitive object={mats.chrome} />
        </mesh>
        <mesh position={[-0.58, 0.02, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.13, 0.15, 24]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>

      {/* BOXY HARDTOP PASSENGER CABIN & ROOF */}
      <group position={[0, wheelY + 1.05, -0.32]}>
        {/* Cabin Roof Shell */}
        <mesh>
          <boxGeometry args={[1.62, 0.68, 2.15]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        {/* Flat Windshield (Upright Angle) */}
        <mesh position={[0, 0.02, 1.07]} rotation={[-0.22, 0, 0]}>
          <boxGeometry args={[1.45, 0.58, 0.04]} />
          <primitive object={mats.glass} />
        </mesh>
        {/* Rectangular Side Windows (Left & Right) */}
        <mesh position={[0.82, 0.02, 0.1]}>
          <boxGeometry args={[0.02, 0.44, 1.65]} />
          <primitive object={mats.glass} />
        </mesh>
        <mesh position={[-0.82, 0.02, 0.1]}>
          <boxGeometry args={[0.02, 0.44, 1.65]} />
          <primitive object={mats.glass} />
        </mesh>
        {/* Rear Window */}
        <mesh position={[0, 0.08, -1.08]}>
          <boxGeometry args={[1.32, 0.42, 0.03]} />
          <primitive object={mats.glass} />
        </mesh>
      </group>

      {/* REAR LED TAILLIGHTS */}
      <mesh position={[0.74, wheelY + 0.62, -1.9]}>
        <boxGeometry args={[0.16, 0.22, 0.06]} />
        <primitive object={mats.taillightLens} />
      </mesh>
      <mesh position={[-0.74, wheelY + 0.62, -1.9]}>
        <boxGeometry args={[0.16, 0.22, 0.06]} />
        <primitive object={mats.taillightLens} />
      </mesh>

      {/* SIDE ROCKER GUARDS / FOOTSTEPS */}
      <mesh position={[0.94, wheelY - 0.06, 0]}>
        <boxGeometry args={[0.16, 0.06, 2.1]} />
        <primitive object={mats.matteCladding} />
      </mesh>
      <mesh position={[-0.94, wheelY - 0.06, 0]}>
        <boxGeometry args={[0.16, 0.06, 2.1]} />
        <primitive object={mats.matteCladding} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------
// 2. TOYOTA FORTUNER LEGENDER & FULL-SIZE SUVS (Scorpio-N, Safari, XUV700)
// ----------------------------------------------------------------------
export function FortunerSUVModel({ color = "#f8fafc", headlightsOn = true }) {
  const mats = useVehicleMaterials(color, headlightsOn);
  const wheelR = 0.42;
  const wheelW = 0.28;
  const wheelY = wheelR;

  const renderWheel = (pos) => (
    <group key={pos.join("-")} position={pos}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[wheelR, wheelR, wheelW, 28]} />
        <primitive object={mats.tireRubber} />
      </mesh>
      {/* Dual-Tone Diamond Cut Alloy Wheels */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, wheelW + 0.01, 16]} />
        <primitive object={mats.darkAlloy} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, wheelW + 0.02, 16]} />
        <primitive object={mats.chrome} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Wheels: Long 2.75m wheelbase, 1.85m width */}
      {renderWheel([0.96, wheelY, 1.45])}
      {renderWheel([-0.96, wheelY, 1.45])}
      {renderWheel([0.96, wheelY, -1.45])}
      {renderWheel([-0.96, wheelY, -1.45])}

      {/* LOWER CHASSIS & RUNNING BOARDS */}
      <mesh position={[0, wheelY + 0.04, 0]}>
        <boxGeometry args={[1.65, 0.22, 4.4]} />
        <primitive object={mats.matteCladding} />
      </mesh>
      {/* Side Steps */}
      <mesh position={[0.98, wheelY - 0.06, 0]}>
        <boxGeometry args={[0.16, 0.05, 2.5]} />
        <primitive object={mats.darkAccent} />
      </mesh>
      <mesh position={[-0.98, wheelY - 0.06, 0]}>
        <boxGeometry args={[0.16, 0.05, 2.5]} />
        <primitive object={mats.darkAccent} />
      </mesh>

      {/* FRONT BUMPER & AGGRESSIVE SPLIT GRILLE */}
      <group position={[0, wheelY + 0.28, 2.3]}>
        {/* Muscular Bumper */}
        <mesh>
          <boxGeometry args={[1.86, 0.45, 0.4]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* Black Honeycomb Lower Air Dam */}
        <mesh position={[0, -0.12, 0.15]}>
          <boxGeometry args={[1.1, 0.22, 0.12]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        {/* Silver Skid Plate */}
        <mesh position={[0, -0.22, 0.18]}>
          <boxGeometry args={[0.9, 0.1, 0.14]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Swept-Back LED Eyebrow DRLs & Projector Headlights */}
        <mesh position={[0.68, 0.14, 0.12]} rotation={[0.15, 0.2, 0]}>
          <boxGeometry args={[0.42, 0.16, 0.14]} />
          <primitive object={mats.headlightLens} />
        </mesh>
        <mesh position={[-0.68, 0.14, 0.12]} rotation={[0.15, -0.2, 0]}>
          <boxGeometry args={[0.42, 0.16, 0.14]} />
          <primitive object={mats.headlightLens} />
        </mesh>
        {/* Upper Chrome Grille Brow */}
        <mesh position={[0, 0.18, 0.16]}>
          <boxGeometry args={[0.95, 0.14, 0.08]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>

      {/* MAIN MUSCULAR SUV BODY SHELL */}
      <mesh position={[0, wheelY + 0.48, 0]}>
        <boxGeometry args={[1.85, 0.58, 4.45]} />
        <primitive object={mats.bodyPaint} />
      </mesh>

      {/* HIGH SCULPTED BONNET / HOOD */}
      <group position={[0, wheelY + 0.8, 1.25]}>
        <mesh rotation={[-0.05, 0, 0]}>
          <boxGeometry args={[1.72, 0.16, 1.85]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* Hood Power Bulges */}
        <mesh position={[0.45, 0.08, 0]}>
          <boxGeometry args={[0.18, 0.06, 1.6]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        <mesh position={[-0.45, 0.08, 0]}>
          <boxGeometry args={[0.18, 0.06, 1.6]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
      </group>

      {/* 7-SEATER GLASSHOUSE & CABIN (Floating Roof Effect) */}
      <group position={[0, wheelY + 1.15, -0.42]}>
        {/* Cabin Pillars & Roof */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.68, 0.62, 2.65]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        {/* Sloped Aerodynamic Windshield */}
        <mesh position={[0, 0.04, 1.35]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[1.55, 0.68, 0.04]} />
          <primitive object={mats.glass} />
        </mesh>
        {/* Side Passenger Windows */}
        <mesh position={[0.85, 0.04, 0.05]}>
          <boxGeometry args={[0.02, 0.44, 2.45]} />
          <primitive object={mats.glass} />
        </mesh>
        <mesh position={[-0.85, 0.04, 0.05]}>
          <boxGeometry args={[0.02, 0.44, 2.45]} />
          <primitive object={mats.glass} />
        </mesh>
        {/* Rear Windshield */}
        <mesh position={[0, 0.06, -1.34]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.45, 0.52, 0.04]} />
          <primitive object={mats.glass} />
        </mesh>
      </group>

      {/* INTEGRATED SILVER ROOF RAILS */}
      <mesh position={[0.65, wheelY + 1.5, -0.42]}>
        <boxGeometry args={[0.05, 0.06, 2.2]} />
        <primitive object={mats.chrome} />
      </mesh>
      <mesh position={[-0.65, wheelY + 1.5, -0.42]}>
        <boxGeometry args={[0.05, 0.06, 2.2]} />
        <primitive object={mats.chrome} />
      </mesh>

      {/* REAR TAILGATE & SPOILER */}
      <group position={[0, wheelY + 0.62, -2.25]}>
        {/* Rear Roof Spoiler */}
        <mesh position={[0, 0.82, 0.2]}>
          <boxGeometry args={[1.55, 0.08, 0.35]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        {/* Connected LED Taillight Strip */}
        <mesh position={[0.62, 0.12, 0.06]}>
          <boxGeometry args={[0.42, 0.14, 0.06]} />
          <primitive object={mats.taillightLens} />
        </mesh>
        <mesh position={[-0.62, 0.12, 0.06]}>
          <boxGeometry args={[0.42, 0.14, 0.06]} />
          <primitive object={mats.taillightLens} />
        </mesh>
        <mesh position={[0, 0.12, 0.06]}>
          <boxGeometry args={[0.82, 0.04, 0.05]} />
          <primitive object={mats.taillightLens} />
        </mesh>
        {/* Rear Bumper with Twin Reflector Accents */}
        <mesh position={[0, -0.32, 0.08]}>
          <boxGeometry args={[1.82, 0.35, 0.32]} />
          <primitive object={mats.matteCladding} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------
// 3. BMW 330Li / EXECUTIVE SEDAN (Low Slung Aerodynamic Luxury Sedan)
// ----------------------------------------------------------------------
export function LuxurySedanModel({ color = "#1e293b", headlightsOn = true }) {
  const mats = useVehicleMaterials(color, headlightsOn);
  const wheelR = 0.35;
  const wheelW = 0.26;
  const wheelY = wheelR;

  const renderWheel = (pos) => (
    <group key={pos.join("-")} position={pos}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[wheelR, wheelR, wheelW, 28]} />
        <primitive object={mats.tireRubber} />
      </mesh>
      {/* 19" M-Sport Multi-Spoke Alloy Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, wheelW + 0.01, 20]} />
        <primitive object={mats.chrome} />
      </mesh>
      {/* Blue M-Brake Caliper */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.14]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Wheels: 2.85m wheelbase, long executive stance */}
      {renderWheel([0.92, wheelY, 1.4])}
      {renderWheel([-0.92, wheelY, 1.4])}
      {renderWheel([0.92, wheelY, -1.45])}
      {renderWheel([-0.92, wheelY, -1.45])}

      {/* LOWER CHASSIS & AERODYNAMIC SIDE SKIRTS */}
      <mesh position={[0, wheelY + 0.02, 0]}>
        <boxGeometry args={[1.68, 0.16, 4.6]} />
        <primitive object={mats.darkAccent} />
      </mesh>

      {/* LOW-SLUNG STREAMLINED BODY SHELL */}
      <mesh position={[0, wheelY + 0.32, 0]}>
        <boxGeometry args={[1.78, 0.44, 4.65]} />
        <primitive object={mats.bodyPaint} />
      </mesh>

      {/* LONG SCULPTED EXECUTIVE BONNET */}
      <group position={[0, wheelY + 0.54, 1.3]}>
        <mesh rotation={[-0.07, 0, 0]}>
          <boxGeometry args={[1.65, 0.14, 1.9]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
      </group>

      {/* ICONIC BMW DUAL KIDNEY FRONT GRILLE & LASER HEADLAMPS */}
      <group position={[0, wheelY + 0.28, 2.32]}>
        <mesh>
          <boxGeometry args={[1.74, 0.35, 0.25]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* Twin Kidney Grille with Chrome Surrounds */}
        <mesh position={[0.22, 0.04, 0.14]}>
          <boxGeometry args={[0.34, 0.24, 0.04]} />
          <primitive object={mats.chrome} />
        </mesh>
        <mesh position={[-0.22, 0.04, 0.14]}>
          <boxGeometry args={[0.34, 0.24, 0.04]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Slender Laser LED Headlights with Blue Accent */}
        <mesh position={[0.66, 0.06, 0.12]} rotation={[0.1, 0.25, 0]}>
          <boxGeometry args={[0.42, 0.14, 0.08]} />
          <primitive object={mats.headlightLens} />
        </mesh>
        <mesh position={[-0.66, 0.06, 0.12]} rotation={[0.1, -0.25, 0]}>
          <boxGeometry args={[0.42, 0.14, 0.08]} />
          <primitive object={mats.headlightLens} />
        </mesh>
      </group>

      {/* STREAMLINED CABIN & ROOFLINE (Hofmeister Kink) */}
      <group position={[0, wheelY + 0.82, -0.3]}>
        <mesh>
          <boxGeometry args={[1.58, 0.52, 2.45]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* Low Rake Windshield */}
        <mesh position={[0, 0.02, 1.24]} rotation={[-0.58, 0, 0]}>
          <boxGeometry args={[1.48, 0.65, 0.04]} />
          <primitive object={mats.glass} />
        </mesh>
        {/* Frameless Side Windows */}
        <mesh position={[0.8, 0.02, 0.02]}>
          <boxGeometry args={[0.02, 0.38, 2.2]} />
          <primitive object={mats.glass} />
        </mesh>
        <mesh position={[-0.8, 0.02, 0.02]}>
          <boxGeometry args={[0.02, 0.38, 2.2]} />
          <primitive object={mats.glass} />
        </mesh>
        {/* Rear Windshield */}
        <mesh position={[0, 0.02, -1.22]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[1.42, 0.58, 0.04]} />
          <primitive object={mats.glass} />
        </mesh>
      </group>

      {/* REAR BOOT & DUAL CHROME EXHAUSTS */}
      <group position={[0, wheelY + 0.32, -2.32]}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[1.72, 0.38, 0.28]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* L-Shaped Taillights */}
        <mesh position={[0.62, 0.16, 0.14]}>
          <boxGeometry args={[0.42, 0.12, 0.04]} />
          <primitive object={mats.taillightLens} />
        </mesh>
        <mesh position={[-0.62, 0.16, 0.14]}>
          <boxGeometry args={[0.42, 0.12, 0.04]} />
          <primitive object={mats.taillightLens} />
        </mesh>
        {/* Dual M-Sport Exhaust Tips */}
        <mesh position={[0.55, -0.12, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        <mesh position={[-0.55, -0.12, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------
// 4. ROYAL ENFIELD HIMALAYAN 450 (High-Altitude Overland Adventure Tourer)
// ----------------------------------------------------------------------
export function HimalayanAdventure3D({ color = "#0284c7", headlightsOn = true }) {
  const mats = useVehicleMaterials(color, headlightsOn);
  // Large 21" front spoked wheel (R=0.48), 17" rear wheel (R=0.42)
  const frontR = 0.48;
  const rearR = 0.42;

  return (
    <group position={[0, 0, 0]}>
      {/* REAR WHEEL (17" Rim with Dual-Sport Knobby Tire) */}
      <group position={[0, rearR, -1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[rearR, rearR, 0.22, 28]} />
          <primitive object={mats.tireRubber} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.23, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Rear Disc */}
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>

      {/* FRONT WHEEL (21" Tall Spoked Wheel) */}
      <group position={[0, frontR, 1.25]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[frontR, frontR, 0.16, 28]} />
          <primitive object={mats.tireRubber} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.17, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Large 320mm Front ByBre Disc */}
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>

      {/* LONG-TRAVEL SHOWA USD SUSPENSION FORKS & BEAK */}
      <group position={[0, 0.85, 0.95]} rotation={[0.38, 0, 0]}>
        <mesh position={[0.13, 0, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 1.05, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        <mesh position={[-0.13, 0, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 1.05, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Upright Wide Enduro Handlebars */}
        <mesh position={[0, 0.58, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.75, 16]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        {/* Handguards (Left & Right) */}
        <mesh position={[0.36, 0.58, 0.05]}>
          <boxGeometry args={[0.12, 0.08, 0.08]} />
          <primitive object={mats.matteCladding} />
        </mesh>
        <mesh position={[-0.36, 0.58, 0.05]}>
          <boxGeometry args={[0.12, 0.08, 0.08]} />
          <primitive object={mats.matteCladding} />
        </mesh>
        {/* High Rally Windscreen (Clear) */}
        <mesh position={[0, 0.65, 0.15]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.26, 0.38, 0.02]} />
          <primitive object={mats.glass} />
        </mesh>
        {/* Himalayan Round LED Headlight with Steel Guard Ring */}
        <mesh position={[0, 0.38, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.06, 24]} />
          <primitive object={mats.headlightLens} />
        </mesh>
      </group>

      {/* HIGH FRONT ADVENTURE BEAK MUDGUARD */}
      <mesh position={[0, 0.82, 1.15]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.45]} />
        <primitive object={mats.bodyPaint} />
      </mesh>

      {/* SHERPA 450 ENGINE & CRANKCASE WITH ALUMINUM BASH PLATE */}
      <group position={[0, 0.52, -0.05]}>
        <mesh>
          <boxGeometry args={[0.35, 0.46, 0.62]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        {/* Aluminum Skid Plate (Bottom Protection) */}
        <mesh position={[0, -0.22, 0.02]}>
          <boxGeometry args={[0.32, 0.04, 0.65]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>

      {/* ADVENTURE FUEL TANK WITH EXTERNAL STEEL TANK RACKS */}
      <group position={[0, 0.98, 0.28]}>
        {/* Sculpted Metal Tank */}
        <mesh rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.44, 0.36, 0.72]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* External Tubular Steel Tank Protection Bars (Iconic Himalayan Silhouette) */}
        <mesh position={[0.26, 0, 0.05]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.04, 0.32, 0.55]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        <mesh position={[-0.26, 0, 0.05]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.04, 0.32, 0.55]} />
          <primitive object={mats.darkAccent} />
        </mesh>
      </group>

      {/* STEPPED TWO-PIECE ADVENTURE TOURING SEAT */}
      <group position={[0, 0.88, -0.52]}>
        {/* Rider Seat */}
        <mesh position={[0, 0.04, 0.18]}>
          <boxGeometry args={[0.32, 0.1, 0.45]} />
          <primitive object={mats.leatherSeat} />
        </mesh>
        {/* Elevated Pillion Seat */}
        <mesh position={[0, 0.12, -0.25]}>
          <boxGeometry args={[0.28, 0.1, 0.42]} />
          <primitive object={mats.leatherSeat} />
        </mesh>
      </group>

      {/* REAR ALUMINUM LUGGAGE RACK */}
      <mesh position={[0, 0.98, -1.05]}>
        <boxGeometry args={[0.32, 0.03, 0.35]} />
        <primitive object={mats.chrome} />
      </mesh>

      {/* UPSWEPT HIGH-CLEARANCE EXHAUST CANISTER (Water-Wading 650mm) */}
      <group position={[0.22, 0.58, -0.6]} rotation={[-0.32, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.065, 0.055, 0.85, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------
// 5. ROYAL ENFIELD CLASSIC 350 & SCRAMBLER (Retro Heritage Cruiser)
// ----------------------------------------------------------------------
export function ClassicCruiser3D({ color = "#78350f", headlightsOn = true }) {
  const mats = useVehicleMaterials(color, headlightsOn);
  const wheelR = 0.42;
  const wheelY = wheelR;

  return (
    <group position={[0, 0, 0]}>
      {/* REAR SPOKED WHEEL WITH DEEP CURVED VALANCED MUDGUARD */}
      <group position={[0, wheelY, -1.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[wheelR, wheelR, 0.18, 28]} />
          <primitive object={mats.tireRubber} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.19, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Curved Classic Mudguard */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[wheelR + 0.05, wheelR + 0.05, 0.22, 24, 1, true, 0, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
      </group>

      {/* FRONT SPOKED WHEEL */}
      <group position={[0, wheelY, 1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[wheelR, wheelR, 0.16, 28]} />
          <primitive object={mats.tireRubber} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.17, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>

      {/* CLASSIC CHROME FORKS & HEADLIGHT NACELLE */}
      <group position={[0, 0.82, 0.88]} rotation={[0.38, 0, 0]}>
        <mesh position={[0.13, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.98, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        <mesh position={[-0.13, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.98, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Wide Chrome Cruiser Handlebars */}
        <mesh position={[0, 0.54, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.72, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Round Chrome Headlamp Nacelle with Visor */}
        <mesh position={[0, 0.38, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.1, 24]} />
          <primitive object={mats.headlightLens} />
        </mesh>
      </group>

      {/* J-SERIES 350 ENGINE WITH POLISHED COOLING FINS */}
      <group position={[0, 0.5, -0.05]}>
        <mesh>
          <boxGeometry args={[0.34, 0.44, 0.58]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        {/* Chrome Engine Crankcase Covers (Round) */}
        <mesh position={[0.18, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.05, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>

      {/* ICONIC TEARDROP FUEL TANK (With Rubber Knee Pads) */}
      <group position={[0, 0.92, 0.25]}>
        <mesh rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[0.42, 0.32, 0.65]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* Rubber Knee Thigh Pads */}
        <mesh position={[0.22, -0.02, 0]}>
          <boxGeometry args={[0.02, 0.16, 0.32]} />
          <primitive object={mats.darkAccent} />
        </mesh>
        <mesh position={[-0.22, -0.02, 0]}>
          <boxGeometry args={[0.02, 0.16, 0.32]} />
          <primitive object={mats.darkAccent} />
        </mesh>
      </group>

      {/* VINTAGE SPRUNG SADDLE SEAT */}
      <group position={[0, 0.86, -0.42]}>
        <mesh position={[0, 0.04, 0.05]}>
          <boxGeometry args={[0.34, 0.08, 0.42]} />
          <primitive object={mats.leatherSeat} />
        </mesh>
      </group>

      {/* ICONIC LONG HORIZONTAL CHROME PEA-SHOOTER EXHAUST */}
      <group position={[0.22, 0.28, -0.45]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.048, 0.042, 1.45, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------
// 6. KAWASAKI NINJA ZX-10R, SUZUKI HAYABUSA & MT-15 (Hypersport Superbike)
// ----------------------------------------------------------------------
export function HypersportSuperbike3D({ color = "#16a34a", isHayabusa = false, headlightsOn = true }) {
  const mats = useVehicleMaterials(color, headlightsOn);
  const wheelR = 0.42;
  const wheelY = wheelR;

  return (
    <group position={[0, 0, 0]}>
      {/* 17" REAR RACE WHEEL (Wide 200/55 Supercorsa Tire) */}
      <group position={[0, wheelY, -1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[wheelR, wheelR, 0.26, 28]} />
          <primitive object={mats.tireRubber} />
        </mesh>
        {/* Lightweight Racing Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.27, 0.27, 0.27, 16]} />
          <primitive object={mats.darkAlloy} />
        </mesh>
      </group>

      {/* 17" FRONT RACE WHEEL WITH DUAL BREMBO DRILLED DISCS */}
      <group position={[0, wheelY, 1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[wheelR, wheelR, 0.18, 28]} />
          <primitive object={mats.tireRubber} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.27, 0.27, 0.19, 16]} />
          <primitive object={mats.darkAlloy} />
        </mesh>
        {/* Twin 330mm Floating Rotors */}
        <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        <mesh position={[-0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>

      {/* INVERTED RACING FORKS & CLIP-ON BARS */}
      <group position={[0, 0.8, 0.88]} rotation={[0.42, 0, 0]}>
        <mesh position={[0.13, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.92, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        <mesh position={[-0.13, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.92, 16]} />
          <primitive object={mats.chrome} />
        </mesh>
        {/* Low Clip-on Race Handlebars */}
        <mesh position={[0, 0.44, -0.04]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.58, 16]} />
          <primitive object={mats.darkAccent} />
        </mesh>
      </group>

      {/* FULL AERODYNAMIC WIND-TUNNEL RACING FAIRING */}
      <group position={[0, 0.85, 0.72]}>
        <mesh rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[isHayabusa ? 0.54 : 0.44, 0.52, 0.78]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
        {/* Twin LED Projector Headlights (Slit Design) */}
        <mesh position={[0.14, 0.08, 0.4]} rotation={[0.1, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.06, 0.08]} />
          <primitive object={mats.headlightLens} />
        </mesh>
        <mesh position={[-0.14, 0.08, 0.4]} rotation={[0.1, -0.2, 0]}>
          <boxGeometry args={[0.12, 0.06, 0.08]} />
          <primitive object={mats.headlightLens} />
        </mesh>
        {/* Aerodynamic Bubble Race Windscreen */}
        <mesh position={[0, 0.32, 0.12]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[0.26, 0.32, 0.02]} />
          <primitive object={mats.glass} />
        </mesh>
      </group>

      {/* 203 HP INLINE-4 ENGINE & ALUMINUM TWIN-SPAR CHASSIS */}
      <group position={[0, 0.52, -0.05]}>
        <mesh>
          <boxGeometry args={[0.38, 0.46, 0.65]} />
          <primitive object={mats.darkAccent} />
        </mesh>
      </group>

      {/* SCULPTED RACING FUEL TANK (With Deep Knee Recesses) */}
      <group position={[0, 0.95, 0.18]}>
        <mesh rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[isHayabusa ? 0.48 : 0.42, 0.34, 0.68]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
      </group>

      {/* SEAT & AERODYNAMIC TAIL COWL (Hayabusa Hump) */}
      <group position={[0, 0.88, -0.55]}>
        {/* Rider Seat */}
        <mesh position={[0, 0.04, 0.15]}>
          <boxGeometry args={[0.3, 0.08, 0.42]} />
          <primitive object={mats.leatherSeat} />
        </mesh>
        {/* Sharp Race Tail or Hayabusa Hump */}
        <mesh position={[0, isHayabusa ? 0.14 : 0.08, -0.32]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[isHayabusa ? 0.38 : 0.26, isHayabusa ? 0.22 : 0.12, 0.54]} />
          <primitive object={mats.bodyPaint} />
        </mesh>
      </group>

      {/* SHORTY TITANIUM RACE EXHAUST CANISTER */}
      <group position={[0.24, 0.35, -0.55]} rotation={[-0.28, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.05, 0.72, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <primitive object={mats.chrome} />
        </mesh>
      </group>
      {/* If Hayabusa: Twin Exhausts on BOTH Left and Right */}
      {isHayabusa && (
        <group position={[-0.24, 0.35, -0.55]} rotation={[-0.28, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.05, 0.72, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <primitive object={mats.chrome} />
          </mesh>
        </group>
      )}
    </group>
  );
}
