<template>
  <div
    class="hero-text-container"
    :class="{ 'hero-jump': isJumping }"
    ref="containerRef"
  >
    <div class="hero-line-container">
      <div class="hero-line">
        {{ line1 }}<span v-if="cursorLine === 1" class="cursor"></span>
      </div>
      <div class="hero-line secondary">
        {{ line2 }}<span v-if="cursorLine === 2" class="cursor"></span>
      </div>
    </div>
    <p class="hero-subtitle">&gt; 🐱🧊MaoBing, developer, youtuber, furry and more!</p>
  </div>
</template>

<script setup>
import { ref, inject, watch } from 'vue'

const textPairs = [
  ['Hello, World.', 'welcome, stranger.'],
  ['>_ ./maobing.sh', 'meow~'],
  ['echo "Change the world"', '"with 1s and 0s."'],
  ['Cat * adorableCat = ', 'new Cat("MaoBing");'],
  ['Of course!', '-- I play Minecraft'],
]

const line1 = ref('')
const line2 = ref('')
const cursorLine = ref(1)
const isJumping = ref(false)
const containerRef = ref(null)

let pairIndex = 0
let isTyping = false

function typeText(targetRef, text, speed, callback) {
  let i = 0
  targetRef.value = ''
  cursorLine.value = targetRef === line1 ? 1 : 2

  function tick() {
    if (i < text.length) {
      targetRef.value += text[i]
      i++
      const delay = text[i - 1] === ' ' ? speed * 2 : speed + Math.random() * 40
      setTimeout(tick, delay)
    } else {
      if (callback) callback()
    }
  }

  setTimeout(tick, 200)
}

function deleteText(targetRef, speed, callback) {
  cursorLine.value = targetRef === line1 ? 1 : 2

  function tick() {
    if (targetRef.value.length > 0) {
      targetRef.value = targetRef.value.slice(0, -1)
      setTimeout(tick, speed + Math.random() * 15)
    } else {
      if (callback) callback()
    }
  }

  tick()
}

function typePair(pair) {
  if (isTyping) return
  isTyping = true

  isJumping.value = true
  setTimeout(() => { isJumping.value = false }, 300)

  line1.value = ''
  line2.value = ''

  typeText(line1, pair[0], 60, () => {
    typeText(line2, pair[1], 50, () => {
      setTimeout(() => {
        deleteText(line2, 28, () => {
          deleteText(line1, 28, () => {
            isTyping = false
            setTimeout(() => {
              pairIndex = (pairIndex + 1) % textPairs.length
              typePair(textPairs[pairIndex])
            }, 800)
          })
        })
      }, 2000)
    })
  })
}

const bootComplete = inject('bootComplete', ref(true))

// Start typewriter after boot screen finishes (or immediately if already done)
watch(bootComplete, (done) => {
  if (done) {
    setTimeout(() => typePair(textPairs[0]), 500)
  }
}, { immediate: true })
</script>

<style scoped>
.hero-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hero-line-container{
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hero-line-container:hover {
  transform: scale(1.06);
}

.hero-line {
  font-family: var(--font-mono);
  font-size: clamp(3.2rem, 6.5vw, 5.6rem);
  font-weight: 700;
  color: var(--text-primary);
  min-height: 1.15em;
  position: relative;
  letter-spacing: -1.5px;
  line-height: 1.1;
  animation: textBreatheIdle 4s ease-in-out infinite;
}

.hero-line.secondary {
  font-size: clamp(1.7rem, 3.3vw, 2.4rem);
  font-weight: 400;
  color: var(--text-secondary);
  letter-spacing: -0.5px;
  animation: textBreatheIdle 4s ease-in-out infinite;
  animation-delay: 0.5s;
}

.hero-text-container:hover .hero-line {
  animation: textBreatheActive 0.75s ease-in-out infinite;
}

.hero-text-container:hover .hero-line.secondary {
  animation: textBreatheActive 0.75s ease-in-out infinite;
  animation-delay: 0.2s;
}

.cursor {
  display: inline-block;
  width: 4px;
  height: 0.85em;
  background: #999;
  margin-left: 4px;
  vertical-align: text-bottom;
  animation: cursor-blink 1.2s steps(2) infinite;
}

.hero-jump {
  animation: heroJump 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.hero-subtitle {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: var(--text-dim);
  margin-top: 8px;
  opacity: 0;
  animation: fadeInUp 0.6s 2s forwards;
}

@media (max-width: 768px) {
  .hero-line { font-size: clamp(2rem, 8vw, 3.2rem) !important; }
  .hero-line.secondary { font-size: clamp(1.2rem, 5vw, 1.6rem) !important; }
  .hero-subtitle { text-align: center; }
}
</style>
