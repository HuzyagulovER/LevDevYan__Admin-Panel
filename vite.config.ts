import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const root_dir = __dirname;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: "dist",
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`
			}
		}
	},
	server: {
		host: true
		// open: '/public/index.html'
	},
	resolve: {
		alias: {
			'@': path.resolve(root_dir, './src'),
			'@views': path.resolve(root_dir, './src/views'),
			'@stores': path.resolve(root_dir, './src/stores'),
			'@helpers': path.resolve(root_dir, './src/helpers'),
			'@comps': path.resolve(root_dir, './src/components'),
			'@add-comps': path.resolve(root_dir, './src/components/add-comps'),
			'@icons': path.resolve(root_dir, './src/components/add-comps/icons'),
			'@for-main': path.resolve(root_dir, './src/components/for-main'),
			'@images': path.resolve(root_dir, './src/assets/images'),
			'@for-courses': path.resolve(root_dir, './src/components/for-courses'),
			'@for-promo': path.resolve(root_dir, './src/components/for-promo'),
			'@for-nots': path.resolve(root_dir, './src/components/for-nots'),
			'@for-course-create': path.resolve(root_dir, './src/components/for-course-create'),
			'@for-content': path.resolve(root_dir, './src/components/for-content'),
			'@for-subscriptions': path.resolve(root_dir, './src/components/for-subscriptions'),
		},
	},

})
