<template>
  <span class="hacker-text">{{ displayText }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { playSound } from '../composables/SoundManager';

const props = defineProps<{
  text: string;
  speed?: number; // ms per char
}>();

const displayText = ref('');
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

let interval: number | null = null;

const startDecoding = () => {
  if (interval) clearInterval(interval);
  
  const targetText = props.text;
  let iteration = 0;
  
  interval = window.setInterval(() => {
    displayText.value = targetText
      .split('')
      .map((_letter, index) => {
        if (index < iteration) {
          return targetText[index];
        }
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join('');
    
    // Play light typing sound every few frames
    if (iteration % 3 === 0) playSound.type();

    if (iteration >= targetText.length) {
      if (interval) clearInterval(interval);
    }
    
    iteration += 1 / 3; // Slow down the "lock in" effect
  }, 30);
};

watch(() => props.text, () => {
  startDecoding();
});

onMounted(() => {
  startDecoding();
});
</script>

<style scoped>
.hacker-text {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
}
</style>
