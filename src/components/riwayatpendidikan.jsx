'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import rianPhoto from '../assets/rian.jpg';
import logoRian from '../assets/Logo Rian.png';
import './Lanyard.css';

function Header() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '20px 60px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        zIndex: 10,
        color: 'white',
        fontFamily: 'Poppins, sans-serif',
        background: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.4 }}>
        <span style={{ fontSize: '1.6rem', fontWeight: 600 }}>Sukrian Efendi</span>
        <span style={{ fontSize: '0.95rem', opacity: 0.85 }}>Jakarta, 31 Juli 2004</span>
      </div>

      <nav
        style={{
          display: 'flex',
          gap: '32px',
          fontSize: '1rem',
          fontWeight: 500,
          justifySelf: 'center',
        }}
      >
        {['Home', 'Riwayat Pendidikan', 'Keahlian', 'Portofolio', 'Kontak'].map((item) => (
          <a
  key={item}

  href={
  item === 'Home'
    ? '/'
    : item === 'Riwayat Pendidikan'
    ? '/riwayat-pendidikan'
    : item === 'Keahlian'
    ? '/keahlian'
    : item === 'Kontak'
    ? '/kontak'
    : '#'
}


  style={{
    color: '#fff',
    textDecoration: 'none',
    position: 'relative',
    transition: 'color 0.3s ease',
  }}
  onMouseEnter={(e) => (e.target.style.color = '#4b8bff')}
  onMouseLeave={(e) => (e.target.style.color = '#fff')}
>
  {item}
</a>

        ))}
      </nav>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '90px' }}>
        <img
          src={logoRian}
          alt="Logo Rian"
          style={{
            height: '55px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, filter 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1) rotate(3deg)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1) rotate(0deg)')}
        />
      </div>
    </header>
  );
}

export default function RiwayatPendidikan() {
  const bgCanvasRef = useRef(null);

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
    const createShootingStar = () => {
      shootingStars.push({
        x: rand(0, width),
        y: rand(0, height / 2),
        len: rand(100, 250),
        speed: rand(8, 15),
        opacity: 1,
      });
    };

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
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <canvas
        ref={bgCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* 📸 Foto melayang */}
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: 10 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 3,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          right: '100px',
          top: '35%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          borderRadius: '50%',
          padding: '6px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          boxShadow: '0 0 25px rgba(255, 215, 0, 0.6)',
        }}
      >
        <img
          src={rianPhoto}
          alt="Foto Sukrian Efendi"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
            border: '3px solid rgba(255, 215, 0, 0.8)',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
          }}
        />
      </motion.div>

      {/* 🧾 Konten utama */}
      <div
        style={{
          position: 'absolute',
          left: '80px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          color: 'white',
          fontFamily: 'Poppins, sans-serif',
          width: '55%',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'left' }}>
          Riwayat Pendidikan
        </h1>

        {/* 🔸 Grid 2x2 dengan animasi masuk */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px 40px',
          }}
        >
          {[
            { jenjang: 'SD', nama: 'SDN Palmerah 22 Pagi, Jakarta', tahun: '2010 - 2016' },
            { jenjang: 'SMP', nama: 'PKBM Mitra Insan Cendekia', tahun: '2023 - 2024' },
            { jenjang: 'SMA', nama: 'PKBM Mitra Insan Cendekia', tahun: '2024 - 2027' },
            { jenjang: 'S1', nama: 'Universitas Pamulang — Sistem Informatika', tahun: '2027 - 2031' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}       // Mulai dari bawah & transparan
              animate={{ opacity: 1, y: 0 }}       // Animasi naik ke posisi normal
              transition={{ delay: index * 0.15 }} // Staggered effect
              whileHover={{
                scale: 1.05,
                y: -8,
                boxShadow: '0 0 25px rgba(255,215,0,0.6)',
              }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '2px solid gold',
                borderRadius: '20px',
                padding: '25px 30px',
                textAlign: 'center',
                boxShadow: '0 0 10px rgba(255,215,0,0.3)',
                backdropFilter: 'blur(8px)',
                transition: '0.3s ease',
              }}
            >
              <h3 style={{ fontSize: '1.3rem', color: 'gold', marginBottom: '10px' }}>
                {item.jenjang}
              </h3>
              <p style={{ fontSize: '1rem', marginBottom: '8px', fontWeight: 500 }}>
                {item.nama}
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>{item.tahun}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
