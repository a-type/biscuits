'use client';

import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  PerspectiveCamera,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, memo } from 'react';
import {
  Color,
  Euler,
  ShaderChunk,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector3,
} from 'three';

const groupPosition = new Vector3(8, 10, -10);
const groupRotation = new Euler(0.2, -0.8, -0.0);
const leftPosition = new Vector3(0, 0, 0);
const rightPosition = new Vector3(6, 0, 0);
const cameraPosition = new Vector3(0, 30, 0);
const floatRange = [1, 10] as [number, number];

export function Paws() {
  return (
    <div className="absolute left-0 top-0 w-full h-full">
      <Canvas>
        <Float
          floatingRange={floatRange}
          floatIntensity={0.1}
          speed={1}
          rotationIntensity={0.5}
        >
          <group scale={0.8} position={groupPosition} rotation={groupRotation}>
            <CatArm position={leftPosition} offset={0} />
            <CatArm position={rightPosition} offset={1} />
          </group>
        </Float>

        <ContactShadows
          opacity={0.25}
          scale={100}
          blur={1}
          far={100}
          resolution={128}
          color="#f00000"
        />
        {/* <Environment preset="sunset" /> */}
        <PerspectiveCamera makeDefault position={cameraPosition} />
        {/* Axishelper */}
        <OrbitControls enabled={false} />
        {/* <axesHelper /> */}
        {/* <cameraHelper /> */}
      </Canvas>
    </div>
  );
}

export default Paws;

const cubePos = new Vector3(-0.073, 0.3, 0.43);
const spherePos = new Vector3(-0.61, -0.071, 11.643);
const sphereRot = new Euler(0, -0.351, 0);
const sphereScale = new Vector3(0.773, 0.803, 1);
const sphere1Pos = new Vector3(0.548, -0.051, 11.709);
const sphere1Rot = new Euler(0, 0.256, 0);
const sphere2Pos = new Vector3(1.232, -0.041, 11.029);
const sphere2Rot = new Vector3(0, 0.788, 0);
const sphere3Pos = new Vector3(-1.338, 0, 11.155);
const sphere3Rot = new Euler(0, -1.116, 0);

const CatArm = memo(function CatArm({ offset, ...props }: any) {
  const group = useRef();
  const { nodes, animations } = useGLTF('/models/cat.glb') as any;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    let timeout = setTimeout(() => {
      actions['SphereAction']?.play();
      actions['Sphere.001Action']?.play();
      actions['Sphere.002Action']?.play();
      actions['Sphere.003Action']?.play();
    }, offset * 1000);
    return () => void clearTimeout(timeout);
  }, [actions, offset]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Cube"
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          material={lightBrown}
          position={cubePos}
        />
        <mesh
          name="Sphere"
          castShadow
          receiveShadow
          geometry={nodes.Sphere.geometry}
          material={lightBrown}
          position={spherePos}
          rotation={sphereRot}
          scale={sphereScale}
        />
        <mesh
          name="Sphere001"
          castShadow
          receiveShadow
          geometry={nodes.Sphere001.geometry}
          material={lightBrown}
          position={sphere1Pos}
          rotation={sphere1Rot}
          scale={sphereScale}
        />
        <mesh
          name="Sphere002"
          castShadow
          receiveShadow
          geometry={nodes.Sphere002.geometry}
          material={lightBrown}
          position={sphere2Pos}
          rotation={sphere2Rot}
          scale={sphereScale}
        />
        <mesh
          name="Sphere003"
          castShadow
          receiveShadow
          geometry={nodes.Sphere003.geometry}
          material={lightBrown}
          position={sphere3Pos}
          rotation={sphere3Rot}
          scale={sphereScale}
        />
      </group>
    </group>
  );
});

useGLTF.preload('/models/cat.glb');

const dotMaterial = (color: number) =>
  new ShaderMaterial({
    vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      ${ShaderChunk.beginnormal_vertex}
      ${ShaderChunk.defaultnormal_vertex}
      ${ShaderChunk.begin_vertex}
      ${ShaderChunk.project_vertex}
      ${ShaderChunk.worldpos_vertex}
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
    }
  `,
    fragmentShader: `
    ${ShaderChunk.common}
    ${ShaderChunk.packing}
    ${ShaderChunk.bsdfs}
    ${ShaderChunk.lights_pars_begin}

    uniform vec3 uBaseColor;
    uniform vec3 uShadowColor;
    uniform vec3 uDirLightPos;
    uniform vec3 uDirLightColor;

    varying vec3 vNormal;

    void main() {
      float shadowPower = 0.25;
      float t = 0.0;
      float opacity = 1.0;
      float directionalLightWeighting = 0.5 * max(dot(normalize(vNormal), uDirLightPos), 0.0);
      vec3 lightWeighting = uDirLightColor * directionalLightWeighting;
      if (directionalLightWeighting < 1.0) {
        gl_FragColor = vec4(mix(uBaseColor, uShadowColor, 0.025), opacity);
      } else {
        gl_FragColor = vec4(uBaseColor, opacity);
      }
      if (directionalLightWeighting < 0.001) {
        t = (mod(gl_FragCoord.x + gl_FragCoord.y, 4.0));
        // if (t > 2.0 && t < 4.0) {
          gl_FragColor = vec4( mix(uBaseColor, uShadowColor, shadowPower), opacity);
        // }
      }
    }
  `,
    uniforms: UniformsUtils.merge([
      UniformsLib.lights,
      UniformsLib.fog,
      {
        uDirLightPos: { value: new Vector3(0, -2, 1) },
        uDirLightColor: { value: new Color(0x80808080) },
        uBaseColor: { value: new Color(color) },
        uShadowColor: { value: new Color(0xc08080) },
      },
    ]),
  });

const lightBrown = dotMaterial(0xffe17c);
