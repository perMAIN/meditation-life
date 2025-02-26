<template>
  <div class="meditation-view">
    <!-- 背景视频/动画 -->
    <div class="background-container">
      <!-- 波纹动画背景 -->
      <div 
        class="gradient-bg" 
        ref="gradientBgRef"
        :data-theme="selectedBackground"
        v-if="selectedBackground.startsWith('ripple-')">
        <div class="gradient-animation"></div>
      </div>
      
      <!-- 视频背景 -->
      <video 
        class="background-video" 
        autoplay 
        loop 
        muted 
        v-if="selectedBackground === 'girl' || selectedBackground === 'man'"
        :key="selectedBackground">
        <source :src="backgroundVideoSrc" type="video/mp4">
      </video>
    </div>

    <div class="content-overlay">
      <div class="timer-display">{{ formatTime(remainingTime) }}</div>
      <button 
        class="timer-control-btn" 
        @click="toggleTimer"
        :class="{ 'running': isRunning }">
        {{ isRunning ? '暂停' : '开始' }}
      </button>
      <audio class="background-audio" autoplay loop :muted="!isRunning" :volume="audioVolume" :src="backgroundAudioSrc" ref="audioRef">
        <!-- <source :src="backgroundAudioSrc" type="audio/mp3" ref="audioRef"> -->
      </audio>
    </div>

    <!-- 底部控制栏 -->
    <div class="bottom-controls">
      <div class="control-icons">
        <el-tooltip content="背景设置" placement="top">
          <el-button class="control-icon" circle @click="showBackgroundDialog">
            <el-icon><Picture /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="时长设置" placement="top">
          <el-button class="control-icon" circle @click="showTimerDialog">
            <el-icon><Timer /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="背景音效" placement="top">
          <el-button class="control-icon" circle @click="showSoundDialog">
            <el-icon><Headset /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="引导语" placement="top">
          <el-button class="control-icon" circle @click="showGuidanceDialog">
            <el-icon><Guide /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 背景设置对话框 -->
    <el-dialog v-model="backgroundDialogVisible" title="选择背景" width="30%" center>
      <div class="dialog-content">
        <el-radio-group v-model="selectedBackground">
          <el-radio-button value="ripple-purple">紫色光晕</el-radio-button>
          <el-radio-button value="ripple-blue">海洋蓝</el-radio-button>
          <el-radio-button value="ripple-green">翡翠绿</el-radio-button>
          <!-- <el-radio-button value="ripple-gold">温暖金</el-radio-button>
          <el-radio-button value="ripple-rose">玫瑰粉</el-radio-button> -->
          <el-radio-button value="girl">女冥想者</el-radio-button>
          <el-radio-button value="man">男冥想者</el-radio-button>
        </el-radio-group>
      </div>
    </el-dialog>

    <!-- 时长设置对话框 -->
    <el-dialog v-model="timerDialogVisible" title="选择冥想时长" width="30%" center>
      <div class="dialog-content">
        <el-radio-group v-model="selectedDuration">
          <el-radio-button v-for="option in durationOptions" 
                          :key="option.value" 
                          :label="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="timerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDuration">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 音效设置对话框 -->
    <el-dialog v-model="soundDialogVisible" title="选择背景音效" width="30%" center>
      <div class="dialog-content">
        <el-radio-group v-model="selectedSound">
          <el-radio-button v-for="sound in soundOptions" 
                          :key="sound.value" 
                          :label="sound.value">
            {{ sound.label }}
          </el-radio-button>
        </el-radio-group>
        <el-slider v-model="volume" :min="0" :max="100" class="volume-slider" />
      </div>
    </el-dialog>

    <!-- 引导语设置对话框 -->
    <el-dialog v-model="guidanceDialogVisible" title="选择引导语" width="30%" center>
      <div class="dialog-content">
        <el-radio-group v-model="selectedGuidance">
          <el-radio-button v-for="guide in guidanceOptions" 
                          :key="guide.value" 
                          :label="guide.value">
            {{ guide.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed, watch } from 'vue'
import { Timer, Headset, Guide, Picture } from '@element-plus/icons-vue'

const selectedDuration = ref(300) // 默认5分钟
const remainingTime = ref(300)
const isRunning = ref(false)
let timerInterval: number | null = null

const durationOptions = [
  { label: '5分钟', value: 300 },
  { label: '10分钟', value: 600 },
  { label: '15分钟', value: 900 },
  { label: '30分钟', value: 1800 },
  { label: '1小时', value: 3600 }
]

const soundOptions = [
  { label: '火焰声', value: 'fire' },
  { label: '海浪声', value: 'wave' },
  { label: '树林声', value: 'forest' }
]

const guidanceOptions = [
  { label: '理想入门', value: 'beginner' },
  { label: '观察呼吸', value: 'breathing' },
  { label: '扫描身体', value: 'body-scan' }
]

const selectedSound = ref('')
const selectedGuidance = ref('')
const volume = ref(20)
// 计算属性：将 volume 转换为 [0, 1] 范围的值
const audioVolume = computed(() => {
  return volume.value / 100
})

const timerDialogVisible = ref(false)
const soundDialogVisible = ref(false)
const guidanceDialogVisible = ref(false)
const backgroundDialogVisible = ref(false)
const selectedBackground = ref('ripple-purple') // 默认使用紫色光晕背景

const backgroundVideoSrc = computed(() => {
  switch (selectedBackground.value) {
    case 'girl':
      return '@/assets/videos/girl.mp4'
    case 'man':
      return '@/assets/videos/men.mp4'
    default:
      return ''
  }
})

const backgroundAudioSrc = computed(() => {
  switch (selectedSound.value) {
    case 'fire':
      return '@/assets/sounds/fire.mp3'
    case 'wave':
      return '@/assets/sounds/waves.mp3'
    case 'forest':  
      return '@/assets/sounds/leaves.mp3'
    default:
      return '@/assets/sounds/waves.mp3'
  }
})

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer()
  } else {
    startTimer()
  }
}

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value--
      } else {
        stopTimer()
      }
    }, 1000)
  }
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  isRunning.value = false
}

const resetTimer = () => {
  stopTimer()
  remainingTime.value = selectedDuration.value
}

const showTimerDialog = () => {
  timerDialogVisible.value = true
}

const showSoundDialog = () => {
  soundDialogVisible.value = true
}

const showGuidanceDialog = () => {
  guidanceDialogVisible.value = true
}

const showBackgroundDialog = () => {
  backgroundDialogVisible.value = true
}

const confirmDuration = () => {
  remainingTime.value = selectedDuration.value
  timerDialogVisible.value = false
}

const gradientBgRef = ref<HTMLElement | null>(null)

watch(selectedBackground, (newValue) => {
  if (gradientBgRef.value) {
    gradientBgRef.value.setAttribute('data-theme', newValue)
  }
})



// watch(volume, (newValue) => {
//   volume.value = newValue / 100
// })

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.meditation-view {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.gradient-bg {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 紫色主题 */
.gradient-bg[data-theme="ripple-purple"] {
  background: linear-gradient(135deg, #2d1b4e, #1a1a2e);
}

/* 蓝色主题 */
.gradient-bg[data-theme="ripple-blue"] {
  background: linear-gradient(135deg, #1a2a6c, #152d4e);
}

/* 绿色主题 */
.gradient-bg[data-theme="ripple-green"] {
  background: linear-gradient(135deg, #134e5e, #1d3d2e);
}

/* 金色主题 */
.gradient-bg[data-theme="ripple-gold"] {
  background: linear-gradient(135deg, #4e3c1a, #2e2d15);
}

/* 玫瑰色主题 */
.gradient-bg[data-theme="ripple-rose"] {
  background: linear-gradient(135deg, #4e1a39, #2e1529);
}

.gradient-animation {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  animation: ripple 4s ease-out infinite;
}

/* 为每个主题创建波纹颜色 */
.gradient-bg[data-theme="ripple-purple"] .gradient-animation {
  background: radial-gradient(circle, rgba(147, 86, 220, 0.1) 0%, transparent 70%);
  box-shadow: 0 0 80px rgba(147, 86, 220, 0.3);
}

.gradient-bg[data-theme="ripple-blue"] .gradient-animation {
  background: radial-gradient(circle, rgba(86, 166, 220, 0.1) 0%, transparent 70%);
  box-shadow: 0 0 80px rgba(86, 166, 220, 0.3);
}

.gradient-bg[data-theme="ripple-green"] .gradient-animation {
  background: radial-gradient(circle, rgba(86, 220, 143, 0.1) 0%, transparent 70%);
  box-shadow: 0 0 80px rgba(86, 220, 143, 0.3);
}

.gradient-bg[data-theme="ripple-gold"] .gradient-animation {
  background: radial-gradient(circle, rgba(220, 187, 86, 0.1) 0%, transparent 70%);
  box-shadow: 0 0 80px rgba(220, 187, 86, 0.3);
}

.gradient-bg[data-theme="ripple-rose"] .gradient-animation {
  background: radial-gradient(circle, rgba(220, 86, 142, 0.1) 0%, transparent 70%);
  box-shadow: 0 0 80px rgba(220, 86, 142, 0.3);
}

/* 创建多层波纹 */
.gradient-animation::before,
.gradient-animation::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  animation: ripple 4s ease-out infinite;
}

.gradient-animation::before {
  animation-delay: -1s;
}

.gradient-animation::after {
  animation-delay: -2s;
}

@keyframes ripple {
  0% {
    transform: scale(0.3);
    opacity: 0.8;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

/* 添加中心光点 */
.gradient-bg::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 添加半透明遮罩 */
  padding: 2rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-display {
  font-size: 6rem;
  font-weight: 300;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
}

.timer-control-btn {
  padding: 1rem 3rem;
  font-size: 1.4rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.timer-control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.timer-control-btn.running {
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.5);
}

.bottom-controls {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 2;
}

.control-icons {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.control-icon {
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s ease;
}

.control-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
}

.volume-slider {
  width: 80%;
  margin-top: 2rem;
}

:deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
}

:deep(.el-radio-button__inner) {
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .timer-display {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  .timer-control-btn {
    padding: 0.8rem 2rem;
    font-size: 1.2rem;
  }

  .control-icon {
    width: 3rem;
    height: 3rem;
    font-size: 1.2rem;
  }

  .control-icons {
    gap: 1rem;
  }
}

/* 添加背景预览效果 */
.background-preview {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.background-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 
