<template>
  <div class="hero-scroll-hint" @click="scrollDown">
    [ scroll down ]
  </div>
</template>

<script setup>
const props = defineProps({
  targetId: { type: String, required: true },
})

function scrollDown() {
  const target = document.getElementById(props.targetId)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.hero-scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 1rem;
  color: #999;
  letter-spacing: 3px;
  animation: floatDown 2s ease-in-out infinite;
  cursor: url('/src/cursor-default.png') 1 1, pointer;
  z-index: 3;
}

.hero-scroll-hint::after {
  content: '\25BC';
  display: block;
  margin: 4px auto 0;
  text-align: center;
  color: #999;
  font-size: 0.7rem;
  animation: scrollPulse 1.6s ease-in-out infinite;
}
</style>
