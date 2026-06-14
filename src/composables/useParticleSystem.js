import { shallowRef } from 'vue'

const spawnFn = shallowRef(null)

export function provideParticleSpawn(fn) {
  spawnFn.value = fn
}

export function useParticleSpawn() {
  function spawn(cx, cy, ringRadius) {
    spawnFn.value?.(cx, cy, ringRadius)
  }
  return { spawn }
}
