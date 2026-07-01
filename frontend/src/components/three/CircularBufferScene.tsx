import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * A DMA circular (ring) buffer, animated: the cyan pointer is the producer
 * (DMA write head) advancing faster than the purple consumer (CPU read tail).
 * Slots between tail and head light up to show data in flight.
 */

const SLOT_COUNT = 24;
const RADIUS = 3;
const FILLED_COLOR = new THREE.Color("#38bdf8");
const EMPTY_COLOR = new THREE.Color("#2a2f3a");

function slotAngle(index: number) {
  return (index / SLOT_COUNT) * Math.PI * 2;
}

function isSlotFilled(index: number, head: number, tail: number) {
  const h = Math.floor(head) % SLOT_COUNT;
  const t = Math.floor(tail) % SLOT_COUNT;
  if (h === t) return false;
  if (h > t) return index >= t && index < h;
  return index >= t || index < h;
}

function Slots({ headRef, tailRef }: { headRef: { current: number }; tailRef: { current: number } }) {
  const materials = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame(() => {
    const head = headRef.current;
    const tail = tailRef.current;
    for (let i = 0; i < SLOT_COUNT; i++) {
      const mat = materials.current[i];
      if (!mat) continue;
      const filled = isSlotFilled(i, head, tail);
      mat.color.lerp(filled ? FILLED_COLOR : EMPTY_COLOR, 0.15);
    }
  });

  const positions = useMemo(
    () =>
      Array.from({ length: SLOT_COUNT }, (_, i) => {
        const angle = slotAngle(i);
        return [Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS] as const;
      }),
    [],
  );

  return (
    <>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, -slotAngle(i), 0]}>
          <boxGeometry args={[0.35, 0.35, 0.18]} />
          <meshStandardMaterial
            ref={(mat) => {
              materials.current[i] = mat;
            }}
            color={EMPTY_COLOR}
          />
        </mesh>
      ))}
    </>
  );
}

function Pointer({ angleRef, color }: { angleRef: { current: number }; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const angle = slotAngle(angleRef.current);
    groupRef.current.position.set(
      Math.cos(angle) * (RADIUS + 0.6),
      0,
      Math.sin(angle) * (RADIUS + 0.6),
    );
    groupRef.current.rotation.y = -angle;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.16, 0.42, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Scene() {
  const headRef = useRef(0);
  const tailRef = useRef(0);

  useFrame((_, delta) => {
    headRef.current += delta * 3;
    tailRef.current += delta * 1.6;
    const maxLead = SLOT_COUNT - 2;
    if (headRef.current - tailRef.current > maxLead) {
      tailRef.current = headRef.current - maxLead;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} />
      <Slots headRef={headRef} tailRef={tailRef} />
      <Pointer angleRef={headRef} color="#38bdf8" />
      <Pointer angleRef={tailRef} color="#c084fc" />
    </>
  );
}

export function CircularBufferScene() {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-2xl border border-border bg-surface/40">
      <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
        <Scene />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
