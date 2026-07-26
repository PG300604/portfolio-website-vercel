/* eslint-disable react/no-unknown-property */
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {} }) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 25 }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <LensMesh modeProps={lensProps} />
      </Canvas>
    </div>
  );
}

function LensMesh({ modeProps = {} }) {
  const ref = useRef();
  const { viewport: vp } = useThree();

  useFrame((state, delta) => {
    const { pointer, camera } = state;
    const v = vp.getCurrentViewport(camera, [0, 0, 15]);

    const destX = (pointer.x * v.width) / 2;
    const destY = (pointer.y * v.height) / 2;

    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.12, delta);
    }
  });

  const {
    scale = 0.08,
    ior = 1.2,
    thickness = 0.5,
    chromaticAberration = 0.05,
    distortion = 0.1,
  } = modeProps;

  return (
    <mesh ref={ref} scale={scale} position={[0, 0, 15]}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.0}
        ior={ior}
        thickness={thickness}
        chromaticAberration={chromaticAberration}
        distortion={distortion}
        color="#ffffff"
        attenuationColor="#ffffff"
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
}
