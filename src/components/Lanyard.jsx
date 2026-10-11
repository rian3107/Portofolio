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
    <div className="lanyard-wrapper" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'visible' }}>
       <Header />
      {/* 🌌 Canvas Background */}
      <canvas
        ref={bgCanvasRef}
        className="space-bg"
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      />

      {/* ✍️ PROFIL PORTOFOLIO — konten dapat di-scroll, background dan Band tetap */}
      <section className="lanyard-hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <span className="profile-eyebrow">PORTOFOLIO PRIBADI · WEB DEVELOPER</span>
          <h1>Halo, saya <span>Rian.</span></h1>
          <p className="profile-lead">Sukrian Efendi — pembelajar mandiri yang bersemangat membangun sesuatu melalui teknologi, pemrograman, dan dunia digital.</p>
          <div className="profile-tags"><span>Self-taught</span><span>Tech enthusiast</span><span>Continuous learner</span></div>
          <p className="hero-hint">Coba tarik kartu lanyard · Gulir ke bawah untuk mengenal saya</p>
        </motion.div>
              <Canvas
        className="lanyard-canvas"
        camera={{ position, fov }}
        gl={{ alpha: transparent }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
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
      </section>

      <motion.main
        className="portfolio-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
      >
        <section className="profile-section">
          <span className="profile-number">01 / TENTANG SAYA</span>
          <h2>Selalu penasaran, selalu berkembang.</h2>
          <p>Nama saya <strong>Sukrian Efendi</strong>, biasa dipanggil Rian. Saya lahir di Jakarta pada 31 Juli 2004 dan memiliki ketertarikan besar pada teknologi, bahasa pemrograman, desain, serta berbagai hal yang berhubungan dengan dunia digital. Bagi saya, teknologi bukan hanya sesuatu yang digunakan sehari-hari, tetapi juga ruang untuk belajar, bereksperimen, dan menciptakan solusi.</p>
          <p>Saya menikmati proses memahami bagaimana sesuatu bekerja, memecah masalah menjadi bagian yang lebih kecil, lalu mencoba membangun solusi sendiri. Saya sadar kemampuan selalu bisa ditingkatkan, karena itu saya berusaha terbuka terhadap masukan dan tidak berhenti belajar ketika menemukan hal yang belum saya pahami.</p>
        </section>
        <section className="profile-section">
          <span className="profile-number">02 / PERJALANAN</span>
          <h2>Belajar secara mandiri dan konsisten.</h2>
          <p>Saya belum memiliki banyak pengalaman formal bekerja sebagai programmer. Sebagian besar perjalanan saya di bidang ini dibangun melalui belajar otodidak, mencoba teknologi baru, membaca dokumentasi, melakukan eksperimen, dan mengerjakan proyek. Saya melihat proses tersebut sebagai kesempatan untuk membangun fondasi, melatih cara berpikir, dan memahami bahwa hasil yang baik membutuhkan latihan serta evaluasi berulang.</p>
          <p>Saya juga berusaha membiasakan diri bekerja dengan disiplin, menghargai waktu yang telah ditentukan, dan menyelesaikan tanggung jawab sebaik mungkin. Saya percaya sikap mau belajar dan konsistensi adalah bekal penting untuk berkembang di lingkungan profesional.</p>
        </section>
        <section className="profile-section">
          <span className="profile-number">03 / PRINSIP HIDUP</span>
          <h2>Karakter sama pentingnya dengan kemampuan.</h2>
          <div className="principle-grid">
            <article className="principle-card"><span>01</span><h3>Kejujuran</h3><p>Saya berusaha bersikap jujur tentang kemampuan, proses, dan hasil pekerjaan. Kepercayaan perlu dibangun lewat tindakan.</p></article>
            <article className="principle-card"><span>02</span><h3>Disiplin</h3><p>Menghargai waktu, menjaga komitmen, dan berusaha menyelesaikan pekerjaan sesuai target yang disepakati.</p></article>
            <article className="principle-card"><span>03</span><h3>Mau belajar</h3><p>Tidak malu mengakui hal yang belum diketahui, menerima masukan, lalu menggunakannya untuk berkembang.</p></article>
            <article className="principle-card"><span>04</span><h3>Bertanggung jawab</h3><p>Berusaha menuntaskan tugas dengan sungguh-sungguh dan mencari jalan keluar ketika menghadapi kendala.</p></article>
          </div>
        </section>
        <section className="profile-section">
          <span className="profile-number">04 / PROYEK</span>
          <h2>Belajar paling baik dengan membuat sesuatu.</h2>
          <p>Proyek-proyek yang saya kerjakan menjadi bagian penting dari perjalanan belajar saya. Melalui proyek, saya dapat menguji pemahaman, menemukan kekurangan, dan belajar menyusun fitur dari awal hingga bisa digunakan. Beberapa hasil dan eksperimen saya dapat dilihat pada halaman portofolio website ini.</p>
          <div className="project-note"><span className="project-note-icon">↗</span><div><h3>Jelajahi karya saya</h3><p>Lihat proyek yang tersedia di bagian portofolio website ini untuk mengetahui proses dan hal-hal yang sedang saya pelajari.</p></div></div>
          <p className="profile-muted">Saya tidak ingin mengklaim teknologi atau pengalaman yang belum benar-benar saya kuasai. Setiap proyek adalah proses bertumbuh, dan saya terus berusaha meningkatkan kualitas kode, pengalaman pengguna, serta cara saya menyelesaikan masalah.</p>
        </section>
        <section className="profile-section profile-education">
          <span className="profile-number">05 / PENDIDIKAN</span><h2>Fondasi pendidikan.</h2>
          <div className="education-item"><span className="education-dot" /><div><h3>Paket C</h3><p>PKBM Mitra Insan Cendekia</p><small>Pendidikan terakhir</small></div></div>
        </section>
        <section className="profile-outro">
          <span className="profile-eyebrow">LANGKAH BERIKUTNYA</span><h2>Masih belajar. Terus membangun.</h2>
          <p>Saya terbuka terhadap kesempatan untuk belajar, berkolaborasi, dan mengembangkan kemampuan bersama orang-orang yang memiliki semangat bertumbuh. Saya ingin terus menjadikan rasa ingin tahu sebagai karya nyata, dengan kejujuran dan tanggung jawab sebagai pegangan.</p>
          <span className="profile-signature">— Sukrian Efendi · Rian</span>
        </section>
      </motion.main>

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
