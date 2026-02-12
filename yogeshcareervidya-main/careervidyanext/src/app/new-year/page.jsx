"use client";

import { useEffect, useRef } from "react";

export default function NewYearPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let particles = [];
    let stars = [];

    // ⭐ Stars
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5,
        o: Math.random()
      });
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 120;
        this.speed = Math.random() * 5 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 360},100%,60%)`;
      }
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life--;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.6;
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(5, 0, 25, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ⭐ Twinkling stars
      stars.forEach((s) => {
        s.o += (Math.random() - 0.5) * 0.05;
        ctx.fillStyle = `rgba(255,255,255,${Math.abs(s.o)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(animate);
    };

    setInterval(createFirework, 600);
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="canvas" />

      <div className="content">
        <h1>Happy New Year</h1>
        <h2>2026</h2>
      </div>

      {/* 🌟 ALL CSS IN ONE PLACE 🌟 */}
      <style jsx global>{`
        body {
          margin: 0;
          background: radial-gradient(circle, #1b003a, #050014);
          overflow: hidden;
        }

        .canvas {
          position: fixed;
          inset: 0;
          z-index: 1;
        }

        .content {
          position: fixed;
          bottom: 14%;
          width: 100%;
          text-align: center;
          z-index: 10;
          animation: float 4s ease-in-out infinite;
        }

        .content h1 {
          font-size: 3.8rem;
          color: gold;
          text-shadow: 0 0 15px gold, 0 0 40px orange;
          animation: glow 2s infinite alternate;
        }

        .content h2 {
          font-size: 5rem;
          color: #fff3b0;
          animation: zoom 3s infinite alternate;
          text-shadow: 0 0 25px gold;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 10px gold;
          }
          to {
            text-shadow: 0 0 35px orange;
          }
        }

        @keyframes zoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @media (max-width: 768px) {
          .content h1 {
            font-size: 2.5rem;
          }
          .content h2 {
            font-size: 3.5rem;
          }
        }
      `}</style>
    </>
  );
}
