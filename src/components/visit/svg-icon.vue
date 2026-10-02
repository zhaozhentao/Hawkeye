<template>
  <svg class="ico" :style="{ width: size, height: size }" viewBox="0 0 24 24" aria-hidden="true">
    <template v-if="name === 'store'">
      <path d="M4 10v11h16V10M3 10l2-7h14l2 7M3 10q2 4 5 0q4 4 8 0q3 4 5 0M9 21v-7h6v7" />
    </template>
    <template v-else-if="name === 'record'">
      <rect x="5" y="3" width="15" height="18" rx="2" />
      <path d="M3 7h4M3 12h4M3 17h4M10 8h6M10 12h6M10 16h4" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 5 5" />
    </template>
    <template v-else-if="name === 'camera'">
      <path d="M3 7h4l2-3h6l2 3h4v14H3z" />
      <circle cx="12" cy="13" r="4" />
    </template>
    <template v-else-if="name === 'grid'">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </template>
    <template v-else-if="name === 'pin'">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: String, default: '42rpx' }
})
</script>

<style scoped>
.ico {
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
