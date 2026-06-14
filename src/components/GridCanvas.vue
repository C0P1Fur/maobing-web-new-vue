<template>
  <canvas id="grid-canvas" ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)

const CELL       = 56
const RADIUS     = 220
const MAX_DISP   = 22
const SCROLL_V   = 0.90
const SPRING     = 0.06
const DAMPING    = 0.78

const TILE_IMG_SRC = '/src/猫冰头.png'
const TILE_SIZE    = 120
const TILE_SPACING = 6
const TILE_ALPHA   = 0.50
const TILE_ROT_V   = 0.015

let ctx = null
let scrollOffset = 0
let mouseX = -9999, mouseY = -9999
let depX = -9999, depY = -9999
let depVX = 0, depVY = 0
let tileImg = null
let tileImgLoaded = false
let rafId = null

function resize() {
  if (!canvasRef.value) return
  canvasRef.value.width  = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function onMouseLeave() {
  mouseX = -9999
  mouseY = -9999
}

function displace(vx, vy) {
  const dx = vx - depX
  const dy = vy - depY
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist >= RADIUS || dist < 0.001) return { x: vx, y: vy }

  const t = 1 - dist / RADIUS
  const strength = t * t * MAX_DISP
  const nx = dx / dist
  const ny = dy / dist

  return {
    x: vx - nx * strength,
    y: vy - ny * strength
  }
}

function draw() {
  if (!canvasRef.value) return
  const w = canvasRef.value.width
  const h = canvasRef.value.height

  scrollOffset = scrollOffset + SCROLL_V

  const fx = (mouseX - depX) * SPRING
  const fy = (mouseY - depY) * SPRING
  depVX = (depVX + fx) * DAMPING
  depVY = (depVY + fy) * DAMPING
  depX += depVX
  depY += depVY

  const isLight = document.documentElement.getAttribute('data-theme') === 'light'
  ctx.fillStyle = isLight ? '#f0f0f5' : '#060b18'
  ctx.fillRect(0, 0, w, h)

  const scrolled = scrollOffset
  const col0 = Math.floor(-scrolled / CELL) - 1
  const colN = Math.ceil((w - scrolled) / CELL) + 1
  const row0 = Math.floor(-scrolled / CELL) - 1
  const rowN = Math.ceil((h - scrolled) / CELL) + 1

  const grid = {}
  for (let c = col0; c <= colN; c++) {
    for (let r = row0; r <= rowN; r++) {
      const vx = c * CELL + scrolled
      const vy = r * CELL + scrolled
      grid[c + ',' + r] = displace(vx, vy)
    }
  }

  // Vertical lines
  for (let c = col0; c <= colN; c++) {
    ctx.beginPath()
    let first = true
    for (let r = row0; r <= rowN; r++) {
      const pt = grid[c + ',' + r]
      if (first) { ctx.moveTo(pt.x, pt.y); first = false }
      else       { ctx.lineTo(pt.x, pt.y) }
    }
    ctx.strokeStyle = 'rgba(65, 105, 225, 0.24)'
    ctx.lineWidth = 1.0
    ctx.stroke()
  }

  // Horizontal lines
  for (let r = row0; r <= rowN; r++) {
    ctx.beginPath()
    let first = true
    for (let c = col0; c <= colN; c++) {
      const pt = grid[c + ',' + r]
      if (first) { ctx.moveTo(pt.x, pt.y); first = false }
      else       { ctx.lineTo(pt.x, pt.y) }
    }
    ctx.strokeStyle = 'rgba(65, 105, 225, 0.18)'
    ctx.lineWidth = 0.8
    ctx.stroke()
  }

  // Tile images
  if (tileImgLoaded) {
    ctx.save()
    ctx.globalAlpha = TILE_ALPHA
    const tc0 = Math.ceil(col0 / TILE_SPACING) * TILE_SPACING
    const tr0 = Math.ceil(row0 / TILE_SPACING) * TILE_SPACING
    for (let c = tc0; c <= colN; c += TILE_SPACING) {
      for (let r = tr0; r <= rowN; r += TILE_SPACING) {
        const pt = grid[c + ',' + r]
        if (!pt) continue
        ctx.save()
        ctx.translate(pt.x, pt.y)
        ctx.rotate(scrollOffset * TILE_ROT_V)
        ctx.drawImage(tileImg, -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE)
        ctx.restore()
      }
    }
    ctx.restore()
  }

  // Glow points near mouse
  if (mouseX > -100 && mouseY > -100) {
    for (let c = col0; c <= colN; c++) {
      for (let r = row0; r <= rowN; r++) {
        const pt = grid[c + ',' + r]
        const dx2 = pt.x - depX
        const dy2 = pt.y - depY
        const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
        if (d2 < RADIUS * 0.6) {
          const alpha2 = (1 - d2 / (RADIUS * 0.6)) * 0.40
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(100, 150, 255, ' + alpha2 + ')'
          ctx.fill()
        }
      }
    }

    const glow = ctx.createRadialGradient(depX, depY, 0, depX, depY, RADIUS)
    glow.addColorStop(0, 'rgba(65, 105, 225, 0.08)')
    glow.addColorStop(0.6, 'rgba(65, 105, 225, 0.02)')
    glow.addColorStop(1, 'rgba(65, 105, 225, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(depX - RADIUS, depY - RADIUS, RADIUS * 2, RADIUS * 2)
  }

  rafId = requestAnimationFrame(draw)
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)

  tileImg = new Image()
  tileImg.onload = function() { tileImgLoaded = true }
  tileImg.src = TILE_IMG_SRC

  rafId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
})
</script>
