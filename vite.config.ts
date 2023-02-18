import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const root_dir = __dirname;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		// outDir: 'C:\\Users\\eduar\\Desktop\\Projects\\levdevyan\\test',
		outDir: "dist"
	},
	server: {
		host: true
		// open: '/public/index.html'
	},
	resolve: {
		alias: {
			'@': path.resolve(root_dir, './src'),
			'@helpers': path.resolve(root_dir, './helpers'),
			'@comps': path.resolve(root_dir, './src/components'),
			'@add-comps': path.resolve(root_dir, './src/components/add-comps'),
			'@icons': path.resolve(root_dir, './src/components/add-comps/icons'),
			'@for-main': path.resolve(root_dir, './src/components/for-main'),
			'@images': path.resolve(root_dir, './src/assets/images'),
			'@for-courses': path.resolve(root_dir, './src/components/for-courses'),
			'@for-promo': path.resolve(root_dir, './src/components/for-promo'),
			'@for-nots': path.resolve(root_dir, './src/components/for-nots'),
			'@for-course-create': path.resolve(root_dir, './src/components/for-course-create'),
		},
	},
})
