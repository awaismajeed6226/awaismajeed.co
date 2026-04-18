(() => {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: 0,
    vy: 0,
    active: false,
    prevX: window.innerWidth / 2,
    prevY: window.innerHeight / 2
  };

  let particles = [];

  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.6 + 0.6
    };
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.max(65, Math.floor((canvas.width * canvas.height) / 28000));
    particles = Array.from({ length: count }, makeParticle);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance < 180) {
          const attract = (180 - distance) / 4500;
          p.vx += (dx / distance) * attract + pointer.vx * 0.0025;
          p.vy += (dy / distance) * attract + pointer.vy * 0.0025;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      p.vx *= 0.975;
      p.vy *= 0.975;

      if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

      p.x = Math.max(0, Math.min(canvas.width, p.x));
      p.y = Math.max(0, Math.min(canvas.height, p.y));

      ctx.beginPath();
      ctx.fillStyle = 'rgba(15, 40, 108, 0.55)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.strokeStyle = `rgba(15, 40, 108, ${(100 - d) / 760})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (event) => {
    pointer.prevX = pointer.x;
    pointer.prevY = pointer.y;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.vx = pointer.x - pointer.prevX;
    pointer.vy = pointer.y - pointer.prevY;
    pointer.active = true;
  });

  window.addEventListener('mouseleave', () => {
    pointer.active = false;
    pointer.vx = 0;
    pointer.vy = 0;
  });

  resize();
  animate();
})();
