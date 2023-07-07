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
export const maxMediaSize: number = 1048576 * 20;
export const maxMediaSizeText: string = formatBytes(maxMediaSize);

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
}, maxSize: number = maxFileSize * 2) {
	return (e.currentTarget.files && e.currentTarget.files[0].size > maxSize) ? true : false
}

export function isAcceptedExtension(e: Event & {
	currentTarget: HTMLInputElement
}, exts: Array<string>) {
	let isAccepted = false
	exts.forEach(ext => {
		if (ext.includes('.')) {
			ext = ext.replace(/\./g, '')
		}

		if (e.currentTarget.files && e.currentTarget.files[0]) {
			if (e.currentTarget.files[0].type.match(new RegExp('/' + ext, 'g'))) {
				isAccepted = true;
			}
		}
	})
	return isAccepted
}

export const getSHA256Hash = async (input: any) => {
	const textAsBuffer = new TextEncoder().encode(input);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hash = hashArray
		.map((item) => item.toString(16).padStart(2, "0"))
		.join("");
	return hash;
};

const app = createApp(App)
app
	.use(createPinia())
	.provide('Store', Store())
	.provide('clearVariable', clearVariable)
	.provide('getSHA256Hash', getSHA256Hash)
	.provide('isLargeFile', isLargeFile)
	.provide('maxFileSize', maxFileSize)
	.provide('maxFileSizeText', maxFileSizeText)
	.provide('maxMediaSize', maxMediaSize)
	.provide('maxMediaSizeText', maxMediaSizeText)
	.provide('isAcceptedExtension', isAcceptedExtension)
	.use(router)
	.mount('#app')