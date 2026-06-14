<template>
  <canvas id="ripple-canvas" ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let rctx = null

function resize() {
  if (!canvasRef.value) return
  canvasRef.value.width  = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

function triggerRipple({ cx, cy, targetBg, targetTheme, onDone }) {
  if (!rctx) return
  const DURATION = 850
  const w = window.innerWidth
  const h = window.innerHeight
  const corners = [[0, 0], [w, 0], [0, h], [w, h]]
  let maxR = 0
  for (let i = 0; i < corners.length; i++) {
    const dx = corners[i][0] - cx
    const dy = corners[i][1] - cy
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d > maxR) maxR = d
  }
  maxR = Math.ceil(maxR) + 10

  resize()
  rctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  const startTime = performance.now()

  function drawFrame(now) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / DURATION, 1.0)
    const eased = 1 - Math.pow(1 - t, 3)
    const r = eased * maxR

    rctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    rctx.beginPath()
    rctx.arc(cx, cy, Math.max(r, 0.5), 0, Math.PI * 2)
    rctx.fillStyle = targetBg
    rctx.fill()

    if (t < 1.0) {
      requestAnimationFrame(drawFrame)
    } else {
      if (onDone) onDone()
      // Wait 2 frames for grid-canvas to update with new theme, then clear
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          rctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
        })
      })
    }
  }

  requestAnimationFrame(drawFrame)
}

onMounted(() => {
  rctx = canvasRef.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
})

defineExpose({ triggerRipple })
</script>
