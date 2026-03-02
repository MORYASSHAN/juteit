import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function JuteBox({
  position,
  rotation,
  scale,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x =
      rotation[0] + state.clock.elapsedTime * 0.3 * speed;
    meshRef.current.rotation.y =
      rotation[1] + state.clock.elapsedTime * 0.5 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1.2, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function JuteSphere({
  position,
  scale,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed?: number;
}) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.0} />
      </mesh>
    </Float>
  );
}

function JuteCylinder({
  position,
  scale,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.4 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <cylinderGeometry args={[0.6, 0.8, 1.4, 8]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
      </mesh>
    </Float>
  );
}

function Scene() {
  // Earthy jute palette colors (literal values for WebGL canvas)
  const brownDark = "#6b4f30";
  const brownMid = "#8b6540";
  const olive = "#6b7c3e";
  const amber = "#c4a84a";
  const cream = "#d4c4a0";
  const brownLight = "#a07850";

  return (
    <>
      <ambientLight intensity={0.6} color="#fff5e0" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#ffe8c0"
        castShadow
      />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#c8e0a0" />

      <JuteBox
        position={[-3, 0.5, -1]}
        rotation={[0.3, 0.4, 0.1]}
        scale={0.8}
        color={brownDark}
        speed={0.7}
      />
      <JuteBox
        position={[3, -0.3, -2]}
        rotation={[0.1, 0.2, 0.3]}
        scale={1.1}
        color={brownMid}
        speed={0.9}
      />
      <JuteBox
        position={[0.5, 1.2, -3]}
        rotation={[0.2, 0.5, 0.1]}
        scale={0.65}
        color={brownLight}
        speed={1.2}
      />

      <JuteSphere
        position={[-1.5, -0.8, -1]}
        scale={0.55}
        color={olive}
        speed={0.8}
      />
      <JuteSphere
        position={[2, 1, -1.5]}
        scale={0.4}
        color={amber}
        speed={1.1}
      />
      <JuteSphere
        position={[-2.5, 0.2, -3]}
        scale={0.7}
        color={cream}
        speed={0.6}
      />

      <JuteCylinder
        position={[1, -1, -2]}
        scale={0.6}
        color={brownDark}
        speed={0.9}
      />
      <JuteCylinder
        position={[-1, 1.5, -2.5]}
        scale={0.45}
        color={olive}
        speed={1.3}
      />

      <Environment preset="sunset" />
    </>
  );
}

export default function JuteScene3D() {
  return (
    <div className="three-canvas w-full h-[320px] md:h-[420px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
