'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import cardGLB from '../assets/card.glb';
import lanyard from '../assets/lanyard.png';
import './Lanyard.css';
import { motion } from 'framer-motion';
import Header from './Header';


extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  const bgCanvasRef = useRef(null);

  // 🌌 Background animasi luar angkasa
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5,
      alpha: Math.random(),
      twinkle: Math.random() * 0.05,
    }));

    const shootingStars = [];
    const planets = [
      { x: width / 4, y: height / 3, r: 50, color: '#4b8bff' },
      { x: width * 0.8, y: height * 0.7, r: 35, color: '#ffcc66' },
    ];

    const rand = (min, max) => Math.random() * (max - min) + min;

    function createShootingStar() {
      shootingStars.push({
        x: rand(0, width),
        y: rand(0, height / 2),
        len: rand(100, 250),
        speed: rand(8, 15),
        opacity: 1,
      });
    }

    const shootingTimer = setInterval(createShootingStar, 10000);
    createShootingStar();

    function animate() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      for (const planet of planets) {
        const grad = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.r);
        grad.addColorStop(0, planet.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of stars) {
        s.alpha += s.twinkle;
        if (s.alpha <= 0 || s.alpha >= 1) s.twinkle *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len / 3);
        grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y - s.len / 3);
        ctx.stroke();
        s.x += s.speed;
        s.y += s.speed / 3;
        s.opacity -= 0.01;
        if (s.opacity <= 0) shootingStars.splice(i, 1);
      }

      requestAnimationFrame(animate);
    }

    animate();

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(shootingTimer);
    };
  }, []);

  return (
    <div className="lanyard-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
       <Header />
      {/* 🌌 Canvas Background */}
      <canvas
        ref={bgCanvasRef}
        className="space-bg"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />

      {/* ✍️ BIOGRAFI */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          maxWidth: '500px',
          color: 'white',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: 2,
          fontSize: '1.05rem',
          textShadow: '0 0 8px rgba(0,0,0,0.5)',
          background: 'none',
          padding: '1px 35px',
          borderRadius: '16px',
          border: 'none',
          backdropFilter: 'blur(5px)',
          marginRight: '250px',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ fontSize: '1.8rem', marginBottom: '12px', color: '#4b8bff' }}
        >
          Tentang Saya
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
        >
          Halo! Nama saya <b>Sukrian Efendi</b>. Saya lahir di Jakarta pada tanggal <b>31 Juli 2004</b>.
          Saya memiliki ketertarikan besar pada dunia teknologi, desain, dan pengembangan web 3D.
          Saya suka mengeksplor hal baru yang bisa menggabungkan seni visual dan interaktivitas digital.
          Tujuan saya adalah terus berkembang dan menciptakan pengalaman digital yang memukau dan bermakna.
        </motion.p>
      </motion.div>

      {/* 🎨 Canvas utama React Three Fiber */}
      <Canvas
        camera={{ position, fov }}
        gl={{ alpha: transparent }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0xffffff), 0)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 90}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>

      {/* 🏷️ Copyright Vertikal */}
      <div
        style={{
          position: 'absolute',
          right: '20px',
          bottom: '20px',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: 'white',
          fontSize: '0.9rem',
          letterSpacing: '2px',
          fontFamily: 'Poppins, sans-serif',
          opacity: 0.8,
          zIndex: 5,
          textShadow: '0 0 5px rgba(255,255,255,0.6)',
        }}
      >
        © Copyright 2025
      </div>
    </div>
  );
}

// 🧵 Band (komponen tali)
function Band({ maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();

  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();

  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 6, linearDamping: 6 };
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ]));

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.3]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.3]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.3]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    [j1, j2].forEach(ref => {
      if (!ref.current) return;
      const t = ref.current.translation?.();
      if (!t) return;
      if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(t);
      const dist = ref.current.lerped.distanceTo(t);
      if (!isFinite(dist)) return;
      const clamped = Math.max(0.1, Math.min(1, dist));
      ref.current.lerped.lerp(t, delta * (minSpeed + clamped * (maxSpeed - minSpeed)));
    });

    const safeGet = ref => ref.current?.translation?.() || new THREE.Vector3();
    curve.points[0].copy(safeGet(j3));
    curve.points[1].copy(j2.current?.lerped || safeGet(j2));
    curve.points[2].copy(j1.current?.lerped || safeGet(j1));
    curve.points[3].copy(safeGet(fixed));

    if (band.current?.geometry && curve) {
      band.current.geometry.setPoints(curve.getPoints(32));
    }

    if (card.current?.angvel && card.current?.rotation) {
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[5.5, -1.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" position={[0, 5, 0]} />
        <RigidBody position={[0.5, 1.5, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0.5, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, -0.5, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

        <RigidBody position={[1, -1.5, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={3.5}
            position={[0, -2.7, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => { e.target.releasePointerCapture(e.pointerId); drag(false); }}
            onPointerDown={e => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
