"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Block({ position, scale = [0.98, 0.42, 0.98], color }) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} flatShading roughness={0.92} />
    </mesh>
  );
}

function Island() {
  const root = useRef(null);
  const dust = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () => Array.from({ length: 34 }, (_, i) => ({
      x: Math.sin(i * 17.13) * 3.1,
      y: Math.cos(i * 9.71) * 1.65,
      z: Math.cos(i * 13.37) * 2.4,
      s: 0.018 + (i % 4) * 0.009,
    })),
    []
  );

  useEffect(() => {
    if (!dust.current) return;
    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      dust.current.setMatrixAt(i, dummy.matrix);
    });
    dust.current.instanceMatrix.needsUpdate = true;
  }, [dummy, particles]);

  useFrame((state, delta) => {
    if (root.current) {
      const targetY = state.pointer.x * 0.18;
      const targetX = -state.pointer.y * 0.08;
      root.current.rotation.y += (targetY - root.current.rotation.y) * Math.min(1, delta * 1.8);
      root.current.rotation.x += (targetX - root.current.rotation.x) * Math.min(1, delta * 1.8);
    }
    if (dust.current) {
      dust.current.rotation.y += delta * 0.018;
      dust.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    }
  });

  const top = [];
  const middle = [];
  const base = [];
  for (let x = -2; x <= 2; x += 1) {
    for (let z = -2; z <= 2; z += 1) {
      if (Math.abs(x) + Math.abs(z) <= 3) {
        top.push([x, 0, z]);
        middle.push([x * 0.84, -0.43, z * 0.84]);
      }
      if (Math.abs(x) + Math.abs(z) <= 2) base.push([x * 0.68, -0.84, z * 0.68]);
    }
  }

  return (
    <>
      <group ref={root} position={[1.35, -0.55, 0]}>
        <Float speed={0.7} rotationIntensity={0.025} floatIntensity={0.12}>
          {base.map((p, i) => <Block key={"b" + i} position={p} color="#303943" scale={[0.94, 0.44, 0.94]} />)}
          {middle.map((p, i) => <Block key={"m" + i} position={p} color="#684b3b" scale={[0.98, 0.44, 0.98]} />)}
          {top.map((p, i) => <Block key={"t" + i} position={p} color={i % 5 === 0 ? "#52745a" : "#638766"} />)}
          <Block position={[0, 0.36, 0]} scale={[0.96, 0.34, 0.96]} color="#3f5860" />
          <Block position={[0, 0.92, 0]} scale={[0.55, 0.8, 0.55]} color="#a8c2c6" />
          <Block position={[0, 1.43, 0]} scale={[0.36, 0.22, 0.36]} color="#00c9dc" />
          <Block position={[-1.1, 0.52, 0.7]} scale={[0.34, 0.9, 0.34]} color="#7a303c" />
          <Block position={[-1.1, 1.02, 0.7]} scale={[0.48, 0.16, 0.48]} color="#a44751" />
          <Block position={[1.1, 0.48, -0.75]} scale={[0.3, 0.78, 0.3]} color="#6f7e88" />
          <Block position={[1.1, 0.93, -0.75]} scale={[0.42, 0.14, 0.42]} color="#00aebe" />
        </Float>
      </group>
      <instancedMesh ref={dust} args={[undefined, undefined, particles.length]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#a9d7d9" transparent opacity={0.68} />
      </instancedMesh>
    </>
  );
}

export default function VeldoraScene() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 760px)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!reduced && !small && !touch);
  }, []);

  if (!enabled) return null;

  return (
    <div className="vld-scene-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [6.4, 3.5, 8.2], fov: 34 }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        frameloop="always"
      >
        <ambientLight intensity={1.25} />
        <directionalLight position={[4, 7, 5]} intensity={2.1} color="#e6f5f4" />
        <pointLight position={[-3, 2, 1]} intensity={22} color="#00b9cb" distance={8} />
        <pointLight position={[3, 0, -3]} intensity={12} color="#7b2cbf" distance={7} />
        <Island />
      </Canvas>
    </div>
  );
}
