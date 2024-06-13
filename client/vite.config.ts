import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'https://super-estate-backend.vercel.app/',
				secure: false,
			},
		},
	},

	plugins: [react()],
})
