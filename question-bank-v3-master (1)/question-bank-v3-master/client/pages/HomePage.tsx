import { Link } from 'react-router'
import useUserStore from '../store/user'

const HomePage = () => {
	const { user } = useUserStore()

	return (
		<div className="min-h-screen bg-slate-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-white mb-4">
						Hệ thống Quản lý Ngân hàng Câu hỏi
					</h1>
					<p className="text-xl text-slate-300">
						Chào mừng, {user.username}! Quản lý môn học, câu hỏi và
						tạo đề thi một cách dễ dàng
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<Link
						to="/subjects"
						className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200"
					>
						<div className="text-center">
							<div className="bg-blue-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-blue-400"
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
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">
								Quản lý Môn học
							</h3>
							<p className="text-slate-400">
								Thêm, sửa, xóa môn học và chủ đề
							</p>
						</div>
					</Link>

					<Link
						to="/questions"
						className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-200"
					>
						<div className="text-center">
							<div className="bg-green-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-green-400"
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
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">
								Quản lý Câu hỏi
							</h3>
							<p className="text-slate-400">
								Thêm câu hỏi thủ công hoặc import hàng loạt
							</p>
						</div>
					</Link>

					<Link
						to="/exams"
						className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-200"
					>
						<div className="text-center">
							<div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-purple-400"
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
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">
								Tạo Đề thi
							</h3>
							<p className="text-slate-400">
								Tạo và quản lý đề thi, sinh mã đề tự động
							</p>
						</div>
					</Link>
				</div>

				<div className="mt-12 bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-8">
					<h2 className="text-2xl font-semibold text-white mb-6 text-center">
						Hướng dẫn sử dụng
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="bg-blue-600/20 rounded-lg p-4 mb-4">
								<span className="text-2xl font-bold text-blue-400">
									1
								</span>
							</div>
							<h3 className="font-semibold text-white mb-2">
								Tạo Môn học
							</h3>
							<p className="text-sm text-slate-400">
								Bắt đầu bằng việc tạo các môn học và chủ đề
							</p>
						</div>
						<div className="text-center">
							<div className="bg-green-600/20 rounded-lg p-4 mb-4">
								<span className="text-2xl font-bold text-green-400">
									2
								</span>
							</div>
							<h3 className="font-semibold text-white mb-2">
								Thêm Câu hỏi
							</h3>
							<p className="text-sm text-slate-400">
								Nhập câu hỏi cho từng môn học
							</p>
						</div>
						<div className="text-center">
							<div className="bg-purple-600/20 rounded-lg p-4 mb-4">
								<span className="text-2xl font-bold text-purple-400">
									3
								</span>
							</div>
							<h3 className="font-semibold text-white mb-2">
								Tạo Đề thi
							</h3>
							<p className="text-sm text-slate-400">
								Tạo đề thi và sinh nhiều mã đề khác nhau
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomePage
