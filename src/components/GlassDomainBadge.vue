<template>
  <div class="glass-domain-badge"><span>maobing.top</span></div>
</template>

<style scoped>
.glass-domain-badge {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  user-select: all;
}

.glass-domain-badge span {
  background-image: linear-gradient(90deg, #ff0000, #ff8800, #ffdd00, #00cc44, #0099ff, #6633ff, #ff00aa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (max-width: 768px) {
  .glass-domain-badge { bottom: 12px; right: 12px; font-size: 0.7rem; }
}
</style>
