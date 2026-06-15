<template>
  <a
    ref="cardRef"
    class="friend-link-card"
    :href="url"
  >
    <div class="friend-link-name">{{ name }}</div>
    <div class="friend-link-desc">{{ desc }}</div>
    <div class="friend-link-arrow">visit &rarr;</div>
  </a>
</template>

<script setup>
import { gsap } from 'gsap'
import { watch, ref } from 'vue'

// 2. 用一个变量 props 接收属性
const props = defineProps({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  url: { type: String, required: true },
  index: { type: Number, required: true },
  isVisible: { type: Boolean, default: false },
})

const cardRef = ref(null)

// 3. 监听 isVisible
watch(() => props.isVisible, (value, oldValue) => {
  if (value && !oldValue && cardRef.value) {
    // 4. 初始化状态：让卡片先处于下方且透明（防止闪烁）
    gsap.set(cardRef.value, { y: 160, opacity: 0})

    // 5. 让 GSAP 直接控制 DOM 节点，使用 props.index 
    gsap.to(cardRef.value, { 
      y: 0,                   // 动画结束回到原位 0，不影响 CSS 的 hover
      opacity: 1, 
      duration: 2.5, 
      delay: props.index * 0.1,
      ease: "bounce.out",
      clearProps: "transform", // 6. 💥 关键：动画结束后清除 transform 属性，把控制权还给 CSS 的 hover！
    });
  }
})
</script>

<style scoped>
.friend-link-card {
  display: block;
  padding: 24px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: url('/src/cursor-default.png') 1 1, pointer;
  /* 7. 添加 transition 让 hover 位移也变得丝滑 */
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform 0.2s ease;
}

.friend-link-card:hover {
  border-color: var(--glass-border-hover);
  box-shadow: 0 4px 24px var(--royal-blue-glow);
  transform: translateY(-4px) !important; /* 加 !important 确保完全压制潜在的剩余样式 */
}

.friend-link-card:hover .friend-link-arrow {
  transform: translateX(4px);
  color: var(--lemon-yellow);
}
.friend-link-name {
  font-family: 'JetBrains Mono', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.friend-link-desc {
  font-size: 0.85rem;
  font-family: 'JetBrains Mono', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.4;
}
.friend-link-arrow {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--royal-blue);
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>