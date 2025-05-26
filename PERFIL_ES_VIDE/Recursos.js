document.querySelectorAll('.btn-enroll').forEach(button => {
  button.addEventListener('click', () => {
    button.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.1)' },
      { transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-in-out'
    });

    setTimeout(() => {
      alert('Estamos trabajando en ello');
    }, 300);
  });
});

const sparkleContainer = document.getElementById('sparkle-container');

function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');

  const size = Math.random() * 4 + 2; 
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;

  sparkleContainer.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 600); 
}

document.addEventListener('mousemove', (e) => {
  createSparkle(e.clientX, e.clientY);
});
