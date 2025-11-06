import { Outlet, useLocation, useNavigate, Link } from 'react-router'
import { useEffect, useState } from 'react'
import { ACCESS_TOKEN_KEY } from '@client/constants'
import useUserStore from '../store/user'

const ProtectedPageLayout = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { user, clearUser } = useUserStore()
	const [sidebarOpen, setSidebarOpen] = useState(true)

	useEffect(() => {
		const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
		if (!accessToken) {
			navigate('/login')
		}
	}, [location.pathname])

	const handleLogout = () => {
		localStorage.removeItem(ACCESS_TOKEN_KEY)
		clearUser()
		navigate('/login')
	}

	const isActive = (path: string) => {
		return location.pathname === path
	}

	const menuItems = [
		{
			path: '/',
			label: 'Trang chủ',
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
			)
		},
		{
			path: '/subjects',
			label: 'Môn học',
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
			)
		},
		{
			path: '/questions',
			label: 'Câu hỏi',
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			)
		},
		{
			path: '/exams',
			label: 'Đề thi',
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			)
		}
	]

	return (
		<div className="flex h-screen bg-slate-900 overflow-hidden">
			{/* Sidebar */}
			<aside
				className={`${
					sidebarOpen ? 'w-64' : 'w-20'
				} bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col`}
			>
				{/* Logo/Header */}
				<div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
					{sidebarOpen && (
						<Link
							to="/"
							className="text-xl font-bold text-white flex items-center gap-2"
						>
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">
									QB
								</span>
							</div>
							<span>Question Bank</span>
						</Link>
					)}
					{!sidebarOpen && (
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
							<span className="text-white font-bold text-sm">
								QB
							</span>
						</div>
					)}
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors"
					>
						{sidebarOpen ? (
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
					{menuItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
								isActive(item.path)
									? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
									: 'text-slate-300 hover:bg-slate-700 hover:text-white'
							}`}
							title={!sidebarOpen ? item.label : ''}
						>
							{item.icon}
							{sidebarOpen && (
								<span className="font-medium">
									{item.label}
								</span>
							)}
						</Link>
					))}
				</nav>

				{/* User Info & Logout */}
				<div className="p-4 border-t border-slate-700">
					{sidebarOpen && (
						<div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
									{user.username.charAt(0).toUpperCase()}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-white truncate">
										{user.username}
									</p>
									<p className="text-xs text-slate-400 capitalize">
										{user.role}
									</p>
								</div>
							</div>
						</div>
					)}
					{!sidebarOpen && (
						<div className="mb-3 flex justify-center">
							<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
								{user.username.charAt(0).toUpperCase()}
							</div>
						</div>
					)}
					<button
						onClick={handleLogout}
						className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${
							!sidebarOpen ? 'justify-center' : ''
						}`}
						title={!sidebarOpen ? 'Đăng xuất' : ''}
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						{sidebarOpen && (
							<span className="font-medium">Đăng xuất</span>
						)}
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 flex flex-col overflow-hidden">
				<div className="flex-1 overflow-y-auto bg-slate-900">
					<Outlet />
				</div>
			</main>
		</div>
	)
}

export default ProtectedPageLayout
