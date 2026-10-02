/**
 * 人人拍 / 我的拜访 演示数据（伪数据，未对接任何接口）
 * 数据参考自「门店拜访 · 随身版」demo，品牌为海天（本品）/ 李锦记（竞品）。
 */

const DAY = 86400000

/** 商圈锚点（仅用于文案展示，地图部分已省略） */
export const businessDistrict = '佛山 · 岭南天地商圈'

/** 门店列表，distance 为预置的模拟距离（米），实际项目应由定位计算 */
export const shops = [
  {
    id: 'FS-OLE',
    name: 'Olé 精品超市 · 佛山商圈店',
    type: '精品超市',
    address: '广东省佛山市禅城区祖庙大街2号 · 岭南天地',
    distance: 320,
    hero: { brand: 'Olé', sub: 'food hall', caption: '精品超市现场拜访' },
    description: '重点查看调味品货架、价格签及本品 / 竞品排面，记录节假日消费偏好。'
  },
  {
    id: 'FS-SHOP2',
    name: '社区生活超市 · 祖庙片区',
    type: '社区超市',
    address: '佛山市禅城区 · 祖庙路周边',
    distance: 680,
    description: '检查常温调味品区与收银台陈列，补录促销信息和缺货商品。'
  },
  {
    id: 'FS-SHOP3',
    name: '邻里便利店 · 福贤路',
    type: '便利店',
    address: '佛山市禅城区 · 福贤路周边',
    distance: 950,
    description: '记录即食消费需求、货架陈列与小规格产品销售反馈。'
  },
  {
    id: 'FS-SHOP4',
    name: '商圈优选超市 · 建新路',
    type: '综合超市',
    address: '佛山市禅城区 · 建新路周边',
    distance: 1240,
    description: '走访家庭消费场景，收集组合装、包装设计与宣传物料意见。'
  }
]

/** 自定义区域表单初始值 */
export const customArea = {
  name: '岭南花园小区',
  type: '大型社区',
  address: '佛山市禅城区 · 岭南花园小区',
  description: '走访小区居民，了解家庭消费习惯，收集产品意见与建议。'
}

/** SKU 字典（本品 / 竞品） */
export const skuDict = {
  own: [
    { id: '10001', name: '海天老酱油', kind: '本品' },
    { id: '10002', name: '海天生抽', kind: '本品' },
    { id: '10003', name: '海天蚝油', kind: '本品' }
  ],
  comp: [
    { id: '20001', name: '李锦记薄盐生抽', kind: '竞品' },
    { id: '20002', name: '李锦记蚝油', kind: '竞品' }
  ]
}

/** 依据本品 / 竞品各排面数生成 SKU 明细 */
function buildSkus(ownCounts, compCounts) {
  return [
    ...skuDict.own.map((s, i) => ({ ...s, count: ownCounts[i] ?? 0 })),
    ...skuDict.comp.map((s, i) => ({ ...s, count: compCounts[i] ?? 0 }))
  ]
}

/** 生成相对今天的时间戳：dayOffset 天前 hour:minute */
function at(dayOffset, hour, minute = 0) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime() - dayOffset * DAY + (hour * 60 + minute) * 60000
}

const storeTarget = (id) => {
  const s = shops.find((x) => x.id === id)
  return { id: s.id, name: s.name, kind: 'store', type: s.type, address: s.address }
}

/**
 * 拜访记录（伪数据）。字段说明：
 * recognized  —— 是否完成鹰眼识别（决定 AI 识别照片数）
 * photoCount  —— 现场照片张数
 * hasSummary  —— 是否有练兵总结
 */
export const visits = [
  {
    id: 'V1',
    target: storeTarget('FS-OLE'),
    start: at(0, 9, 0),
    end: at(0, 9, 24),
    recognized: true,
    photoCount: 3,
    hasSummary: true,
    skus: buildSkus([9, 8, 7], [11, 13]),
    prevSkus: buildSkus([8, 7, 7], [10, 12]),
    notes: [
      { title: '用户意见与建议', text: '建议增加低盐口味选择，并在包装上突出规格与适用场景。' },
      { title: '消费趋势', text: '小规格和低盐产品关注度较高，家庭顾客倾向组合购买。' }
    ],
    transcript: '本次完成门店货架与价格签检查，记录本品和竞品排面，收集包装与消费需求反馈。',
    summary: '现场发现：本品价格签完整，竞品有组合促销。\n主要反馈：低盐、小规格及家庭组合装需求较多。\n后续事项：跟进陈列与宣传改进，下次回访核实。'
  },
  {
    id: 'V2',
    target: storeTarget('FS-SHOP2'),
    start: at(0, 11, 5),
    end: at(0, 11, 26),
    recognized: true,
    photoCount: 2,
    hasSummary: true,
    skus: buildSkus([6, 5, 4], [9, 8]),
    prevSkus: buildSkus([6, 6, 4], [8, 7]),
    notes: [{ title: '宣传改进', text: '建议提高包装文字辨识度，补充清晰的产品介绍和活动说明。' }],
    transcript: '完成社区超市常温区陈列检查，核对促销信息与缺货情况。',
    summary: '现场发现：常温区陈列整齐，本品排面稳定。\n主要反馈：促销标识不够醒目。\n后续事项：补充宣传物料并回访。'
  },
  {
    id: 'V3',
    target: storeTarget('FS-SHOP3'),
    start: at(1, 15, 30),
    end: at(1, 15, 48),
    recognized: true,
    photoCount: 3,
    hasSummary: false,
    skus: buildSkus([4, 3, 2], [7, 6]),
    prevSkus: buildSkus([4, 3, 3], [6, 5]),
    notes: [{ title: '消费趋势', text: '便利店即食场景下小规格产品动销较快。' }],
    transcript: '',
    summary: ''
  },
  {
    id: 'V4',
    target: storeTarget('FS-OLE'),
    start: at(3, 10, 0),
    end: at(3, 10, 25),
    recognized: true,
    photoCount: 2,
    hasSummary: true,
    skus: buildSkus([8, 7, 7], [10, 12]),
    prevSkus: buildSkus([7, 6, 6], [10, 11]),
    notes: [{ title: 'Top竞品补录', text: '李锦记薄盐生抽，竞品排面靠前的黄金视线层，正在做组合促销。' }],
    transcript: '回访 Olé 精品超市，核对上次陈列改进情况。',
    summary: '现场发现：本品排面较上次提升。\n主要反馈：竞品促销力度较大。\n后续事项：跟进本品促销资源投放。'
  },
  {
    id: 'V5',
    target: { id: 'FS-AREA-GARDEN', name: '岭南花园小区', kind: 'custom', type: '大型社区', address: '佛山市禅城区 · 岭南花园小区' },
    start: at(3, 16, 0),
    end: at(3, 16, 32),
    recognized: false,
    photoCount: 0,
    hasSummary: true,
    skus: [],
    prevSkus: [],
    notes: [{ title: '用户意见与建议', text: '居民更关注家庭日常消费与性价比，对低盐、小规格产品有兴趣。' }],
    transcript: '本次完成小区居民走访，了解家庭消费习惯，收集产品包装、口味和价格方面的意见。',
    summary: '现场发现：居民重视性价比与家庭消费需求。\n主要反馈：希望增加低盐口味，优化包装说明。\n后续事项：整理意见并跟进反馈。'
  },
  {
    id: 'V6',
    target: storeTarget('FS-SHOP4'),
    start: at(8, 9, 30),
    end: at(8, 9, 55),
    recognized: true,
    photoCount: 3,
    hasSummary: true,
    skus: buildSkus([7, 6, 5], [8, 9]),
    prevSkus: buildSkus([6, 5, 5], [9, 8]),
    notes: [{ title: '消费趋势', text: '家庭顾客倾向组合装采购，节假日需求明显。' }],
    transcript: '走访综合超市，收集组合装与包装设计的意见。',
    summary: '现场发现：组合装动销良好。\n主要反馈：包装设计需突出节日氛围。\n后续事项：反馈市场部评估物料更新。'
  },
  {
    id: 'V7',
    target: storeTarget('FS-SHOP2'),
    start: at(20, 14, 10),
    end: at(20, 14, 35),
    recognized: false,
    photoCount: 1,
    hasSummary: true,
    skus: [],
    prevSkus: [],
    notes: [{ title: '质量改进', text: '个别瓶装产品外箱有挤压痕迹，建议加强运输防护。' }],
    transcript: '例行回访社区超市，检查陈列与库存。',
    summary: '现场发现：库存充足，陈列规范。\n主要反馈：外箱运输有挤压。\n后续事项：反馈物流优化包装防护。'
  }
].sort((a, b) => b.end - a.end)

/* ------------------------------ 工具函数 ------------------------------ */

export const pad = (n) => String(n).padStart(2, '0')

/** 时间戳 -> HH:MM */
export function fmtTime(t) {
  const d = new Date(t)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 时间戳 -> YYYY-MM-DD */
export function fmtDate(t) {
  const d = new Date(t)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 时间戳 -> MM-DD */
export function fmtMonthDay(t) {
  const d = new Date(t)
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 拜访时长（分钟） */
export const mins = (r) => Math.max(0, Math.round((r.end - r.start) / 60000))

/** 时长文案 */
export function duration(n) {
  if (n >= 60) {
    const h = Math.floor(n / 60)
    const m = Math.round(n % 60)
    return `${h}小时${m ? m + '分' : ''}`
  }
  return `${Math.round(n)}分钟`
}

/** 距离文案：< 1000m 显示米，否则显示公里 */
export function fmtDistance(m) {
  if (m == null) return '距离待定位'
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`
}

/** 统计某类 SKU 排面合计 */
export function sumKind(skus, kind) {
  return (skus || []).filter((s) => s.kind === kind).reduce((n, s) => n + (s.count || 0), 0)
}

/** 今日 0 点时间戳 */
function todayStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/**
 * 依据筛选条件过滤拜访记录
 * @param {Object} f { period:'all'|'today'|'week'|'month'|'custom', type:'all'|'store'|'custom', q, from, to }
 */
export function filterVisits(list, f) {
  const t = todayStart()
  let a = 0
  let b = t + DAY
  if (f.period === 'today') a = t
  else if (f.period === 'week') a = t - ((new Date(t).getDay() + 6) % 7) * DAY
  else if (f.period === 'month') a = new Date(new Date(t).getFullYear(), new Date(t).getMonth(), 1).getTime()
  else if (f.period === 'custom') {
    a = f.from ? new Date(f.from + 'T00:00:00').getTime() : 0
    b = f.to ? new Date(f.to + 'T00:00:00').getTime() + DAY : Number.MAX_SAFE_INTEGER
  }
  return list
    .filter((r) => r.end >= a && r.end < b)
    .filter((r) => f.type === 'all' || r.target.kind === f.type)
    .filter((r) => !f.q || r.target.name.includes(f.q))
    .sort((x, y) => y.end - x.end)
}

/** 汇总指标 */
export function visitMetrics(list) {
  const stores = new Set(list.filter((r) => r.target.kind === 'store').map((r) => r.target.id))
  return [
    { label: '拜访门店', value: stores.size, unit: '家' },
    { label: '拜访次数', value: list.length, unit: '次' },
    { label: 'AI识别照片数', value: list.reduce((n, r) => n + (r.recognized ? r.photoCount : 0), 0), unit: '张' },
    { label: '练兵总结数', value: list.filter((r) => r.hasSummary).length, unit: '条' }
  ]
}

/** 按日期分组（返回 [{ date, items:[] }]，已按时间倒序） */
export function groupByDate(list) {
  const groups = []
  list.forEach((r) => {
    const key = fmtDate(r.end)
    const last = groups[groups.length - 1]
    if (last && last.date === key) last.items.push(r)
    else groups.push({ date: key, items: [r] })
  })
  return groups
}
