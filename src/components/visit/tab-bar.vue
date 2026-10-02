<template>
  <view class="nav">
    <view class="nav-inner">
      <view
        v-for="item in tabs"
        :key="item.key"
        class="nav-btn"
        :class="{ active: item.key === current }"
        @click="switchTab(item)"
      >
        <svg-icon :name="item.icon" size="44rpx" />
        <text class="nav-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import svgIcon from './svg-icon.vue'

const props = defineProps({
  current: { type: String, default: 'renrenpai' }
})

const tabs = [
  { key: 'renrenpai', label: '人人拍', icon: 'store', url: '/pages/renrenpai/index' },
  { key: 'visits', label: '我的拜访', icon: 'record', url: '/pages/visits/index' }
]

function switchTab(item) {
  if (item.key === props.current) return
  uni.reLaunch({ url: item.url })
}
</script>

<style scoped>
.nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: #1b2432dc;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid #a5bed32b;
  box-shadow: 0 -8px 25px #0b131a25;
  padding-bottom: env(safe-area-inset-bottom);
}
.nav-inner {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  height: 130rpx;
}
.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 20rpx;
  color: #8097b3;
  position: relative;
}
.nav-btn.active {
  color: #d2e5ff;
  font-weight: 600;
}
.nav-btn.active::before {
  content: '';
  position: absolute;
  top: 0;
  width: 52rpx;
  height: 6rpx;
  border-radius: 0 0 6rpx 6rpx;
  background: #adcfff;
  box-shadow: 0 0 10px #80b8ff66;
}
.nav-label {
  font-size: 20rpx;
  line-height: 1.2;
}
</style>
