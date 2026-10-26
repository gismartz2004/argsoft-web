// Next-Level Cinematic Neural Network Background with Three.js
function iniciarFondo3D() {
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

  // Neural Network Configuration
  const group = new THREE.Group();
  scene.add(group);

  const particlesCount = 250;
  const maxDistance = 2.5;
  const segments = particlesCount * particlesCount;

  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const particleData = [];

  const pMaterial = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.06,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: true
  });

  const particles = new THREE.BufferGeometry();

  for (let i = 0; i < particlesCount; i++) {
    const x = Math.random() * 20 - 10;
    const y = Math.random() * 20 - 10;
    const z = Math.random() * 20 - 10;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    particleData.push({
      velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2).multiplyScalar(0.01),
      numConnections: 0
    });
  }

  particles.setDrawRange(0, particlesCount);
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));

  const pointCloud = new THREE.Points(particles, pMaterial);
  group.add(pointCloud);

  // Lines Geometry
  const linePositions = new Float32Array(segments * 3);
  const lineColors = new Float32Array(segments * 3);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.3
  });

  const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  group.add(linesMesh);

  camera.position.z = 15;

  // Scroll Integration
  let scrollPercent = 0;
  window.addEventListener('scroll', () => {
    const h = document.documentElement,
      b = document.body,
      st = 'scrollTop',
      sh = 'scrollHeight';
    scrollPercent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
  });

  // Animation Loop
  const animate = () => {
    requestAnimationFrame(animate);

    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    for (let i = 0; i < particlesCount; i++)
      particleData[i].numConnections = 0;

    for (let i = 0; i < particlesCount; i++) {
      const p1 = particleData[i];

      positions[i * 3] += p1.velocity.x;
      positions[i * 3 + 1] += p1.velocity.y;
      positions[i * 3 + 2] += p1.velocity.z;

      if (positions[i * 3 + 1] < -10 || positions[i * 3 + 1] > 10) p1.velocity.y = -p1.velocity.y;
      if (positions[i * 3] < -10 || positions[i * 3] > 10) p1.velocity.x = -p1.velocity.x;
      if (positions[i * 3 + 2] < -10 || positions[i * 3 + 2] > 10) p1.velocity.z = -p1.velocity.z;

      // Check connections
      for (let j = i + 1; j < particlesCount; j++) {
        const p2 = particleData[j];
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          p1.numConnections++;
          p2.numConnections++;

          const alpha = 1.0 - dist / maxDistance;

          linePositions[vertexpos++] = positions[i * 3];
          linePositions[vertexpos++] = positions[i * 3 + 1];
          linePositions[vertexpos++] = positions[i * 3 + 2];

          linePositions[vertexpos++] = positions[j * 3];
          linePositions[vertexpos++] = positions[j * 3 + 1];
          linePositions[vertexpos++] = positions[j * 3 + 2];

          lineColors[colorpos++] = 0;
          lineColors[colorpos++] = 0.5 + (alpha * 0.5);
          lineColors[colorpos++] = 0.8 + (alpha * 0.2);

          lineColors[colorpos++] = 0;
          lineColors[colorpos++] = 0.5 + (alpha * 0.5);
          lineColors[colorpos++] = 0.8 + (alpha * 0.2);

          numConnected++;
        }
      }
    }

    linesMesh.geometry.setDrawRange(0, numConnected * 2);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;
    pointCloud.geometry.attributes.position.needsUpdate = true;

    // Cinematic progressive movement
    group.rotation.y += 0.001;

    // Fly-through effect based on scroll
    camera.position.z = 15 - (scrollPercent * 12); // Acercarse al hacer scroll
    camera.rotation.y = scrollPercent * 0.5;
    camera.position.y = -scrollPercent * 5;

    renderer.render(scene, camera);
  };

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

// Arranque: funciona tanto si el script se carga en el head como si se
// inyecta bajo demanda despues de DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarFondo3D);
} else {
  iniciarFondo3D();
}
