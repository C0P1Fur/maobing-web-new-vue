<template>
  <canvas id="particle-canvas" ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { provideParticleSpawn } from '@/composables/useParticleSystem.js'

const canvasRef = ref(null)
let pctx = null

const GRAVITY = 0.15
const DAMPING = 0.98
const PARTICLE_COUNT = 8

let particles = []
let masterRaf = null

function resize() {
  if (!canvasRef.value) return
  canvasRef.value.width  = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

function spawnBurst(cx, cy, ringRadius) {
  const count = PARTICLE_COUNT + Math.floor(Math.random() * 7) - 3
  const colors = ['#ffffff', '#e0e0ff', '#c8d6ff', '#4169E1', '#6b8cff', '#a0b8ff', '#FFD700']

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 3 + Math.random() * 5
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed - 1.5

    const startX = cx + Math.cos(angle) * ringRadius
    const startY = cy + Math.sin(angle) * ringRadius

    const size = 20 + Math.floor(Math.random() * 12)
    particles.push({
      x: startX,
      y: startY,
      vx: vx,
      vy: vy,
      fontKey: size + 'px "JetBrains Mono", monospace',
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.105,
      text: Math.random() < 0.5 ? '🧊' : '🐱'
    })
  }

  if (!masterRaf) masterRaf = requestAnimationFrame(masterStep)
}

function particleTick() {
  if (!pctx) return

  pctx.setTransform(1, 0, 0, 1, 0, 0)
  pctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  pctx.textAlign = 'center'
  pctx.textBaseline = 'middle'

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]

    p.vy += GRAVITY
    p.vx *= DAMPING
    p.vy *= DAMPING
    p.x += p.vx
    p.y += p.vy
    p.rot += p.rotSpeed

    if (p.y > canvasRef.value.height + 50 || p.x < -50 || p.x > canvasRef.value.width + 50) {
      particles.splice(i, 1)
      continue
    }

    const cos = Math.cos(p.rot)
    const sin = Math.sin(p.rot)
    pctx.setTransform(cos, sin, -sin, cos, p.x, p.y)
    pctx.font = p.fontKey
    pctx.fillStyle = p.color
    pctx.fillText(p.text, 0, 0)
  }

  if (particles.length === 0) {
    pctx.setTransform(1, 0, 0, 1, 0, 0)
    pctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

function masterStep() {
  const hasParticles = particles.length > 0

  if (hasParticles) {
    particleTick()
  }

  if (particles.length > 0) {
    masterRaf = requestAnimationFrame(masterStep)
  } else {
    masterRaf = null
  }
}

onMounted(() => {
  pctx = canvasRef.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  provideParticleSpawn(spawnBurst)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  if (masterRaf) cancelAnimationFrame(masterRaf)
})
</script>
