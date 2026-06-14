<template>
  <!-- Hamburger button -->
  <button
    class="hamburger"
    :class="{ open: isOpen }"
    aria-label="Toggle navigation menu"
    @click="toggle"
  >
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>

  <!-- Sidebar overlay -->
  <div
    class="sidebar-overlay"
    :class="{ open: isOpen }"
    @click="close"
  ></div>

  <!-- Sidebar navigation -->
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="sidebar-brand">MAOBING<span class="accent">.TOP</span></div>
    <nav class="sidebar-nav">
      <a
        v-for="item in navItems"
        :key="item.id"
        class="sidebar-link"
        :class="{ active: item.id === 'home' }"
        :href="'#' + item.id"
        @click.prevent="navigateTo(item.id)"
      >
        <span>{{ item.label }}</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      &copy; 2026 MAOBING // v1.0.0
    </div>
  </aside>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useSidebar } from '@/composables/useSidebar.js'

const { isOpen, open, close, toggle } = useSidebar()

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'friends', label: 'Friends' },
]

function navigateTo(targetId) {
  close()
  setTimeout(() => {
    const target = document.querySelector('#' + targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, 400)
}

function onKeyDown(e) {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.hamburger {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 1001;
  width: 36px;
  height: 28px;
  background: none;
  border: none;
  cursor: url('/src/cursor-default.png') 1 1, pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.68, -0.55, 0.27, 1.55),
              opacity 0.25s ease;
}

.hamburger.open .hamburger-line:nth-child(1) {
  transform: translateY(13px) rotate(45deg);
}

.hamburger.open .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.open .hamburger-line:nth-child(3) {
  transform: translateY(-13px) rotate(-45deg);
}

.hamburger:hover .hamburger-line {
  background: var(--lemon-yellow);
  box-shadow: 0 0 8px var(--lemon-yellow-glow);
}

/* Sidebar overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.sidebar-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 300px;
  height: 100vh;
  background: rgba(14, 14, 26, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid var(--glass-border);
  box-shadow: 4px 0 40px rgba(0, 0, 0, 0.5);
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  padding: 100px 40px 40px;
  overflow-y: auto;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-brand {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.sidebar-brand .accent {
  color: var(--royal-blue);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: url('/src/cursor-default.png') 1 1, pointer;
  text-decoration: none;
  border: 1px solid transparent;
  position: relative;
}

.sidebar-link::before {
  content: '';
  font-family: var(--font-mono);
  color: var(--lemon-yellow);
  font-size: 0.85rem;
  width: 0;
  overflow: hidden;
  transition: width 0.25s ease, opacity 0.25s ease;
  opacity: 0;
  flex-shrink: 0;
}

.sidebar-link:hover {
  color: var(--text-primary);
  background: rgba(65, 105, 225, 0.12);
  border-color: var(--glass-border);
}

.sidebar-link:hover::before {
  content: '>';
  width: 12px;
  opacity: 1;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid var(--glass-border);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-dim);
}
</style>
