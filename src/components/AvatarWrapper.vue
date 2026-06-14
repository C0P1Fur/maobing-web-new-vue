<template>
  <div>
    <div class="avatar-tooltip" :class="{ visible: tooltipVisible }" ref="tooltipRef">点一下试试~</div>
    <div class="hero-avatar-wrapper" ref="wrapperRef">
      <div class="hero-avatar-ring-breathe">
        <svg class="hero-avatar-ring" viewBox="0 0 200 200">
          <defs>
            <path id="textCircle" d="M 100 8 A 92 92 0 0 1 100 192 A 92 92 0 0 1 100 8" />
          </defs>
          <text font-family="'JetBrains Mono', 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="12" fill="#ffffff"
                font-weight="600" letter-spacing="2" text-anchor="middle">
            <textPath href="#textCircle" startOffset="25%">
              MAOBING <tspan fill="#4169E1">&#128049;</tspan>
              猫冰 <tspan fill="#4169E1">&#129482;</tspan>
              MAOBING <tspan fill="#4169E1">&#128049;</tspan>
              猫冰 <tspan fill="#4169E1">&#129482;</tspan>
              MAOBING <tspan fill="#4169E1">&#128049;</tspan>
              猫冰 <tspan fill="#4169E1">&#129482;</tspan>
              MAOBING <tspan fill="#4169E1">&#128049;</tspan>
              猫冰
            </textPath>
          </text>
        </svg>
      </div>
      <div class="hero-avatar-frame">
        <div class="hero-avatar-placeholder">
          <img src="/src/q版猫冰无背景.png" alt="猫冰头像" class="icon">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useParticleSpawn } from '@/composables/useParticleSystem.js'

const { spawn } = useParticleSpawn()

const wrapperRef = ref(null)
const tooltipRef = ref(null)
const tooltipVisible = ref(false)

// Spring physics
let springScale = 1
let springVel = 0
let springTarget = 1
let springActive = false
const SPRING_STIFF = 0.22
const SPRING_DAMP  = 0.75
let masterRaf = null

// Avatar position cache
let avatarCx = 0, avatarCy = 0, ringRadius = 0

function updateAvatarCache() {
  if (!wrapperRef.value) return
  const rect = wrapperRef.value.getBoundingClientRect()
  avatarCx = rect.left + rect.width / 2
  avatarCy = rect.top + rect.height / 2
  ringRadius = (rect.width + 80) * (92 / 200)
}

function masterStep() {
  let needsSpring = false

  if (springActive) {
    const force = (springTarget - springScale) * SPRING_STIFF
    springVel += force
    springVel *= SPRING_DAMP
    springScale += springVel
    if (wrapperRef.value) {
      wrapperRef.value.style.transform = 'scale(' + springScale + ')'
    }

    if (Math.abs(springScale - springTarget) < 0.0003 && Math.abs(springVel) < 0.0003) {
      springScale = springTarget
      springVel = 0
      if (wrapperRef.value) wrapperRef.value.style.transform = 'scale(' + springTarget + ')'
      springActive = false
    } else {
      needsSpring = true
    }
  }

  if (needsSpring) {
    masterRaf = requestAnimationFrame(masterStep)
  } else {
    masterRaf = null
  }
}

function startMasterLoop() {
  if (!masterRaf) masterRaf = requestAnimationFrame(masterStep)
}

function onMouseMove(e) {
  if (tooltipRef.value) {
    tooltipRef.value.style.left = e.clientX + 'px'
    tooltipRef.value.style.top = e.clientY + 'px'
  }
}

function onMouseEnter() {
  tooltipVisible.value = true
  springTarget = 1.15
  springActive = true
  startMasterLoop()
}

function onMouseLeave() {
  tooltipVisible.value = false
  springTarget = 1.0
  springActive = true
  startMasterLoop()
}

function onMouseDown(e) {
  e.preventDefault()
  springScale = 0.88
  springVel = 0
  springTarget = 1.15
  springActive = true
  if (wrapperRef.value) wrapperRef.value.style.transform = 'scale(0.88)'
  startMasterLoop()

  spawn(avatarCx, avatarCy, ringRadius)
}

onMounted(() => {
  updateAvatarCache()
  window.addEventListener('scroll', updateAvatarCache, { passive: true })
  window.addEventListener('resize', updateAvatarCache, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateAvatarCache)
  window.removeEventListener('resize', updateAvatarCache)
  if (masterRaf) cancelAnimationFrame(masterRaf)
})
</script>

<style scoped>
.hero-avatar-wrapper {
  flex: 0 0 auto;
  position: relative;
  width: clamp(200px, 26vw, 320px);
  height: clamp(200px, 26vw, 320px);
  z-index: 3;
  top: -36px;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(1);
  cursor: url('/src/cursor-default.png') 1 1, pointer;
}

.hero-avatar-wrapper:hover{
  transform: scale(1.17);
}

.hero-avatar-wrapper:hover .hero-avatar-ring-breathe{
  animation: ringBreatheActive 1s ease-in-out infinite;
}

.avatar-tooltip {
  position: fixed;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.84);
  color: #ccc;
  font-family: var(--font-general);
  font-weight: 550;
  font-size: 0.8rem;
  white-space: nowrap;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translate(12px, -12px);
}

.avatar-tooltip.visible {
  opacity: 1;
}

.hero-avatar-ring-breathe {
  position: absolute;
  top: -40px;
  left: -40px;
  width: calc(100% + 80px);
  height: calc(100% + 80px);
  overflow: visible;
  pointer-events: none;
  user-select: none;
  animation: ringBreatheIdle 2s ease-in-out infinite;
  transform-origin: center center;
}

.hero-avatar-ring {
  width: 100%;
  height: 100%;
  animation: ringTextSpin 15s linear infinite;
  overflow: visible;
}

.hero-avatar-frame {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--glass-border-hover);
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    0 0 40px var(--royal-blue-glow),
    0 0 80px rgba(65, 105, 225, 0.12),
    inset 0 0 30px rgba(65, 105, 225, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: border-color var(--transition-smooth), box-shadow var(--transition-smooth);
  overflow: hidden;
  animation: breathe 3s ease-in-out infinite;
}

.hero-avatar-frame::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px dashed rgba(65, 105, 225, 0.2);
  animation: ringRotate 20s linear infinite;
}

.hero-avatar-placeholder {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-dim);
  text-align: center;
  line-height: 1.5;
  user-select: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-avatar-placeholder .icon {
  width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .hero-avatar-wrapper { width: 200px; height: 200px; }
}
</style>
