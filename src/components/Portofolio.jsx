'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import portofolio1 from '../assets/portofolio1.png';
import portofolio2 from '..\assets\portofolio2.png';

export default function Portofolio() {
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
    <>
      <style>{`
        .portfolio-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: black;
          font-family: 'Poppins', sans-serif;
          color: white;
        }

        .portfolio-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .portfolio-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          justify-content: flex-start;
          align-items: flex-start;
          min-height: 100vh;
          padding: 120px 5%;
        }

        .portfolio-card {
          width: 260px;
          background: linear-gradient(145deg, #ffffff, #e8e8e8);
          border-radius: 20px;
          box-shadow: 8px 8px 25px rgba(0,0,0,0.3), -8px -8px 25px rgba(255,255,255,0.1);
          overflow: hidden;
          transform-style: preserve-3d;
          perspective: 1000px;
          transition: all 0.3s ease;
        }

        .portfolio-card:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .portfolio-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-bottom: 1px solid #ccc;
        }

        .portfolio-info {
          padding: 18px;
          text-align: center;
          color: black;
        }

        .portfolio-info h2 {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .portfolio-info p {
          font-size: 0.85rem;
          color: #333;
        }

        .portfolio-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 15px;
        }

        .portfolio-buttons a {
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.8rem;
          transition: 0.3s ease;
        }

        .portfolio-buttons a.github {
          background: #000;
          color: white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        }

        .portfolio-buttons a.github:hover {
          background: #333;
          transform: translateY(-3px);
        }

        .portfolio-buttons a.demo {
          background: #0078ff;
          color: white;
          box-shadow: 0 3px 10px rgba(0,120,255,0.3);
        }

        .portfolio-buttons a.demo:hover {
          background: #005fcc;
          transform: translateY(-3px);
        }

        @media (max-width: 700px) {
          .portfolio-card {
            width: 80%;
          }
        }
      `}</style>

      <div className="portfolio-container">
        <Header />
        <canvas ref={bgCanvasRef} className="portfolio-bg" />

        <div className="portfolio-content">
          <motion.div
            className="portfolio-card"
            whileHover={{ rotateY: 10, rotateX: 5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <img src={portofolio1} alt="Project Portofolio" />
            <div className="portfolio-info">
              <h2>Portofolio Website</h2>
              <p>Website pribadi dengan efek interaktif dan animasi bintang.</p>
              <div className="portfolio-buttons">
                <a
                  href="https://github.com/rian3107/Portofolio.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github"
                >
                  GitHub
                </a>
                <a
                  href="https://projectrian.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo"
                >
                  Coba
                </a>
              </div>
            </div>
          </motion.div>
          <motion.div
    className="portfolio-card"
    whileHover={{ rotateY: 10, rotateX: 5 }}
    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
  >
    <img src={portofolio2} alt="TKIT Jabal Nur" />

    <div className="portfolio-info">
      <h2>Website TKIT Jabal Nur</h2>
      <p>Website sekolah TKIT Jabal Nur berbasis modern dan responsive.</p>

      <div className="portfolio-buttons">
        <a
          href="https://tkitjabalnur.netlify.app/v"
          target="_blank"
          rel="noopener noreferrer"
          className="demo"
        >
          Coba
        </a>
      </div>
    </div>
  </motion.div>

        </div>
      </div>
      
    </>
  );
}
