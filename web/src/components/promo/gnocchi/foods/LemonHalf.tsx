/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
	nodes: {
		Mesh_lemonHalf: THREE.Mesh;
		Mesh_lemonHalf_1: THREE.Mesh;
		Mesh_lemonHalf_2: THREE.Mesh;
	};
	materials: {
		yellow: THREE.MeshStandardMaterial;
		_defaultMat: THREE.MeshStandardMaterial;
		brownDark: THREE.MeshStandardMaterial;
	};
};

export function LemonHalf({ ...props }: JSX.IntrinsicElements['group']) {
	const group = useRef<THREE.Group>(null);
	const { nodes, materials } = useGLTF(
		'/models/kenney-foods/lemonHalf.glb',
	) as GLTFResult;
	return (
		<group ref={group} {...props} dispose={null}>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Mesh_lemonHalf.geometry}
				material={materials.yellow}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Mesh_lemonHalf_1.geometry}
				material={materials._defaultMat}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Mesh_lemonHalf_2.geometry}
				material={materials.brownDark}
			/>
		</group>
	);
}

// useGLTF.preload('/models/kenney-foods/lemonHalf.glb');
