'use client';
import React, { useEffect, useRef, useState } from 'react';
import logoRian from '../assets/Logo Rian.png';
import { motion } from 'framer-motion';
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
        <img src={logoRian} alt="Logo Rian" style={{ height: '55px', width: 'auto' }} />
      </div>
    </header>
  );
}

export default function Kontak() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');

  // === Background bintang ===
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5,
      alpha: Math.random(),
      twinkle: Math.random() * 0.05,
    }));

    function animate() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      for (const s of stars) {
        s.alpha += s.twinkle;
        if (s.alpha <= 0 || s.alpha >= 1) s.twinkle *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }

    animate();
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // === Efek 3D Card mengikuti gerakan cursor ===
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / 20).toFixed(2);
    const rotateY = ((x - rect.width / 2) / 20).toFixed(2);
    setTransformStyle(`rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('rotateX(0deg) rotateY(0deg)');
  };

  // === Tautan otomatis ===
  const message = encodeURIComponent('Haii, boleh bertanya?');
  const email = 'efendisukrian7@gmail.com';
  const waNumber = '6281262778436'; // tanpa 0 di depan

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Konten Tengah */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          color: 'white',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: 350,
            padding: '40px 30px',
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 25px rgba(75,139,255,0.3)',
            transform: transformStyle,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.25s ease',
            textAlign: 'center',
          }}
        >
          <img
            src={logoRian}
            alt="Logo"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              marginBottom: 20,
              boxShadow: '0 0 15px rgba(75,139,255,0.6)',
            }}
          />
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#7eff4b' }}>Sukrian Efendi</h2>
          <p style={{ opacity: 0.9, margin: '10px 0 25px', fontSize: '0.95rem' }}>
            Hubungi saya
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a
              href={`mailto:${email}?subject=Pertanyaan&body=${message}`}
              style={{
                color: '#4b8bff',
                textDecoration: 'none',
                fontWeight: 500,
                background: 'rgba(255,255,255,0.1)',
                padding: '10px 0',
                borderRadius: '10px',
                transition: '0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(75,139,255,0.3)')}
              onMouseLeave={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
            >
              ✉️ {email}
            </a>
            <a
              href={`https://wa.me/${waNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#7eff4b',
                textDecoration: 'none',
                fontWeight: 500,
                background: 'rgba(255,255,255,0.1)',
                padding: '10px 0',
                borderRadius: '10px',
                transition: '0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(126,255,75,0.25)')}
              onMouseLeave={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
            >
              📞 {waNumber}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
