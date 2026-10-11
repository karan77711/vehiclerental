import React from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function CarModel(props) {
  const { scene } = useGLTF("/models/suzuki_swift.glb");

  // ✅ Rotate the car slowly
  useFrame((state, delta) => {
    scene.rotation.y += delta * 0.5;
  });

  return (
    <>
      {/* ✅ Car Model */}
      <primitive object={scene} scale={1.5} position={[0, -1, 0]} {...props} />

      {/* ✅ Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
    </>
  );
}
