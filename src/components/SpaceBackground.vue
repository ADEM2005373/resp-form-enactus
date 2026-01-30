<template>
  <div ref="container" class="space-background"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useSpace } from '../composables/useSpace';

const container = ref<HTMLDivElement | null>(null);
const { isWarping } = useSpace();

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let galaxyMaterial: THREE.PointsMaterial;
let galaxyGeo: THREE.BufferGeometry;
let animationId: number;

// Stars
let starGeo: THREE.BufferGeometry;
let starMaterial: THREE.PointsMaterial;
let starPoints: THREE.Points;

// Detect Mobile
const isMobile = window.innerWidth < 768;

const STAR_COUNT = isMobile ? 15 : 50;
const starVelocities: { x: number, y: number, z: number }[] = [];

// Parallax
const mouseX = ref(0);
const mouseY = ref(0);

const PARTICLE_COUNT = isMobile ? 2000 : 8000;
let time = 0;

const handleMouseMove = (event: MouseEvent) => {
  mouseX.value = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY.value = -(event.clientY / window.innerHeight) * 2 + 1;
};

// Internal Cloud Texture
const createCloudTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(0, 243, 255, 0.6)'); // Cyan glow
  gradient.addColorStop(0.5, 'rgba(0, 0, 64, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const initShootingStars = () => {
  const positions = [];
  const colors = [];
  
  for (let i = 0; i < STAR_COUNT; i++) {
    positions.push(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      Math.random() * 2000 - 1000
    );
    // White/Blueish for shooting stars
    colors.push(0.8, 0.9, 1);
    
    starVelocities.push({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random() * 20 + 20 // Fast z-movement
    });
  }

  starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  starMaterial = new THREE.PointsMaterial({
    size: 4,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  starPoints = new THREE.Points(starGeo, starMaterial);
  scene.add(starPoints);
};

const initThree = () => {
  if (!container.value) return;

  scene = new THREE.Scene();
  // Deep Space Background (Dark Purple/Black)
  scene.background = new THREE.Color(0x05000a); 

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 500;

  renderer = new THREE.WebGLRenderer({ 
    alpha: false, 
    antialias: !isMobile // Disable antialias on mobile for performance
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio
  container.value.innerHTML = ''; // Clear previous canvas if any
  container.value.appendChild(renderer.domElement);

  // --- VORTEX GALAXY ---
  const positions = [];
  const colors = [];
  const sizes = [];
  const color = new THREE.Color();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Spiral Galaxy Math
    const branches = 3;
    const radius = Math.random() * 800;
    const spinAngle = radius * 0.005;
    const branchAngle = (i % branches) / branches * Math.PI * 2;
    
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;

    positions.push(
      Math.cos(branchAngle + spinAngle) * radius + randomX,
      randomY + (Math.sin(radius * 0.002) * 100), // Wavey vertical
      Math.sin(branchAngle + spinAngle) * radius + randomZ
    );

    // Color Logic: Core is white/cyan, edges are magenta/purple
    const mixedColor = color.setHSL(Math.random() * 0.6 + 0.5, 0.8, 0.5); // Blue-ish spectrum
    if (radius < 200) mixedColor.setHex(0xffffff); // Core white
    else if (radius > 600) mixedColor.setHex(0xff00ff); // Edge Magenta

    colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    sizes.push(Math.random() * 4 + 1); // Varied sizes, visible
  }

  galaxyGeo = new THREE.BufferGeometry();
  galaxyGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  galaxyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  galaxyGeo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const texture = createCloudTexture();

  galaxyMaterial = new THREE.PointsMaterial({
    size: 4, 
    sizeAttenuation: true,
    map: texture || undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.9, 
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMaterial);
  scene.add(galaxyPoints);

  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  if (camera && renderer && container.value) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  time += 0.002;

  // Rotation
  const rotationSpeed = isWarping.value ? 0.05 : 0.001;
  scene.rotation.y += rotationSpeed;
  scene.rotation.z += rotationSpeed * 0.2;

  // Parallax (Mouse Interaction)
  const parallaxX = mouseX.value * 100;
  const parallaxY = mouseY.value * 100;
  camera.position.x += (parallaxX - camera.position.x) * 0.05;
  camera.position.y += (parallaxY - camera.position.y) * 0.05;

  // Warp Camera movement
  if (isWarping.value) {
    camera.position.z -= 10;
    if (camera.position.z < 100) camera.position.z = 1000; // Loop back
    camera.fov = 100;
  } else {
    // Breathing effect + maintain base Z
    camera.position.z = 500 + Math.sin(time) * 50; 
    camera.fov = 75;
  }
  
  // Animate Shooting Stars
  if (starPoints && starGeo) {
    const positions = starGeo.attributes.position.array as Float32Array;
    for(let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      // Move star
      positions[i3 + 2] += starVelocities[i].z + (isWarping.value ? 50 : 0);
      
      // Reset if passed camera
      if (positions[i3 + 2] > 600) {
        positions[i3 + 2] = -1000; // Reset far back
        positions[i3] = (Math.random() - 0.5) * 2000; // New X
        positions[i3 + 1] = (Math.random() - 0.5) * 2000; // New Y
      }
    }
    starGeo.attributes.position.needsUpdate = true;
  }

  // Nebula Pulse (Dynamic Colors & Size)
  if (galaxyGeo && galaxyMaterial) {
    const sizes = galaxyGeo.attributes.size.array as Float32Array;
    
    // We only update a subset or use a shader for performance, but for 8000 particles CPU is fine
    // Let's just pulsate the entire galaxy size slightly for the "Breathing" effect
    // Actually, updating 8000 floats every frame is cheap.
    
    // OPTIMIZATION: Instead of looping 8000 times, let's just create a "Living" feel via camera/material
    // Modulating opacity or global point size is cheaper.
    // galaxyMaterial.size = 4 * pulse; // Simple easy breathing
    
    // Better: Modulate individual stars for "Twinkle"
    // Since we don't have a custom shader, we can't easily do per-particle time-based offset efficiently on CPU without iteration.
    // Let's iterate, 8k is fine on modern devices.
    
    for(let i=0; i < PARTICLE_COUNT; i++) {
      // Twinkle effect
      if (Math.random() > 0.99) {
         sizes[i] = Math.random() * 4 + 1;
      }
    }
    galaxyGeo.attributes.size.needsUpdate = true;
  }

  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
};

onMounted(() => {
  initThree();
  initShootingStars();
  window.addEventListener('mousemove', handleMouseMove);
  
  // Mobile Touch Support
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX.value = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseY.value = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }, { passive: true });

  animate();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  cancelAnimationFrame(animationId);
  if (renderer) renderer.dispose();
  if (galaxyGeo) galaxyGeo.dispose();
  if (starGeo) starGeo.dispose();
});
</script>

<style scoped>
.space-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: black;
}
</style>
