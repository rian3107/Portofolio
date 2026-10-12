
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
} from 'react-icons/fa';
import Header from './Header';
import logoRian from '../assets/Logo Rian.png';

export default function Kontak() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // BACKGROUND LUAR ANGKASA — TETAP DIPERTAHANKAN
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId;
    let lastTime = 0;

    const stars = [];
    const meteors = [];

    const planets = [
      {
        x: 0.12,
        y: 0.25,
        radius: 150,
        color: 'rgba(37, 99, 235, 0.18)',
      },
      {
        x: 0.88,
        y: 0.7,
        radius: 190,
        color: 'rgba(139, 92, 246, 0.13)',
      },
      {
        x: 0.5,
        y: 0.95,
        radius: 160,
        color: 'rgba(14, 165, 233, 0.08)',
      },
    ];

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

      const count = Math.min(
        700,
        Math.max(180, Math.floor((width * height) / 6500))
      );

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.7 + 0.2,
          speed: Math.random() * 0.012 + 0.003,
          direction: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.9,
        y: Math.random() * Math.min(height, window.innerHeight) * 0.55,
        length: Math.random() * 100 + 80,
        speed: Math.random() * 5 + 4,
        opacity: 1,
        angle: Math.PI / 5,
      });

      if (meteors.length > 5) meteors.shift();
    };

    const drawGlow = (planet) => {
      const x = planet.x * width;
      const y = planet.y * height;

      const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, planet.radius
      );

      gradient.addColorStop(0, planet.color);
      gradient.addColorStop(1, 'rgba(3, 5, 13, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time = 0) => {
      const delta = lastTime
        ? Math.min((time - lastTime) / 16.67, 2)
        : 1;

      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#03050d';
      ctx.fillRect(0, 0, width, height);

      planets.forEach(drawGlow);

      // Bintang berkelap-kelip
      stars.forEach((star) => {
        star.alpha += star.speed * star.direction * delta;

        if (star.alpha >= 0.95) {
          star.alpha = 0.95;
          star.direction = -1;
        } else if (star.alpha <= 0.12) {
          star.alpha = 0.12;
          star.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${star.alpha})`;
        ctx.fill();

        if (star.radius > 1.2) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#60a5fa';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Meteor bercahaya diagonal
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];

        const tailX =
          meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY =
          meteor.y - Math.sin(meteor.angle) * meteor.length;

        const gradient = ctx.createLinearGradient(
          tailX,
          tailY,
          meteor.x,
          meteor.y
        );

        gradient.addColorStop(0, 'rgba(96,165,250,0)');
        gradient.addColorStop(
          0.75,
          `rgba(96,165,250,${meteor.opacity * 0.5})`
        );
        gradient.addColorStop(
          1,
          `rgba(255,255,255,${meteor.opacity})`
        );

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        meteor.x += Math.cos(meteor.angle) * meteor.speed * delta;
        meteor.y += Math.sin(meteor.angle) * meteor.speed * delta;
        meteor.opacity -= 0.012 * delta;

        if (
          meteor.opacity <= 0 ||
          meteor.x > width + meteor.length ||
          meteor.y > height + meteor.length
        ) {
          meteors.splice(i, 1);
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    createMeteor();

    const meteorTimer = window.setInterval(createMeteor, 4500);

    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });

    observer.observe(document.body);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      window.clearInterval(meteorTimer);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Efek kartu 3D
  const handleMouseMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setTilt({
      x: -((y - rect.height / 2) / 22),
      y: (x - rect.width / 2) / 22,
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // LOGO ASLI DARI REACT ICONS
  const contacts = [
    {
      name: 'Email',
      description: 'Kirim pesan langsung melalui email',
      icon: FaEnvelope,
      color: '#60a5fa',
      glow: 'rgba(96,165,250,0.16)',
      href: 'mailto:efendisukrian7@gmail.com?subject=Pertanyaan&body=Haii%2C%20boleh%20bertanya%3F',
      label: 'Kirim Email',
    },
    {
      name: 'WhatsApp',
      description: 'Hubungi saya untuk komunikasi cepat',
      icon: FaWhatsapp,
      color: '#4ade80',
      glow: 'rgba(74,222,128,0.14)',
      href: 'https://wa.me/6281262778436?text=Haii%2C%20boleh%20bertanya%3F',
      label: 'Chat WhatsApp',
    },
    {
      name: 'Facebook',
      description: 'Temukan profil Facebook saya',
      icon: FaFacebookF,
      color: '#60a5fa',
      glow: 'rgba(96,165,250,0.14)',
      href: 'https://www.facebook.com/profile.php?id=100087497570542',
      label: 'Buka Facebook',
    },
    {
      name: 'Instagram',
      description: 'Lihat aktivitas dan foto terbaru',
      icon: FaInstagram,
      color: '#f472b6',
      glow: 'rgba(244,114,182,0.14)',
      href: 'https://www.instagram.com/rianzmmm',
      label: 'Buka Instagram',
    },
  ];

  return (
    <>
      <style>{`
        .contact-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background: #03050d;
          color: #f8fafc;
          font-family: 'Poppins', sans-serif;
        }

        .contact-page *,
        .contact-page *::before,
        .contact-page *::after {
          box-sizing: border-box;
        }

        .contact-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: -1;
          pointer-events: none;
        }

        .contact-content {
          position: relative;
          z-index: 1;
          width: min(1100px, 90%);
          min-height: 100vh;
          margin: 0 auto;
          padding: 125px 0 65px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .contact-heading {
          max-width: 700px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .contact-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          border: 1px solid rgba(96,165,250,0.28);
          border-radius: 999px;
          background: rgba(37,99,235,0.08);
          color: #93c5fd;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .contact-eyebrow::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 12px #60a5fa;
          animation: contactPulse 2s ease-in-out infinite;
        }

        .contact-title {
          margin: 22px 0 16px;
          font-size: clamp(2.6rem, 6vw, 4.5rem);
          font-weight: 800;
          letter-spacing: -2.5px;
          line-height: 1.08;
          color: white;
        }

        .contact-title span {
          background: linear-gradient(
            100deg,
            #60a5fa,
            #a78bfa,
            #f0abfc
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .contact-subtitle {
          max-width: 520px;
          margin: 0 auto;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.9;
        }

        .contact-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          align-items: stretch;
          gap: 25px;
          width: 100%;
          max-width: 940px;
        }

        .contact-profile,
        .contact-panel {
          min-width: 0;
          border: 1px solid rgba(148,163,184,0.17);
          border-radius: 25px;
          background: linear-gradient(
            145deg,
            rgba(17,24,39,0.82),
            rgba(7,12,26,0.88)
          );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow:
            0 20px 65px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.035);
        }

        /* PROFILE */
        .contact-profile {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 36px 25px;
          text-align: center;
          transform-style: preserve-3d;
          transition: transform 0.18s ease-out;
          will-change: transform;
        }

        .contact-profile::before {
          content: '';
          position: absolute;
          top: -90px;
          left: 50%;
          width: 230px;
          height: 230px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(59,130,246,0.14);
          filter: blur(55px);
          pointer-events: none;
        }

        .contact-profile::after {
          content: '';
          position: absolute;
          right: -65px;
          bottom: -70px;
          width: 170px;
          height: 170px;
          border: 1px solid rgba(129,140,248,0.12);
          border-radius: 50%;
          box-shadow:
            0 0 0 18px rgba(129,140,248,0.025),
            0 0 0 38px rgba(129,140,248,0.02);
          pointer-events: none;
        }

        .contact-profile > * {
          position: relative;
          z-index: 1;
        }

        .profile-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          margin-bottom: 28px;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.4px;
        }

        .profile-topline-label {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .profile-topline-label span:first-child {
          color: #c4b5fd;
          font-size: 15px;
        }

        .profile-online {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border: 1px solid rgba(74,222,128,0.18);
          border-radius: 999px;
          background: rgba(74,222,128,0.05);
          color: #86efac;
          font-size: 9px;
          letter-spacing: 0.3px;
        }

        .profile-online::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 9px #4ade80;
        }

        .contact-avatar-wrap {
          position: relative;
          display: grid;
          place-items: center;
          width: 145px;
          height: 145px;
          margin-bottom: 25px;
        }

        .contact-avatar-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(147,197,253,0.3);
          border-radius: 50%;
          animation: contactOrbit 18s linear infinite;
        }

        .contact-avatar-ring::before {
          content: '';
          position: absolute;
          top: 16px;
          right: 18px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #67e8f9;
          box-shadow: 0 0 12px #67e8f9;
        }

        .contact-avatar-ring-two {
          position: absolute;
          inset: 12px;
          border: 1px dashed rgba(196,181,253,0.25);
          border-radius: 50%;
          animation: contactOrbit 26s linear infinite reverse;
        }

        .contact-avatar {
          width: 105px;
          height: 105px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.16);
          background: #10172e;
          box-shadow:
            0 0 0 7px rgba(96,165,250,0.04),
            0 0 35px rgba(96,165,250,0.2);
        }

        .contact-name {
          margin: 0;
          color: #f8fafc;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .contact-role {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 10px 0 18px;
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .contact-role::before {
          content: '</>';
          color: #67e8f9;
          font-size: 12px;
          letter-spacing: 0;
        }

        .contact-bio {
          max-width: 280px;
          margin: 0;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.95;
        }

        .profile-divider {
          width: 100%;
          height: 1px;
          margin: 25px 0 20px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(129,140,248,0.3),
            transparent
          );
        }

        .contact-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 13px;
          border: 1px solid rgba(74,222,128,0.17);
          border-radius: 999px;
          background: rgba(74,222,128,0.06);
          color: #86efac;
          font-size: 10px;
          line-height: 1.5;
        }

        .contact-status::before {
          content: '✦';
          color: #4ade80;
          font-size: 11px;
        }

        .profile-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          margin-top: 24px;
          color: #64748b;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .profile-bottom span:first-child {
          color: #a5b4fc;
          font-size: 13px;
        }

        /* PANEL KONTAK */
        .contact-panel {
          padding: 30px;
        }

        .contact-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 25px;
        }

        .contact-panel-kicker {
          display: block;
          margin-bottom: 9px;
          color: #818cf8;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2.5px;
        }

        .contact-panel-header h2 {
          margin: 0 0 9px;
          color: #f8fafc;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.6px;
        }

        .contact-panel-header p {
          max-width: 360px;
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.9;
        }

        .contact-panel-decoration {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(129,140,248,0.22);
          border-radius: 14px;
          background: rgba(129,140,248,0.09);
          color: #a5b4fc;
          font-size: 23px;
        }

        .contact-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
          padding: 13px;
          border: 1px solid rgba(148,163,184,0.12);
          border-radius: 16px;
          background: rgba(255,255,255,0.025);
          text-decoration: none;
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .contact-link:hover {
          transform: translateX(4px);
          border-color: var(--contact-color);
          background: var(--contact-glow);
          box-shadow: 0 0 25px var(--contact-glow);
        }

        .contact-link:focus-visible {
          outline: 2px solid var(--contact-color);
          outline-offset: 3px;
        }

        .contact-link-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 45px;
          height: 45px;
          border: 1px solid var(--contact-glow);
          border-radius: 13px;
          background: var(--contact-glow);
          color: var(--contact-color);
          font-size: 22px;
          box-shadow: inset 0 0 12px var(--contact-glow);
          transition: transform 0.25s ease;
        }

        .contact-link-icon svg {
          display: block;
          width: 1em;
          height: 1em;
        }

        .contact-link:hover .contact-link-icon {
          transform: scale(1.07) rotate(-4deg);
        }

        .contact-link-copy {
          flex: 1;
          min-width: 0;
        }

        .contact-link-copy strong {
          display: block;
          margin-bottom: 5px;
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 700;
        }

        .contact-link-copy small {
          display: block;
          color: #8190a8;
          font-size: 10px;
          line-height: 1.7;
        }

        .contact-link-action {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          color: #64748b;
          font-size: 9px;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        .contact-link-arrow {
          font-size: 18px;
        }

        .contact-link:hover .contact-link-action {
          color: var(--contact-color);
          transform: translate(2px, -2px);
        }

        .contact-panel-footer {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 24px;
          padding-top: 19px;
          border-top: 1px solid rgba(148,163,184,0.1);
        }

        .contact-panel-footer-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 27px;
          height: 27px;
          border-radius: 9px;
          background: rgba(129,140,248,0.1);
          color: #a5b4fc;
        }

        .contact-panel-footer p {
          margin: 2px 0 0;
          color: #8190a8;
          font-size: 10px;
          line-height: 1.8;
        }

        /* FOOTER */
        .contact-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 38px;
          color: #64748b;
          text-align: center;
          font-size: 9px;
          letter-spacing: 1.3px;
        }

        .contact-footer span {
          color: #93c5fd;
        }

        .contact-footer-mark {
          color: #818cf8;
        }

        /* ANIMASI */
        @keyframes contactOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes contactPulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 12px #60a5fa;
          }
          50% {
            opacity: 0.55;
            box-shadow: 0 0 4px #60a5fa;
          }
        }

        /* TABLET */
        @media (max-width: 850px) {
          .contact-content {
            padding-top: 115px;
          }

          .contact-layout {
            grid-template-columns: minmax(0, 1fr);
            max-width: 540px;
            gap: 20px;
          }

          .contact-profile {
            padding: 28px 25px;
          }

          .contact-avatar-wrap {
            margin-bottom: 22px;
          }

          .contact-panel {
            padding: 26px;
          }

          .contact-heading {
            margin-bottom: 30px;
          }
        }

        /* MOBILE */
        @media (max-width: 560px) {
          .contact-content {
            width: 92%;
            padding: 105px 0 35px;
          }

          .contact-heading {
            margin-bottom: 27px;
          }

          .contact-eyebrow {
            gap: 8px;
            padding: 8px 12px;
            font-size: 9px;
            letter-spacing: 2px;
          }

          .contact-title {
            margin: 19px 0 13px;
            font-size: clamp(2.3rem, 10vw, 3.4rem);
            letter-spacing: -1.5px;
          }

          .contact-subtitle {
            max-width: 400px;
            font-size: 12px;
            line-height: 1.85;
          }

          .contact-layout {
            gap: 16px;
          }

          .contact-profile {
            padding: 23px 17px;
            border-radius: 21px;
          }

          .profile-topline {
            margin-bottom: 24px;
            font-size: 8px;
            letter-spacing: 0.7px;
          }

          .profile-online {
            padding: 5px 7px;
            font-size: 8px;
          }

          .contact-avatar-wrap {
            width: 125px;
            height: 125px;
            margin-bottom: 20px;
          }

          .contact-avatar {
            width: 91px;
            height: 91px;
          }

          .contact-name {
            font-size: 24px;
          }

          .contact-role {
            margin: 9px 0 15px;
            font-size: 9px;
          }

          .contact-bio {
            font-size: 11px;
          }

          .contact-status {
            max-width: 100%;
            font-size: 9px;
          }

          .contact-panel {
            padding: 20px 14px;
            border-radius: 21px;
          }

          .contact-panel-header {
            margin-bottom: 19px;
          }

          .contact-panel-header h2 {
            font-size: 21px;
          }

          .contact-panel-header p {
            font-size: 10px;
          }

          .contact-panel-decoration {
            width: 38px;
            height: 38px;
            font-size: 20px;
          }

          .contact-links {
            gap: 10px;
          }

          .contact-link {
            gap: 10px;
            padding: 11px 9px;
            border-radius: 13px;
          }

          .contact-link-icon {
            width: 39px;
            height: 39px;
            border-radius: 11px;
            font-size: 19px;
          }

          .contact-link-copy strong {
            font-size: 11px;
          }

          .contact-link-copy small {
            font-size: 9px;
          }

          .contact-link-action {
            font-size: 9px;
          }

          .contact-link-action > span:first-child {
            display: none;
          }

          .contact-panel-footer {
            margin-top: 19px;
            padding-top: 15px;
          }

          .contact-panel-footer p {
            font-size: 9px;
          }

          .contact-footer {
            gap: 6px;
            margin-top: 25px;
            font-size: 8px;
            letter-spacing: 0.7px;
          }
        }

        @media (max-width: 360px) {
          .contact-content {
            width: 94%;
          }

          .contact-link-copy small {
            font-size: 8px;
          }

          .profile-topline-label {
            gap: 4px;
          }

          .profile-topline-label span:last-child {
            font-size: 7px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-page *,
          .contact-page *::before,
          .contact-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="contact-page">
        <canvas
          ref={canvasRef}
          className="contact-background"
          aria-hidden="true"
        />

        <Header />

        <main className="contact-content">
          <motion.section
            className="contact-heading"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="contact-eyebrow">
              LET'S CONNECT
            </div>

            <h1 className="contact-title">
              Hubungi <span>Saya</span>
            </h1>

            <p className="contact-subtitle">
              Punya pertanyaan, ide, atau ingin berkolaborasi?
              Silakan hubungi saya melalui salah satu platform
              di bawah ini.
            </p>
          </motion.section>

          <div className="contact-layout">
            <motion.section
              ref={cardRef}
              className="contact-profile"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetTilt}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <div className="profile-topline">
                <div className="profile-topline-label">
                  <span>✧</span>
                  <span>MY DIGITAL SPACE</span>
                </div>

                <div className="profile-online">
                  Online
                </div>
              </div>

              <div className="contact-avatar-wrap">
                <div className="contact-avatar-ring" />
                <div className="contact-avatar-ring-two" />

                <img
                  className="contact-avatar"
                  src={logoRian}
                  alt="Logo Sukrian Efendi"
                />
              </div>

              <h2 className="contact-name">
                Sukrian Efendi
              </h2>

              <p className="contact-role">
                Web Developer
              </p>

              <p className="contact-bio">
                Membangun pengalaman digital yang kreatif,
                interaktif, dan berkesan melalui teknologi web.
              </p>

              <div className="profile-divider" />

              <div className="contact-status">
                Terbuka untuk koneksi dan kolaborasi
              </div>

              <div className="profile-bottom">
                <span>✦</span>
                <span>CREATIVE · DIGITAL · FUTURE</span>
              </div>
            </motion.section>

            <motion.section
              className="contact-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="contact-panel-header">
                <div>
                  <span className="contact-panel-kicker">
                    GET IN TOUCH
                  </span>

                  <h2>Temukan Saya</h2>

                  <p>
                    Pilih platform yang paling nyaman untuk
                    menghubungi atau mengikuti aktivitas saya.
                  </p>
                </div>

                <div
                  className="contact-panel-decoration"
                  aria-hidden="true"
                >
                  ↗
                </div>
              </div>

              <div className="contact-links">
                {contacts.map((contact, index) => {
                  const ContactIcon = contact.icon;
                  const external = contact.href.startsWith('https://');

                  return (
                    <motion.a
                      key={contact.name}
                      className="contact-link"
                      href={contact.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      aria-label={contact.label}
                      style={{
                        '--contact-color': contact.color,
                        '--contact-glow': contact.glow,
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + index * 0.1,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span
                        className="contact-link-icon"
                        aria-hidden="true"
                      >
                        <ContactIcon />
                      </span>

                      <span className="contact-link-copy">
                        <strong>{contact.name}</strong>
                        <small>{contact.description}</small>
                      </span>

                      <span
                        className="contact-link-action"
                        aria-hidden="true"
                      >
                        <span>{contact.label}</span>
                        <span className="contact-link-arrow">↗</span>
                      </span>
                    </motion.a>
                  );
                })}
              </div>

              <div className="contact-panel-footer">
                <div className="contact-panel-footer-icon">
                  ✧
                </div>

                <p>
                  Setiap koneksi bisa menjadi awal dari sesuatu
                  yang luar biasa. Mari mulai percakapan!
                </p>
              </div>
            </motion.section>
          </div>

          <motion.footer
            className="contact-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            © {new Date().getFullYear()}
            <span>Sukrian Efendi | Surefdev</span>
            <span className="contact-footer-mark">✦</span>
            DESIGNED WITH CREATIVITY
          </motion.footer>
        </main>
      </div>
    </>
  );
}
