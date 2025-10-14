'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import logoRian from '../assets/Logo Rian.png';

export default function Kontak() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');

  // === Background bintang + planet + shooting stars ===
  useEffect(() => {
    const canvas = canvasRef.current;
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

      // planets
      for (const planet of planets) {
        const grad = ctx.createRadialGradient(
          planet.x,
          planet.y,
          0,
          planet.x,
          planet.y,
          planet.r
        );
        grad.addColorStop(0, planet.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // stars
      for (const s of stars) {
        s.alpha += s.twinkle;
        if (s.alpha <= 0 || s.alpha >= 1) s.twinkle *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      }

      // shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const grad = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x - s.len,
          s.y - s.len / 3
        );
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

  // === Efek 3D Card ===
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
  const handleMouseLeave = () => setTransformStyle('rotateX(0deg) rotateY(0deg)');

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
          <p style={{ opacity: 0.9, margin: '10px 0 25px', fontSize: '0.95rem' }}>Hubungi saya</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Email */}
            <a
              href={`mailto:efendisukrian7@gmail.com?subject=Pertanyaan&body=Haii, boleh bertanya?`}
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
              Email
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/6281262778436?text=Haii,%20boleh%20bertanya?`}
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
              WhatsApp
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/Rian`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1877f2',
                textDecoration: 'none',
                fontWeight: 500,
                background: 'rgba(255,255,255,0.1)',
                padding: '10px 0',
                borderRadius: '10px',
                transition: '0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(24,119,242,0.25)')}
              onMouseLeave={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
            >
              Facebook
            </a>

            {/* Instagram */}
            <a
              href={`https://www.instagram.com/rianzzmm`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#e1306c',
                textDecoration: 'none',
                fontWeight: 500,
                background: 'rgba(255,255,255,0.1)',
                padding: '10px 0',
                borderRadius: '10px',
                transition: '0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(225,48,108,0.25)')}
              onMouseLeave={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
            >
              Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
