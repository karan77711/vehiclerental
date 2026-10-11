import React, { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

// Glowing Cyber 3D Pin for Telemetry Diagnostics
function CyberPin({ position, systemKey, onSelectSystem, isSelected }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const s = 1 + Math.sin(t * 3.5) * 0.25;
      ringRef.current.scale.set(s, s, s);
    }
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 2.5) * 0.03;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <group ref={meshRef} position={[0, position[1], 0]}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectSystem && onSelectSystem(systemKey);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          style={{ cursor: "pointer" }}
        >
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color={isSelected ? "#00f0ff" : hovered ? "#38bdf8" : "#06b6d4"} />
        </mesh>

        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.13, 24]} />
          <meshBasicMaterial
            color={isSelected ? "#00f0ff" : "#38bdf8"}
            transparent
            opacity={hovered || isSelected ? 0.95 : 0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

// PREMIUM CIRCULAR SHOWROOM TURNTABLE & ROAD STAGE
function ShowroomTurntableStage({ headlightsOn, underglowOn }) {
  return (
    <group position={[0, -0.46, 0]}>
      {/* REFLECTIVE CIRCULAR CYBER TURNTABLE DISC (y = -0.46) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial
          color="#111622"
          roughness={0.78}
          metalness={0.25}
        />
      </mesh>

      {/* GLOWING CYAN OUTER RIM RING */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[5.35, 5.48, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
      </mesh>

      {/* INNER ACCENT GLOW RING */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[3.2, 3.25, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>

      {/* YELLOW DASHED CENTER ROAD LINE ACROSS TURNTABLE */}
      {[-4.2, -2.6, -1.0, 0.6, 2.2, 3.8].map((z, idx) => (
        <mesh key={idx} position={[0, 0.003, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 1.1]} />
          <meshBasicMaterial color="#eab308" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// HIGH-FIDELITY JIMNY WHEEL COMPONENT (All-Terrain Tire, 5-Slot Alloy Rim, Chrome Cap & Brake Disc)
function JimnyWheel({ position, isLeft = false, isSpare = false }) {
  const tireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#12151b",
        roughness: 0.92,
        metalness: 0.05
      }),
    []
  );

  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#334155",
        metalness: 0.88,
        roughness: 0.20
      }),
    []
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f1f5f9",
        metalness: 0.96,
        roughness: 0.08
      }),
    []
  );

  const discMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        metalness: 0.92,
        roughness: 0.15
      }),
    []
  );

  if (isSpare) {
    return (
      <group position={position} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.348, 0.348, 0.205, 32]} />
          <primitive object={tireMat} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.21, 24]} />
          <primitive object={rimMat} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <primitive object={chromeMat} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      {/* Heavy-Duty All-Terrain Jimny Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.348, 0.348, 0.205, 32]} />
        <primitive object={tireMat} />
      </mesh>

      {/* Jimny 5-Slot Alloy Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.21, 24]} />
        <primitive object={rimMat} />
      </mesh>

      {/* Outer Rim Lip & Center Suzuki Chrome Hub Cap */}
      <mesh
        position={[isLeft ? -0.105 : 0.105, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.075, 0.075, 0.02, 16]} />
        <primitive object={chromeMat} />
      </mesh>

      {/* 5 Wheel Lug Nuts */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * 2 * Math.PI) / 5;
        const r = 0.12;
        return (
          <mesh
            key={i}
            position={[
              isLeft ? -0.105 : 0.105,
              r * Math.sin(angle),
              r * Math.cos(angle)
            ]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.015, 0.015, 0.015, 6]} />
            <primitive object={chromeMat} />
          </mesh>
        );
      })}

      {/* Ventilated Disc Brake Rotor Inside Wheel */}
      <mesh
        position={[isLeft ? 0.06 : -0.06, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
        <primitive object={discMat} />
      </mesh>
    </group>
  );
}

// 1. ACTUAL MARUTI SUZUKI JIMNY JB74 4x4 MODEL (1700 Meshes + Full All-Terrain Wheels)
function PhotorealisticSuzukiJimny({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/suzuki_jimny.glb");
  const paintMatsRef = useRef([]);
  const headlightMatsRef = useRef([]);
  const tailMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.scale.set(scale, scale, scale);
    clone.position.set(0, 0, 0);

    const paints = [];
    const heads = [];
    const tails = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();

          // Body paint customization
          if (matName.includes("pintura") || matName.includes("body") || matName.includes("paint")) {
            mat.metalness = 0.88;
            mat.roughness = 0.18;
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.05;
            paints.push(mat);
          } else if (matName.includes("plastico") || matName.includes("bumper")) {
            mat.color = new THREE.Color("#181c24");
            mat.roughness = 0.90;
            mat.metalness = 0.08;
          } else if (matName.includes("vidros") && !matName.includes("vermelhos")) {
            mat.transparent = true;
            mat.opacity = 0.52;
            mat.roughness = 0.05;
            mat.metalness = 0.2;
          } else if (matName.includes("farol") || matName.includes("headlight")) {
            heads.push(mat);
          } else if (matName.includes("vermelhos") || matName.includes("lanterna")) {
            tails.push(mat);
          }
        }
      }
    });

    paintMatsRef.current = paints;
    headlightMatsRef.current = heads;
    tailMatsRef.current = tails;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  useEffect(() => {
    const headCol = new THREE.Color(headlightsOn ? "#38bdf8" : "#0369a1");
    const tailCol = new THREE.Color(headlightsOn ? "#ef4444" : "#7f1d1d");
    headlightMatsRef.current.forEach((m) => {
      m.emissive.copy(headCol);
      m.emissiveIntensity = headlightsOn ? 1.8 : 0.2;
    });
    tailMatsRef.current.forEach((m) => {
      m.emissive.copy(tailCol);
      m.emissiveIntensity = headlightsOn ? 1.6 : 0.2;
    });
  }, [headlightsOn]);

  return (
    <group>
      <primitive object={clonedScene} />
      <JimnyWheel position={[0.689 * scale, 0.348 * scale, 1.167 * scale]} isLeft={false} />
      <JimnyWheel position={[-0.689 * scale, 0.348 * scale, 1.167 * scale]} isLeft={true} />
      <JimnyWheel position={[0.689 * scale, 0.348 * scale, -1.073 * scale]} isLeft={false} />
      <JimnyWheel position={[-0.689 * scale, 0.348 * scale, -1.073 * scale]} isLeft={true} />
      <JimnyWheel position={[-0.207 * scale, 0.771 * scale, -1.716 * scale]} isSpare={true} />
    </group>
  );
}

// 2. ACTUAL MAHINDRA THAR 4x4 MODEL (Full Model with Factory Wheels, Grille & Hardtop)
function PhotorealisticMahindraThar({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/mahindra_thar.glb");
  const paintMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    const s = 0.1522 * scale;
    clone.scale.set(s, s, s);
    clone.position.set(-0.143 * s, 0.3257 * s, 0.411 * s);

    const paints = [];

    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        const matName = (child.material.name || "").toLowerCase();

        // ONLY clone body paint materials so textures and shaders remain cached for 0-lag load!
        if (
          matName.includes("carpaint") ||
          matName.includes("body") ||
          matName.includes("color_m00") ||
          matName.includes("color_m02") ||
          matName.includes("standard")
        ) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          mat.metalness = 0.88;
          mat.roughness = 0.18;
          mat.clearcoat = 1.0;
          mat.clearcoatRoughness = 0.05;
          child.material = mat;
          paints.push(mat);
        }
      }
    });

    paintMatsRef.current = paints;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  return <primitive object={clonedScene} />;
}

// 3. PHOTOREALISTIC TOYOTA FORTUNER LEGENDER 4x4 (Authentic 13.8MB Model with Factory Bridgestone Wheels & Slotted Grille)
function PhotorealisticToyotaFortuner({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/toyota_fortuner.glb");
  const paintMatsRef = useRef([]);
  const headlightMatsRef = useRef([]);
  const tailMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Bounding Box: [74.66, 67.37, 178.19], length is 178.19 units
    // Real Fortuner is 4.795m -> s = 4.795 / 178.191 = 0.02691 * scale
    const s = 0.02691 * scale;
    clone.scale.set(s, s, s);
    // Center at (0, 0) and ground wheels at y = 0
    clone.position.set(-41.876 * s, 2.753 * s, 105.974 * s);

    const paints = [];
    const heads = [];
    const tails = [];

    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        const matName = (child.material.name || "").toLowerCase();

        // Body paint materials (Mesh 0 & 1: 80_Color_007 is 115k verts; Mesh 4 & 5: FrontColor is 90k verts; Mesh 2: Color_002_1; Mesh 12: Color_001_1)
        if (
          matName.includes("color_007") ||
          matName.includes("color_002_1") ||
          matName.includes("color_001_1") ||
          matName.includes("frontcolor") ||
          matName.includes("body") ||
          matName.includes("paint")
        ) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          mat.metalness = 0.88;
          mat.roughness = 0.18;
          mat.clearcoat = 1.0;
          mat.clearcoatRoughness = 0.05;
          child.material = mat;
          paints.push(mat);
        } else if (matName.includes("h08") || matName.includes("headlight")) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          heads.push(mat);
        } else if (matName.includes("a01") || matName.includes("taillight")) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          tails.push(mat);
        } else if (matName.includes("color_002") || matName.includes("glass")) {
          child.material.transparent = true;
          child.material.opacity = 0.52;
          child.material.roughness = 0.05;
          child.material.metalness = 0.2;
        } else if (matName.includes("bridgestone") || matName.includes("tire") || matName.includes("tyre")) {
          child.material.color = new THREE.Color("#13151a");
          child.material.roughness = 0.92;
          child.material.metalness = 0.05;
        } else if (matName.includes("color_a06") || matName.includes("color_008")) {
          child.material.color = new THREE.Color("#1a1d24");
          child.material.roughness = 0.85;
          child.material.metalness = 0.15;
        }
      }
    });

    paintMatsRef.current = paints;
    headlightMatsRef.current = heads;
    tailMatsRef.current = tails;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  useEffect(() => {
    const headCol = new THREE.Color(headlightsOn ? "#38bdf8" : "#0369a1");
    const tailCol = new THREE.Color(headlightsOn ? "#ef4444" : "#7f1d1d");
    headlightMatsRef.current.forEach((m) => {
      m.emissive.copy(headCol);
      m.emissiveIntensity = headlightsOn ? 2.2 : 0.2;
    });
    tailMatsRef.current.forEach((m) => {
      m.emissive.copy(tailCol);
      m.emissiveIntensity = headlightsOn ? 1.8 : 0.2;
    });
  }, [headlightsOn]);

  return <primitive object={clonedScene} />;
}

// 4. PHOTOREALISTIC GRAND 4x4 SUV MODEL (Scorpio-N, Safari, Harrier, XUV700)
// Heavy-duty muscular 15.4MB SUV with slotted grille, wide wheel arches, disc brakes & roof rails
function PhotorealisticGrandSuv({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/jeep_grand_cherokee.glb");
  const paintMatsRef = useRef([]);
  const headlightMatsRef = useRef([]);
  const tailMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Bounds: W=6.67, H=5.55, L=15.092. Target length ~4.7m -> s = 0.3114 * scale
    const s = 0.3114 * scale;
    clone.scale.set(s, s, s);
    // Rotate to face forward +Z, center at (0,0), ground wheels at y = 0
    clone.rotation.set(0, Math.PI, 0);
    clone.position.set(0, 2.733 * s, -0.130 * s);

    const paints = [];
    const heads = [];
    const tails = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();

          if (matName.includes("body")) {
            mat.metalness = 0.88;
            mat.roughness = 0.18;
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.05;
            paints.push(mat);
          } else if (matName.includes("phare")) {
            heads.push(mat);
          } else if (matName.includes("feux_rouge") || matName.includes("feux_stop")) {
            tails.push(mat);
          } else if (matName.includes("vitre")) {
            mat.transparent = true;
            mat.opacity = 0.52;
            mat.roughness = 0.05;
            mat.metalness = 0.2;
          } else if (matName.includes("pneus")) {
            mat.color = new THREE.Color("#13151a");
            mat.roughness = 0.92;
            mat.metalness = 0.05;
          } else if (matName.includes("jante") || matName.includes("chrome") || matName.includes("metal_alu")) {
            mat.metalness = 0.95;
            mat.roughness = 0.12;
          } else if (matName.includes("plastique_noir")) {
            mat.color = new THREE.Color("#181b22");
            mat.roughness = 0.88;
          }
        }
      }
    });

    paintMatsRef.current = paints;
    headlightMatsRef.current = heads;
    tailMatsRef.current = tails;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  useEffect(() => {
    const headCol = new THREE.Color(headlightsOn ? "#38bdf8" : "#0369a1");
    const tailCol = new THREE.Color(headlightsOn ? "#ef4444" : "#7f1d1d");
    headlightMatsRef.current.forEach((m) => {
      m.emissive.copy(headCol);
      m.emissiveIntensity = headlightsOn ? 2.0 : 0.2;
    });
    tailMatsRef.current.forEach((m) => {
      m.emissive.copy(tailCol);
      m.emissiveIntensity = headlightsOn ? 1.8 : 0.2;
    });
  }, [headlightsOn]);

  return <primitive object={clonedScene} />;
}

// 5. PHOTOREALISTIC LUXURY CROSSOVER SUV MODEL (Creta, Innova Hycross)
function PhotorealisticLuxurySuv({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/suv_luxury.glb");
  const paintMatsRef = useRef([]);
  const headlightMatsRef = useRef([]);
  const tailMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    const s = 1.15 * scale;
    clone.scale.set(s, s, s);
    clone.position.set(-0.273 * s, -0.0186 * s, -0.155 * s);

    const paints = [];
    const heads = [];
    const tails = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();
          const meshName = (child.name || "").toLowerCase();

          if (matName.includes("body") || meshName.includes("body")) {
            mat.metalness = 0.88;
            mat.roughness = 0.18;
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.05;
            paints.push(mat);
          } else if (matName.includes("bumper")) {
            mat.color = new THREE.Color("#1f242e");
            mat.roughness = 0.85;
            mat.metalness = 0.1;
          } else if (matName.includes("glass") || meshName.includes("glass")) {
            mat.transparent = true;
            mat.opacity = 0.52;
            mat.roughness = 0.05;
            mat.metalness = 0.2;
          } else if (matName.includes("whitelight") || matName.includes("yellolight")) {
            heads.push(mat);
          } else if (matName.includes("redlight")) {
            tails.push(mat);
          } else if (matName.includes("tyre")) {
            mat.color = new THREE.Color("#13151a");
            mat.roughness = 0.9;
            mat.metalness = 0.05;
          }
        }
      }
    });

    paintMatsRef.current = paints;
    headlightMatsRef.current = heads;
    tailMatsRef.current = tails;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  useEffect(() => {
    const headCol = new THREE.Color(headlightsOn ? "#38bdf8" : "#0369a1");
    const tailCol = new THREE.Color(headlightsOn ? "#ef4444" : "#7f1d1d");
    headlightMatsRef.current.forEach((m) => {
      m.emissive.copy(headCol);
      m.emissiveIntensity = headlightsOn ? 2.0 : 0.2;
    });
    tailMatsRef.current.forEach((m) => {
      m.emissive.copy(tailCol);
      m.emissiveIntensity = headlightsOn ? 1.8 : 0.2;
    });
  }, [headlightsOn]);

  return <primitive object={clonedScene} />;
}

// 6. PHOTOREALISTIC COMPACT SUV MODEL (Tata Nexon EV / Brezza)
function PhotorealisticCompactSuv({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/suv_compact.glb");
  const paintMatsRef = useRef([]);
  const headlightMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Bounds: Size: [2.31, 1.92, 5.48]. Target length ~4.0m -> s = 0.730 * scale
    const s = 0.730 * scale;
    clone.scale.set(s, s, s);
    clone.position.set(0.059 * s, 0.727 * s, 0.118 * s);

    const paints = [];
    const heads = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();

          if (matName.includes("paint") || matName.includes("color")) {
            mat.metalness = 0.88;
            mat.roughness = 0.18;
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.05;
            paints.push(mat);
          } else if (matName.includes("glass")) {
            mat.transparent = true;
            mat.opacity = 0.52;
            mat.roughness = 0.05;
            mat.metalness = 0.2;
          } else if (matName.includes("index_0_2") || matName.includes("light")) {
            heads.push(mat);
          }
        }
      }
    });

    paintMatsRef.current = paints;
    headlightMatsRef.current = heads;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  useEffect(() => {
    const headCol = new THREE.Color(headlightsOn ? "#38bdf8" : "#0369a1");
    headlightMatsRef.current.forEach((m) => {
      m.emissive.copy(headCol);
      m.emissiveIntensity = headlightsOn ? 1.8 : 0.2;
    });
  }, [headlightsOn]);

  return <primitive object={clonedScene} />;
}

// 7. PHOTOREALISTIC MARUTI SUZUKI SWIFT SPORT MODEL (160 Meshes, Metallic Clearcoat)
function PhotorealisticSuzukiSwift({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/suzuki_swift.glb");
  const paintMatsRef = useRef([]);
  const headlightMatsRef = useRef([]);
  const tailMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    const s = 0.60 * scale;
    clone.scale.set(s, s, s);
    clone.position.set(-1.705 * s, 0, 3.546 * s);

    const paints = [];
    const heads = [];
    const tails = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();
          const meshName = (child.name || "").toLowerCase();

          if (
            matName.includes("body") ||
            matName.includes("paint") ||
            matName.includes("ablaze_red") ||
            matName.includes("carroceria") ||
            meshName.includes("body") ||
            meshName.includes("hood")
          ) {
            mat.metalness = 0.88;
            mat.roughness = 0.18;
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.05;
            paints.push(mat);
          } else if (matName.includes("glass") || matName.includes("window") || meshName.includes("glass")) {
            mat.transparent = true;
            mat.opacity = 0.52;
            mat.roughness = 0.05;
            mat.metalness = 0.2;
          } else if (matName.includes("chrome") || matName.includes("rim") || meshName.includes("rim")) {
            mat.metalness = 0.96;
            mat.roughness = 0.08;
          } else if (matName.includes("light") || matName.includes("headlight") || meshName.includes("light")) {
            if (matName.includes("tail") || matName.includes("red")) {
              tails.push(mat);
            } else {
              heads.push(mat);
            }
          } else if (matName.includes("tire") || matName.includes("tyre") || matName.includes("rubber") || meshName.includes("tire")) {
            mat.color = new THREE.Color("#13151a");
            mat.roughness = 0.9;
            mat.metalness = 0.05;
          }
        }
      }
    });

    paintMatsRef.current = paints;
    headlightMatsRef.current = heads;
    tailMatsRef.current = tails;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  useEffect(() => {
    const headCol = new THREE.Color(headlightsOn ? "#38bdf8" : "#0369a1");
    const tailCol = new THREE.Color(headlightsOn ? "#ef4444" : "#7f1d1d");
    headlightMatsRef.current.forEach((m) => {
      m.emissive.copy(headCol);
      m.emissiveIntensity = headlightsOn ? 1.6 : 0.2;
    });
    tailMatsRef.current.forEach((m) => {
      m.emissive.copy(tailCol);
      m.emissiveIntensity = headlightsOn ? 1.6 : 0.2;
    });
  }, [headlightsOn]);

  return <primitive object={clonedScene} />;
}

// 8. PHOTOREALISTIC BMW M-POWER SEDAN (BMW 330Li M Sport Gran Limousine)
function PhotorealisticBmw({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/bmw_m4.glb");
  const paintMatsRef = useRef([]);
  const headlightMatsRef = useRef([]);
  const tailMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    const s = 0.23 * scale;
    clone.scale.set(s, s, s);
    clone.position.set(0.6736 * s, 0, 0.6515 * s);

    const paints = [];
    const heads = [];
    const tails = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();
          const meshName = (child.name || "").toLowerCase();

          if (
            matName.includes("white41") ||
            matName.includes("body151") ||
            matName.includes("ff41") ||
            matName.includes("body") ||
            meshName.includes("body")
          ) {
            mat.metalness = 0.90;
            mat.roughness = 0.16;
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.04;
            paints.push(mat);
          } else if (matName.includes("windows") || matName.includes("glass")) {
            mat.transparent = true;
            mat.opacity = 0.52;
            mat.roughness = 0.05;
          } else if (matName.includes("chrome") || matName.includes("m8rim")) {
            mat.metalness = 0.96;
            mat.roughness = 0.08;
          } else if (matName.includes("headlight") || matName.includes("led1") || matName.includes("light51")) {
            heads.push(mat);
          } else if (matName.includes("redlight") || matName.includes("tail71")) {
            tails.push(mat);
          }
        }
      }
    });

    paintMatsRef.current = paints;
    headlightMatsRef.current = heads;
    tailMatsRef.current = tails;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  useEffect(() => {
    const headCol = new THREE.Color(headlightsOn ? "#38bdf8" : "#0369a1");
    const tailCol = new THREE.Color(headlightsOn ? "#ef4444" : "#7f1d1d");
    headlightMatsRef.current.forEach((m) => {
      m.emissive.copy(headCol);
      m.emissiveIntensity = headlightsOn ? 1.8 : 0.2;
    });
    tailMatsRef.current.forEach((m) => {
      m.emissive.copy(tailCol);
      m.emissiveIntensity = headlightsOn ? 1.6 : 0.2;
    });
  }, [headlightsOn]);

  return <primitive object={clonedScene} />;
}

// 9. PHOTOREALISTIC CLASSIC ROADSTER & SCRAMBLER 2-WHEELER (Royal Enfield Classic 350, Himalayan 450, Triumph Scrambler 400X)
// 165 Meshes, authentic wire spoke wheels, single front & single rear tyre, teardrop tank, leather saddle, chrome exhaust
function PhotorealisticClassicEnfield({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/bike_enfield_classic.glb");
  const paintMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Bounding Box: W=1.244m, H=2.117m, L=3.762m. Min Y = -1.130m
    const s = 0.571 * scale;
    clone.scale.set(s, s, s);
    clone.position.set(-0.101 * s, 1.130 * s, 0.181 * s);

    const paints = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();

          if (matName.includes("body") || matName.includes("paint") || matName.includes("tank")) {
            mat.metalness = 0.88;
            mat.roughness = 0.18;
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.05;
            paints.push(mat);
          } else if (matName.includes("seat")) {
            mat.color = new THREE.Color("#1f242e");
            mat.roughness = 0.85;
            mat.metalness = 0.05;
          } else if (matName.includes("steel") || matName.includes("chrome")) {
            mat.metalness = 0.96;
            mat.roughness = 0.08;
          } else if (matName.includes("engine")) {
            mat.metalness = 0.86;
            mat.roughness = 0.32;
          } else if (matName.includes("disk")) {
            mat.metalness = 0.92;
            mat.roughness = 0.18;
          }
        }
      }
    });

    paintMatsRef.current = paints;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  return <primitive object={clonedScene} />;
}

// 10. PHOTOREALISTIC BMW R 1250 GS ADVENTURE 2-WHEELER (True 2-Wheeler with Spoke Wheels & ShiftCam Boxer)
function PhotorealisticBmwBike({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/bike_bmw.glb");
  const paintMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Clean model bounds: W=1.133, H=1.492, L=2.669. Ground Min Y = -0.108
    const s = 0.805 * scale;
    clone.scale.set(s, s, s);
    // Wheels sit directly on the turntable floor at y = 0
    clone.position.set(0, 0.108 * s, 0.010 * s);

    const paints = [];

    clone.traverse((child) => {
      // Safety: hide any duplicate rigged nodes or skinned meshes if present
      if (
        child.isSkinnedMesh ||
        (child.name && (child.name.includes("ROOT") || child.name.includes("rootJoint") || child.name.includes("PART_")))
      ) {
        child.visible = false;
      }

      if (child.isMesh && child.visible) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();

          // Body fairing & tank (Material.004, Material.062)
          if (matName.includes("004") || matName.includes("062") || matName.includes("body") || matName.includes("paint")) {
            mat.metalness = 0.85;
            mat.roughness = 0.20;
            mat.clearcoat = 1.0;
            paints.push(mat);
          }
        }
      }
    });

    paintMatsRef.current = paints;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  return <primitive object={clonedScene} />;
}

// 11. PHOTOREALISTIC KAWASAKI NINJA ZX-10R / H2R 2-WHEELER (Championship Superbike with Aero Wings)
function PhotorealisticNinjaH2R({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/bike_h2r.glb");
  const paintMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Bounds: Size [1.989, 1.087, 0.802]. Length is along X, so rotate 90 deg around Y.
    const s = 1.05 * scale;
    clone.scale.set(s, s, s);
    clone.rotation.set(0, Math.PI / 2, 0);
    clone.position.set(0, 0.064 * s, -0.068 * s);

    const paints = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();

          // Fairings & Cowl
          if (matName.includes("001") || matName.includes("005") || matName.includes("021")) {
            mat.metalness = 0.90;
            mat.roughness = 0.16;
            mat.clearcoat = 1.0;
            paints.push(mat);
          }
        }
      }
    });

    paintMatsRef.current = paints;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  return <primitive object={clonedScene} />;
}

// 12. REAL 2-WHEELED YAMAHA SUPERBIKE / MT-15 / KTM 390 (Single Front Tire, Single Rear Tire)
function PhotorealisticYamaha({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/bike_yamaha.glb");
  const paintMatsRef = useRef([]);
  const headlightMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.scale.set(scale, scale, scale);
    clone.position.set(0, 0, 0);

    const paints = [];
    const heads = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const matName = (mat.name || "").toLowerCase();
          const meshName = (child.name || "").toLowerCase();

          if (matName.includes("main_decals") || meshName.includes("body") || meshName.includes("fuel_cap")) {
            mat.metalness = 0.88;
            mat.roughness = 0.18;
            mat.clearcoat = 1.0;
            paints.push(mat);
          } else if (meshName.includes("tire") || matName.includes("tire")) {
            mat.color = new THREE.Color("#111317");
            mat.roughness = 0.94;
            mat.metalness = 0.05;
          } else if (meshName.includes("rim") || matName.includes("rim")) {
            mat.color = new THREE.Color("#334155");
            mat.metalness = 0.85;
            mat.roughness = 0.20;
          } else if (meshName.includes("seat") || matName.includes("seat")) {
            mat.color = new THREE.Color("#18181b");
            mat.roughness = 0.85;
          } else if (meshName.includes("exhaust") || meshName.includes("muffler")) {
            mat.metalness = 0.95;
            mat.roughness = 0.12;
          } else if (meshName.includes("headlight") || meshName.includes("drl")) {
            heads.push(mat);
          }
        }
      }
    });

    paintMatsRef.current = paints;
    headlightMatsRef.current = heads;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  useEffect(() => {
    const headCol = new THREE.Color(headlightsOn ? "#38bdf8" : "#0369a1");
    headlightMatsRef.current.forEach((m) => {
      m.emissive.copy(headCol);
      m.emissiveIntensity = headlightsOn ? 2.2 : 0.2;
    });
  }, [headlightsOn]);

  return <primitive object={clonedScene} />;
}

// 13. REAL 2-WHEELED SUZUKI HAYABUSA 1340cc (Single Front Tire, Single Rear Tire, Dual Exhaust)
function PhotorealisticHayabusa({ color = "#dc2626", headlightsOn = true, scale = 1.0 }) {
  const { scene } = useGLTF("/models/bike_hayabusa.glb");
  const paintMatsRef = useRef([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.scale.set(scale, scale, scale);
    clone.position.set(0, 0, 0.04 * scale);

    const paints = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone ? child.material.clone() : child.material;
          child.material = mat;
          const meshName = (child.name || "").toLowerCase();

          if (meshName.includes("chassis") && !meshName.includes("glass") && !meshName.includes("tyre")) {
            mat.metalness = 0.88;
            mat.roughness = 0.18;
            mat.clearcoat = 1.0;
            paints.push(mat);
          } else if (meshName.includes("tyre")) {
            mat.color = new THREE.Color("#111317");
            mat.roughness = 0.94;
            mat.metalness = 0.05;
          } else if (meshName.includes("rim")) {
            mat.color = new THREE.Color("#475569");
            mat.metalness = 0.88;
            mat.roughness = 0.18;
          } else if (meshName.includes("exhaust") || meshName.includes("crome")) {
            mat.color = new THREE.Color("#e2e8f0");
            mat.metalness = 0.95;
            mat.roughness = 0.08;
          } else if (meshName.includes("glass")) {
            mat.transparent = true;
            mat.opacity = 0.45;
            mat.roughness = 0.05;
          }
        }
      }
    });

    paintMatsRef.current = paints;
    return clone;
  }, [scene, scale]);

  useEffect(() => {
    const c = new THREE.Color(color);
    paintMatsRef.current.forEach((m) => m.color.copy(c));
  }, [color]);

  return <primitive object={clonedScene} />;
}

// Forward Road Projection Headlight Beams
function HeadlightRoadBeam({ headlightsOn }) {
  const targetObj = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, -0.46, 6.0);
    return o;
  }, []);

  if (!headlightsOn) return null;

  return (
    <>
      <primitive object={targetObj} />
      <spotLight
        position={[0.35, 0.25, 1.8]}
        target={targetObj}
        intensity={1.2}
        angle={0.42}
        penumbra={0.80}
        color="#e0f2fe"
        distance={9.0}
      />
      <spotLight
        position={[-0.35, 0.25, 1.8]}
        target={targetObj}
        intensity={1.2}
        angle={0.42}
        penumbra={0.80}
        color="#e0f2fe"
        distance={9.0}
      />
    </>
  );
}

// MAIN 3D STUDIO SCENE
function StudioScene({
  vehicleConfig,
  color,
  onSelectSystem,
  highlightedSystem,
  headlightsOn,
  underglowOn,
  showPins
}) {
  const isBike = vehicleConfig.category === "BIKE";

  return (
    <>
      {/* Balanced Studio Lighting - Natural Tone Without Washed-Out White Glare */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 5]} intensity={1.3} castShadow />
      <directionalLight position={[-5, 5, -4]} intensity={0.65} color="#93c5fd" />
      <directionalLight position={[0, 4, -5]} intensity={0.5} color="#e2e8f0" />
      <pointLight position={[0, 3.5, 2]} intensity={0.7} color="#38bdf8" />

      {/* Headlight Projected Road Beams */}
      <HeadlightRoadBeam headlightsOn={headlightsOn} />

      {/* Underbody Neon Glow */}
      {underglowOn && (
        <pointLight position={[0, -0.22, 0]} intensity={3.5} color="#00f0ff" distance={4.5} />
      )}

      {/* HDRI Studio Reflections */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      {/* TURNTABLE STAGE: Surface at y = -0.46 */}
      <ShowroomTurntableStage headlightsOn={headlightsOn} underglowOn={underglowOn} />

      {/* VEHICLE ROOT: Placed at y = -0.46 so wheels touch the turntable at y = -0.46 */}
      <group position={[0, -0.46, 0]}>
        {vehicleConfig.modelType === "hayabusa" ? (
          <Suspense fallback={null}>
            <PhotorealisticHayabusa color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "bmw_bike" ? (
          <Suspense fallback={null}>
            <PhotorealisticBmwBike color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "ninja" ? (
          <Suspense fallback={null}>
            <PhotorealisticNinjaH2R color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "yamaha" ? (
          <Suspense fallback={null}>
            <PhotorealisticYamaha color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "classic_enfield" ? (
          <Suspense fallback={null}>
            <PhotorealisticClassicEnfield color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.category === "BIKE" ? (
          <Suspense fallback={null}>
            <PhotorealisticClassicEnfield color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "fortuner" ? (
          <Suspense fallback={null}>
            <PhotorealisticToyotaFortuner color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "grand_suv" ? (
          <Suspense fallback={null}>
            <PhotorealisticGrandSuv color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "jimny" ? (
          <Suspense fallback={null}>
            <PhotorealisticSuzukiJimny color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "thar" ? (
          <Suspense fallback={null}>
            <PhotorealisticMahindraThar color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "luxury_suv" ? (
          <Suspense fallback={null}>
            <PhotorealisticLuxurySuv color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "compact_suv" ? (
          <Suspense fallback={null}>
            <PhotorealisticCompactSuv color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : vehicleConfig.modelType === "bmw" ? (
          <Suspense fallback={null}>
            <PhotorealisticBmw color={color} headlightsOn={headlightsOn} />
          </Suspense>
        ) : (
          <Suspense fallback={null}>
            <PhotorealisticSuzukiSwift color={color} headlightsOn={headlightsOn} />
          </Suspense>
        )}

        {/* 3D Telemetry Pins */}
        {showPins && (
          <>
            <CyberPin
              position={[0, isBike ? 0.52 : 0.75, isBike ? 0.05 : 1.35]}
              systemKey="engine"
              onSelectSystem={onSelectSystem}
              isSelected={highlightedSystem === "engine"}
            />
            <CyberPin
              position={[isBike ? 0.15 : 0.95, isBike ? 0.32 : 0.42, isBike ? 0.75 : 1.35]}
              systemKey="brakes"
              onSelectSystem={onSelectSystem}
              isSelected={highlightedSystem === "brakes"}
            />
            <CyberPin
              position={[isBike ? -0.12 : 0, isBike ? 0.35 : 0.42, isBike ? -0.35 : -0.2]}
              systemKey="transmission"
              onSelectSystem={onSelectSystem}
              isSelected={highlightedSystem === "transmission"}
            />
            <CyberPin
              position={[isBike ? -0.15 : -0.85, isBike ? 0.72 : 0.52, isBike ? 0.60 : 0.5]}
              systemKey="suspension"
              onSelectSystem={onSelectSystem}
              isSelected={highlightedSystem === "suspension"}
            />
            <CyberPin
              position={[isBike ? 0 : -0.45, isBike ? 0.68 : 0.8, isBike ? -0.25 : 1.2]}
              systemKey="battery"
              onSelectSystem={onSelectSystem}
              isSelected={highlightedSystem === "battery"}
            />
            <CyberPin
              position={[isBike ? 0 : 0.95, isBike ? 0.30 : 0.42, isBike ? -0.80 : -1.35]}
              systemKey="tires"
              onSelectSystem={onSelectSystem}
              isSelected={highlightedSystem === "tires"}
            />
          </>
        )}
      </group>

      {/* Realistic Contact Shadows on Turntable Floor - frames={1} for Zero GPU Lag */}
      <ContactShadows
        position={[0, -0.458, 0]}
        opacity={0.88}
        scale={9.5}
        blur={2.4}
        far={3.5}
        frames={1}
        color={underglowOn ? "#00f0ff" : "#020617"}
      />
    </>
  );
}

// Preload 3D Models in Background
useGLTF.preload("/models/suzuki_jimny.glb");
useGLTF.preload("/models/mahindra_thar.glb");
useGLTF.preload("/models/toyota_fortuner.glb");
useGLTF.preload("/models/jeep_grand_cherokee.glb");
useGLTF.preload("/models/suv_luxury.glb");
useGLTF.preload("/models/suv_compact.glb");
useGLTF.preload("/models/suzuki_swift.glb");
useGLTF.preload("/models/bmw_m4.glb");
useGLTF.preload("/models/bike_hayabusa.glb");
useGLTF.preload("/models/bike_yamaha.glb");
useGLTF.preload("/models/bike_bmw.glb");
useGLTF.preload("/models/bike_h2r.glb");
useGLTF.preload("/models/bike_enfield_classic.glb");

export default function Vehicle3DViewer({
  color = "#b4b8be",
  vehicleName = "mahindra thar",
  displayName,
  vehicleType,
  onSelectSystem,
  highlightedSystem
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [underglowOn, setUnderglowOn] = useState(false);
  const [showPins, setShowPins] = useState(true);
  const controlsRef = useRef();

  // Category & vehicle configuration matcher for all Real-Life Indian Fleet Vehicles
  const vehicleConfig = useMemo(() => {
    const combined = `${vehicleName} ${displayName || ""} ${vehicleType || ""}`.toLowerCase();

    // 1. Suzuki Hayabusa 1340cc Hyperbike
    if (combined.includes("hayabusa")) {
      return {
        category: "BIKE",
        modelType: "hayabusa",
        bikeVariant: "hayabusa",
        hudBadge: "3D SUZUKI HAYABUSA 1340cc HYPERBIKE",
        hudSubtitle: "Transcontinental Aerodynamic Hyperbike • Dual Exhaust • 2-Wheeler"
      };
    }

    // 2. BMW R 1250 GS Adventure
    if (
      combined.includes("r1250") ||
      combined.includes("r 1250") ||
      combined.includes("1250 gs") ||
      combined.includes("bmw gs") ||
      combined.includes("bmwr1250") ||
      (combined.includes("bmw") && combined.includes("gs")) ||
      (combined.includes("bmw") && combined.includes("bike"))
    ) {
      return {
        category: "BIKE",
        modelType: "bmw_bike",
        hudBadge: "3D BMW R 1250 GS ADVENTURE",
        hudSubtitle: "1254cc Boxer Twin • ShiftCam • Dual-Spoke Wheels • 2-Wheeler"
      };
    }

    // 3. Kawasaki Ninja ZX-10R Superbike
    if (
      combined.includes("ninja") ||
      combined.includes("zx10r") ||
      combined.includes("zx-10r") ||
      combined.includes("h2r")
    ) {
      return {
        category: "BIKE",
        modelType: "ninja",
        hudBadge: "3D KAWASAKI NINJA ZX-10R SUPERBIKE",
        hudSubtitle: "WorldSBK Championship Aerodynamics • Single Rear Wheel • In-Line 4"
      };
    }

    // 4. Royal Enfield Himalayan 450 Adventure Tourer
    if (combined.includes("himalayan")) {
      return {
        category: "BIKE",
        modelType: "classic_enfield",
        hudBadge: "3D ROYAL ENFIELD HIMALAYAN 450",
        hudSubtitle: "Sherpa 450 Adventure Tourer • Chrome Spoke Wheels • 2-Wheeler"
      };
    }

    // 5. Royal Enfield Classic 350 Roadster
    if (combined.includes("classic") || combined.includes("bullet") || combined.includes("enfield")) {
      return {
        category: "BIKE",
        modelType: "classic_enfield",
        hudBadge: "3D ROYAL ENFIELD CLASSIC 350",
        hudSubtitle: "J-Series Classic Roadster • Chrome Spoke Wheels • Single Rear Wheel"
      };
    }

    // 6. Triumph Scrambler 400X
    if (combined.includes("scrambler") || combined.includes("triumph")) {
      return {
        category: "BIKE",
        modelType: "classic_enfield",
        hudBadge: "3D TRIUMPH SCRAMBLER 400X",
        hudSubtitle: "TR-Series 398cc Liquid-Cooled • Wire Spoke Wheels • 2-Wheeler"
      };
    }

    // 7. KTM 390 Adventure Rally / Duke
    if (combined.includes("ktm") || combined.includes("390") || combined.includes("duke")) {
      return {
        category: "BIKE",
        modelType: "yamaha",
        hudBadge: "3D KTM 390 ADVENTURE RALLY",
        hudSubtitle: "WP Apex Long-Travel Suspension • Streetfighter Stance • Single Rear Wheel"
      };
    }

    // 8. Yamaha MT-15 / Sportbike / Streetfighter / General Bike fallback
    if (
      vehicleType === "BIKE" ||
      combined.includes("mt15") ||
      combined.includes("mt-15") ||
      combined.includes("yamaha") ||
      combined.includes("bike") ||
      combined.includes("motorcycle")
    ) {
      return {
        category: "BIKE",
        modelType: "yamaha",
        hudBadge: "3D YAMAHA HYPER NAKED STREETFIGHTER",
        hudSubtitle: "Deltabox Frame • Single Rear Wheel • Upside-Down Front Forks"
      };
    }

    // 9. Toyota Fortuner Legender 4x4
    if (combined.includes("fortuner")) {
      return {
        category: "FORTUNER_4X4",
        modelType: "fortuner",
        hudBadge: "3D TOYOTA FORTUNER LEGENDER 4x4",
        hudSubtitle: "204 HP 2.8L D-4D Diesel • Dual-Range 4WD • 7-Seater"
      };
    }

    // 10. Maruti Suzuki Jimny Alpha 4x4
    if (combined.includes("jimny")) {
      return {
        category: "JIMNY_4X4",
        modelType: "jimny",
        hudBadge: "3D MARUTI SUZUKI JIMNY 4x4",
        hudSubtitle: "AllGrip Pro 4WD • Ladder-Frame Lightweight 4x4 Off-Roader"
      };
    }

    // 11. Mahindra Thar 4x4 Hardtop
    if (combined.includes("thar")) {
      return {
        category: "THAR_4X4",
        modelType: "thar",
        hudBadge: "3D MAHINDRA THAR 4x4 HARDTOP",
        hudSubtitle: "mHawk Diesel • Mechanical Locking Differential 4WD"
      };
    }

    // 12. Muscular Grand 4x4 SUVs: Scorpio-N, Safari, Harrier, XUV700
    if (
      combined.includes("scorpio") ||
      combined.includes("safari") ||
      combined.includes("harrier") ||
      combined.includes("xuv700") ||
      combined.includes("xuv")
    ) {
      let badge = "3D HEAVY-DUTY GRAND SUV";
      let sub = "Rugged Ladder-Frame 4x4 Architecture • Command Seating";
      if (combined.includes("scorpio")) {
        badge = "3D MAHINDRA SCORPIO-N Z8L 4XPLOR";
        sub = "175 HP mHawk • Intelligent 4XPLOR Terrain Management";
      } else if (combined.includes("safari")) {
        badge = "3D TATA SAFARI DARK GOLD ACCOMPLISHED+";
        sub = "Kryotec 2.0L Diesel • OMEGARC Land Rover Derived Monocoque";
      } else if (combined.includes("harrier")) {
        badge = "3D TATA HARRIER #DARK EDITION";
        sub = "Kryotec 2.0L Turbo Diesel • Land Rover Pedigree Chassis";
      } else if (combined.includes("xuv700") || combined.includes("xuv")) {
        badge = "3D MAHINDRA XUV700 AX7-L AWD";
        sub = "mStallion Turbo • Intelligent All-Wheel Drive";
      }

      return {
        category: "GRAND_SUV",
        modelType: "grand_suv",
        hudBadge: badge,
        hudSubtitle: sub
      };
    }

    // 13. Sleek Luxury Crossover SUVs & MPVs: Creta, Hycross, Innova
    if (
      combined.includes("creta") ||
      combined.includes("hycross") ||
      combined.includes("innova")
    ) {
      let badge = "3D LUXURY SUV STUDIO";
      let sub = "Aerodynamic Monocoque • Highway Touring Cruiser";
      if (combined.includes("creta")) {
        badge = "3D HYUNDAI CRETA SX(O) 1.5 TURBO";
        sub = "160 HP 1.5L Turbo GDi • 7-Speed Dual Clutch Transmission";
      } else if (combined.includes("hycross") || combined.includes("innova")) {
        badge = "3D TOYOTA INNOVA HYCROSS ZX(O) HYBRID";
        sub = "Self-Charging Strong Hybrid Electric • TNGA Monocoque";
      }

      return {
        category: "LUXURY_SUV",
        modelType: "luxury_suv",
        hudBadge: badge,
        hudSubtitle: sub
      };
    }

    // 14. Tata Nexon & Compact Crossovers
    if (combined.includes("nexon") || combined.includes("brezza") || combined.includes("punch")) {
      return {
        category: "COMPACT_SUV",
        modelType: "compact_suv",
        hudBadge: "3D TATA NEXON EV EMPOWERED+ LR",
        hudSubtitle: "Permanent Magnet Synchronous EV • 465 km Long Range"
      };
    }

    // 15. BMW M-Power Performance Sedans
    if (
      combined.includes("bmw") ||
      combined.includes("330li") ||
      combined.includes("sedan") ||
      combined.includes("m sport")
    ) {
      return {
        category: "PERFORMANCE_SEDAN",
        modelType: "bmw",
        hudBadge: "3D BMW 330Li M SPORT GRAN LIMOUSINE",
        hudSubtitle: "TwinPower Turbo • M-Sport Aerodynamics • Rear-Wheel Drive"
      };
    }

    // 16. Default / Maruti Suzuki Swift Sport
    return {
      category: "HATCHBACK_URBAN",
      modelType: "swift",
      hudBadge: "3D MARUTI SUZUKI SWIFT SPORT ZXi+",
      hudSubtitle: "Heartect High-Tensile Chassis • BoosterJet Sport Tuning"
    };
  }, [vehicleName, displayName, vehicleType]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(3.5, 1.4, 3.8);
      controlsRef.current.target.set(0, 0.35, 0);
      controlsRef.current.update();
    }
  };

  const setCameraAngle = (pos) => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(...pos);
      controlsRef.current.target.set(0, 0.35, 0);
      controlsRef.current.update();
    }
  };

  const effectiveDisplayName = displayName || vehicleName;

  return (
    <div className="studio-canvas-container">
      {/* 3D Canvas with Real Model Centered on Circular Turntable at Medium Framing */}
      <Canvas
        shadows
        camera={{ position: [3.5, 1.4, 3.8], fov: 36 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95
        }}
      >
        <StudioScene
          vehicleConfig={vehicleConfig}
          color={color}
          onSelectSystem={onSelectSystem}
          highlightedSystem={highlightedSystem}
          headlightsOn={headlightsOn}
          underglowOn={underglowOn}
          showPins={showPins}
        />

        {/* OrbitControls centered on vehicle's body center (y = 0.35) */}
        <OrbitControls
          ref={controlsRef}
          target={[0, 0.35, 0]}
          enablePan={false}
          minDistance={2.2}
          maxDistance={7.5}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 - 0.04}
          autoRotate={autoRotate}
          autoRotateSpeed={1.8}
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.85}
        />
      </Canvas>

      {/* TOP-LEFT LIVE VEHICLE IDENTIFICATION HUD */}
      <div className="studio-top-hud">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00f0ff", display: "inline-block" }}></span>
          <span style={{ fontSize: "10px", fontFamily: "monospace", fontWeight: "bold", color: "#00f0ff", letterSpacing: "1px", textTransform: "uppercase" }}>
            {vehicleConfig.hudBadge}
          </span>
        </div>
        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", textTransform: "capitalize" }}>
          {effectiveDisplayName}
        </span>
        <span style={{ fontSize: "10px", color: "#94a3b8", fontFamily: "monospace" }}>
          {vehicleConfig.hudSubtitle}
        </span>
      </div>

      {/* TOP-RIGHT STUDIO CONTROLS TOOLBAR */}
      <div className="studio-top-toolbar">
        {/* Headlights Toggle */}
        <button
          type="button"
          onClick={() => setHeadlightsOn(!headlightsOn)}
          className={`studio-ctrl-btn ${headlightsOn ? "active-amber" : ""}`}
          title="Toggle Headlights & Road Beam"
        >
          💡 {headlightsOn ? "Lights ON" : "Lights OFF"}
        </button>

        {/* Underbody Neon Glow */}
        <button
          type="button"
          onClick={() => setUnderglowOn(!underglowOn)}
          className={`studio-ctrl-btn ${underglowOn ? "active-cyan" : ""}`}
          title="Toggle Road Underglow"
        >
          ✨ {underglowOn ? "Neon ON" : "Neon"}
        </button>

        {/* 3D Telemetry Pins */}
        <button
          type="button"
          onClick={() => setShowPins(!showPins)}
          className={`studio-ctrl-btn ${showPins ? "active-sky" : ""}`}
          title="Toggle Diagnostic Pins"
        >
          📍 {showPins ? "Pins" : "Pins OFF"}
        </button>

        {/* Silky 360 Turntable Spin Mechanism */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`studio-ctrl-btn ${autoRotate ? "active-cyan" : ""}`}
          style={autoRotate ? { borderColor: "#00f0ff", color: "#00f0ff", background: "rgba(0, 240, 255, 0.15)" } : {}}
          title="360° Smooth Turntable Spin"
        >
          {autoRotate ? "⏹ Stop Spin" : "↻ 360° Spin"}
        </button>

        {/* Reset Camera View */}
        <button
          type="button"
          onClick={resetCamera}
          className="studio-ctrl-btn"
          title="Reset Camera View"
        >
          ↺
        </button>
      </div>

      {/* BOTTOM-RIGHT PRESET CAMERA ANGLES */}
      <div className="studio-bottom-angles">
        <span style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace", paddingRight: "4px" }}>Angle:</span>
        <button
          type="button"
          onClick={() => setCameraAngle([3.5, 1.4, 3.8])}
          className="studio-angle-btn"
          title="Hero 3/4 Perspective"
        >
          Hero 3/4
        </button>
        <button
          type="button"
          onClick={() => setCameraAngle([0, 1.1, 4.8])}
          className="studio-angle-btn"
          title="Front Grille Perspective"
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => setCameraAngle([4.8, 0.8, 0])}
          className="studio-angle-btn"
          title="Side Profile"
        >
          Side
        </button>
        <button
          type="button"
          onClick={() => setCameraAngle([-3.5, 1.4, -3.8])}
          className="studio-angle-btn"
          title="Rear 3/4 Angle"
        >
          Rear 3/4
        </button>
        <button
          type="button"
          onClick={() => setCameraAngle([0, 5.5, 0.1])}
          className="studio-angle-btn"
          title="Top Drone View"
        >
          Top
        </button>
      </div>

      {/* BOTTOM-LEFT ROAD STATUS HINT */}
      <div className="studio-bottom-hint">
        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
        <span>Asphalt Turntable • Drag to Spin 360°</span>
      </div>
    </div>
  );
}
