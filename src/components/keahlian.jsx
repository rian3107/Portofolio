'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

// Import logo (nanti kamu ubah sesuai folder & format yang kamu punya)
import reactLogo from '../assets/react.png';
import nextLogo from '../assets/next.jpg';
import nodeLogo from '../assets/node.jpg';
import tailwindLogo from '../assets/tailwindcss.jpg';
import jsLogo from '../assets/javascript.png';
import phpLogo from '../assets/php.png';
import mysqlLogo from '../assets/mysql.png';
import designLogo from '../assets/uiux.jpg';

export default function Keahlian() {
  const bgCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  const skills = [
    { name: 'React.js', level: 'Basic', color: '#61dafb', logo: reactLogo },
    { name: 'Next.js', level: 'Basic', color: '#ffffff', logo: nextLogo },
    { name: 'Node.js', level: 'Basic', color: '#3c873a', logo: nodeLogo },
    { name: 'Tailwind CSS', level: 'Basic', color: '#38bdf8', logo: tailwindLogo },
    { name: 'JavaScript', level: 'Basic', color: '#f7df1e', logo: jsLogo },
    { name: 'PHP', level: 'Basic', color: '#8993be', logo: phpLogo },
    { name: 'MySQL', level: 'Basic', color: '#f29111', logo: mysqlLogo },
    { name: 'UI/UX Design', level: 'Basic', color: '#ff5fa2', logo: designLogo },
  ];

  return (
    <>
      <style>{`
        .keahlian-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #020408ff, #020617);
          color: white;
          font-family: 'Poppins', sans-serif;
        }

        .keahlian-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.4;
          z-index: 0;
        }

        .keahlian-content {
          position: relative;
          z-index: 1;
          padding: 120px 8% 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .keahlian-title {
          font-size: 3rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 50px;
          background: linear-gradient(90deg, #00d2ff, #3a7bd5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 35px;
          width: 100%;
          max-width: 1000px;
        }

        .skill-card {
          position: relative;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 30px 20px;
          text-align: center;
          backdrop-filter: blur(12px);
          transition: 0.3s ease;
        }

        .skill-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 0 25px rgba(255,255,255,0.2);
        }

        .skill-logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          margin: 0 auto 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 0 15px rgba(255,255,255,0.1);
          transition: 0.4s;
        }

        .skill-card:hover .skill-logo {
          box-shadow: 0 0 25px currentColor;
          transform: scale(1.05);
        }

        .skill-logo img {
          width: 55%;
          height: 55%;
          object-fit: contain;
        }

        .skill-name {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .skill-level {
          font-size: 0.95rem;
          opacity: 0.8;
          margin-bottom: 12px;
        }

        .progress-bar {
          position: relative;
          height: 8px;
          width: 100%;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          position: absolute;
          height: 100%;
          border-radius: 10px;
          transition: width 0.8s ease;
        }

        @media (max-width: 768px) {
          .keahlian-title {
            font-size: 2.3rem;
          }
        }
      `}</style>

      <div className="keahlian-page">
        <Header />
        <canvas ref={bgCanvasRef} className="keahlian-bg" />
        <div className="keahlian-content">
          <motion.h1
            className="keahlian-title"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            
          </motion.h1>

          <div className="skills-grid">
            {skills.map((s, i) => (
              <motion.div
                key={i}
                className="skill-card"
                style={{ color: s.color }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="skill-logo">
                  <img src={s.logo} alt={s.name} />
                </div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-level">{s.level}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      background: s.color,
                      width:
                        s.level === 'Advanced'
                          ? '90%'
                          : s.level === 'Intermediate'
                          ? '70%'
                          : '50%',
                    }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
