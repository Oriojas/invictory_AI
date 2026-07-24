import React, { useEffect, useRef } from 'react';

export default function GridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configuración del grid (reducido al 40% del tamaño original: 36px * 0.4 = ~14px)
    const spacing = 14; // Distancia entre líneas de la cuadrícula
    const radiusOfInfluence = 180; // Radio de deformación del "agujero negro"
    const maxPullStrength = 60; // Intensidad de la atracción hacia el centro del puntero

    // Posición del ratón (por defecto fuera de la pantalla)
    let mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    handleResize();

    // Render loop
    const render = () => {
      // Suavizar movimiento del ratón (efecto inercia/física)
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Deformador de puntos según la posición del cursor
      const getDeformedPoint = (px, py) => {
        const dx = mouse.x - px;
        const dy = mouse.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radiusOfInfluence && dist > 0) {
          // Factor de atracción no lineal (física de lente gravitacional / agujero negro)
          const normDist = dist / radiusOfInfluence;
          const pullFactor = Math.pow(1 - normDist, 2) * maxPullStrength;
          
          const angle = Math.atan2(dy, dx);
          return {
            x: px + Math.cos(angle) * pullFactor,
            y: py + Math.sin(angle) * pullFactor,
            intensity: 1 - normDist
          };
        }

        return { x: px, y: py, intensity: 0 };
      };

      ctx.lineWidth = 1.2;

      // 1. Dibujar líneas verticales
      for (let x = 0; x <= width + spacing; x += spacing) {
        ctx.beginPath();
        let isFirst = true;
        
        for (let y = 0; y <= height + spacing; y += 12) {
          const pt = getDeformedPoint(x, y);
          
          if (isFirst) {
            ctx.moveTo(pt.x, pt.y);
            isFirst = false;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        
        // Estilo de línea sobrio pero visible según DESIGN.md
        ctx.strokeStyle = 'rgba(0, 103, 177, 0.22)'; // Azul corporativo visible
        ctx.stroke();
      }

      // 2. Dibujar líneas horizontales
      for (let y = 0; y <= height + spacing; y += spacing) {
        ctx.beginPath();
        let isFirst = true;

        for (let x = 0; x <= width + spacing; x += 12) {
          const pt = getDeformedPoint(x, y);

          if (isFirst) {
            ctx.moveTo(pt.x, pt.y);
            isFirst = false;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        ctx.strokeStyle = 'rgba(0, 103, 177, 0.22)';
        ctx.stroke();
      }

      // 3. Dibujar brillo gravitacional en el centro del agujero negro
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, radiusOfInfluence
        );
        gradient.addColorStop(0, 'rgba(0, 103, 177, 0.25)');
        gradient.addColorStop(0.5, 'rgba(253, 208, 0, 0.12)'); // Destello de Amarillo Colsubsidio
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');


        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, radiusOfInfluence, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
