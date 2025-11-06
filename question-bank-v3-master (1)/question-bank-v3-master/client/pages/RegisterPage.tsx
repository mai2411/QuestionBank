import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { toast } from 'react-hot-toast'
import { api } from '../libs/api'

const RegisterPage = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		confirmPassword: ''
	})
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (formData.password !== formData.confirmPassword) {
			toast.error('Mật khẩu xác nhận không khớp!')
			return
		}

		setLoading(true)

		try {
			const response = await api.api.users.register.post({
				username: formData.username,
				password: formData.password
			})

			if (response.data) {
				toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
				navigate('/login')
			} else if (response.error) {
				const error = response.error.value as any
				toast.error(
					'Đăng ký thất bại: ' +
						(error?.message || 'Lỗi không xác định')
				)
			}
		} catch (error) {
			console.error('Register error:', error)
			toast.error('Lỗi khi đăng ký')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center mb-6">
					<div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
						<span className="text-white font-bold text-2xl">
							QB
						</span>
					</div>
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-white">
					Tạo tài khoản mới
				</h2>
				<p className="mt-2 text-center text-sm text-slate-400">
					Hoặc{' '}
					<Link
						to="/login"
						className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
					>
						đăng nhập vào tài khoản có sẵn
					</Link>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-slate-800 border border-slate-700 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-slate-300"
							>
								Tên đăng nhập
							</label>
							<div className="mt-1">
								<input
									id="username"
									name="username"
									type="text"
									required
									value={formData.username}
									onChange={(e) =>
										setFormData({
											...formData,
											username: e.target.value
										})
									}
									className="appearance-none block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Nhập tên đăng nhập"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-slate-300"
							>
								Mật khẩu
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									required
									value={formData.password}
									onChange={(e) =>
										setFormData({
											...formData,
											password: e.target.value
										})
									}
									className="appearance-none block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Nhập mật khẩu"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-slate-300"
							>
								Xác nhận mật khẩu
							</label>
							<div className="mt-1">
								<input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									required
									value={formData.confirmPassword}
									onChange={(e) =>
										setFormData({
											...formData,
											confirmPassword: e.target.value
										})
									}
									className="appearance-none block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Nhập lại mật khẩu"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{loading ? 'Đang đăng ký...' : 'Đăng ký'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default RegisterPage
