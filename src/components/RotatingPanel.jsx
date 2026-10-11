import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

function RotatingPanel({ color, position }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.material.emissiveIntensity = hovered ? 0.8 : 0.2;
    }
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 1, 0.1]} />
      <meshStandardMaterial
        color={color}
        emissive={hovered ? color : "#000000"}
        emissiveIntensity={hovered ? 0.8 : 0.2}
      />
      <Html position={[0, 0, 0.2]}>
        <div style={{ color: "white", fontSize: "14px", textAlign: "center" }}>
          Dashboard Panel
        </div>
      </Html>
    </mesh>
  );
}

export default RotatingPanel;
