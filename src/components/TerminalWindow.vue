<template>
  <div class="terminal-window">
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="terminal-dot dot-red"></span>
        <span class="terminal-dot dot-yellow"></span>
        <span class="terminal-dot dot-green"></span>
      </div>
      <span class="terminal-label">{{ label }}</span>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: 'bash — maobing@terminal ~' },
})
</script>

<style scoped>
.terminal-window {
  width: 720px;
  max-width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(65, 105, 225, 0.18);
  background: rgba(14, 14, 22, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(65, 105, 225, 0.06) inset,
    0 1px 0 rgba(255, 255, 255, 0.03) inset;
  overflow: hidden;
}

.terminal-header {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 14px;
  background: rgba(10, 10, 18, 0.55);
  border-bottom: 1px solid rgba(65, 105, 225, 0.10);
  gap: 12px;
  user-select: none;
}

.terminal-dots {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}

.terminal-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.terminal-dot.dot-red    { background: #ff5f56; box-shadow: 0 0 4px rgba(255,95,86,0.35); }
.terminal-dot.dot-yellow { background: #ffbd2e; box-shadow: 0 0 4px rgba(255,189,46,0.35); }
.terminal-dot.dot-green  { background: #27c93f; box-shadow: 0 0 4px rgba(39,201,63,0.35); }

.terminal-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-dim);
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.terminal-body {
  padding: 28px 52px;
}
</style>
