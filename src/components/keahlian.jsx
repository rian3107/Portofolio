
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "./Header";

import reactLogo from "../assets/react.png";
import nextLogo from "../assets/next.jpg";
import nodeLogo from "../assets/node.jpg";
import tailwindLogo from "../assets/tailwindcss.jpg";
import javascriptLogo from "../assets/javascript.png";
import phpLogo from "../assets/php.png";
import mysqlLogo from "../assets/mysql.png";
import uiuxLogo from "../assets/uiux.jpg";

import "./Keahlian.css";

const skills = [
  {
    name: "React.js",
    category: "Frontend Development",
    description:
      "Membangun antarmuka web yang interaktif dan berbasis komponen.",
    level: "Dasar",
    logo: reactLogo,
  },
  {
    name: "Next.js",
    category: "Frontend Framework",
    description:
      "Mengembangkan aplikasi web dengan struktur dan routing terorganisir.",
    level: "Dasar",
    logo: nextLogo,
  },
  {
    name: "Node.js",
    category: "Backend Development",
    description:
      "Mengenal lingkungan JavaScript untuk kebutuhan sisi server.",
    level: "Dasar",
    logo: nodeLogo,
  },
  {
    name: "Tailwind CSS",
    category: "Styling",
    description:
      "Menyusun tampilan responsif menggunakan utility-first CSS.",
    level: "Dasar",
    logo: tailwindLogo,
  },
  {
    name: "JavaScript",
    category: "Programming Language",
    description:
      "Membuat interaksi dan perilaku dinamis pada halaman web.",
    level: "Dasar",
    logo: javascriptLogo,
  },
  {
    name: "PHP",
    category: "Backend Development",
    description:
      "Mengenal pemrograman sisi server untuk aplikasi web.",
    level: "Dasar",
    logo: phpLogo,
  },
  {
    name: "MySQL",
    category: "Database",
    description:
      "Mengenal pengelolaan data menggunakan basis data relasional.",
    level: "Dasar",
    logo: mysqlLogo,
  },
  {
    name: "UI/UX Design",
    category: "Design",
    description:
      "Memahami dasar desain antarmuka dan pengalaman pengguna.",
    level: "Dasar",
    logo: uiuxLogo,
  },
];

export default function Keahlian() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame;
    let width = 0;
    let height = 0;
    let stars = [];
    let meteors = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from(
        { length: Math.floor((width * height) / 7000) },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.3 + 0.2,
          alpha: Math.random() * 0.65 + 0.2,
          twinkle: Math.random() * 0.018 + 0.003,
        })
      );
    };

    const addMeteor = () => {
      if (Math.random() < 0.012) {
        meteors.push({
          x: Math.random() * width * 1.1,
          y: -30,
          length: Math.random() * 100 + 45,
          speed: Math.random() * 4 + 3,
          opacity: Math.random() * 0.45 + 0.2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha +=
          (Math.random() - 0.5) * star.twinkle;

        star.alpha = Math.max(
          0.12,
          Math.min(0.9, star.alpha)
        );

        ctx.beginPath();
        ctx.arc(
          star.x,
          star.y,
          star.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(200, 218, 255, ${star.alpha})`;
        ctx.fill();
      });

      addMeteor();

      meteors = meteors.filter(
        (meteor) =>
          meteor.x < width + 150 &&
          meteor.y < height + 150
      );

      meteors.forEach((meteor) => {
        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x - meteor.length,
          meteor.y + meteor.length
        );

        gradient.addColorStop(
          0,
          `rgba(160, 190, 255, ${meteor.opacity})`
        );

        gradient.addColorStop(
          1,
          "rgba(160, 190, 255, 0)"
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.3;

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(
          meteor.x - meteor.length,
          meteor.y + meteor.length
        );
        ctx.stroke();

        meteor.x += meteor.speed;
        meteor.y += meteor.speed;
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="skills-page">
      <canvas
        className="skills-stars"
        ref={canvasRef}
        aria-hidden="true"
      />

      <div
        className="skills-glow skills-glow-one"
        aria-hidden="true"
      />

      <div
        className="skills-glow skills-glow-two"
        aria-hidden="true"
      />

      <Header />

      {/* HERO */}
      <section className="skills-hero">
        <motion.div
          className="skills-hero-inner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <p className="skills-eyebrow">
            <span />
            SKILLS & TECHNOLOGIES
          </p>

          <h1>
            Tools I use.
            <br />
            <span>Skills I build.</span>
          </h1>

          <p className="skills-intro">
            Teknologi yang sedang saya pelajari dan gunakan
            untuk membangun pengalaman digital yang fungsional,
            menarik, dan terus berkembang.
          </p>

          <a className="skills-scroll" href="#skill-list">
            <span className="skills-scroll-line" />
            Jelajahi keahlian
          </a>
        </motion.div>

        <div
          className="skills-hero-index"
          aria-hidden="true"
        >
          <span>01</span>
          <span className="skills-index-rule" />
          <span>08</span>
        </div>
      </section>

      {/* DAFTAR KEAHLIAN */}
      <section
        className="skills-list-section"
        id="skill-list"
      >
        <div className="skills-section-heading">
          <div>
            <p className="skills-eyebrow">
              CURRENT TOOLKIT
            </p>

            <h2>
              Yang sedang saya <span>kuasai.</span>
            </h2>
          </div>

          <p className="skills-section-note">
            Fondasi yang terus diasah melalui latihan,
            eksplorasi, dan proyek.
          </p>
        </div>

        <div className="skills-list">
          {skills.map((skill, index) => (
            <motion.article
              className="skill-row"
              key={skill.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.18,
              }}
              transition={{
                duration: 0.45,
                delay: (index % 4) * 0.06,
              }}
            >
              <span className="skill-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="skill-logo-wrap">
                <img
                  src={skill.logo}
                  alt={`${skill.name} logo`}
                  className="skill-logo"
                />
              </div>

              <div className="skill-copy">
                <p className="skill-category">
                  {skill.category}
                </p>

                <h3>{skill.name}</h3>

                <p className="skill-description">
                  {skill.description}
                </p>
              </div>

              <span className="skill-level">
                <i />
                {skill.level}
              </span>

              <span
                className="skill-arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </motion.article>
          ))}
        </div>
      </section>

      {/* PENUTUP */}
      <section className="skills-note-section">
        <p className="skills-eyebrow">
          MY APPROACH
        </p>

        <h2>
          Belajar. Mencoba. <span>Bertumbuh.</span>
        </h2>

        <p>
          Bagi saya, keahlian bukan sekadar daftar teknologi.
          Setiap hal baru adalah kesempatan untuk bereksperimen,
          memecahkan masalah, dan menciptakan karya yang lebih baik.
        </p>

        <div className="skills-note-line">
          <span />
        </div>
      </section>

      <footer className="skills-footer">
        <span>PORTFOLIO / KEAHLIAN</span>
        <span>Always learning, always building.</span>
      </footer>
    </main>
  );
}
