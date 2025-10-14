'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import rianPhoto from '../assets/rian.jpg';
import Header from './Header';

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

  const pendidikan = [
    { jenjang: 'SD', nama: 'SDN Palmerah 22 Pagi, Jakarta', tahun: '2010 - 2016' },
    { jenjang: 'SMP', nama: 'PKBM Mitra Insan Cendekia', tahun: '2023 - 2024' },
    { jenjang: 'SMA', nama: 'PKBM Mitra Insan Cendekia', tahun: '2024 - 2027' },
    { jenjang: 'S1', nama: 'Universitas Pamulang — Sistem Informatika', tahun: '2027 - 2031' },
  ];

  return (
    <>
      <style>{`
        .riwayat-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .riwayat-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: black;
        }

        .riwayat-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 100px 8%;
          color: white;
          font-family: 'Poppins', sans-serif;
          gap: 40px;
        }

        .riwayat-text {
          flex: 1;
        }

        .riwayat-title {
          font-size: 2.8rem;
          margin-bottom: 40px;
        }

        .riwayat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px 40px;
        }

        .riwayat-card {
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid gold;
          border-radius: 20px;
          padding: 25px 30px;
          text-align: center;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          backdrop-filter: blur(8px);
          transition: 0.3s ease;
        }

        .riwayat-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
        }

        .riwayat-card h3 {
          font-size: 1.3rem;
          color: gold;
          margin-bottom: 10px;
        }

        .riwayat-card .nama {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .riwayat-card .tahun {
          font-size: 0.9rem;
          opacity: 0.85;
        }

        .riwayat-foto {
          flex: 0 0 auto;
          border-radius: 50%;
          padding: 6px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
        }

        .riwayat-foto img {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 3px solid rgba(255, 215, 0, 0.8);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
        }

        @media (max-width: 900px) {
          .riwayat-content {
            flex-direction: column;
            text-align: center;
            padding: 120px 5% 60px;
          }

          .riwayat-foto {
            order: -1;
            margin-bottom: 30px;
          }

          .riwayat-foto img {
            width: 180px;
            height: 180px;
          }

          .riwayat-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .riwayat-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="riwayat-container">
        <Header />
        <canvas ref={bgCanvasRef} className="riwayat-bg" />
        <div className="riwayat-content">
          <div className="riwayat-text">
            <h1 className="riwayat-title">Riwayat Pendidikan</h1>
            <div className="riwayat-grid">
              {pendidikan.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="riwayat-card"
                >
                  <h3>{item.jenjang}</h3>
                  <p className="nama">{item.nama}</p>
                  <p className="tahun">{item.tahun}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 10 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 3,
              ease: 'easeInOut',
            }}
            className="riwayat-foto"
          >
            <img src={rianPhoto} alt="Sukrian Efendi" />
          </motion.div>
        </div>
      </div>
    </>
  );
}
