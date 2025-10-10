'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import logoRian from '../assets/Logo Rian.png';
import './Lanyard.css';

// ==== HEADER (sama seperti halaman lain) ====
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
                : item === 'Portofolio'
                ? '/portofolio'
                : '/kontak'
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

// ==== HALAMAN PORTOFOLIO ====
export default function Portofolio() {
  const canvasRef = useRef(null);

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

  // === Data Portofolio ===
  const projects = [
    {
      title: 'Game Dino Clone',
      description: 'Game mirip Dino Google, dibuat dengan React dan Canvas.',
      github: 'https://github.com/username/dino-clone',
      demo: 'https://dino-clone-demo.vercel.app',
    },
    {
      title: 'Website Portofolio',
      description: 'Website pribadi modern dan interaktif menggunakan React + Framer Motion.',
      github: 'https://github.com/username/portofolio',
      demo: 'https://portofolio-demo.vercel.app',
    },
    {
      title: 'Aplikasi Todo List',
      description: 'Aplikasi produktivitas dengan local storage dan animasi ringan.',
      github: 'https://github.com/username/todo-list',
      demo: 'https://todo-list-demo.vercel.app',
    },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Header />

      {/* Background */}
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

      {/* Konten */}
      <div
        style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: '90%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          fontFamily: 'Poppins, sans-serif',
          color: 'white',
        }}
      >
        {projects.map((p, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: '20px',
              padding: '25px 20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 25px rgba(75,139,255,0.3)',
            }}
          >
            <h3 style={{ color: '#7eff4bff', marginBottom: '10px' }}>{p.title}</h3>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: '15px' }}>
              {p.description}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#4b8bff',
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontWeight: 500,
                }}
              >
                🔗 GitHub
              </a>
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#7eff4bff',
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontWeight: 500,
                }}
              >
                🚀 Demo
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
