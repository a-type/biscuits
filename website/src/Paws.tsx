import {
  AccumulativeShadows,
  Backdrop,
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
  Stage,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  MeshStandardMaterial,
  MeshToonMaterial,
  Vector3,
  ShaderMaterial,
  ShaderChunk,
  UniformsUtils,
  UniformsLib,
  Color,
} from 'three';

export function Paws() {
  return (
    <div className="absolute left-0 top-0 w-full h-full">
      <Canvas shadows>
        <Float
          floatingRange={[1, 10]}
          floatIntensity={0.1}
          speed={1}
          rotationIntensity={0.5}
        >
          <group
            scale={0.8}
            position={[6, 10, -10]}
            rotation={[0.2, -0.8, -0.0]}
          >
            <CatArm position={[0, 0, 0]} offset={0} />
            <CatArm position={[6, 0, 0]} offset={1} />
          </group>
        </Float>
        {/* <AccumulativeShadows temporal frames={50} scale={10}>
          <RandomizedLight amount={6} position={[0, 30, 10]} />
        </AccumulativeShadows> */}
        <ContactShadows
          opacity={0.25}
          scale={100}
          blur={1}
          far={100}
          resolution={128}
          color="#f00000"
        />
        <Environment preset="sunset" />
        <PerspectiveCamera makeDefault position={[0, 30, 0]} />
        {/* Axishelper */}
        <OrbitControls />
        {/* <axesHelper /> */}
        {/* <cameraHelper /> */}
      </Canvas>
    </div>
  );
}

function CatArm({ offset, ...props }: any) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/models/cat.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    setTimeout(() => {
      actions['SphereAction']?.play();
      actions['Sphere.001Action']?.play();
      actions['Sphere.002Action']?.play();
      actions['Sphere.003Action']?.play();
    }, offset * 1000);
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
          position={[-0.073, 0.3, 0.43]}
        />
        <mesh
          name="Sphere"
          castShadow
          receiveShadow
          geometry={nodes.Sphere.geometry}
          material={lightBrown}
          position={[-0.61, -0.071, 11.643]}
          rotation={[0, -0.351, 0]}
          scale={[0.773, 0.803, 1]}
        />
        <mesh
          name="Sphere001"
          castShadow
          receiveShadow
          geometry={nodes.Sphere001.geometry}
          material={lightBrown}
          position={[0.548, -0.051, 11.709]}
          rotation={[0, 0.256, 0]}
          scale={[0.773, 0.803, 1]}
        />
        <mesh
          name="Sphere002"
          castShadow
          receiveShadow
          geometry={nodes.Sphere002.geometry}
          material={lightBrown}
          position={[1.232, -0.041, 11.029]}
          rotation={[0, 0.788, 0]}
          scale={[0.773, 0.803, 1]}
        />
        <mesh
          name="Sphere003"
          castShadow
          receiveShadow
          geometry={nodes.Sphere003.geometry}
          material={lightBrown}
          position={[-1.338, 0, 11.155]}
          rotation={[0, -1.116, 0]}
          scale={[0.773, 0.803, 1]}
        />
      </group>
    </group>
  );
}

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
