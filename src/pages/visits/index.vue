<template>
  <view class="screen">
    <view class="bg"></view>
    <view class="statusbar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="content">
      <!-- 页头 -->
      <view class="page-head">
        <view class="eyebrow">门店拜访 · 随身版</view>
        <view class="h1">我的拜访</view>
        <view class="sub">每一次抵达，都留下记录</view>
      </view>

      <!-- 时间筛选 -->
      <scroll-view scroll-x class="seg-scroll">
        <view class="seg">
          <view
            v-for="p in periods"
            :key="p.value"
            class="seg-btn"
            :class="{ on: filter.period === p.value }"
            @click="filter.period = p.value"
          >
            {{ p.label }}
          </view>
        </view>
      </scroll-view>

      <view v-if="filter.period === 'custom'" class="custom-range">
        <picker mode="date" :value="filter.from" @change="(e) => (filter.from = e.detail.value)">
          <view class="date-box">{{ filter.from || '开始日期' }}</view>
        </picker>
        <text class="range-sep">至</text>
        <picker mode="date" :value="filter.to" @change="(e) => (filter.to = e.detail.value)">
          <view class="date-box">{{ filter.to || '结束日期' }}</view>
        </picker>
      </view>

      <!-- 个人拜访汇总 -->
      <view class="card summary-card">
        <view class="card-head">
          <view class="card-title"><text class="h2">个人拜访汇总</text></view>
        </view>
        <view class="record-metrics">
          <view v-for="m in metrics" :key="m.label" class="stat">
            <view class="label">{{ m.label }}</view>
            <view class="value">
              <text class="num-strong">{{ m.value }}</text>
              <text class="unit">{{ m.unit }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 搜索 / 类型筛选 -->
      <view class="record-filters">
        <view class="search filter-search">
          <svg-icon name="search" size="32rpx" />
          <input v-model="filter.q" placeholder="搜索门店 / 区域名称" placeholder-class="ph" />
        </view>
        <picker mode="selector" :range="typeLabels" :value="typeIndex" @change="onTypeChange">
          <view class="select">
            <text>{{ typeLabels[typeIndex] }}</text>
            <text class="caret">▾</text>
          </view>
        </picker>
      </view>

      <!-- 记录列表 -->
      <view class="record-list">
        <block v-for="g in groups" :key="g.date">
          <view class="date-heading">
            <text>{{ g.date }}</text>
            <view class="date-line"></view>
          </view>
          <view v-for="r in g.items" :key="r.id" class="card history-card" @click="openDetail(r)">
            <view class="row">
              <text class="tag">{{ r.target.kind === 'store' ? '门店拜访' : '自定义区域' }}</text>
            </view>
            <view class="history-name">{{ r.target.name }}</view>
            <view class="shop-line">{{ fmtTime(r.start) }}—{{ fmtTime(r.end) }} · {{ duration(mins(r)) }}</view>

            <view v-if="r.photoCount" class="history-thumbs">
              <view v-for="n in Math.min(r.photoCount, 3)" :key="n" class="thumb">
                <svg-icon name="camera" size="34rpx" />
              </view>
            </view>

            <view class="history-meta">
              <text class="meta-text">
                AI识别照片 {{ r.recognized ? r.photoCount : 0 }} 张 · 练兵总结 {{ r.hasSummary ? 1 : 0 }} 条
              </text>
              <text class="textbtn" @click.stop="openDetail(r)">查看详情 ↗</text>
            </view>
          </view>
        </block>

        <view v-if="!flat.length" class="card empty">暂无匹配的拜访记录</view>
      </view>
    </view>

    <!-- 详情弹窗 -->
    <view v-if="detail" class="modal-mask" @click="detail = null">
      <view class="modal" @click.stop>
        <view class="modal-head">
          <text class="modal-title">拜访详情</text>
          <view class="close" @click="detail = null">×</view>
        </view>
        <scroll-view scroll-y class="modal-body">
          <view class="detail-name">{{ detail.target.name }}</view>
          <view class="detail-sub">{{ fmtDate(detail.start) }} {{ fmtTime(detail.start) }}—{{ fmtTime(detail.end) }}</view>
          <view class="detail-sub">{{ detail.target.address }}</view>

          <!-- 货架照片与识别结果 -->
          <view v-if="detail.photoCount || detail.recognized" class="detail-block">
            <view class="block-h3">货架照片与识别结果</view>
            <view v-if="detail.photoCount" class="history-thumbs">
              <view v-for="n in detail.photoCount" :key="n" class="thumb">
                <svg-icon name="camera" size="34rpx" />
              </view>
            </view>
            <view v-if="detail.recognized" class="recogn-line">
              本品 {{ sumKind(detail.skus, '本品') }} 排面 · 竞品 {{ sumKind(detail.skus, '竞品') }} 排面
            </view>
          </view>

          <!-- 与上一次对比 -->
          <view v-if="detail.recognized && detail.prevSkus && detail.prevSkus.length" class="detail-block">
            <view class="block-h3">与上一次对比</view>
            <view class="cmp-table">
              <view class="cmp-row cmp-head">
                <text class="cmp-c">排面</text><text class="cmp-c">前次</text><text class="cmp-c">上次</text><text class="cmp-c">变化</text>
              </view>
              <view v-for="k in ['本品', '竞品']" :key="k" class="cmp-row">
                <text class="cmp-c">{{ k }}</text>
                <text class="cmp-c">{{ sumKind(detail.prevSkus, k) }}</text>
                <text class="cmp-c">{{ sumKind(detail.skus, k) }}</text>
                <text class="cmp-c" :class="deltaClass(sumKind(detail.prevSkus, k), sumKind(detail.skus, k))">
                  {{ deltaText(sumKind(detail.prevSkus, k), sumKind(detail.skus, k)) }}
                </text>
              </view>
            </view>
          </view>

          <!-- 现场信息沉淀 -->
          <view v-if="detail.notes && detail.notes.length" class="detail-block">
            <view class="block-h3">现场信息沉淀</view>
            <view v-for="(n, i) in detail.notes" :key="i" class="note-item">
              <view class="note-title">{{ n.title }}</view>
              <view class="note-text">{{ n.text }}</view>
            </view>
          </view>

          <!-- 工作总结 -->
          <view v-if="detail.transcript || detail.summary" class="detail-block">
            <view class="block-h3">工作总结</view>
            <view v-if="detail.transcript" class="summary-transcript">转写文字：{{ detail.transcript }}</view>
            <view v-if="detail.summary" class="summary-text">{{ detail.summary }}</view>
          </view>

          <view class="modal-footer">
            <view class="soft-btn" @click="revisit">再次拜访此地点 →</view>
          </view>
        </scroll-view>
      </view>
    </view>

    <tab-bar current="visits" />
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import svgIcon from '@/components/visit/svg-icon.vue'
import tabBar from '@/components/visit/tab-bar.vue'
import {
  visits,
  filterVisits,
  visitMetrics,
  groupByDate,
  sumKind,
  fmtTime,
  fmtDate,
  duration,
  mins
} from '@/store/visitData.js'

const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0

const periods = [
  { value: 'all', label: '全部' },
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'custom', label: '自选日期' }
]
const typeLabels = ['全部拜访', '门店拜访', '自定义区域']
const typeValues = ['all', 'store', 'custom']

const filter = reactive({ period: 'all', type: 'all', q: '', from: '', to: '' })
const detail = ref(null)

const typeIndex = computed(() => typeValues.indexOf(filter.type))
const flat = computed(() => filterVisits(visits, filter))
const metrics = computed(() => visitMetrics(flat.value))
const groups = computed(() => groupByDate(flat.value))

function onTypeChange(e) {
  filter.type = typeValues[Number(e.detail.value)]
}
function openDetail(r) {
  detail.value = r
}
function revisit() {
  detail.value = null
  uni.showToast({ title: '拜访流程待实现', icon: 'none' })
}
function deltaClass(prev, cur) {
  return cur > prev ? 'up' : cur < prev ? 'fall' : ''
}
function deltaText(prev, cur) {
  return cur > prev ? '↑' + (cur - prev) : cur < prev ? '↓' + (prev - cur) : '—'
}
</script>

<style scoped>
.statusbar {
  position: relative;
  z-index: 1;
}

/* 时间筛选 */
.seg-scroll {
  margin-bottom: 8rpx;
  white-space: nowrap;
}
.seg-scroll .seg {
  display: inline-flex;
  width: max-content;
  min-width: 100%;
}
.seg-scroll .seg-btn {
  flex: none;
  padding: 14rpx 30rpx;
}
.custom-range {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 24rpx 0 8rpx;
}
.date-box {
  border: 1px solid #9fbcde35;
  border-radius: 14rpx;
  padding: 16rpx 24rpx;
  background: #15223866;
  color: #dfebfc;
  font-size: 24rpx;
}
.range-sep {
  color: #9db1cd;
  font-size: 24rpx;
}

/* 汇总卡片 */
.summary-card {
  margin-top: 28rpx;
}
.record-metrics {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 34rpx 34rpx;
}
.record-metrics .stat {
  width: 50%;
  box-sizing: border-box;
  padding: 26rpx 0;
  border-bottom: 1px solid var(--line);
}
.record-metrics .stat:nth-last-child(-n + 2) {
  border-bottom: 0;
  padding-bottom: 0;
}
.num-strong {
  font-size: 48rpx;
  font-weight: 600;
  color: #f0f5ff;
  letter-spacing: -1px;
}

/* 筛选行 */
.record-filters {
  display: flex;
  gap: 20rpx;
  align-items: center;
  margin: 28rpx 0 8rpx;
}
.filter-search {
  flex: 1;
  min-width: 0;
}
.select {
  display: flex;
  align-items: center;
  gap: 10rpx;
  border: 1px solid #adc2dd29;
  background: #25354b80;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  color: #d0def0;
  font-size: 24rpx;
  white-space: nowrap;
}
.caret {
  font-size: 20rpx;
  color: #9db1cd;
}

/* 记录列表 */
.record-list {
  margin-top: 20rpx;
}
.date-heading {
  display: flex;
  align-items: center;
  gap: 20rpx;
  font-size: 24rpx;
  color: #b6cbe6;
  margin: 34rpx 0 18rpx;
}
.date-line {
  flex: 1;
  height: 1px;
  background: #adcaee1b;
}
.history-card {
  padding: 34rpx;
  margin-bottom: 24rpx;
}
.history-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #eef4fe;
  margin: 14rpx 0 0;
}
.shop-line {
  color: #9fb3cd;
  font-size: 24rpx;
  margin-top: 8rpx;
}
.history-thumbs {
  display: flex;
  gap: 16rpx;
  margin: 24rpx 0;
}
.thumb {
  width: 148rpx;
  height: 134rpx;
  border-radius: 14rpx;
  border: 1px solid #b5ceed26;
  background: linear-gradient(135deg, #2b405a, #1a2637);
  color: #7f9dc4;
  display: flex;
  align-items: center;
  justify-content: center;
}
.history-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}
.meta-text {
  color: #99afcb;
  font-size: 22rpx;
  flex: 1;
  min-width: 0;
}

/* 弹窗 */
.modal-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  background: #0712219c;
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}
.modal {
  width: 100%;
  max-width: 620px;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #35445c, #232d3b);
  border: 1px solid #a9c5e63d;
  border-radius: 36rpx;
  padding: 40rpx;
  box-sizing: border-box;
  box-shadow: 0 30px 100px #0006;
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.modal-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #eef4fe;
}
.close {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #b6cce319;
  color: #d9eaff;
  font-size: 40rpx;
  line-height: 56rpx;
  text-align: center;
}
.modal-body {
  max-height: 62vh;
}
.detail-name {
  font-size: 34rpx;
  font-weight: 600;
  color: #f1f5fc;
}
.detail-sub {
  font-size: 22rpx;
  color: #a1b2c9;
  margin-top: 8rpx;
}
.detail-block {
  padding: 30rpx 0;
  border-bottom: 1px solid var(--line);
}
.block-h3 {
  font-size: 28rpx;
  font-weight: 600;
  color: #d6e3f6;
  margin-bottom: 16rpx;
}
.recogn-line {
  font-size: 24rpx;
  color: #adc2de;
  margin-top: 8rpx;
}
.cmp-table {
  margin-top: 8rpx;
}
.cmp-row {
  display: flex;
  border-bottom: 1px solid #a5bedb14;
}
.cmp-row.cmp-head .cmp-c {
  color: #8da5c2;
  font-size: 20rpx;
}
.cmp-c {
  flex: 1;
  padding: 18rpx 6rpx;
  font-size: 24rpx;
  color: #cbdaf0;
}
.cmp-c:last-child {
  text-align: right;
}
.note-item {
  margin-top: 16rpx;
  border: 1px solid #b1c9e023;
  padding: 24rpx;
  border-radius: 18rpx;
  background: #121f3022;
}
.note-title {
  font-size: 26rpx;
  color: #e3ebf7;
  margin-bottom: 10rpx;
}
.note-text {
  font-size: 24rpx;
  color: #aabed9;
  line-height: 1.7;
}
.summary-transcript {
  font-size: 24rpx;
  color: #aec1dc;
  line-height: 1.7;
}
.summary-text {
  font-size: 24rpx;
  color: #aec1dc;
  line-height: 1.7;
  white-space: pre-wrap;
  margin-top: 16rpx;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 30rpx;
}
</style>
