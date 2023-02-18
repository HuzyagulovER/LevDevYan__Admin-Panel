import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia";
import router from './routes';
import { Store } from './stores/store';


export function clearVariable(variable: any): any {
	switch (typeof variable) {
		case 'string':
			return ''

		case 'number':
			return 0

		case 'boolean':
			return false

		case 'object':
			return (Array.isArray(variable)) ? [] : Object.keys(variable).reduce((acc: any, val: any) => {
				acc[val] = clearVariable(variable[val])
				return acc
			}, {})
	}
}

export const maxFileSize: number = 1048576;
export const maxFileSizeText: string = formatBytes(maxFileSize);

function formatBytes(bytes: number, decimals: number = 2) {
	if (!+bytes) return '0 B'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function isLargeFile(e: Event & {
	currentTarget: HTMLInputElement
}) {
	return (e.currentTarget.files && e.currentTarget.files[0].size > 2097152) ? true : false
}

const app = createApp(App)
app.use(createPinia())
	.provide('Store', Store())
	.provide('clearVariable', clearVariable)
	.provide('isLargeFile', isLargeFile)
	.provide('maxFileSize', maxFileSize)
	.provide('maxFileSizeText', maxFileSizeText)
	.use(router)
	.mount('#app')