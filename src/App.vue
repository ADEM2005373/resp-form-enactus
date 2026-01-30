<template>
  <div id="app-container">
    <VisualEffects />
    <SpaceBackground />
    <MissionControl />
  </div>
</template>

<script setup lang="ts">
import SpaceBackground from './components/SpaceBackground.vue';
import MissionControl from './components/MissionControl.vue';
import VisualEffects from './components/VisualEffects.vue';
</script>

<style>
#app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
