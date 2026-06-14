<template>
  <button
    ref="btnRef"
    class="theme-toggle-btn"
    aria-label="切换日间/夜间模式"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @click="onClick"
  >
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme.js'

const { currentTheme, toggleTheme } = useTheme()

const btnRef = ref(null)
const emit = defineEmits(['triggerRipple'])

let springScale = 1
let springVel = 0
let springTarget = 1
const SPRING_STIFF = 0.28
const SPRING_DAMP  = 0.72
let springRaf = null

function springStep() {
  const force = (springTarget - springScale) * SPRING_STIFF
  springVel += force
  springVel *= SPRING_DAMP
  springScale += springVel
  if (btnRef.value) {
    btnRef.value.style.transform = 'scale(' + springScale + ')'
  }
  if (Math.abs(springScale - springTarget) < 0.0005 && Math.abs(springVel) < 0.0005) {
    if (btnRef.value) btnRef.value.style.transform = 'scale(' + springTarget + ')'
    springScale = springTarget
    springVel = 0
    springRaf = null
    return
  }
  springRaf = requestAnimationFrame(springStep)
}

function startSpring() {
  if (!springRaf) springRaf = requestAnimationFrame(springStep)
}

let isTransitioning = false

function onMouseEnter() {
  if (isTransitioning) return
  springTarget = 1.08
  startSpring()
}

function onMouseLeave() {
  if (isTransitioning) return
  springTarget = 1.0
  startSpring()
}

function onMouseDown(e) {
  if (isTransitioning) return
  e.preventDefault()
  springTarget = 0.82
  startSpring()
}

function onMouseUp() {
  if (isTransitioning) return
  springTarget = 1.0
  startSpring()
}

function onClick() {
  if (isTransitioning) return

  springTarget = 1.0
  startSpring()
  isTransitioning = true

  const rect = btnRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  const targetTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  const targetBg = targetTheme === 'light' ? '#f0f0f5' : '#060b18'

  emit('triggerRipple', { cx, cy, targetBg, targetTheme, onDone: () => {
    toggleTheme()
    isTransitioning = false
  }})
}

onMounted(() => {
  // Listen for global mouseup to reset spring if mouse released outside button
  document.addEventListener('mouseup', () => {
    if (isTransitioning) return
    if (springTarget === 0.82) { springTarget = 1.0; startSpring() }
  })
})
</script>

<style scoped>
.theme-toggle-btn {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1002;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: url('/src/cursor-default.png') 1 1, pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  overflow: visible;
  color: #e8e8f0;
  will-change: transform;
}

.theme-toggle-btn:hover {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 28px rgba(65, 105, 225, 0.3);
}

.icon-sun,
.icon-moon {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  transition: opacity 0.35s ease,
              transform 0.45s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.icon-sun {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
.icon-moon {
  opacity: 0;
  transform: rotate(-90deg) scale(0.3);
}

:global(html[data-theme="light"]) .icon-sun {
  opacity: 0;
  transform: rotate(90deg) scale(0.3);
}
:global(html[data-theme="light"]) .icon-moon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

:global(html[data-theme="light"]) .theme-toggle-btn {
  color: #555;
  background: rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
:global(html[data-theme="light"]) .theme-toggle-btn:hover {
  border-color: rgba(0, 0, 0, 0.18);
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.12);
}

@media (max-width: 768px) {
  .theme-toggle-btn { top: 16px; right: 16px; width: 38px; height: 38px; }
  .icon-sun,
  .icon-moon { width: 17px; height: 17px; }
}
</style>
