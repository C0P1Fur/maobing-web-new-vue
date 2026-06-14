<template>
  <footer class="footer">
    <p class="footer-text">Designed &amp; Built with <span class="accent">&lt;/&gt;</span> by Maobing &mdash; &copy; 2026</p>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 48px 32px;
  border-top: 1px solid var(--glass-border);
}

.footer-text {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-dim);
}

.footer-text .accent { color: var(--royal-blue); }
</style>
