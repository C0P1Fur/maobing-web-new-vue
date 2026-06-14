<template>
  <div
    ref="widgetRef"
    class="like-widget"
    :class="{ liked: hasLiked }"
  >
    <Teleport to="body">
      <div class="like-tooltip" :class="{ visible: tooltipVisible }">给猫冰点个赞吧~</div>
    </Teleport>
    <button
      class="like-btn"
      :aria-label="'点赞 (' + likeCount + ')'"
      @click="toggleLike"
    >
      <svg class="like-icon" viewBox="0 0 24 24" :fill="hasLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
    <span class="like-count" :key="displayCount">{{ displayCount }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY_LIKED = 'maobing_has_liked'
const STORAGE_KEY_COUNT = 'maobing_like_count'

const hasLiked = ref(false)
const likeCount = ref(0)
const displayCount = ref(0)
const tooltipVisible = ref(false)
const widgetRef = ref(null)
let tooltipEl = null

function onMouseMove(e) {
  if (tooltipEl) {
    tooltipEl.style.left = e.clientX + 'px'
    tooltipEl.style.top = e.clientY + 'px'
  }
}

function onMouseEnter() {
  tooltipVisible.value = true
  // Capture tooltip element after Teleport renders it
  requestAnimationFrame(() => {
    tooltipEl = document.querySelector('.like-tooltip')
  })
}

function onMouseLeave() {
  tooltipVisible.value = false
  tooltipEl = null
}

function animateCount() {
  displayCount.value = likeCount.value
}

function toggleLike() {
  hasLiked.value = true
  likeCount.value += 1
  animateCount()
  saveState()
}

function saveState() {
  localStorage.setItem(STORAGE_KEY_LIKED, hasLiked.value ? '1' : '0')
  localStorage.setItem(STORAGE_KEY_COUNT, String(likeCount.value))
}

onMounted(() => {
  hasLiked.value = localStorage.getItem(STORAGE_KEY_LIKED) === '1'
  likeCount.value = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10) || 0
  displayCount.value = likeCount.value

  const el = widgetRef.value
  if (el) {
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mouseleave', onMouseLeave)
  }
})

onUnmounted(() => {
  const el = widgetRef.value
  if (el) {
    el.removeEventListener('mousemove', onMouseMove)
    el.removeEventListener('mouseenter', onMouseEnter)
    el.removeEventListener('mouseleave', onMouseLeave)
  }
})
</script>

<style scoped>
.like-widget {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  user-select: none;
}

.like-widget:hover {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 28px rgba(255, 105, 180, 0.25);
}

.like-widget.liked {
  border-color: rgba(255, 105, 180, 0.35);
  box-shadow: 0 4px 28px rgba(255, 105, 180, 0.2);
}

.like-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  cursor: url('/src/cursor-default.png') 1 1, pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.like-btn:hover {
  transform: scale(1.18);
}

.like-btn:active {
  transform: scale(0.85);
}

.like-icon {
  width: 22px;
  height: 22px;
  color: #ff6b9d;
  transition: color var(--transition-fast), filter var(--transition-fast);
}

.liked .like-icon {
  color: #ff2d78;
  filter: drop-shadow(0 0 6px rgba(255, 45, 120, 0.5));
}

.like-count {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 24px;
  text-align: center;
  line-height: 1;
  transition: color var(--transition-fast);
}

.liked .like-count {
  color: #ff6b9d;
}

/* Light theme overrides */
:global(html[data-theme="light"]) .like-widget {
  background: rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

:global(html[data-theme="light"]) .like-widget:hover {
  border-color: rgba(0, 0, 0, 0.18);
  box-shadow: 0 4px 28px rgba(255, 105, 180, 0.2);
}

:global(html[data-theme="light"]) .like-count {
  color: #444;
}

:global(html[data-theme="light"]) .liked .like-count {
  color: #e82a6a;
}

@media (max-width: 768px) {
  .like-widget {
    bottom: 12px;
    left: 12px;
    padding: 7px 12px;
    gap: 6px;
  }
  .like-btn {
    width: 30px;
    height: 30px;
  }
  .like-icon {
    width: 18px;
    height: 18px;
  }
  .like-count {
    font-size: 0.75rem;
  }
}
</style>

<style>
/* Global tooltip styles (not scoped — Teleported to body) */
.like-tooltip {
  position: fixed;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.84);
  color: #ccc;
  font-family: 'JetBrains Mono', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-weight: 550;
  font-size: 0.78rem;
  white-space: nowrap;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translate(12px, -12px);
}

.like-tooltip.visible {
  opacity: 1;
}
</style>
