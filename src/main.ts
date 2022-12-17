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

const app = createApp(App)
app.use(createPinia())
	.provide('Store', Store())
	.provide('clearVariable', clearVariable)
	.use(router)
	.mount('#app')