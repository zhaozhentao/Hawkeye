import {
	createSSRApp
} from "vue";
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import '@tdesign/uniapp/common/style/theme/index.less'
import './styles/visit-theme.css'
import zh from './locale/zh.json'
import en from './locale/en.json'

export function createApp() {
	const app = createSSRApp(App);

	// 读取持久化的语言偏好，默认中文
	const savedLocale = uni.getStorageSync('app_locale') || 'zh'

	const i18n = createI18n({
		locale: savedLocale,
		fallbackLocale: 'zh',
		messages: { zh, en },
		legacy: false
	})

	app.use(i18n)

	app.config.globalProperties.$statusBarHeight = uni.getSystemInfoSync().statusBarHeight

	return {
		app,
	};
}
