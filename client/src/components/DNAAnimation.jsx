import { useEffect, useRef } from 'react';

const DNAAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 500;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Plant Cell & Vascular Network parameters
    const cellsCount = 18;
    const cells = [];

    // Initialize cells
    for (let i = 0; i < cellsCount; i++) {
      cells.push({
        x: Math.random() * 500 + 100, // cluster near center
        y: Math.random() * 400 + 50,
        radius: Math.random() * 15 + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI,
        chloroplasts: Array.from({ length: 4 }, () => ({
          angle: Math.random() * Math.PI * 2,
          distance: Math.random() * 6 + 2,
          speed: (Math.random() - 0.5) * 0.02,
        })),
      });
    }

    let frame = 0;

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;

      // Draw connections first (Vascular networks)
      ctx.lineWidth = 1.0;
      for (let i = 0; i < cellsCount; i++) {
        const cellA = cells[i];
        
        // Let them float relative to canvas size
        if (cellA.x < 0 || cellA.x > width) cellA.vx *= -1;
        if (cellA.y < 0 || cellA.y > height) cellA.vy *= -1;
        
        cellA.x += cellA.vx;
        cellA.y += cellA.vy;

        for (let j = i + 1; j < cellsCount; j++) {
          const cellB = cells[j];
          const dist = Math.hypot(cellA.x - cellB.x, cellA.y - cellB.y);
          
          if (dist < 150) {
            // Draw connection line
            const alpha = (1 - dist / 150) * 0.15;
            ctx.strokeStyle = `rgba(76, 175, 80, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(cellA.x, cellA.y);
            ctx.lineTo(cellB.x, cellB.y);
            ctx.stroke();
          }
        }
      }

      // Draw Plant Cells (green circles with walls and chloroplast nodes)
      for (let i = 0; i < cellsCount; i++) {
        const cell = cells[i];
        
        const pulse = 1 + Math.sin(frame * cell.pulseSpeed + cell.pulseOffset) * 0.08;
        const currentRadius = cell.radius * pulse;

        // Draw Cell Wall (hexagonal shape or clean circle with double layers)
        ctx.strokeStyle = 'rgba(46, 125, 50, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, currentRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner membrane
        ctx.strokeStyle = 'rgba(76, 175, 80, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, currentRadius - 3, 0, Math.PI * 2);
        ctx.stroke();

        // Cell cytoplasm fill
        ctx.fillStyle = 'rgba(76, 175, 80, 0.03)';
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, currentRadius - 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw Nucleus core (earthy gold/amber glow)
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#d97706';
        ctx.shadowColor = '#d97706';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw moving chloroplasts inside cytoplasm
        cell.chloroplasts.forEach((ch) => {
          ch.angle += ch.speed;
          const cx = cell.x + Math.cos(ch.angle) * (currentRadius * 0.5);
          const cy = cell.y + Math.sin(ch.angle) * (currentRadius * 0.5);
          
          ctx.beginPath();
          ctx.arc(cx, cy, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#4caf50';
          ctx.fill();
        });
      }

      // Draw slow-moving environmental background particles (soil metagenomic nutrients)
      for (let j = 0; j < 8; j++) {
        const py = (height / 9) * (j + 1) + Math.cos(frame * 0.005 + j) * 15;
        const px = (width / 2) + Math.sin(frame * 0.004 + j) * (width * 0.35);
        
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 119, 6, 0.18)';
        ctx.fill();
      }

      frame++;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
};

export default DNAAnimation;
