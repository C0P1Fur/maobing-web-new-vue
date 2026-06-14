<template>
  <div id="boot-screen" :class="{ exit: isExiting }">
    <div class="boot-terminal">
      <div class="boot-terminal-header">
        <div class="boot-terminal-dot red"></div>
        <div class="boot-terminal-dot yellow"></div>
        <div class="boot-terminal-dot green"></div>
        <span class="boot-terminal-label">maobing@sanctuary — bash — 80×24</span>
      </div>
      <div class="boot-terminal-body">
        <div id="boot-logs" ref="logsRef">
          <div
            v-for="(log, i) in displayedLogs"
            :key="i"
            class="boot-log-line"
            :class="log.type"
          >
            {{ log.msg }}
          </div>
        </div>
        <div id="boot-progress">
          <span id="boot-progress-bar">[{{ progressBar }}]</span>&nbsp;
          <span id="boot-progress-pct">{{ progressPct }}%</span>
          <span class="boot-cursor">&#9608;</span>
        </div>
        <div class="boot-logo-area">
          <div class="boot-logo-wrapper">
            <img class="boot-logo" src="/src/maobing-logo-flat.png" alt="MaoBing Logo">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['complete'])

const isExiting = ref(false)
const displayedLogs = ref([])
const logsRef = ref(null)
const progress = ref(0)
const targetProgress = ref(0)

const bootLogs = [
  { msg: '[ BIOS ] v2.14.0 — MaoBing Systems (R) Boot Agent',            type: 'info' },
  { msg: '[ BIOS ] CPU detected: Intel(R) Core(TM) i9-13900K @ 5.80GHz', type: 'info' },
  { msg: '[ BIOS ] Memory check: 65536MB OK',                             type: 'info' },
  { msg: '[ BIOS ] Storage detected: NVMe SSD 2TB (Samsung 990 Pro)',     type: 'info' },
  { msg: '[ BIOS ] USB Controller: xHCI mode enabled, 12 ports',          type: 'info' },
  { msg: '[ BIOS ] TPM 2.0: secure boot verification passed',             type: 'info' },
  { msg: '[ BIOS ] Initializing PCI Express devices...',                  type: 'info' },
  { msg: '[ ACPI ] Possible power management issue on port 0x1F',         type: 'warn' },
  { msg: '[ BOOT ] Loading bootloader: systemd-boot v252.1',              type: 'info' },
  { msg: '[ BOOT ] Kernel image: linux-6.8.0-maobing-amd64',              type: 'info' },
  { msg: '[ BOOT ] Decompressing kernel .......................... [OK]',  type: 'info' },
  { msg: '[ KRNL ] Initializing cgroup v2 hierarchy',                     type: 'info' },
  { msg: '[ KRNL ] Mounting filesystem: ext4 on /dev/nvme0n1p2',          type: 'info' },
  { msg: '[ KRNL ] Loading kernel modules ........................ [OK]',  type: 'info' },
  { msg: '[ KRNL ] Starting udev device manager',                         type: 'info' },
  { msg: '[ KRNL ] Configuring loopback interface lo',                    type: 'info' },
  { msg: '[ KRNL ] Starting network services: SSH, HTTP, WS',             type: 'info' },
  { msg: '[ KRNL ] Initializing GPU compute pipeline — CUDA 12.4',        type: 'info' },
  { msg: '[ FS   ] fsck: /dev/nvme0n1p2 clean, 342188/6553600 files',     type: 'info' },
  { msg: '[ FS   ] Mounting /home .................................... [OK]', type: 'info' },
  { msg: '[ NET  ] DHCP lease acquired: 192.168.1.42/24',                 type: 'info' },
  { msg: '[ NET  ] DNS resolver: 1.1.1.1, 8.8.8.8',                      type: 'info' },
  { msg: '[ NET  ] Firewall rule #42: rate-limiting enabled on port 443', type: 'warn' },
  { msg: '[ SRV  ] Starting nginx 1.27.0 .......................... [OK]', type: 'info' },
  { msg: '[ SRV  ] Starting PostgreSQL 16.3 ....................... [OK]', type: 'info' },
  { msg: '[ SRV  ] Starting Redis 7.4 cache server ............... [OK]',  type: 'info' },
  { msg: '[ TLS  ] Certificate verification: Let\'s Encrypt R11 valid',   type: 'info' },
  { msg: '[ INIT ] Starting user-space daemons...',                       type: 'info' },
  { msg: '[ INIT ] Loading project: "MaoBing\'s Sanctuary"',              type: 'info' },
  { msg: '[ INIT ] Cache warming: 2048 assets preloaded',                 type: 'info' },
  { msg: '[SUCCESS] System Boot Complete. Welcome, maoBing.',             type: 'success' }
]

const totalLogs = bootLogs.length

const progressBar = computed(() => {
  const pct = Math.round(progress.value)
  const filled = Math.round(pct / 5)
  let bar = '['
  for (let i = 0; i < 20; i++) {
    bar += i < filled ? '█' : '░'
  }
  bar += ']'
  return bar
})

const progressPct = computed(() => Math.round(progress.value))

// Progress spring animation
let progressRaf = null
function updateProgressLoop() {
  progress.value += (targetProgress.value - progress.value) * 0.12
  if (Math.abs(targetProgress.value - progress.value) < 0.3) {
    progress.value = targetProgress.value
  }

  if (progress.value < targetProgress.value || progress.value < 100) {
    progressRaf = requestAnimationFrame(updateProgressLoop)
  }
}

function appendLog(log, callback) {
  displayedLogs.value.push(log)

  // Auto-scroll logs
  requestAnimationFrame(() => {
    if (logsRef.value) {
      logsRef.value.scrollTop = logsRef.value.scrollHeight
    }
  })

  targetProgress.value = Math.round((displayedLogs.value.length / totalLogs) * 100)

  const baseDelay = 25
  const jitter   = Math.random() * 50
  const pause    = Math.random() < 0.05 ? 80 : 0

  setTimeout(callback, baseDelay + jitter + pause)
}

function runBootSequence() {
  let i = 0
  function next() {
    if (i >= bootLogs.length) {
      onBootComplete()
      return
    }
    appendLog(bootLogs[i], () => {
      i++
      next()
    })
  }
  next()
}

function onBootComplete() {
  targetProgress.value = 100

  setTimeout(() => {
    isExiting.value = true

    // After exit animation, emit complete
    setTimeout(() => {
      emit('complete')
    }, 700)
  }, 1000)
}

onMounted(() => {
  // Lock body scroll during boot
  document.body.style.overflow = 'hidden'
  progressRaf = requestAnimationFrame(updateProgressLoop)
  runBootSequence()
})
</script>

<style scoped>
#boot-screen {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 9999;
  background: #0d0e15;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
}

#boot-screen.exit {
  animation: bootSlideOut 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.boot-terminal {
  width: 100%;
  height: 100%;
  border-radius: 0;
  border: none;
  background: rgba(0, 0, 0, 0.92);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.boot-terminal-header {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  background: rgba(30, 30, 40, 0.92);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 10px;
  user-select: none;
  flex-shrink: 0;
}

.boot-terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.boot-terminal-dot.red    { background: #ff5f56; }
.boot-terminal-dot.yellow { background: #ffbd2e; }
.boot-terminal-dot.green  { background: #27c93f; }

.boot-terminal-label {
  flex: 1;
  text-align: center;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 0.7rem;
  color: #777;
  letter-spacing: 0.3px;
  margin-right: 50px;
}

.boot-terminal-body {
  flex: 1;
  padding: 18px 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-size: 0.82rem;
  line-height: 1.7;
}

.boot-logo-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.boot-logo-wrapper {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  line-height: 0;
}

.boot-logo {
  display: block;
  width: 300px;
  height: auto;
  padding: 20px;
  opacity: 0.55;
  border-radius: 8px;
  animation: logoBreathe 3s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

#boot-logs {
  flex: 1;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 6px;
  padding: 10px 14px;
  width: fit-content;
}

#boot-logs::-webkit-scrollbar { width: 4px; }
#boot-logs::-webkit-scrollbar-track { background: transparent; }
#boot-logs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

.boot-log-line {
  white-space: nowrap;
  opacity: 0;
  transform: translateY(18px);
  animation: bootLineIn 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

.boot-log-line.info    { color: #00cc44; }
.boot-log-line.warn    { color: #ffbd2e; }
.boot-log-line.error   { color: #ff5f56; }
.boot-log-line.success { color: #27c93f; font-weight: 700; }

#boot-progress {
  margin-top: 16px;
  padding: 10px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: #ffbd2e;
  white-space: nowrap;
  font-size: 1.05rem;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 6px;
}

.boot-cursor {
  display: inline-block;
  color: #00cc44;
  animation: bootCursorBlink 0.7s step-end infinite;
}
</style>
