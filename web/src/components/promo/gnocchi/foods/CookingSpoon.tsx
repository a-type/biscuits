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
    cookingSpoon: THREE.Mesh;
  };
  materials: {
    brown: THREE.MeshStandardMaterial;
  };
};

export function CookingSpoon({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    '/models/kenney-foods/smoothed/cookingSpoon.glb',
  ) as GLTFResult;
  return (
    <animated.group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.cookingSpoon.geometry}
        material={brown}
      />
    </animated.group>
  );
}

// useGLTF.preload('/models/kenney-foods/smoothed/cookingSpoon.glb');