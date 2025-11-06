import { createRoot } from 'react-dom/client'
import '@client/styles/global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import router from './router'
import { useEffect } from 'react'
import useUserStore from './store/user'
import { ACCESS_TOKEN_KEY } from './constants'
import { api } from './libs/api'

const client = new QueryClient()

function App() {
	const { setUser } = useUserStore()
	const fetchUserInfo = async () => {
		try {
			const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
			if (!accessToken) {
				return
			}
			const userResponse = await api.api.users.me.get()
			if(userResponse.error) {
				throw new Error('Failed to fetch user info')
			}
			
			const user: any = userResponse.data
			console.log(user)
			setUser({
				id: user.id,
				username: user.username,
				role: user.role
			})
		} catch (error) {
			console.error(error)
		}
	}
	useEffect(() => {
		fetchUserInfo()
	}, [])
	return (
		<QueryClientProvider client={client}>
			<RouterProvider router={router} />
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: '#363636',
						color: '#fff'
					},
					success: {
						duration: 3000,
						iconTheme: {
							primary: '#10B981',
							secondary: '#fff'
						}
					},
					error: {
						duration: 5000,
						iconTheme: {
							primary: '#EF4444',
							secondary: '#fff'
						}
					}
				}}
			/>
		</QueryClientProvider>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
