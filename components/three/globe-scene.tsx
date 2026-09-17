"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { hubs, arcs, type Hub } from "@/content/hubs";

const RADIUS = 1;
const DOT_COUNT = 3400;
const ARC_SEGMENTS = 72;

/** Lat/lng in degrees to a point on a sphere of the given radius. */
function toVector(lat: number, lng: number, radius = RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * Great-circle path between two surface points, lifted into an arc.
 * Spherical interpolation, so the path is the one a signal would actually
 * take rather than a straight chord through the planet.
 */
function greatCircle(from: THREE.Vector3, to: THREE.Vector3, lift: number) {
  const start = from.clone().normalize();
  const end = to.clone().normalize();
  const omega = Math.acos(THREE.MathUtils.clamp(start.dot(end), -1, 1));
  const sinOmega = Math.sin(omega);

  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= ARC_SEGMENTS; i += 1) {
    const t = i / ARC_SEGMENTS;
    const point =
      sinOmega < 1e-6
        ? start.clone()
        : start
            .clone()
            .multiplyScalar(Math.sin((1 - t) * omega) / sinOmega)
            .add(end.clone().multiplyScalar(Math.sin(t * omega) / sinOmega));
    const altitude = RADIUS * (1 + lift * Math.sin(Math.PI * t));
    points.push(point.normalize().multiplyScalar(altitude));
  }
  return new THREE.CatmullRomCurve3(points);
}

/* -------------------------------------------------------------------------- */
/* Surface: a dotted sphere whose far hemisphere fades out                     */
/* -------------------------------------------------------------------------- */

const surfaceVertex = /* glsl */ `
  varying float vFade;
  uniform float uSize;
  uniform float uScale;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec3 worldNormal = normalize(mat3(modelMatrix) * normalize(position));
    vec3 viewDir = normalize(cameraPosition - worldPosition.xyz);
    vFade = smoothstep(-0.05, 0.62, dot(worldNormal, viewDir));
    vec4 mvPosition = viewMatrix * worldPosition;
    // gl_PointSize is in device pixels and the projection matrix never
    // touches it, so the drawing-buffer height has to be folded in by hand
    // or the dots come out sub-pixel and the sphere reads as a solid disc.
    gl_PointSize = uSize * uScale / max(-mvPosition.z, 0.001);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const surfaceFragment = /* glsl */ `
  varying float vFade;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    if (vFade <= 0.02) discard;
    vec2 offset = gl_PointCoord - vec2(0.5);
    if (dot(offset, offset) > 0.25) discard;
    gl_FragColor = vec4(uColor, vFade * uOpacity);
  }
`;

function SurfaceDots() {
  const positions = useMemo(() => {
    // Fibonacci lattice: even coverage without the pole clustering you get
    // from naive lat/lng sampling.
    const array = new Float32Array(DOT_COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOT_COUNT; i += 1) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      array[i * 3] = Math.cos(theta) * radiusAtY * RADIUS;
      array[i * 3 + 1] = y * RADIUS;
      array[i * 3 + 2] = Math.sin(theta) * radiusAtY * RADIUS;
    }
    return array;
  }, []);

  const bufferHeight = useThree(
    (state) => state.size.height * state.viewport.dpr,
  );

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#9fadd8") },
      uSize: { value: 0.0115 },
      uScale: { value: bufferHeight },
      uOpacity: { value: 0.82 },
    }),
    // Recreated on resize so the dots keep a constant apparent size.
    [bufferHeight],
  );

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={surfaceVertex}
        fragmentShader={surfaceFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/* Atmosphere: a back-side fresnel shell                                       */
/* -------------------------------------------------------------------------- */

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 uColor;
  void main() {
    float rim = 1.0 - abs(dot(normalize(vNormal), normalize(-vPosition)));
    float intensity = pow(rim, 3.2);
    gl_FragColor = vec4(uColor, intensity * 0.34);
  }
`;

function Atmosphere() {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#4c6bf5") } }),
    [],
  );
  return (
    <mesh scale={1.12}>
      <sphereGeometry args={[RADIUS, 48, 48]} />
      <shaderMaterial
        vertexShader={atmosphereVertex}
        fragmentShader={atmosphereFragment}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* Hubs and arcs                                                               */
/* -------------------------------------------------------------------------- */

function HubMarker({ hub }: { hub: Hub }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const planned = hub.status === "planned";
  const color = planned ? "#f0a24b" : "#3ddcff";

  const { position, quaternion, beacon } = useMemo(() => {
    const surface = toVector(hub.lat, hub.lng, RADIUS * 1.005);

    // The ring lies in XY by default; rotate its +Z normal to point straight
    // out of the sphere so it reads as a ripple on the surface, not a disc.
    const outward = surface.clone().normalize();
    const orientation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      outward,
    );

    // Inside this group, +Z is already the outward direction, so the beacon
    // is a straight run along local Z.
    const beaconLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, RADIUS * 0.07),
      ]),
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: planned ? 0.22 : 0.42,
      }),
    );

    return { position: surface, quaternion: orientation, beacon: beaconLine };
  }, [hub, color, planned]);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    // Each hub breathes on its own phase so the globe never pulses in unison.
    const phase = (clock.elapsedTime * 0.55 + Math.abs(hub.lng) / 90) % 1;
    ringRef.current.scale.setScalar(1 + phase * 2.6);
    const material = ringRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = (1 - phase) * (planned ? 0.28 : 0.55);
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[0.014, 10, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.018, 0.024, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <primitive object={beacon} />
    </group>
  );
}

function Arc({ from, to, index }: { from: Hub; to: Hub; index: number }) {
  const curve = useMemo(
    () => greatCircle(toVector(from.lat, from.lng), toVector(to.lat, to.lng), 0.22),
    [from, to],
  );

  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(ARC_SEGMENTS),
    );
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color("#4c6bf5"),
      transparent: true,
      opacity: 0.4,
    });
    return new THREE.Line(geometry, material);
  }, [curve]);

  const packetRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!packetRef.current) return;
    const t = (clock.elapsedTime * 0.14 + index * 0.11) % 1;
    packetRef.current.position.copy(curve.getPointAt(t));
    const material = packetRef.current.material as THREE.Material;
    material.opacity = Math.sin(t * Math.PI) * 0.95;
  });

  return (
    <group>
      <primitive object={line} />
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.011, 8, 8]} />
        <meshBasicMaterial
          color="#8ee9ff"
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Scene                                                                       */
/* -------------------------------------------------------------------------- */

function Globe({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const arcPairs = useMemo(
    () =>
      arcs
        .map(([fromId, toId]) => ({
          from: hubs.find((hub) => hub.id === fromId),
          to: hubs.find((hub) => hub.id === toId),
        }))
        .filter(
          (pair): pair is { from: Hub; to: Hub } =>
            Boolean(pair.from) && Boolean(pair.to),
        ),
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!paused) groupRef.current.rotation.y += delta * 0.055;
    // Pointer parallax: a slight lean toward the cursor, nothing more.
    const targetX = state.pointer.y * 0.16;
    const targetZ = -state.pointer.x * 0.06;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.z += (targetZ - groupRef.current.rotation.z) * 0.04;
  });

  return (
    <group ref={groupRef} rotation={[0.28, 0, 0]}>
      <SurfaceDots />
      <Atmosphere />
      {hubs.map((hub) => (
        <HubMarker key={hub.id} hub={hub} />
      ))}
      {arcPairs.map((pair, index) => (
        <Arc key={`${pair.from.id}-${pair.to.id}`} from={pair.from} to={pair.to} index={index} />
      ))}
    </group>
  );
}

export default function GlobeScene({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.75], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={paused ? "demand" : "always"}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <Globe paused={paused} />
    </Canvas>
  );
}

// Keeps TS happy about the intrinsic elements used above under React 19.
export type _ThreeElements = ThreeElements;
