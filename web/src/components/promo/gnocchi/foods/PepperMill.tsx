/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
// @ts-ignore
import { GLTF } from 'three-stdlib';
import { brown, darkBrown } from '../materials.js';
import { animated } from '@react-spring/three';

type GLTFResult = GLTF & {
  nodes: {
    pepperMill: THREE.Mesh;
  };
  materials: {
    brownLight: THREE.MeshStandardMaterial;
  };
};

export function PepperMill({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    '/models/kenney-foods/smoothed/pepperMill.glb',
  ) as GLTFResult;
  return (
    <animated.group ref={group} {...props} dispose={null}>
      <mesh
        scale={[1, 0.8, 1]}
        castShadow
        geometry={nodes.pepperMill.geometry}
        material={brown}
      />
    </animated.group>
  );
}

// useGLTF.preload('/models/kenney-foods/smoothed/pepperMill.glb');