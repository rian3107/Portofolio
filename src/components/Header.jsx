'use client';
import React, { useState, useEffect } from 'react';
import logoRian from '../assets/Logo Rian.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Riwayat Pendidikan', href: '/riwayat-pendidikan' },
    { name: 'Keahlian', href: '/keahlian' },
    { name: 'Portofolio', href: '/portofolio' },
    { name: 'Kontak', href: '/kontak' },
  ];

  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: isMobile ? '15px 20px 60px 20px' : '18px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 10,
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
        background: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      {/* ===== Baris Atas ===== */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* Kiri: Nama dan TTL */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.4 }}>
          <span
            style={{
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              fontWeight: 600,
            }}
          >
            Sukrian Efendi S.kom
          </span>
          <span
            style={{
              fontSize: isMobile ? '0.9rem' : '0.95rem',
              opacity: 0.85,
            }}
          >
            Jakarta, 31 Juli 2004
          </span>
        </div>

        {/* Kanan: Menu Navigasi / Hamburger */}
        {!isMobile ? (
          <nav
            style={{
              display: 'flex',
              gap: '32px',
              fontSize: '1rem',
              fontWeight: 500,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#4b8bff')}
                onMouseLeave={(e) => (e.target.style.color = '#fff')}
              >
                {item.name}
              </a>
            ))}
          </nav>
        ) : (
          <div
            style={{
              zIndex: 15,
              cursor: 'pointer',
              padding: '5px',
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              // Ikon X (close)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18M6 6l12 12" stroke="#4b8bff" strokeWidth="2" />
              </svg>
            ) : (
              // Ikon hamburger
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* ===== Logo Tengah Bawah Header ===== */}
      {isMobile && (
        <div
          style={{
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src={logoRian}
            alt="Logo Rian"
            style={{
              height: '55px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 6px rgba(75,139,255,0.6))',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, filter 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1) rotate(3deg)';
              e.target.style.filter = 'drop-shadow(0 0 12px rgba(75,139,255,0.9))';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) rotate(0deg)';
              e.target.style.filter = 'drop-shadow(0 0 6px rgba(75,139,255,0.6))';
            }}
          />
        </div>
      )}

      {/* ===== Dropdown Menu ===== */}
      {menuOpen && isMobile && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100%)',
            left: 0,
            width: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            padding: '20px 0',
            zIndex: 9,
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '1.1rem',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#4b8bff')}
              onMouseLeave={(e) => (e.target.style.color = '#fff')}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
