<template>
  <section class="hero" id="home">
    <div class="hero-left">
      <TerminalWindow>
        <TypewriterText />
      </TerminalWindow>
    </div>

    <AvatarWrapper />

    <ScrollHint target-id="friends" />
  </section>
</template>

<script setup>
import TerminalWindow from '@/components/TerminalWindow.vue'
import TypewriterText from '@/components/TypewriterText.vue'
import AvatarWrapper from '@/components/AvatarWrapper.vue'
import ScrollHint from '@/components/ScrollHint.vue'
</script>

<style scoped>
.hero {
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 80px 72px;
  gap: 140px;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.hero-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  max-width: 720px;
  z-index: 3;
  text-align: left;
}

@media (max-width: 768px) {
  .hero { flex-direction: column; padding: 100px 24px 60px; gap: 32px; }
  .hero-left { max-width: 100%; align-items: center; text-align: center; }
}
</style>
