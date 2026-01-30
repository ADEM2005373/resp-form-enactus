<template>
  <div class="selection-grid">
    <div 
      v-for="option in options" 
      :key="option"
      class="selection-card"
      :class="{ active: modelValue === option }"
      @click="$emit('update:modelValue', option)"
    >
      <div class="card-glow"></div>
      <span class="card-text">{{ option }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  options: string[]
  modelValue: string
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();
</script>

<style scoped>
.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin: 1rem 0;
}

.selection-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  overflow: hidden;
  user-select: none;
}

.card-text {
  position: relative;
  z-index: 2;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
}

.selection-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 243, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
}

.selection-card.active {
  background: rgba(0, 243, 255, 0.1);
  border-color: #00f3ff;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
}

.selection-card.active .card-text {
  color: #fff;
  text-shadow: 0 0 8px rgba(0, 243, 255, 0.8);
}

/* Futuristic "scanline" or glow effect background */
.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 0%, rgba(0, 243, 255, 0.05) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.5s;
  z-index: 1;
}

.selection-card:hover .card-glow {
  transform: translateX(100%);
}
</style>
