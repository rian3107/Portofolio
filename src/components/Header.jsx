
'use client';

import React, { useState, useEffect } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth <= 768;

      setIsMobile(mobile);

      if (!mobile) {
        setMenuOpen(false);
      }
    };

    checkScreen();

    window.addEventListener('resize', checkScreen);

    return () => {
      window.removeEventListener('resize', checkScreen);
    };
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    {
      name: 'Riwayat Pendidikan',
      href: '/riwayat-pendidikan',
    },
    { name: 'Keahlian', href: '/keahlian' },
    { name: 'Portofolio', href: '/portofolio' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const headerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '16px 22px' : '20px 6%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1000,
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',

    // Background header sepenuhnya transparan
    background: 'transparent',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    borderBottom: 'none',
    boxShadow: 'none',

    transition: 'none',
  };

  const topRowStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  };

  const nameContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.5,
    minWidth: 0,
  };

  const nameStyle = {
    fontSize: isMobile ? '1.2rem' : '1.45rem',
    fontWeight: 700,
    letterSpacing: '0.3px',
    color: '#ffffff',
    textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
  };

  const birthStyle = {
    fontSize: isMobile ? '0.78rem' : '0.9rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: '0.2px',
    textShadow: '0 1px 8px rgba(0, 0, 0, 0.3)',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(16px, 2.4vw, 34px)',
    fontSize: '0.94rem',
    fontWeight: 500,
    flexWrap: 'wrap',
  };

  const navLinkStyle = {
    position: 'relative',
    display: 'inline-block',
    padding: '8px 0',
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    textShadow: '0 1px 8px rgba(0, 0, 0, 0.25)',
    transition: 'color 0.25s ease',
  };

  const hamburgerStyle = {
    width: '44px',
    height: '44px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    background: 'transparent',
    color: '#ffffff',
    transition: 'all 0.25s ease',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <header style={headerStyle}>
      {/* Baris utama: nama dan navigasi */}
      <div style={topRowStyle}>
        {/* Nama dan tanggal lahir */}
        <div style={nameContainerStyle}>
          <span style={nameStyle}>Sukrian Efendi</span>

          <span style={birthStyle}>
            Jakarta, 31 Juli 2004
          </span>
        </div>

        {/* Navigasi desktop */}
        {!isMobile ? (
          <nav style={navStyle} aria-label="Navigasi utama">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#60a5fa';

                  const underline =
                    e.currentTarget.querySelector('.nav-underline');

                  if (underline) {
                    underline.style.transform = 'scaleX(1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    'rgba(255, 255, 255, 0.9)';

                  const underline =
                    e.currentTarget.querySelector('.nav-underline');

                  if (underline) {
                    underline.style.transform = 'scaleX(0)';
                  }
                }}
              >
                {item.name}

                <span
                  className="nav-underline"
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 2,
                    width: '100%',
                    height: '2px',
                    borderRadius: '10px',
                    background:
                      'linear-gradient(90deg, #60a5fa, #818cf8)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.25s ease',
                  }}
                />
              </a>
            ))}
          </nav>
        ) : (
          /* Hamburger menu mobile */
          <button
            type="button"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'rgba(96, 165, 250, 0)';

              e.currentTarget.style.borderColor =
                'rgba(96, 165, 250, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';

              e.currentTarget.style.borderColor =
                'rgba(255, 255, 255, 0.25)';
            }}
            style={hamburgerStyle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke={menuOpen ? '#ffffff' : '#ffffff'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: 'transform 0.25s ease',
                transform: menuOpen
                  ? 'rotate(90deg)'
                  : 'rotate(0deg)',
              }}
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown menu mobile */}
      {isMobile && (
        <div
          id="mobile-navigation"
          aria-hidden={!menuOpen}
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: '16px',
            right: '16px',
            width: 'auto',
            boxSizing: 'border-box',
            padding: menuOpen ? '10px' : '0 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: menuOpen ? '4px' : '0',

            // Dropdown tetap gelap agar tulisan mudah dibaca
            background:
              'linear-gradient(145deg, rgba(0, 0, 0, 0.97), rgba(0, 0, 0, 0.96))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',

            border: menuOpen
              ? '1px solid rgba(255, 255, 255, 0.13)'
              : '1px solid transparent',

            borderRadius: '18px',

            boxShadow: menuOpen
              ? '0 18px 45px rgba(0, 0, 0, 0.3)'
              : 'none',

            opacity: menuOpen ? 1 : 0,
            visibility: menuOpen ? 'visible' : 'hidden',

            transform: menuOpen
              ? 'translateY(0)'
              : 'translateY(-8px)',

            pointerEvents: menuOpen ? 'auto' : 'none',

            transition:
              'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease',

            zIndex: 1001,
          }}
        >
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'rgba(96, 165, 250, 0.12)';

                e.currentTarget.style.color = '#93c5fd';
                e.currentTarget.style.paddingLeft = '20px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.paddingLeft = '14px';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '46px',
                boxSizing: 'border-box',
                padding: '12px 14px',
                paddingLeft: '14px',
                borderRadius: '11px',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: 'none',
                background: 'transparent',

                transition:
                  'background 0.2s ease, color 0.2s ease, padding 0.2s ease',

                borderBottom:
                  index !== navItems.length - 1
                    ? '1px solid rgba(255, 255, 255, 0.045)'
                    : 'none',
              }}
            >
              {item.name}

              <span
                style={{
                  marginLeft: 'auto',
                  color: 'rgba(147, 197, 253, 0.8)',
                  fontSize: '1.15rem',
                }}
                aria-hidden="true"
              >
                ›
              </span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
}