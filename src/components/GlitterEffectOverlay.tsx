import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'diamond' | 'sparkle';
}

const GLITTER_COLORS = [
  '#fbbf24', // Amber 400
  '#fef08a', // Yellow 200
  '#ffffff', // White
  '#fda4af', // Rose 300
  '#a7f3d0', // Emerald 200
  '#93c5fd', // Blue 300
];

export const GlitterEffectOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Spawn a particle helper
    const spawnParticle = (
      x: number,
      y: number,
      count = 1,
      isBurst = false
    ) => {
      for (let i = 0; i < count; i++) {
        let vx = 0;
        let vy = 0;
        let speed = 0;

        if (isBurst) {
          // Radial explosion
          const angle = Math.random() * Math.PI * 2;
          speed = Math.random() * 4 + 2; // 2 to 6
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed - 1.0; // slight upward force
        } else {
          // Gentle drift from mouse move
          vx = (Math.random() - 0.5) * 1.5;
          vy = (Math.random() - 0.5) * 1.5 - 0.5; // slight upward drift
        }

        const size = isBurst ? Math.random() * 6 + 3 : Math.random() * 4 + 2;
        const color = GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)];
        const alpha = 1.0;
        const decay = isBurst ? Math.random() * 0.015 + 0.01 : Math.random() * 0.025 + 0.015; // fade rate
        const gravity = isBurst ? 0.08 : 0.03;
        const rotation = Math.random() * Math.PI * 2;
        const rotationSpeed = (Math.random() - 0.5) * 0.2;
        
        const shapeRand = Math.random();
        let shape: 'circle' | 'diamond' | 'sparkle' = 'sparkle';
        if (shapeRand < 0.25) shape = 'circle';
        else if (shapeRand < 0.5) shape = 'diamond';

        particlesRef.current.push({
          x,
          y,
          vx,
          vy,
          size,
          color,
          alpha,
          decay,
          gravity,
          rotation,
          rotationSpeed,
          shape,
        });
      }
    };

    // Mouse Move event
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      
      if (lastMousePos.current) {
        const dist = Math.hypot(x - lastMousePos.current.x, y - lastMousePos.current.y);
        // Only spawn if mouse moved enough to create a trail
        if (dist > 6) {
          spawnParticle(x, y, 2, false);
          lastMousePos.current = { x, y };
        }
      } else {
        lastMousePos.current = { x, y };
      }
    };

    // Click event (Burst)
    const handleClick = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const target = e.target as HTMLElement;
      
      // Check if clicking a button or interactive element
      const isInteractive = target.closest('button, a, select, input, [role="button"], .cursor-pointer');
      
      if (isInteractive) {
        // Massive magical burst
        spawnParticle(x, y, 40, true);
      } else {
        // Smaller burst on general clicks
        spawnParticle(x, y, 8, true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Animation loop
    let animationId = 0;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98; // drag
        p.vy *= 0.98;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        
        // Shadow/glow for larger sparkles
        if (p.size > 4) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        }

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        if (p.shape === 'circle') {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        } else if (p.shape === 'diamond') {
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size, 0);
          ctx.closePath();
        } else {
          // Sparkle / 4-point star using quadratic curves
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(0, 0, p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.size);
          ctx.quadraticCurveTo(0, 0, -p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.size);
          ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
