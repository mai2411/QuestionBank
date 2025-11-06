import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../libs/api'

type Subject = {
	id: number
	name: string
	code: string
}

type Question = {
	id: number
	question: string
	answerA: string
	answerB: string
	answerC: string
	answerD: string
	correctAnswer: string
	subjectId: number
	createdAt: string
	updatedAt: string
}

const QuestionPage = () => {
	const [questions, setQuestions] = useState<Question[]>([])
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [loading, setLoading] = useState(true)
	const [showForm, setShowForm] = useState(false)
	const [showImportForm, setShowImportForm] = useState(false)
	const [editingQuestion, setEditingQuestion] = useState<Question | null>(
		null
	)
	const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
		null
	)
	const [importFile, setImportFile] = useState<File | null>(null)
	const [formData, setFormData] = useState({
		question: '',
		answerA: '',
		answerB: '',
		answerC: '',
		answerD: '',
		correctAnswer: 'A',
		subjectId: 0
	})

	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			setLoading(true)
			const [subjectsRes, questionsRes] = await Promise.all([
				api.api.subjects.get(),
				api.api.questions.get()
			])

			if (subjectsRes.data) {
				setSubjects(subjectsRes.data as Subject[])
			}
			if (questionsRes.data) {
				setQuestions(questionsRes.data as Question[])
			}
		} catch (error) {
			console.error('Error loading data:', error)
			toast.error('Lỗi khi tải dữ liệu')
		} finally {
			setLoading(false)
		}
	}

	const loadQuestionsBySubject = async (subjectId: number | null) => {
		try {
			setLoading(true)
			setSelectedSubjectId(subjectId)

			if (subjectId) {
				const response = await api.api.questions.get({
					query: { subjectId: subjectId.toString() }
				})
				if (response.data) {
					setQuestions(response.data as Question[])
				}
			} else {
				const response = await api.api.questions.get()
				if (response.data) {
					setQuestions(response.data as Question[])
				}
			}
		} catch (error) {
			console.error('Error loading questions:', error)
			toast.error('Lỗi khi tải câu hỏi')
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			if (editingQuestion) {
				// Update question
				const response = await api.api.questions[
					editingQuestion.id
				].put(formData)
				if (response.data) {
					toast.success('Cập nhật câu hỏi thành công!')
					loadQuestionsBySubject(selectedSubjectId)
					resetForm()
				}
			} else {
				// Create question
				const response = await api.api.questions.post(formData)
				if (response.data) {
					toast.success('Tạo câu hỏi thành công!')
					loadQuestionsBySubject(selectedSubjectId)
					resetForm()
				}
			}
		} catch (error) {
			console.error('Error saving question:', error)
			toast.error('Lỗi khi lưu câu hỏi')
		}
	}

	const handleEdit = (question: Question) => {
		setEditingQuestion(question)
		setFormData({
			question: question.question,
			answerA: question.answerA,
			answerB: question.answerB,
			answerC: question.answerC,
			answerD: question.answerD,
			correctAnswer: question.correctAnswer,
			subjectId: question.subjectId
		})
		setShowForm(true)
	}

	const handleDelete = async (id: number) => {
		if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
			try {
				await api.api.questions[id].delete()
				toast.success('Xóa câu hỏi thành công!')
				loadQuestionsBySubject(selectedSubjectId)
			} catch (error) {
				console.error('Error deleting question:', error)
				toast.error('Lỗi khi xóa câu hỏi')
			}
		}
	}

	const resetForm = () => {
		setFormData({
			question: '',
			answerA: '',
			answerB: '',
			answerC: '',
			answerD: '',
			correctAnswer: 'A',
			subjectId: 0
		})
		setEditingQuestion(null)
		setShowForm(false)
	}

	const handleFileImport = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!importFile || !formData.subjectId) {
			toast.error('Vui lòng chọn file và môn học')
			return
		}

		try {
			const text = await importFile.text()
			const lines = text.split('\n').filter((line) => line.trim())

			const questions = lines.map((line, index) => {
				const [
					question,
					answerA,
					answerB,
					answerC,
					answerD,
					correctAnswer
				] = line.split(',').map((s) => s.trim())
				if (
					!question ||
					!answerA ||
					!answerB ||
					!answerC ||
					!answerD ||
					!correctAnswer
				) {
					throw new Error(
						`Dòng ${index + 1}: Thiếu thông tin câu hỏi`
					)
				}
				return {
					question,
					answerA,
					answerB,
					answerC,
					answerD,
					correctAnswer,
					subjectId: formData.subjectId
				}
			})

			const response = await api.api.questions.bulk.post(questions)
			if (response.data) {
				toast.success(`Import thành công ${questions.length} câu hỏi!`)
				loadQuestionsBySubject(selectedSubjectId)
				setShowImportForm(false)
				setImportFile(null)
			}
		} catch (error) {
			console.error('Import error:', error)
			toast.error('Lỗi khi import: ' + (error as Error).message)
		}
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
						Quản lý Câu hỏi
					</h1>
					<p className="text-slate-300">
						Thêm, sửa, xóa câu hỏi cho các môn học
					</p>
				</div>

				{/* Subject Filter */}
				<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 mb-6">
					<h2 className="text-lg font-semibold text-white mb-4">
						Lọc theo Môn học
					</h2>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => loadQuestionsBySubject(null)}
							className={`px-4 py-2 rounded-lg transition-colors ${
								selectedSubjectId === null
									? 'bg-blue-600 text-white hover:bg-blue-500'
									: 'bg-slate-700 text-slate-300 hover:bg-slate-600'
							}`}
						>
							Tất cả môn học
						</button>
						{subjects.map((subject) => (
							<button
								key={subject.id}
								onClick={() =>
									loadQuestionsBySubject(subject.id)
								}
								className={`px-4 py-2 rounded-lg transition-colors ${
									selectedSubjectId === subject.id
										? 'bg-blue-600 text-white hover:bg-blue-500'
										: 'bg-slate-700 text-slate-300 hover:bg-slate-600'
								}`}
							>
								{subject.code}
							</button>
						))}
					</div>
				</div>

				{/* Add Question Form */}
				<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 mb-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-white">
							{editingQuestion
								? 'Chỉnh sửa Câu hỏi'
								: 'Thêm Câu hỏi mới'}
						</h2>
						<div className="space-x-2">
							<button
								onClick={() =>
									setShowImportForm(!showImportForm)
								}
								className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors"
							>
								{showImportForm ? 'Ẩn import' : 'Import CSV'}
							</button>
							<button
								onClick={() => setShowForm(!showForm)}
								className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
							>
								{showForm ? 'Ẩn form' : 'Thêm câu hỏi'}
							</button>
						</div>
					</div>

					{showForm && (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Đáp án đúng *
									</label>
									<select
										required
										value={formData.correctAnswer}
										onChange={(e) =>
											setFormData({
												...formData,
												correctAnswer: e.target.value
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									>
										<option value="A">A</option>
										<option value="B">B</option>
										<option value="C">C</option>
										<option value="D">D</option>
									</select>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-1">
									Nội dung câu hỏi *
								</label>
								<textarea
									required
									value={formData.question}
									onChange={(e) =>
										setFormData({
											...formData,
											question: e.target.value
										})
									}
									className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									rows={3}
									placeholder="Nhập nội dung câu hỏi"
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Đáp án A *
									</label>
									<input
										type="text"
										required
										value={formData.answerA}
										onChange={(e) =>
											setFormData({
												...formData,
												answerA: e.target.value
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Nhập đáp án A"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Đáp án B *
									</label>
									<input
										type="text"
										required
										value={formData.answerB}
										onChange={(e) =>
											setFormData({
												...formData,
												answerB: e.target.value
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Nhập đáp án B"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Đáp án C *
									</label>
									<input
										type="text"
										required
										value={formData.answerC}
										onChange={(e) =>
											setFormData({
												...formData,
												answerC: e.target.value
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Nhập đáp án C"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										Đáp án D *
									</label>
									<input
										type="text"
										required
										value={formData.answerD}
										onChange={(e) =>
											setFormData({
												...formData,
												answerD: e.target.value
											})
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Nhập đáp án D"
									/>
								</div>
							</div>
							<div className="flex space-x-4">
								<button
									type="submit"
									className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors"
								>
									{editingQuestion
										? 'Cập nhật'
										: 'Thêm câu hỏi'}
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

					{showImportForm && (
						<form onSubmit={handleFileImport} className="space-y-4">
							<div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-4">
								<h3 className="text-sm font-medium text-blue-300 mb-2">
									Hướng dẫn import CSV:
								</h3>
								<p className="text-sm text-blue-200">
									File CSV cần có định dạng: Câu hỏi, Đáp án
									A, Đáp án B, Đáp án C, Đáp án D, Đáp án đúng
								</p>
								<p className="text-sm text-blue-200 mt-1">
									Ví dụ: "Thủ đô của Việt Nam là gì?", "Hà
									Nội", "TP.HCM", "Đà Nẵng", "Huế", "A"
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-1">
										File CSV *
									</label>
									<input
										type="file"
										accept=".csv"
										required
										onChange={(e) =>
											setImportFile(
												e.target.files?.[0] || null
											)
										}
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>
							<div className="flex space-x-4">
								<button
									type="submit"
									className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition-colors"
								>
									Import câu hỏi
								</button>
								<button
									type="button"
									onClick={() => {
										setShowImportForm(false)
										setImportFile(null)
									}}
									className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-500 transition-colors"
								>
									Hủy
								</button>
							</div>
						</form>
					)}
				</div>

				{/* Questions List */}
				<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-700">
						<h2 className="text-xl font-semibold text-white">
							Danh sách Câu hỏi
							{selectedSubjectId && (
								<span className="text-sm font-normal text-slate-400 ml-2">
									- {getSubjectName(selectedSubjectId)}
								</span>
							)}
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-700">
							<thead className="bg-slate-900/50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Câu hỏi
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Môn học
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Đáp án đúng
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody className="bg-slate-800 divide-y divide-slate-700">
								{questions.map((question) => (
									<tr
										key={question.id}
										className="hover:bg-slate-700/50 transition-colors"
									>
										<td className="px-6 py-4 text-sm text-white max-w-md">
											<div className="truncate">
												{question.question}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
											{getSubjectName(question.subjectId)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
											{question.correctAnswer}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
											<button
												onClick={() =>
													handleEdit(question)
												}
												className="text-blue-400 hover:text-blue-300 transition-colors"
											>
												Sửa
											</button>
											<button
												onClick={() =>
													handleDelete(question.id)
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
						{questions.length === 0 && (
							<div className="text-center py-8 text-slate-400">
								Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default QuestionPage
