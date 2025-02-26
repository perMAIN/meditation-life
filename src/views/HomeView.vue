<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isRippling = ref(false)
const scale = ref(1)
const isStarted = ref(false)

const handleScroll = (e: WheelEvent) => {
  const delta = e.deltaY * -0.001
  const newScale = Math.min(Math.max(scale.value + delta, 0.8), 1.2)
  scale.value = newScale
}

onMounted(() => {
  window.addEventListener('wheel', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleScroll)
})

const startMeditation = () => {
  if (!isStarted.value) {
    isStarted.value = true
    setTimeout(() => {
      router.push('/meditation')
    }, 1000)
  }
}
</script>

<template>
  <div class="home">
    <div class="background-wrapper">
      <div class="background-image"></div>
    </div>
    
    <div class="content-overlay">
      <div class="glass-container" :style="{ transform: `scale(${scale})` }">
        <h1 class="meditation-title">静心冥想</h1>
        <p class="meditation-subtitle">让心灵沉淀，找寻内心的平静</p>
        
        <button 
          class="elegant-button" 
          @click="startMeditation"
          :class="{ 'started': isStarted }">
          {{ isStarted ? '正在开启心灵之旅...' : '开始冥想' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow-x: hidden;
}

.background-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150vh; /* 设置背景图高度大于视口高度 */
  background-image: url('@/assets/images/men-meditation.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* 固定背景，实现视差效果 */
}

.content-overlay {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  padding: 2rem 0;
}

.glass-container {
  width: 60vw; /* 修改为3/5 */
  min-height: 40vh;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.meditation-title {
  color: white;
  font-size: 4.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

.meditation-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.5rem;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 300;
  letter-spacing: 1px;
}

.elegant-button {
  padding: 1.2rem 2.8rem;
  font-size: 1.4rem;
  color: white;
  background: rgba(106, 17, 203, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  font-weight: 400;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.elegant-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(37, 117, 252, 0.6);
  backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.elegant-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.elegant-button:hover::before {
  opacity: 1;
}

.elegant-button span {
  position: relative;
  z-index: 1;
}

.elegant-button.started {
  background: rgba(106, 17, 203, 0.3);
  backdrop-filter: blur(8px);
  cursor: default;
  transform: none;
}

.elegant-button.started:hover {
  transform: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.elegant-button.started::before {
  display: none;
}

@media (max-width: 768px) {
  .home {
    overflow-y: auto;
  }

  .background-image {
    height: 120vh;
  }

  .glass-container {
    width: 90vw;
    padding: 2rem;
  }

  .meditation-title {
    font-size: 2.5rem;
  }

  .meditation-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .elegant-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
  }
}
</style>
