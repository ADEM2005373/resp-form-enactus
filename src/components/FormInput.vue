<template>
  <div class="input-group">
    <label v-if="label">{{ label }}</label>
    
    <textarea
      v-if="type === 'textarea'"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      rows="4"
    ></textarea>

    <input 
      v-else
      :type="type" 
      :placeholder="placeholder" 
      :value="modelValue"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { playSound } from '../composables/SoundManager';

withDefaults(defineProps<{
  label?: string
  type?: string
  placeholder?: string
  modelValue?: string
}>(), {
  type: 'text'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('update:modelValue', target.value);
  playSound.type(); // Play sound
};
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem; /* Increased spacing */
  text-align: left;
  width: 100%;
}

label {
  color: #00f3ff;
  font-family: 'Courier New', Courier, monospace;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(0, 243, 255, 0.3);
}

input, textarea {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px; /* Slight rounded corners */
  padding: 1.2rem;
  color: white;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif; /* Cleaner font for reading */
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

input:focus, textarea:focus {
  outline: none;
  border-color: #00f3ff;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.3), inset 0 0 10px rgba(0, 243, 255, 0.1);
  background: rgba(0, 0, 0, 0.5);
  transform: scale(1.01); /* Subtle grow effect */
}

/* Placeholder styling */
::placeholder {
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}
</style>
