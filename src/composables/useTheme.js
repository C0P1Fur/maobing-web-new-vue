import { ref } from 'vue'

const currentTheme = ref(localStorage.getItem('theme') || 'dark')

export function useTheme() {
  function applyTheme(theme) {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  function toggleTheme() {
    const next = currentTheme.value === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    return next
  }

  return { currentTheme, applyTheme, toggleTheme }
}
