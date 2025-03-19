document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('theButton');
  const counter = document.getElementById('counter');
  const particles = document.getElementById('particles');
  let clickCount = 0;

  // Handle button click
  button.addEventListener('click', function (event) {
    // Increment click counter
    clickCount++;
    counter.textContent = clickCount;

    // Add a "pressed" effect
    button.classList.add('active:scale-95');
    setTimeout(() => button.classList.remove('active:scale-95'), 100);

    // Create particles
    createParticles(event);
  });

  // Create particles
  function createParticles(event) {
    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add(
        'absolute',
        'w-2',
        'h-2',
        'bg-white',
        'rounded-full',
        'opacity-80',
        'animate-float'
      );

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 10 + 5;
      const velocityX = Math.cos(angle) * velocity;
      const velocityY = Math.sin(angle) * velocity;

      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;

      particles.appendChild(particle);

      // Animate particle
      let posX = centerX;
      let posY = centerY;
      let opacity = 1;

      function animateParticle() {
        if (opacity <= 0) {
          particle.remove();
          return;
        }

        posX += velocityX;
        posY += velocityY;
        opacity -= 0.02;

        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;

        requestAnimationFrame(animateParticle);
      }

      requestAnimationFrame(animateParticle);
    }
  }
});