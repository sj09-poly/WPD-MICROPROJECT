// Hamburger menu toggle
var hamburger = document.querySelector('.hamburger');
var navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function() {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    navLinks.classList.remove('open');
  });
});

// Highlight the current page link in navbar
var currentPage = window.location.pathname.split('/').pop() || 'home.html';
document.querySelectorAll('.nav-links a').forEach(function(link) {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// ── Dynamic Neural Network Background ──
(function() {
  var canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var PARTICLE_COUNT = 80;
  var CONNECTION_DIST = 140;
  var MOUSE_RADIUS = 200;
  var animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', function() {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Particle class
  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 2.5 + 1;
    // Blue-to-purple palette
    var hue = 220 + Math.random() * 50; // 220 (blue) to 270 (purple)
    this.color = 'hsla(' + hue + ', 70%, 60%, 0.7)';
    this.glowColor = 'hsla(' + hue + ', 80%, 65%, 0.3)';
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.01 + Math.random() * 0.02;
  }

  Particle.prototype.update = function() {
    this.pulsePhase += this.pulseSpeed;

    // Gentle mouse repulsion
    var dx = this.x - mouse.x;
    var dy = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_RADIUS && dist > 0) {
      var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.015;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    // Dampen
    this.vx *= 0.998;
    this.vy *= 0.998;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap edges
    if (this.x < -20) this.x = canvas.width + 20;
    if (this.x > canvas.width + 20) this.x = -20;
    if (this.y < -20) this.y = canvas.height + 20;
    if (this.y > canvas.height + 20) this.y = -20;
  };

  Particle.prototype.draw = function() {
    var pulse = 1 + Math.sin(this.pulsePhase) * 0.3;
    var r = this.radius * pulse;

    // Glow
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 3, 0, Math.PI * 2);
    ctx.fillStyle = this.glowColor;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  // Init particles
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          var opacity = (1 - dist / CONNECTION_DIST) * 0.25;

          // Brighter if near mouse
          var mx = (particles[i].x + particles[j].x) / 2;
          var my = (particles[i].y + particles[j].y) / 2;
          var mouseDist = Math.sqrt((mx - mouse.x) * (mx - mouse.x) + (my - mouse.y) * (my - mouse.y));
          if (mouseDist < MOUSE_RADIUS) {
            opacity += (1 - mouseDist / MOUSE_RADIUS) * 0.2;
          }

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(100, 130, 230, ' + opacity + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  // Floating gradient blobs
  var blobs = [
    { x: 0.2, y: 0.3, r: 300, color: 'rgba(100, 140, 255, 0.06)', speed: 0.0003, phase: 0 },
    { x: 0.7, y: 0.6, r: 350, color: 'rgba(160, 100, 255, 0.05)', speed: 0.0004, phase: 2 },
    { x: 0.5, y: 0.8, r: 250, color: 'rgba(80, 180, 255, 0.04)', speed: 0.0005, phase: 4 }
  ];

  function drawBlobs(time) {
    blobs.forEach(function(b) {
      var bx = (b.x + Math.sin(time * b.speed + b.phase) * 0.1) * canvas.width;
      var by = (b.y + Math.cos(time * b.speed * 0.7 + b.phase) * 0.1) * canvas.height;
      var gradient = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
      gradient.addColorStop(0, b.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(bx, by, b.r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gradient background
    var bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bg.addColorStop(0, '#eef2ff');
    bg.addColorStop(0.4, '#f5f7fb');
    bg.addColorStop(1, '#f0eaff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Floating blobs
    drawBlobs(time || 0);

    // Update and draw particles
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    drawConnections();
    for (var i = 0; i < particles.length; i++) {
      particles[i].draw();
    }

    animId = requestAnimationFrame(animate);
  }

  animate(0);

  // Pause when tab hidden for performance
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animate(0);
    }
  });
})();
