<template>
  <section class="section" id="friends">
    <SectionTitle label="Friends" title="links &amp; friends" />

    <div class="friend-links-grid" ref="gridRef">
      <FriendCard
        v-for="(link, i) in friendLinks"
        :key="i"
        :name="link.name"
        :desc="link.desc"
        :url="link.url"
        :index="i"
        :is-visible="cardsVisible"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SectionTitle from '@/components/SectionTitle.vue'
import FriendCard from '@/components/FriendCard.vue'
import { friendLinks } from '@/data/friends.js'

const gridRef = ref(null)
const cardsVisible = ref(false)

let observer = null

onMounted(() => {
  if (!gridRef.value) return

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      cardsVisible.value = entry.isIntersecting
    })
  }, { threshold: 0.2 })

  observer.observe(gridRef.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.friend-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1000px;
}

@media (max-width: 768px) {
  .friend-links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
