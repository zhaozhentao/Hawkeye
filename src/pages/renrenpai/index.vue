<template>
  <view class="screen">
    <view class="bg"></view>
    <view class="statusbar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="content">
      <!-- 页头 -->
      <view class="page-head">
        <view class="eyebrow">门店拜访 · 随身版</view>
        <view class="h1">人人拍</view>
        <view class="sub">选择门店或自定义区域，开始拜访</view>
      </view>

      <!-- 模式切换：门店区域 / 自定义区域 -->
      <view class="mode-tabs">
        <view class="mode-tab" :class="{ on: mode === 'stores' }" @click="mode = 'stores'">门店区域</view>
        <view class="mode-tab" :class="{ on: mode === 'custom' }" @click="mode = 'custom'">自定义区域</view>
      </view>

      <!-- 门店区域 -->
      <block v-if="mode === 'stores'">
        <view class="search">
          <svg-icon name="search" size="32rpx" />
          <input v-model="query" placeholder="搜索门店名称 / 地址" placeholder-class="ph" confirm-type="search" />
        </view>

        <view class="location-strip">
          <svg-icon name="pin" size="28rpx" />
          <text>{{ district }}</text>
          <text class="locate-btn" @click="onLocate">模拟定位</text>
        </view>

        <view class="list-hint">{{ district }} · 按距离排序</view>

        <view class="shop-list">
          <view
            v-for="s in filteredShops"
            :key="s.id"
            class="card shop-card"
            :class="{ selected: s.id === selectedShop }"
            @click="selectedShop = s.id"
          >
            <!-- 门头（仅重点门店展示，伪数据无图片，用渐变占位） -->
            <view v-if="s.hero" class="storefront-card">
              <view class="storefront-thumb">
                <svg-icon name="camera" size="48rpx" />
              </view>
              <view class="storefront-text">
                <text class="brand">{{ s.hero.brand }}</text>
                <text class="brand-sub">{{ s.hero.sub }}</text>
                <text class="brand-caption">{{ s.hero.caption }}</text>
              </view>
            </view>

            <view class="row">
              <view class="store-icon">
                <svg-icon name="store" size="38rpx" />
              </view>
              <text class="tag">{{ fmtDistance(s.distance) }}</text>
            </view>

            <view class="shop-name">{{ s.name }}</view>
            <view class="shop-line">{{ s.type }} · {{ s.address }}</view>
            <view class="shop-desc">{{ s.description }}</view>

            <view class="store-bottom">
              <view class="soft-btn" @click.stop="onEnter(s)">进店 →</view>
            </view>
          </view>

          <view v-if="!filteredShops.length" class="card empty">没有找到门店，可以切换到自定义区域。</view>
        </view>
      </block>

      <!-- 自定义区域 -->
      <view v-else class="card content-pad">
        <view class="row custom-head">
          <text class="tag amber">自定义区域 · 可修改</text>
          <text class="textbtn" @click="fillCustom">填入小区信息</text>
        </view>

        <view class="form-grid">
          <view class="field">
            <text class="field-label">区域名称 *</text>
            <input v-model="form.name" maxlength="80" placeholder="请输入拜访区域名称" placeholder-class="ph" />
          </view>
          <view class="field">
            <text class="field-label">业态（选填）</text>
            <input v-model="form.type" maxlength="40" placeholder="如商超、便利店、其他" placeholder-class="ph" />
          </view>
          <view class="field">
            <text class="field-label">详细地址（选填）</text>
            <input v-model="form.address" maxlength="200" placeholder="填写或补充详细地址" placeholder-class="ph" />
          </view>
          <view class="field">
            <text class="field-label">补充信息</text>
            <textarea
              v-model="form.description"
              maxlength="2000"
              placeholder="填写现场情况、拜访对象或区域特点…"
              placeholder-class="ph"
            />
          </view>
        </view>

        <view class="form-footer">
          <view class="primary" @click="onCustomStart">开始拜访 →</view>
        </view>
      </view>
    </view>

    <tab-bar current="renrenpai" />
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import svgIcon from '@/components/visit/svg-icon.vue'
import tabBar from '@/components/visit/tab-bar.vue'
import { shops, customArea, businessDistrict, fmtDistance } from '@/store/visitData.js'

const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0
const district = businessDistrict

const mode = ref('stores')
const query = ref('')
const selectedShop = ref('FS-OLE')
const form = reactive({ ...customArea })

const filteredShops = computed(() => {
  const q = query.value.trim()
  return shops
    .filter((s) => !q || (s.name + s.address).includes(q))
    .sort((a, b) => a.distance - b.distance)
})

function onLocate() {
  uni.showToast({ title: '已模拟定位到岭南天地商圈', icon: 'none' })
}

function onEnter(s) {
  uni.showToast({ title: `「${s.name}」拜访流程待实现`, icon: 'none' })
}

function fillCustom() {
  Object.assign(form, customArea)
  uni.showToast({ title: '已填入示例小区信息', icon: 'none' })
}

function onCustomStart() {
  if (!form.name.trim()) {
    uni.showToast({ title: '请填写区域名称', icon: 'none' })
    return
  }
  uni.showToast({ title: `「${form.name.trim()}」拜访流程待实现`, icon: 'none' })
}
</script>

<style scoped>
.statusbar {
  position: relative;
  z-index: 1;
}

/* 模式切换 */
.mode-tabs {
  display: flex;
  gap: 8rpx;
  margin: 0 0 32rpx;
  padding: 10rpx;
  background: #192a4166;
  border: 1px solid #b7cdef20;
  border-radius: 22rpx;
}
.mode-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 14rpx;
  font-size: 26rpx;
  color: #a2b5cf;
  border: 1px solid transparent;
}
.mode-tab.on {
  background: #bdd6f224;
  color: #e6f1ff;
  border-color: #c0d7f327;
}

/* 定位条 */
.location-strip {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin: 28rpx 0 8rpx;
  font-size: 22rpx;
  color: #b1c7e2;
}
.locate-btn {
  margin-left: auto;
  color: #d0e4ff;
  text-decoration: underline;
}
.list-hint {
  color: #9db1cd;
  font-size: 22rpx;
  margin: 16rpx 0 20rpx;
}

/* 门店列表 */
.shop-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}
.shop-card {
  padding: 34rpx;
  border-color: #a8c1df25;
  transition: border-color 0.2s;
}
.shop-card.selected {
  border-color: #accffc80;
  background: linear-gradient(125deg, #9ab7de22, #28384c);
}
.store-icon {
  width: 68rpx;
  height: 68rpx;
  border: 1px solid #bad3f033;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #b9d2ed13;
  color: #c7dfff;
}
.shop-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #eef4fe;
  margin: 18rpx 0 0;
}
.shop-line {
  color: #9fb3cd;
  font-size: 24rpx;
  margin-top: 10rpx;
}
.shop-desc {
  color: #8ba0bd;
  font-size: 22rpx;
  line-height: 1.7;
  margin-top: 14rpx;
  padding: 16rpx 20rpx;
  background: #8aaacf0d;
  border-left: 4rpx solid #adc7eb44;
  border-radius: 6rpx;
}
.store-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 28rpx;
}

/* 门头卡片 */
.storefront-card {
  display: flex;
  gap: 30rpx;
  align-items: center;
  background: linear-gradient(115deg, #141b24, #293e55);
  border: 1px solid #b9cee52c;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 28rpx;
}
.storefront-thumb {
  width: 150rpx;
  height: 200rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f9dc4;
  background: linear-gradient(135deg, #2b405a, #1a2637);
}
.storefront-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6rpx;
}
.storefront-text .brand {
  font-size: 56rpx;
  line-height: 1.1;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 2rpx;
  color: #f1f5ff;
}
.storefront-text .brand-sub {
  font-size: 22rpx;
  letter-spacing: 2rpx;
  color: #b2c8e2;
}
.storefront-text .brand-caption {
  font-size: 22rpx;
  color: #afc4df;
  margin-top: 8rpx;
}

/* 自定义区域表单 */
.custom-head {
  margin-bottom: 32rpx;
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}
.field-label {
  display: block;
  font-size: 24rpx;
  color: #b5c8e0;
  margin-bottom: 16rpx;
}
.field input,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #9fbcde35;
  border-radius: 18rpx;
  background: #15223866;
  color: #e4efff;
  font-size: 26rpx;
}
.field input {
  height: 88rpx;
  line-height: 88rpx;
  padding: 0 24rpx;
}
.field textarea {
  min-height: 180rpx;
  padding: 22rpx 24rpx;
  width: 100%;
}
.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 44rpx;
}
</style>
