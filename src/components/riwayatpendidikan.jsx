'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import rianPhoto from '../assets/rian.jpg';
import Header from './Header';
import './RiwayatPendidikan.css';

const pendidikan = [
  {
    jenjang: '01',
    label: 'Sekolah Dasar',
    nama: 'SDN Palmerah 22 Pagi',
    lokasi: 'Jakarta',
    tahun: '2010 — 2016',
  },
  {
    jenjang: '02',
    label: 'Sekolah Menengah Pertama',
    nama: 'PKBM Mitra Insan Cendekia',
    lokasi: '',
    tahun: '2023 — 2024',
  },
  {
    jenjang: '03',
    label: 'Sekolah Menengah Atas',
    nama: 'PKBM Mitra Insan Cendekia',
    lokasi: '',
    tahun: '2024 — 2027',
    status: 'Sedang ditempuh',
  },
];

export default function RiwayatPendidikan() {
  const bgCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastShootingStar = 0;

    const stars = Array.from({ length: 190 }, () => ({
      x: 0,
      y: 0,
      r: Math.random() * 1.25 + 0.2,
      alpha: Math.random() * 0.75 + 0.15,
      speed: Math.random() * 0.007 + 0.002,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));
    const shootingStars = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.forEach((star) => {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      });
    };

    const addShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.85,
        y: Math.random() * height * 0.45,
        length: 70 + Math.random() * 110,
        speed: 5 + Math.random() * 4,
        opacity: 0.8,
      });
    };

    const drawGlow = (x, y, radius, color) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time = 0) => {
      ctx.clearRect(0, 0, width, height);
      // Subtle cosmic glows; the canvas stays behind all page content.
      drawGlow(width * 0.13, height * 0.18, Math.min(width, height) * 0.36, 'rgba(40, 78, 160, 0.14)');
      drawGlow(width * 0.88, height * 0.72, Math.min(width, height) * 0.32, 'rgba(99, 54, 145, 0.10)');

      stars.forEach((star) => {
        star.alpha += star.speed * star.direction;
        if (star.alpha > 0.9 || star.alpha < 0.12) star.direction *= -1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 235, 255, ${star.alpha})`;
        ctx.fill();
      });

      if (time - lastShootingStar > 7200) {
        addShootingStar();
        lastShootingStar = time;
      }

      for (let i = shootingStars.length - 1; i >= 0; i -= 1) {
        const star = shootingStars[i];
        const gradient = ctx.createLinearGradient(
          star.x, star.y, star.x - star.length, star.y - star.length * 0.28
        );
        gradient.addColorStop(0, `rgba(220, 235, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(220, 235, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length, star.y - star.length * 0.28);
        ctx.stroke();
        star.x += star.speed;
        star.y += star.speed * 0.28;
        star.opacity -= 0.012;
        if (star.opacity <= 0 || star.x > width + star.length) shootingStars.splice(i, 1);
      }

      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <main className="education-page">
      <canvas ref={bgCanvasRef} className="education-space-bg" aria-hidden="true" />
      <div className="education-ambient" aria-hidden="true" />
      <Header />

      <section className="education-hero">
        <div className="education-hero-inner">
          <motion.div
            className="education-intro"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <p className="eyebrow"><span className="eyebrow-line" /> PROFIL · PERJALANAN BELAJAR</p>
            <h1>Belajar adalah<br /><em>perjalanan.</em></h1>
            <p className="education-lead">
              Setiap tahap memberi ruang untuk bertumbuh. Ini adalah rangkuman perjalanan
              pendidikan saya sejauh ini—dan proses yang masih terus berjalan.
            </p>
            <a className="text-link" href="#timeline">
              Lihat perjalanan <span aria-hidden="true">↘</span>
            </a>
          </motion.div>

          <motion.aside
            className="education-portrait"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: 'easeOut' }}
          >
            <div className="portrait-frame">
              <img src={rianPhoto} alt="Sukrian Efendi" />
            </div>
            <div className="portrait-caption">
              <span className="caption-index">01 / TENTANG SAYA</span>
              <p>Sukrian Efendi</p>
              <span className="caption-role">Pembelajar mandiri · Tech enthusiast</span>
            </div>
            <span className="portrait-orbit orbit-one" aria-hidden="true" />
            <span className="portrait-orbit orbit-two" aria-hidden="true" />
          </motion.aside>
        </div>
        <div className="hero-bottom-note">
          <span>PROSES, BUKAN PERLOMBAAN</span>
          <span className="note-line" />
          <span>SCROLL UNTUK MENJELAJAH</span>
        </div>
      </section>

      <section className="education-timeline-section" id="timeline">
        <div className="section-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> 01 — RIWAYAT PENDIDIKAN</p>
          <h2>Langkah demi<br /><em>langkah.</em></h2>
          <p className="section-description">
            Perjalanan tidak selalu berjalan lurus. Yang penting adalah tetap melanjutkan
            proses dan memberi ruang untuk berkembang.
          </p>
        </div>

        <div className="education-timeline">
          {pendidikan.map((item, index) => (
            <motion.article
              className={`timeline-entry${item.status ? ' timeline-entry-current' : ''}`}
              key={item.jenjang}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <div className="timeline-marker">
                <span>{item.jenjang}</span>
                {index !== pendidikan.length - 1 && <i aria-hidden="true" />}
              </div>
              <div className="timeline-main">
                <p className="timeline-label">{item.label}</p>
                <h3>{item.nama}</h3>
                {item.lokasi && <p className="timeline-location">{item.lokasi}</p>}
                {item.status && <span className="current-status"><span /> {item.status}</span>}
              </div>
              <p className="timeline-year">{item.tahun}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="learning-section">
        <div className="learning-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> 02 — DI LUAR KELAS</p>
          <h2>Terus tumbuh,<br /><em>terus mencoba.</em></h2>
        </div>
        <div className="learning-content">
          <p className="learning-statement">
            Pendidikan bukan hanya tentang ruang kelas. Saya juga ingin terus mengasah
            kemampuan melalui eksplorasi teknologi, latihan, dan proyek-proyek digital.
          </p>
          <div className="learning-focus-list">
            <div className="focus-row">
              <span className="focus-number">A</span>
              <div><h3>Belajar mandiri</h3><p>Membangun kebiasaan belajar, mencari referensi, dan memahami hal baru secara bertahap.</p></div>
              <span className="focus-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="focus-row">
              <span className="focus-number">B</span>
              <div><h3>Web & teknologi</h3><p>Mengeksplorasi cara teknologi dapat diubah menjadi pengalaman digital yang berguna.</p></div>
              <span className="focus-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="focus-row">
              <span className="focus-number">C</span>
              <div><h3>Membangun lewat praktik</h3><p>Menguji ide melalui proyek kecil, memperbaiki kekurangan, lalu berkembang dari hasilnya.</p></div>
              <span className="focus-arrow" aria-hidden="true">↗</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="education-footer">
        <p className="eyebrow"><span className="eyebrow-line" /> MASIH DALAM PROSES</p>
        <h2>Belum selesai.<br /><em>Baru bertumbuh.</em></h2>
        <p>Setiap langkah adalah bagian dari cerita yang sedang saya bangun.</p>
        <span className="footer-signature">Sukrian Efendi <span>©</span></span>
      </footer>
    </main>
  );
}
