"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";

export function StylizedExcavator(props: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating and rotation to make it look premium
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      groupRef.current.rotation.y += 0.005;
    }
  });

  const bodyMaterial = <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />;
  const armMaterial = <meshStandardMaterial color="#A51A1A" metalness={0.6} roughness={0.3} />;
  const glassMaterial = <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} roughness={0.1} />;
  const trackMaterial = <meshStandardMaterial color="#1a1a1a" roughness={0.9} />;

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Main Body */}
      <Box args={[3, 1.5, 2]} position={[0, 1, 0]}>
        {bodyMaterial}
      </Box>

      {/* Cabin */}
      <Box args={[1.2, 1.2, 1.8]} position={[0.5, 2.3, 0]}>
        {glassMaterial}
      </Box>

      {/* Tracks */}
      <Box args={[4, 0.6, 0.6]} position={[0, 0.3, 1.2]}>
        {trackMaterial}
      </Box>
      <Box args={[4, 0.6, 0.6]} position={[0, 0.3, -1.2]}>
        {trackMaterial}
      </Box>

      {/* Arm Assembly Base */}
      <Box args={[1, 1, 1]} position={[-1.5, 1.5, 0]}>
        {armMaterial}
      </Box>

      {/* Main Boom */}
      <Box args={[3, 0.4, 0.4]} position={[-2.8, 2.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        {armMaterial}
      </Box>

      {/* Dipper Arm */}
      <Box args={[2, 0.3, 0.3]} position={[-4.5, 2.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        {armMaterial}
      </Box>

      {/* Bucket */}
      <Cylinder args={[0.6, 0.6, 1, 32, 1, false, 0, Math.PI]} position={[-5.3, 1.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
        {bodyMaterial}
      </Cylinder>
    </group>
  );
}
