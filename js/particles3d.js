// Neural Network Background with Three.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas3d');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Particles Configuration
  const particlesCount = 200;
  const particlesGeometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(particlesCount * 3);
  const velocityArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
    velocityArray[i] = (Math.random() - 0.5) * 0.01;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Fog for depth
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.1);

  camera.position.z = 5;

  // Mouse Interaction
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  const animate = () => {
    requestAnimationFrame(animate);

    const positions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;

      // Move particles
      positions[i3] += velocityArray[i3];
      positions[i3 + 1] += velocityArray[i3 + 1];
      positions[i3 + 2] += velocityArray[i3 + 2];

      // Containment
      if (Math.abs(positions[i3]) > 5) velocityArray[i3] *= -1;
      if (Math.abs(positions[i3 + 1]) > 5) velocityArray[i3 + 1] *= -1;
      if (Math.abs(positions[i3 + 2]) > 5) velocityArray[i3 + 2] *= -1;
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    // Smooth Mouse Rotation
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    particlesMesh.rotation.y = mouseX * 0.2;
    particlesMesh.rotation.x = -mouseY * 0.2;

    renderer.render(scene, camera);
  };

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  animate();
});