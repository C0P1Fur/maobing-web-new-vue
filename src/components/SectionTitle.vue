<template>
    <div class="section-label">{{ label }}</div>
    <h2 class="section-title">{{ title }}</h2>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
})
</script>

<style scoped>
.section-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--royal-blue);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 16px;
  opacity: 0.8;
  text-align: center;
}

.section-title {
  font-family: var(--font-mono);
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
}
</style>
