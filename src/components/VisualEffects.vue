<template>
  <div class="visual-effects-layer">
    <div class="scanlines"></div>
    <div class="vignette"></div>
    <div class="noise"></div>
  </div>
</template>

<style scoped>
.visual-effects-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* Let clicks pass through */
  z-index: 9999;
}

.scanlines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.1)
  );
  background-size: 100% 4px;
  animation: scanlineScroll 10s linear infinite;
  opacity: 0.6;
}

.vignette {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

.noise {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  animation: noiseAnimation 0.5s steps(5) infinite;
  opacity: 0.05;
}

@keyframes scanlineScroll {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

@keyframes noiseAnimation {
  0% { transform: translate(0, 0); }
  20% { transform: translate(-10px, 10px); }
  40% { transform: translate(10px, -10px); }
  60% { transform: translate(-10px, -10px); }
  80% { transform: translate(10px, 10px); }
  100% { transform: translate(0, 0); }
}
</style>
