<template>
  <a
    class="friend-link-card"
    :class="{ visible: isVisible }"
    :href="url"
    :style="{ animationDelay: `${index * 0.1}s` }"
  >
    <div class="friend-link-name">{{ name }}</div>
    <div class="friend-link-desc">{{ desc }}</div>
    <div class="friend-link-arrow">visit &rarr;</div>
  </a>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  url: { type: String, required: true },
  index: { type: Number, required: true },
  isVisible: { type: Boolean, default: false },
})
</script>

<style scoped>
.friend-link-card {
  display: block;
  padding: 24px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all var(--transition-fast);
  cursor: url('/src/cursor-default.png') 1 1, pointer;
  opacity: 0;
  transform: translateY(30px);
}

.friend-link-card.visible {
  animation: cascadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.friend-link-card:hover {
  border-color: var(--glass-border-hover);
  box-shadow: 0 4px 24px var(--royal-blue-glow);
  transform: translateY(-4px);
}

.friend-link-card:hover .friend-link-arrow {
  transform: translateX(4px);
  color: var(--lemon-yellow);
}

.friend-link-name {
  font-family: 'JetBrains Mono', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.friend-link-desc {
  font-size: 0.85rem;
  font-family: 'JetBrains Mono', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.4;
}

.friend-link-arrow {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--royal-blue);
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
