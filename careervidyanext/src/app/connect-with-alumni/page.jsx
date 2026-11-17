// app/connect-with-alumni/page.jsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "../layout/Header.jsx";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (!BASE_URL) return "";
  return `${BASE_URL}/${path.replace(/^\//, "")}`;
};

/* ============================================================
   ULTRA NETWORK BACKGROUND — Person Icons
   ============================================================ */
function UltraNetworkBackground({
  color = "200, 200, 200",
  lineColor = "200, 200, 200",
  density = 90,
  maxLinkDist = 130,
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext("2d");
    let animationId, width = 0, height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let mouse = { x: -1000, y: -1000 };

    const drawPerson = (x, y, size, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(${color}, ${opacity})`;
      
      const headRadius = size * 0.35;
      const bodyWidth = size * 0.8;
      
      ctx.beginPath();
      ctx.arc(0, -size * 0.2, headRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(-bodyWidth / 2, size * 0.5);
      ctx.quadraticCurveTo(-bodyWidth / 2, -size * 0.1, 0, -size * 0.1);
      ctx.quadraticCurveTo(bodyWidth / 2, -size * 0.1, bodyWidth / 2, size * 0.5);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(25, Math.floor((width * height) / (density * 150)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseSize: Math.random() * 8 + 12,
        size: Math.random() * 8 + 12,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxLinkDist) {
            const alpha = (1 - dist / maxLinkDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const md = Math.hypot(dx, dy);
        
        let currentSize = node.baseSize;
        let alpha = 0.5;

        if (md < 150) {
          currentSize = node.baseSize + (1 - md / 150) * 5;
          alpha = 0.8;
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${(1 - md / 150) * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        const pulse = Math.sin(time * 2 + node.phase) * 0.1 + 0.9;
        node.size = currentSize * pulse;

        drawPerson(node.x, node.y, node.size, alpha);
      }

      animationId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    resize();
    draw();
    
    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("mousemove", onMouseMove);
    canvas.parentElement?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMouseMove);
      canvas.parentElement?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [color, lineColor, density, maxLinkDist]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

/* ============================================================
   FLOATING ORBS
   ============================================================ */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />
    </div>
  );
}

/* ============================================================
   SPARKLE FIELD
   ============================================================ */
function SparkleField() {
  const sparkles = Array.from({ length: 40 }, (_, i) => ({
    left: `${(i * 17 + 3) % 100}%`,
    top: `${(i * 23 + 7) % 100}%`,
    delay: `${(i % 10) * 0.3}s`,
    size: `${2 + (i % 3)}px`,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   MAGNETIC CURSOR GLOW
   ============================================================ */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] z-0 rounded-full mix-blend-multiply"
      style={{
        background:
          "radial-gradient(circle, rgba(236,116,37,0.12), rgba(37,99,235,0.05) 40%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

/* ============================================================
   SCROLL REVEAL HOOK
   ============================================================ */
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
function Counter({ end, duration = 2000, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(end * eased));
            if (p < 1) requestAnimationFrame(tick);
            else setVal(end);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ============================================================
   TYPEWRITER
   ============================================================ */
function Typewriter({ words, speed = 100, pause = 1800 }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timeout;
    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      timeout = setTimeout(() => {
        setText((t) =>
          deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1)
        );
      }, deleting ? speed / 2 : speed);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, speed, pause]);

  return (
    <span className="relative">
      <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#ec7425,#f59e0b,#ec7425)] bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
        {text}
      </span>
      <span className="typewriter-caret">|</span>
    </span>
  );
}

/* ============================================================
   TILT CARD
   ============================================================ */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1000px) rotateY(0) rotateX(0) translateY(0)";
  }, []);
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function ConnectWithAlumniPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/v1/ourstudent");
        if (res.data.success && Array.isArray(res.data.data)) {
          setStudents(res.data.data);
        } else setError(true);
      } catch (err) {
        console.error("Alumni fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const alumni = students
    .map((s) => ({
      _id: s._id,
      name: (s.name || "").trim() || "Alumni",
      company: (s.company || "").trim(),
      photo: s.image ? getFullUrl(s.image) : "",
      logo: s.companyLogo ? getFullUrl(s.companyLogo) : "",
    }))
    .filter((a) => a.photo || a.logo);

  // Split alumni for 2 rows
  const half = Math.ceil(alumni.length / 2);
  const row1 = alumni.slice(0, half);
  const row2 = alumni.slice(half);

  const stats = [
    { value: 10000, suffix: "+", label: "Alumni" },
    { value: 500, suffix: "+", label: "Hiring Partners" },
    { value: 95, suffix: "%", label: "Placement Rate" },
    { value: 40, suffix: "+", label: "Countries" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      <Header />
      {/* CSS GLOBAL STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.7s ease-out both; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }

        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 40px) scale(0.95); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-60px, 50px) scale(1.15); }
        }
        @keyframes floatBlob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 30px) scale(0.9); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .typewriter-caret {
          animation: blink 1s steps(1) infinite;
          color: #ec7425;
          font-weight: 300;
        }

        /* ---- Alumni Card Floating Animation ---- */
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .alumni-card {
          animation: cardFloat 4s ease-in-out infinite;
          will-change: transform;
        }
        .alumni-card:hover {
          animation-play-state: paused;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(236,116,37,0.5), transparent 70%);
          top: -100px; left: -100px;
          animation: floatBlob1 20s ease-in-out infinite;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(37,99,235,0.35), transparent 70%);
          top: 40%; right: -150px;
          animation: floatBlob2 25s ease-in-out infinite;
        }
        .orb-3 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%);
          bottom: 10%; left: 10%;
          animation: floatBlob3 18s ease-in-out infinite;
        }
        .orb-4 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%);
          top: 70%; right: 20%;
          animation: floatBlob1 22s ease-in-out infinite reverse;
        }
        .orb-5 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%);
          top: 20%; left: 40%;
          animation: floatBlob2 28s ease-in-out infinite;
        }

        .sparkle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(236,116,37,1), rgba(236,116,37,0.2));
          box-shadow: 0 0 8px rgba(236,116,37,0.6);
          animation: twinkle 3s ease-in-out infinite;
        }

        .grid-pattern {
          background-image:
            linear-gradient(rgba(236,116,37,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(236,116,37,0.5) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
        }

        /* Hide scrollbar for swiper */
        .swiper-wrapper { padding-bottom: 20px; }
        
        .swiper-pagination-bullet {
          background-color: #cbd5e1 !important;
          opacity: 1 !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background-color: #ec7425 !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}} />

      {/* 🌌 Global decorative layers & Full Page Background */}
      <FloatingOrbs />
      <SparkleField />
      <CursorGlow />
      
      <UltraNetworkBackground
        className="fixed inset-0 z-0 opacity-60"
        color="180, 180, 180"
        lineColor="180, 180, 180"
        maxLinkDist={160}
      />

      {/* ================= HERO ================= */}
      <section className="relative z-10 pt-24 pb-20 overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-bold text-white shadow-lg animate-[floatY_3s_ease-in-out_infinite]"
            style={{ background: "linear-gradient(180deg, #ec7425, #c15304)" }}>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            #VidyaHaiTohSuccessHai
          </span>

          <h1 className="mt-6 text-4xl md:text-4xl lg:text-4xl font-extrabold tracking-tight leading-tight text-slate-900">
            Connect With Our{" "}
            <br className="hidden md:block" />
            <Typewriter
              words={["Alumni Network", "Success Stories", "Mentors", "Future Leaders"]}
              speed={90}
            />
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-slate-600 text-base md:text-lg animate-fade-up font-medium">
            Join a thriving community of{" "}
            <span className="font-bold text-orange-600">10,000+ graduates</span> working at
            top companies. Get mentored, network, and grow your career with
            people who've walked the same path.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link href="#alumni"
              className="group relative px-8 py-3.5 rounded-full font-bold text-white shadow-xl transition-transform hover:scale-105 overflow-hidden">
              <span className="absolute inset-0 bg-[linear-gradient(180deg,#ec7425,#c15304)]" />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Meet Our Alumni →</span>
            </Link>
            <Link href="#join"
              className="px-8 py-3.5 rounded-full font-bold text-slate-800 border-2 border-slate-300 bg-white/80 backdrop-blur hover:bg-slate-100 hover:border-orange-400 transition-all">
              Join the Network
            </Link>
          </div>

          {/* Stats with counters */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 120}>
                <TiltCard className="rounded-2xl py-6 px-3 bg-white/80 backdrop-blur border border-slate-200 shadow-lg hover:shadow-2xl hover:border-orange-300 transition-all">
                  <div className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-[linear-gradient(180deg,#ec7425,#c15304)]">
                    <Counter end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs md:text-sm text-slate-500 mt-1 font-bold">
                    {s.label}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ================= WHY CONNECT ================= */}
      <section className="relative z-10 py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Why Connect With Alumni?
              </h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto font-medium">
                Your alumni network is one of the strongest assets you'll carry after graduation.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🤝", title: "Mentorship", desc: "Get 1-on-1 guidance from alumni working at top companies in your field.", color: "from-orange-400 to-red-400" },
              { icon: "💼", title: "Job Referrals", desc: "Access referral opportunities from 500+ hiring partners across industries.", color: "from-blue-400 to-purple-400" },
              { icon: "🚀", title: "Career Growth", desc: "Learn from real career journeys and accelerate your professional path.", color: "from-emerald-400 to-teal-400" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 150}>
                <TiltCard>
                  <div className="group relative rounded-2xl p-7 bg-white/90 backdrop-blur border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 h-full overflow-hidden">
                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
                    <div className="text-4xl mb-1 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 inline-block">
                      {item.icon}
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                    <div className={`mt-5 h-1 w-12 rounded-full bg-gradient-to-r ${item.color} group-hover:w-24 transition-all duration-500`} />
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

  
{/* ================= FEATURED ALUMNI SUCCESS WALL ================= */}
{alumni.length > 0 && (
  <section
    id="alumni"
    className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white"
  >
    {/* Background Decorations */}
    <div className="absolute top-20 -left-32 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-10 -right-32 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 max-w-[1300px] mx-auto px-4">

      {/* Heading */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Our Alumni Network
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Dreams Turned Into
            <span className="block mt-2 bg-gradient-to-r from-blue-700 via-violet-600 to-orange-500 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>

          <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed">
            Meet the talented professionals who transformed their
            ambitions into achievements with CareerVidya.
          </p>
        </div>
      </Reveal>

      {/* Alumni Count */}
      <div className="flex justify-center mb-9">
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex -space-x-2">
            {alumni.slice(0, 4).map((s, i) => (
              <div
                key={s._id}
                className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center text-xs font-bold text-blue-800 overflow-hidden"
              >
                {s.photo ? (
                  <img
                    src={s.photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  s.name?.charAt(0)
                )}
              </div>
            ))}
          </div>
          <div>
            <p className="text-lg font-extrabold text-slate-900 leading-none">
              {alumni.length}+
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Featured success stories
            </p>
          </div>
        </div>
      </div>

      {/* TWO ROW ALUMNI GRID */}
      <div className="relative">

        {/* Top Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

          {alumni.filter((_, i) => i % 2 === 0).map((s, i) => (
            <div
              key={s._id}
              className="alumni-card group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-shadow duration-500"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {/* Top Accent */}
              <div className="h-1 bg-gradient-to-r from-blue-600 via-violet-500 to-orange-400" />

              {/* Alumni Image */}
              <div className="relative h-36 sm:h-44 md:h-52 bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-3 overflow-hidden">

                <div className="absolute w-32 h-32 rounded-full bg-blue-200/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />

                {s.photo ? (
                  <img
                    src={s.photo}
                    alt={s.name}
                    loading="lazy"
                    className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="relative z-10 w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
                    {s.name?.charAt(0)}
                  </div>
                )}

                <span className="absolute top-3 left-3 text-[9px] font-bold tracking-wider uppercase bg-white/90 text-blue-700 px-2 py-1 rounded-full shadow-sm">
                  Alumni
                </span>

                <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2l2.8 6.2L21 11l-6.2 2.8L12 20l-2.8-6.2L3 11l6.2-2.8L12 2z" />
                  </svg>
                </div>
              </div>

              {/* Details */}
              <div className="p-3 sm:p-4">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate group-hover:text-blue-700 transition-colors">
                  {s.name}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Successfully placed at
                </p>

                <div className="mt-3 flex items-center gap-2 min-w-0">
                  {s.logo && (
                    <div className="w-9 h-9 flex-shrink-0 rounded-lg border border-slate-100 bg-white p-1 flex items-center justify-center">
                      <Image
                        src={s.logo}
                        alt={s.company || s.name}
                        width={32}
                        height={32}
                        className="object-contain max-w-full max-h-full"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-orange-600 truncate">
                      {s.company || "Placed Graduate"}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                      Career Achievement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Middle Divider */}
        <div className="flex items-center gap-4 my-7">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-400">
            More Success Stories
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

          {alumni.filter((_, i) => i % 2 !== 0).map((s, i) => (
            <div
              key={s._id}
              className="alumni-card group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-shadow duration-500"
              style={{ animationDelay: `${i * 0.4 + 0.2}s` }}
            >
              <div className="h-1 bg-gradient-to-r from-orange-400 via-violet-500 to-blue-600" />

              <div className="relative h-36 sm:h-44 md:h-52 bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-3 overflow-hidden">

                <div className="absolute w-32 h-32 rounded-full bg-orange-200/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />

                {s.photo ? (
                  <img
                    src={s.photo}
                    alt={s.name}
                    loading="lazy"
                    className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="relative z-10 w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-700">
                    {s.name?.charAt(0)}
                  </div>
                )}

                <span className="absolute top-3 left-3 text-[9px] font-bold tracking-wider uppercase bg-white/90 text-orange-600 px-2 py-1 rounded-full shadow-sm">
                  Alumni
                </span>

                <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2l2.8 6.2L21 11l-6.2 2.8L12 20l-2.8-6.2L3 11l6.2-2.8L12 2z" />
                  </svg>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate group-hover:text-orange-600 transition-colors">
                  {s.name}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Successfully placed at
                </p>

                <div className="mt-3 flex items-center gap-2 min-w-0">
                  {s.logo && (
                    <div className="w-9 h-9 flex-shrink-0 rounded-lg border border-slate-100 bg-white p-1 flex items-center justify-center">
                      <Image
                        src={s.logo}
                        alt={s.company || s.name}
                        width={32}
                        height={32}
                        className="object-contain max-w-full max-h-full"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-orange-600 truncate">
                      {s.company || "Placed Graduate"}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                      Career Achievement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Message */}
      <div className="text-center mt-12">
        <p className="text-sm text-slate-500">
          Your success story could be next.
          <span className="font-bold text-blue-700 ml-1">
            Start your journey with CareerVidya.
          </span>
        </p>
      </div>

    </div>
  </section>
)}


      {/* ================= JOIN CTA ================= */}
      <section id="join" className="relative z-10 pb-24 pt-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <Reveal>
            <div className="relative rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-2xl border border-orange-200 bg-white/70 backdrop-blur-md group">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(236,116,37,0.12),rgba(37,99,235,0.12),rgba(236,116,37,0.12))] bg-[length:200%_200%] animate-[gradientShift_8s_ease_infinite]" />
              
              <div className="absolute inset-0 pointer-events-none">
                {["🎓", "🚀", "💼", "🤝", "⭐", "🌟"].map((e, i) => (
                  <span key={i} className="absolute text-2xl opacity-30"
                    style={{
                      left: `${10 + i * 15}%`,
                      top: `${20 + (i % 3) * 25}%`,
                      animation: `floatY ${3 + (i % 3)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.4}s`,
                    }}>
                    {e}
                  </span>
                ))}
              </div>

              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
                  Ready to{" "}
                  <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#ec7425,#2563eb)]">
                    Reconnect?
                  </span>
                </h2>
                <p className="mt-4 text-slate-600 max-w-xl mx-auto font-medium">
                  Join our alumni community, share your journey, and inspire the next generation of graduates.
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/signup"
                    className="group relative px-8 py-3.5 rounded-full font-bold text-white shadow-xl transition-transform hover:scale-105 overflow-hidden">
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,#ec7425,#c15304)]" />
                    <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">Connect with Alumni</span>
                  </Link>
                  <Link href="/signup"
                    className="px-8 py-3.5 rounded-full font-bold text-slate-800 border-2 border-slate-300 bg-white/80 hover:bg-slate-100 hover:border-orange-400 transition-all">
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}