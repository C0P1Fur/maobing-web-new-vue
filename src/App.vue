<script setup>
import { ref, onMounted, onUnmounted, provide, readonly } from 'vue'
import BootScreen from '@/components/BootScreen.vue'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import GridCanvas from '@/components/GridCanvas.vue'
import ScanlinesOverlay from '@/components/ScanlinesOverlay.vue'
import RippleCanvas from '@/components/RippleCanvas.vue'
import ParticleCanvas from '@/components/ParticleCanvas.vue'
import HeroSection from '@/scene/HeroSection.vue'
import FriendLinksSection from '@/scene/FriendLinksSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import GlassDomainBadge from '@/components/GlassDomainBadge.vue'
import { useTheme } from '@/composables/useTheme.js'

const bootComplete = ref(false)
const rippleRef = ref(null)

const { applyTheme } = useTheme()

// Let children know boot state so they can defer heavy init
provide('bootComplete', readonly(bootComplete))

function onBootComplete() {
  bootComplete.value = true
  document.body.style.overflow = ''
}

function onTriggerRipple({ cx, cy, targetBg, targetTheme, onDone }) {
  rippleRef.value?.triggerRipple({
    cx, cy, targetBg, targetTheme,
    onDone: () => {
      applyTheme(targetTheme)
      onDone()
    }
  })
}

// Custom cursor pressed state
function onMouseDown() { document.documentElement.classList.add('cursor-pressed') }
function onMouseUp()   { document.documentElement.classList.remove('cursor-pressed') }
function onMouseLeave() { document.documentElement.classList.remove('cursor-pressed') }

onMounted(() => {
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<template>
  <!-- Boot screen stays on top (z-index:9999) while main content loads behind -->
  <BootScreen v-if="!bootComplete" @complete="onBootComplete" />

  <!-- Main content mounts immediately, initializes while boot screen is visible -->
  <GridCanvas />
  <ScanlinesOverlay />
  <RippleCanvas ref="rippleRef" />
  <ParticleCanvas />
  <HamburgerMenu />
  <HeroSection />
  <FriendLinksSection />
  <AppFooter />
  <GlassDomainBadge />
</template>
