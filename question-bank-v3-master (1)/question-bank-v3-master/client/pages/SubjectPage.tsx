import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../libs/api'

type Subject = {
	id: number
	name: string
	code: string
	description?: string
	createdAt: string
	updatedAt: string
}

const SubjectPage = () => {
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [loading, setLoading] = useState(true)
	const [showForm, setShowForm] = useState(false)
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		code: '',
		description: ''
	})

	useEffect(() => {
		loadSubjects()
	}, [])

	const loadSubjects = async () => {
		try {
			setLoading(true)
			const response = await api.api.subjects.get()
			if (response.data) {
				setSubjects(response.data as Subject[])
			}
		} catch (error) {
			console.error('Error loading subjects:', error)
			toast.error('Lỗi khi tải danh sách môn học')
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			if (editingSubject) {
				// Update subject
				const response = await api.api.subjects[editingSubject.id].put(
					formData
				)
				if (response.data) {
					toast.success('Cập nhật môn học thành công!')
					loadSubjects()
					resetForm()
				}
			} else {
				// Create subject
				const response = await api.api.subjects.post(formData)
				if (response.data) {
					toast.success('Tạo môn học thành công!')
					loadSubjects()
					resetForm()
				}
			}
		} catch (error) {
			console.error('Error saving subject:', error)
			toast.error('Lỗi khi lưu môn học')
		}
	}

	const handleEdit = (subject: Subject) => {
		setEditingSubject(subject)
		setFormData({
			name: subject.name,
			code: subject.code,
			description: subject.description || ''
		})
		setShowForm(true)
	}

	const handleDelete = async (id: number) => {
		if (confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
			try {
				await api.api.subjects[id].delete()
				toast.success('Xóa môn học thành công!')
				loadSubjects()
			} catch (error) {
				console.error('Error deleting subject:', error)
				toast.error('Lỗi khi xóa môn học')
			}
		}
	}

	const resetForm = () => {
		setFormData({ name: '', code: '', description: '' })
		setEditingSubject(null)
		setShowForm(false)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
					<p className="mt-4 text-slate-300">Đang tải...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-slate-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">
						Quản lý Môn học
					</h1>
					<p className="text-slate-300">
						Thêm, sửa, xóa môn học và chủ đề
					</p>
				</div>

				<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 mb-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-white">
							{editingSubject
								? 'Chỉnh sửa Môn học'
								: 'Thêm Môn học mới'}
						</h2>
						<button
							onClick={() => setShowForm(!showForm)}
							className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
						>
							{showForm ? 'Ẩn form' : 'Thêm môn học'}
						</button>
					</div>

					{showForm && (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Tên môn học *
									</label>
									<input
										type="text"
										required
										value={formData.name}
										onChange={(e) =>
											setFormData({
												...formData,
												name: e.target.value
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Nhập tên môn học"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Mã môn học *
									</label>
									<input
										type="text"
										required
										value={formData.code}
										onChange={(e) =>
											setFormData({
												...formData,
												code: e.target.value
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Nhập mã môn học"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-1">
									Mô tả
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value
										})
									}
									className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									rows={3}
									placeholder="Nhập mô tả môn học"
								/>
							</div>
							<div className="flex space-x-4">
								<button
									type="submit"
									className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors"
								>
									{editingSubject
										? 'Cập nhật'
										: 'Thêm môn học'}
								</button>
								<button
									type="button"
									onClick={resetForm}
									className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-500 transition-colors"
								>
									Hủy
								</button>
							</div>
						</form>
					)}
				</div>

				<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-700">
						<h2 className="text-xl font-semibold text-white">
							Danh sách Môn học
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-700">
							<thead className="bg-slate-900/50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Mã môn học
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Tên môn học
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Mô tả
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Ngày tạo
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody className="bg-slate-800 divide-y divide-slate-700">
								{subjects.map((subject) => (
									<tr
										key={subject.id}
										className="hover:bg-slate-700/50 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
											{subject.code}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-white">
											{subject.name}
										</td>
										<td className="px-6 py-4 text-sm text-slate-400">
											{subject.description || '-'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
											{new Date(
												subject.createdAt
											).toLocaleDateString('vi-VN')}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
											<button
												onClick={() =>
													handleEdit(subject)
												}
												className="text-blue-400 hover:text-blue-300 transition-colors"
											>
												Sửa
											</button>
											<button
												onClick={() =>
													handleDelete(subject.id)
												}
												className="text-red-400 hover:text-red-300 transition-colors"
											>
												Xóa
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{subjects.length === 0 && (
							<div className="text-center py-8 text-slate-400">
								Chưa có môn học nào. Hãy thêm môn học đầu tiên!
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default SubjectPage
