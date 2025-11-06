import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../libs/api'

type Subject = {
	id: number
	name: string
	code: string
}

type Exam = {
	id: number
	name: string
	code: string
	duration: number
	numberOfQuestions: number
	subjectId: number
	createdAt: string
	updatedAt: string
}

type ExamVariant = any[] // Backend returns array of questions directly

const ExamPage = () => {
	const [exams, setExams] = useState<Exam[]>([])
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [loading, setLoading] = useState(true)
	const [showForm, setShowForm] = useState(false)
	const [editingExam, setEditingExam] = useState<Exam | null>(null)
	const [showGenerateForm, setShowGenerateForm] = useState(false)
	const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
	const [variants, setVariants] = useState<Record<string, ExamVariant>>({})
	const [formData, setFormData] = useState({
		name: '',
		code: '',
		duration: 60,
		numberOfQuestions: 2,
		subjectId: 0
	})
	const [generateData, setGenerateData] = useState({
		numberOfVariants: 4
	})

	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			setLoading(true)
			const [subjectsRes, examsRes] = await Promise.all([
				api.api.subjects.get(),
				api.api.exams.get()
			])

			if (subjectsRes.data) {
				setSubjects(subjectsRes.data as Subject[])
			}
			if (examsRes.data) {
				setExams(examsRes.data as Exam[])
			}
		} catch (error) {
			console.error('Error loading data:', error)
			toast.error('Lỗi khi tải dữ liệu')
		} finally {
			setLoading(false)
		}
	}

	const loadVariants = async (examId: number) => {
		try {
			const response = await api.api.exams[examId].variants.get()
			if (response.data) {
				setVariants(response.data as Record<string, ExamVariant>)
			} else {
				setVariants({})
			}
		} catch (error) {
			console.error('Error loading variants:', error)
			toast.error('Lỗi khi tải các mã đề')
			setVariants({})
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			if (editingExam) {
				// Update exam
				const response = await api.api.exams[editingExam.id].put(
					formData
				)
				if (response.data) {
					toast.success('Cập nhật đề thi thành công!')
					loadData()
					resetForm()
				}
			} else {
				// Create exam
				const response = await api.api.exams.post(formData)
				if (response.data) {
					toast.success('Tạo đề thi thành công!')
					loadData()
					resetForm()
				}
			}
		} catch (error) {
			console.error('Error saving exam:', error)
			toast.error('Lỗi khi lưu đề thi')
		}
	}

	const handleGenerateVariants = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedExam) return

		try {
			const response = await api.api.exams[selectedExam.id].generate.post(
				generateData
			)
			if (response.data) {
				toast.success(
					`Tạo ${generateData.numberOfVariants} mã đề thành công!`
				)
				loadVariants(selectedExam.id)
				setShowGenerateForm(false)
			}
		} catch (error) {
			console.error('Error generating variants:', error)
			toast.error('Lỗi khi tạo mã đề')
		}
	}

	const handleEdit = (exam: Exam) => {
		setEditingExam(exam)
		setFormData({
			name: exam.name,
			code: exam.code,
			duration: exam.duration,
			numberOfQuestions: exam.numberOfQuestions,
			subjectId: exam.subjectId
		})
		setShowForm(true)
	}

	const handleDelete = async (id: number) => {
		if (confirm('Bạn có chắc chắn muốn xóa đề thi này?')) {
			try {
				await api.api.exams[id].delete()
				toast.success('Xóa đề thi thành công!')
				loadData()
			} catch (error) {
				console.error('Error deleting exam:', error)
				toast.error('Lỗi khi xóa đề thi')
			}
		}
	}

	const handleViewVariants = async (exam: Exam) => {
		setSelectedExam(exam)
		await loadVariants(exam.id)
	}

	const handleExportExam = async (
		examId: number,
		variantCode?: string,
		includeAnswers: boolean = false
	) => {
		try {
			const response = await api.api.exams[examId].export.get({
				query: {
					variantCode,
					includeAnswers: includeAnswers.toString()
				}
			})

			if (response.data) {
				// Create and download file
				const content = response.data.content
				const blob = new Blob([content], {
					type: 'text/plain;charset=utf-8'
				})
				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = `de-thi-${variantCode || 'all'}.txt`
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				URL.revokeObjectURL(url)
			}
		} catch (error) {
			console.error('Error exporting exam:', error)
			toast.error('Lỗi khi xuất đề thi')
		}
	}

	const resetForm = () => {
		setFormData({
			name: '',
			code: '',
			duration: 60,
			numberOfQuestions: 2,
			subjectId: 0
		})
		setEditingExam(null)
		setShowForm(false)
	}

	const getSubjectName = (subjectId: number) => {
		const subject = subjects.find((s) => s.id === subjectId)
		return subject ? `${subject.code} - ${subject.name}` : 'Không xác định'
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
						Quản lý Đề thi
					</h1>
					<p className="text-slate-300">
						Tạo, quản lý đề thi và sinh mã đề tự động
					</p>
				</div>

				{/* Add Exam Form */}
				<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 mb-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-white">
							{editingExam
								? 'Chỉnh sửa Đề thi'
								: 'Thêm Đề thi mới'}
						</h2>
						<button
							onClick={() => setShowForm(!showForm)}
							className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors"
						>
							{showForm ? 'Ẩn form' : 'Thêm đề thi'}
						</button>
					</div>

					{showForm && (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Tên đề thi *
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
										placeholder="Nhập tên đề thi"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Mã đề thi *
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
										placeholder="Nhập mã đề thi"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Thời gian (phút) *
									</label>
									<input
										type="number"
										required
										min="1"
										value={formData.duration}
										onChange={(e) =>
											setFormData({
												...formData,
												duration: Number(e.target.value)
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Số câu hỏi *
									</label>
									<input
										type="number"
										required
										min="1"
										value={formData.numberOfQuestions}
										onChange={(e) =>
											setFormData({
												...formData,
												numberOfQuestions: Number(
													e.target.value
												)
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Môn học *
									</label>
									<select
										required
										value={formData.subjectId}
										onChange={(e) =>
											setFormData({
												...formData,
												subjectId: Number(
													e.target.value
												)
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									>
										<option value={0}>Chọn môn học</option>
										{subjects.map((subject) => (
											<option
												key={subject.id}
												value={subject.id}
											>
												{subject.code} - {subject.name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="flex space-x-4">
								<button
									type="submit"
									className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition-colors"
								>
									{editingExam ? 'Cập nhật' : 'Thêm đề thi'}
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

				{/* Generate Variants Form */}
				{showGenerateForm && selectedExam && (
					<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 mb-6">
						<h2 className="text-xl font-semibold text-white mb-4">
							Sinh mã đề cho: {selectedExam.name}
						</h2>
						<form
							onSubmit={handleGenerateVariants}
							className="space-y-4"
						>
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-1">
									Số lượng mã đề cần sinh *
								</label>
								<input
									type="number"
									required
									min="1"
									max="20"
									value={generateData.numberOfVariants}
									onChange={(e) =>
										setGenerateData({
											...generateData,
											numberOfVariants: Number(
												e.target.value
											)
										})
									}
									className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div className="flex space-x-4">
								<button
									type="submit"
									className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors"
								>
									Sinh mã đề
								</button>
								<button
									type="button"
									onClick={() => setShowGenerateForm(false)}
									className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-500 transition-colors"
								>
									Hủy
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Exams List */}
				<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-700">
						<h2 className="text-xl font-semibold text-white">
							Danh sách Đề thi
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-700">
							<thead className="bg-slate-900/50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Tên đề thi
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Mã đề
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Môn học
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Thời gian
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Số câu
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody className="bg-slate-800 divide-y divide-slate-700">
								{exams.map((exam) => (
									<tr
										key={exam.id}
										className="hover:bg-slate-700/50 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
											{exam.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-white">
											{exam.code}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
											{getSubjectName(exam.subjectId)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
											{exam.duration} phút
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
											{exam.numberOfQuestions} câu
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
											<button
												onClick={() =>
													handleViewVariants(exam)
												}
												className="text-blue-400 hover:text-blue-300 transition-colors"
											>
												Xem mã đề
											</button>
											<button
												onClick={() => {
													setSelectedExam(exam)
													setShowGenerateForm(true)
												}}
												className="text-green-400 hover:text-green-300 transition-colors"
											>
												Sinh mã đề
											</button>
											<button
												onClick={() =>
													handleExportExam(exam.id)
												}
												className="text-purple-400 hover:text-purple-300 transition-colors"
											>
												Xuất đề
											</button>
											<button
												onClick={() => handleEdit(exam)}
												className="text-yellow-400 hover:text-yellow-300 transition-colors"
											>
												Sửa
											</button>
											<button
												onClick={() =>
													handleDelete(exam.id)
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
						{exams.length === 0 && (
							<div className="text-center py-8 text-slate-400">
								Chưa có đề thi nào. Hãy tạo đề thi đầu tiên!
							</div>
						)}
					</div>
				</div>

				{/* Variants Display */}
				{selectedExam &&
					variants &&
					typeof variants === 'object' &&
					Object.keys(variants).length > 0 && (
						<div className="mt-8 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
							<div className="px-6 py-4 border-b border-slate-700">
								<h2 className="text-xl font-semibold text-white">
									Các mã đề của: {selectedExam.name}
								</h2>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{variants &&
										Object.entries(variants || {}).map(
											([code, variant]) => (
												<div
													key={code}
													className="border border-slate-700 bg-slate-900/50 rounded-lg p-4 hover:border-slate-600 transition-colors"
												>
													<div className="flex justify-between items-center mb-2">
														<h3 className="font-semibold text-white">
															{code}
														</h3>
														<div className="space-x-2">
															<button
																onClick={() =>
																	handleExportExam(
																		selectedExam.id,
																		code,
																		false
																	)
																}
																className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
															>
																Xuất đề
															</button>
															<button
																onClick={() =>
																	handleExportExam(
																		selectedExam.id,
																		code,
																		true
																	)
																}
																className="text-green-400 hover:text-green-300 text-sm transition-colors"
															>
																Xuất đáp án
															</button>
														</div>
													</div>
													<p className="text-sm text-slate-400">
														{Array.isArray(variant)
															? variant.length
															: (variant as any)
																	.questions
																	?.length ||
															  0}{' '}
														câu hỏi
													</p>
												</div>
											)
										)}
								</div>
							</div>
						</div>
					)}
			</div>
		</div>
	)
}

export default ExamPage
