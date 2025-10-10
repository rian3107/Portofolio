'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
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


            style={{ color: '#fff', textDecoration: 'none' }}
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

export default function Keahlian() {
  const bgCanvasRef = useRef(null);
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [infoText, setInfoText] = useState('Tekan Spasi / Panah Atas untuk lompat');

  const skills = [
    { name: 'HTML & CSS', level: 95 },
    { name: 'JavaScript', level: 90 },
    { name: 'React.js', level: 90 },
    { name: 'Node.js', level: 50 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'Editing & Design', level: 75 },
  ];

  // 🌌 Background ringan
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      s: Math.random() * 0.5 + 0.2,
    }));
    let raf;

    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      for (let s of stars) {
        s.y += s.s;
        if (s.y > canvas.height) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 🕹️ Game optimized
  useEffect(() => {
    const canvas = gameRef.current;
    const ctx = canvas.getContext('2d');
    const GAME_W = 500;
    const GAME_H = 300;
    canvas.width = GAME_W;
    canvas.height = GAME_H;

    let bird = { x: 100, y: GAME_H / 2, vy: 0, r: 10 };
    const gravity = 0.5;
    const jump = -8;
    let pipes = [];
    const pipeWidth = 60;
    const gap = 110;
    let lastTime = performance.now();
    let frameTime = 0;
    let running = true;
    let scoreLocal = 0;
    let raf;

    const spawnPipe = () => {
      const topH = Math.random() * (GAME_H - gap - 50) + 20;
      pipes.push({ x: GAME_W, topH, bottomY: topH + gap, passed: false });
    };

    const reset = () => {
      pipes = [];
      bird = { x: 100, y: GAME_H / 2, vy: 0, r: 10 };
      scoreLocal = 0;
      setScore(0);
      running = true;
      spawnPipe();
      lastTime = performance.now();
      loop(lastTime);
    };

    const loop = (time) => {
      const delta = (time - lastTime) / 16.67; // normalisasi ke 60fps
      lastTime = time;
      frameTime += delta;
      if (frameTime > 6) frameTime = 6;

      ctx.clearRect(0, 0, GAME_W, GAME_H);

      while (frameTime >= 1) {
        bird.vy += gravity;
        bird.y += bird.vy;
        if (bird.y + bird.r > GAME_H) {
          running = false;
          setInfoText('💀 Game Over — Tekan Spasi untuk mulai ulang');
        }
        pipes.forEach((p) => (p.x -= 2.5));
        if (pipes.length === 0 || pipes[pipes.length - 1].x < GAME_W - 200) spawnPipe();
        pipes = pipes.filter((p) => p.x + pipeWidth > 0);
        frameTime--;
      }

      for (const p of pipes) {
        ctx.fillStyle = '#4b8bff';
        ctx.fillRect(p.x, 0, pipeWidth, p.topH);
        ctx.fillRect(p.x, p.bottomY, pipeWidth, GAME_H - p.bottomY);

        if (!p.passed && p.x + pipeWidth < bird.x) {
          p.passed = true;
          scoreLocal++;
          setScore(scoreLocal);
        }

        // collision
        if (
          bird.x + bird.r > p.x &&
          bird.x - bird.r < p.x + pipeWidth &&
          (bird.y - bird.r < p.topH || bird.y + bird.r > p.bottomY)
        ) {
          running = false;
          setInfoText('💀 Game Over — Tekan Spasi untuk mulai ulang');
        }
      }

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText(`Skor: ${scoreLocal}`, 10, 20);

      if (running) raf = requestAnimationFrame(loop);
    };

    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!running) {
          setInfoText('Tekan Spasi / Panah Atas untuk lompat');
          reset();
        } else bird.vy = jump;
      }
    };

    window.addEventListener('keydown', onKey);
    reset();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <Header />
      <canvas
        ref={bgCanvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      <div
        style={{
          position: 'relative',
          top: 120,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <canvas
          ref={gameRef}
          style={{
            display: 'block',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 12,
            boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
          }}
        />
        <div style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>{infoText}</div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            padding: '10px 0',
            marginTop: 20,
          }}
        >
          {skills.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              style={{
                minWidth: 160,
                height: 40,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.name}</div>
              <div
                style={{
                  width: '100%',
                  height: 12,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${s.level}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg,#89f7fe,#66a6ff)',
                    borderRadius: 6,
                    fontSize: 10,
                    color: '#111',
                    fontWeight: 600,
                    transition: 'width 0.8s ease',
                    textAlign: 'right',
                    paddingRight: 4,
                  }}
                >
                  {s.level}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
