
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

import portofolio1 from '../assets/portofolio1.png';
import portofolio2 from '../assets/portofolio2.png';
import portofolio3 from '../assets/portofolio3.png';

export default function Portofolio() {
  const bgCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;
    let lastTime = 0;
    let meteorTimer;

    const stars = [];
    const shootingStars = [];

    const planets = [
      {
        x: 0.08,
        y: 0.35,
        r: 100,
        color: 'rgba(25, 80, 255, 0.16)',
      },
      {
        x: 0.92,
        y: 0.72,
        r: 150,
        color: 'rgba(100, 30, 255, 0.12)',
      },
    ];

    // Canvas mengikuti tinggi seluruh halaman, bukan hanya layar.
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createStars = () => {
      stars.length = 0;

      // Kepadatan bintang menyesuaikan tinggi halaman.
      const starCount = Math.min(
        900,
        Math.max(180, Math.floor((width * height) / 6500))
      );

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.7 + 0.2,
          speed: Math.random() * 0.7 + 0.2,
          direction: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.9,
        y: Math.random() * Math.min(height, window.innerHeight) * 0.45,
        length: Math.random() * 130 + 70,
        speed: Math.random() * 7 + 5,
        opacity: 1,
        angle: Math.PI / 5,
      });

      if (shootingStars.length > 5) {
        shootingStars.shift();
      }
    };

    const drawPlanetGlow = (planet) => {
      const x = planet.x * width;
      const y = planet.y * window.innerHeight;

      const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, planet.r
      );

      gradient.addColorStop(0, planet.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, planet.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time = 0) => {
      const delta = Math.min((time - lastTime) / 16.67 || 1, 2);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#03050d';
      ctx.fillRect(0, 0, width, height);

      planets.forEach(drawPlanetGlow);

      // Bintang berkelap-kelip.
      stars.forEach((star) => {
        star.alpha += 0.008 * star.direction * delta;

        if (star.alpha >= 0.95) {
          star.alpha = 0.95;
          star.direction = -1;
        } else if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${star.alpha})`;
        ctx.fill();

        if (star.r > 1.1) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#60a5fa';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Animasi meteor.
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        const tailX =
          star.x - Math.cos(star.angle) * star.length;
        const tailY =
          star.y - Math.sin(star.angle) * star.length;

        const gradient = ctx.createLinearGradient(
          tailX,
          tailY,
          star.x,
          star.y
        );

        gradient.addColorStop(
          0,
          'rgba(96, 165, 250, 0)'
        );
        gradient.addColorStop(
          0.7,
          `rgba(96, 165, 250, ${star.opacity * 0.4})`
        );
        gradient.addColorStop(
          1,
          `rgba(255, 255, 255, ${star.opacity})`
        );

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#60a5fa';
        ctx.fill();
        ctx.shadowBlur = 0;

        star.x += Math.cos(star.angle) * star.speed * delta;
        star.y += Math.sin(star.angle) * star.speed * delta;
        star.opacity -= 0.008 * delta;

        if (
          star.opacity <= 0 ||
          star.x > width + star.length ||
          star.y > height + star.length
        ) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    createShootingStar();

    meteorTimer = window.setInterval(createShootingStar, 4500);

    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    // Perbarui ukuran saat jendela berubah.
    window.addEventListener('resize', handleResize);

    // Perbarui ukuran ketika tinggi konten halaman berubah.
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      createStars();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      window.clearInterval(meteorTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const projects = [
    {
      image: portofolio1,
      number: '01',
      category: 'PERSONAL PROJECT',
      title: 'Portofolio Website',
      description:
        'Website pribadi dengan tampilan interaktif, animasi, dan visual bertema luar angkasa.',
      tags: ['React', 'Framer Motion', 'CSS'],
      demo: 'https://projectrian.my.id',
    },
    {
      image: portofolio2,
      number: '02',
      category: 'EDUCATION WEBSITE',
      title: 'Website TKIT Jabal Nur',
      description:
        'Website sekolah dengan desain modern, informatif, dan responsif di berbagai perangkat.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
      demo: 'https://tkitjabalnur.netlify.app/',
    },
    {
      image: portofolio3,
      number: '03',
      category: 'WEB DESIGN',
      title: 'Website Restaurant',
      description:
        'Eksplorasi desain website restoran dengan konsep minimalis, elegan, dan modern.',
      tags: ['Web Design', 'CSS', 'JavaScript'],
      demo: 'https://sample-restaurant03.netlify.app/',
    },
  ];

  return (
    <>
      <style>{`
        .portfolio-container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #03050d;
          color: #f8fafc;
          font-family: 'Poppins', sans-serif;
          isolation: isolate;
        }

        .portfolio-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: -1;
          pointer-events: none;
        }

        .portfolio-content {
          position: relative;
          width: min(1180px, 90%);
          margin: 0 auto;
          padding: 125px 0 90px;
        }

        .portfolio-intro {
          max-width: 760px;
          margin: 0 auto 55px;
          text-align: center;
        }

        .portfolio-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 15px;
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.08);
          color: #93c5fd;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .portfolio-eyebrow::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 12px #60a5fa;
        }

        .portfolio-title {
          margin: 22px 0 16px;
          font-size: clamp(2.5rem, 6vw, 4.7rem);
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: -2px;
          color: #fff;
        }

        .portfolio-title span {
          background: linear-gradient(
            90deg,
            #60a5fa,
            #818cf8,
            #c084fc
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .portfolio-subtitle {
          max-width: 600px;
          margin: 0 auto;
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.9;
        }

        .portfolio-divider {
          width: 75px;
          height: 3px;
          margin: 25px auto 0;
          border-radius: 10px;
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          box-shadow: 0 0 15px rgba(96, 165, 250, 0.45);
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 25px;
          align-items: stretch;
        }

        .portfolio-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.17);
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            rgba(17, 24, 39, 0.95),
            rgba(7, 12, 26, 0.94)
          );
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.22);
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .portfolio-card:hover {
          border-color: rgba(96, 165, 250, 0.65);
          box-shadow:
            0 18px 55px rgba(0, 0, 0, 0.35),
            0 0 25px rgba(59, 130, 246, 0.1);
        }

        .portfolio-image-wrap {
          position: relative;
          height: 195px;
          overflow: hidden;
          background: #0b1220;
        }

        .portfolio-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 55%,
            rgba(3, 5, 13, 0.6)
          );
          pointer-events: none;
        }

        .portfolio-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .portfolio-card:hover .portfolio-image {
          transform: scale(1.07);
        }

        .portfolio-number {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 1;
          padding: 7px 11px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(3, 5, 13, 0.75);
          color: #bfdbfe;
          font-size: 12px;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }

        .portfolio-info {
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: flex-start;
          padding: 23px;
        }

        .portfolio-category {
          margin: 0 0 12px;
          color: #60a5fa;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.8px;
        }

        .portfolio-info h2 {
          margin: 0 0 12px;
          color: #f8fafc;
          font-size: 20px;
          line-height: 1.4;
          font-weight: 700;
        }

        .portfolio-info p {
          margin: 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.85;
        }

        .portfolio-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 18px;
        }

        .portfolio-tag {
          padding: 6px 9px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 6px;
          background: rgba(148, 163, 184, 0.06);
          color: #cbd5e1;
          font-size: 10px;
        }

        .portfolio-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          width: 100%;
          margin-top: auto;
          padding-top: 23px;
        }

        .portfolio-buttons a {
          display: inline-flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 40px;
          padding: 9px 12px;
          border: 1px solid transparent;
          border-radius: 9px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .portfolio-buttons .demo {
          background: linear-gradient(110deg, #2563eb, #4f46e5);
          color: white;
          box-shadow: 0 5px 18px rgba(37, 99, 235, 0.2);
        }

        .portfolio-buttons .demo:hover {
          box-shadow: 0 5px 22px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .portfolio-footer {
          margin-top: 55px;
          text-align: center;
          color: #64748b;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .portfolio-footer span {
          color: #93c5fd;
        }

        @media (max-width: 950px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }

          .portfolio-content {
            width: 92%;
          }
        }

        @media (max-width: 600px) {
          .portfolio-content {
            padding: 105px 0 55px;
          }

          .portfolio-intro {
            margin-bottom: 35px;
          }

          .portfolio-title {
            letter-spacing: -1px;
          }

          .portfolio-subtitle {
            font-size: 13px;
          }

          .portfolio-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 20px;
            max-width: 400px;
            margin: 0 auto;
          }

          .portfolio-image-wrap {
            height: 210px;
          }

          .portfolio-info {
            padding: 21px;
          }

          .portfolio-footer {
            margin-top: 35px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .portfolio-card,
          .portfolio-image,
          .portfolio-buttons a {
            transition: none;
          }
        }
      `}</style>

      <div className="portfolio-container">
        <canvas
          ref={bgCanvasRef}
          className="portfolio-bg"
          aria-hidden="true"
        />

        <Header />

        <main className="portfolio-content">
          <motion.section
            className="portfolio-intro"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="portfolio-eyebrow">
              MY CREATIVE UNIVERSE
            </div>

            <h1 className="portfolio-title">
              Karya &amp; <span>Portofolio</span>
            </h1>

            <p className="portfolio-subtitle">
              Kumpulan proyek dan eksplorasi digital yang saya bangun
              dengan kreativitas, teknologi, dan perhatian terhadap detail.
            </p>

            <div className="portfolio-divider" />
          </motion.section>

          <section
            className="portfolio-grid"
            aria-label="Daftar proyek"
          >
            {projects.map((project, index) => (
              <motion.article
                key={project.number}
                className="portfolio-card"
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.15 + index * 0.15,
                }}
                whileHover={{
                  y: -8,
                  rotateX: 2,
                  rotateY: -2,
                }}
                style={{ transformPerspective: 1000 }}
              >
                <div className="portfolio-image-wrap">
                  <img
                    className="portfolio-image"
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />

                  <span className="portfolio-number">
                    {project.number}
                  </span>
                </div>

                <div className="portfolio-info">
                  <div className="portfolio-category">
                    {project.category}
                  </div>

                  <h2>{project.title}</h2>

                  <p>{project.description}</p>

                  <div className="portfolio-tags">
                    {project.tags.map((tag) => (
                      <span className="portfolio-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="portfolio-buttons">
                    <a
                      className="demo"
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lihat Demo <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>

          <motion.footer
            className="portfolio-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            © Sukrian Efendi &amp; SurefDev
          </motion.footer>
        </main>
      </div>
    </>
  );
}
