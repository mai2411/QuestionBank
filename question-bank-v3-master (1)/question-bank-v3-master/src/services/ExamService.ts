import { initORM } from "@server/db"

class ExamService {
  async createExam(body: {
    name: string,
    code: string,
    duration: number,
    numberOfQuestions: number,
    subjectId: number,
  }) {
    const db = await initORM()
    const exam = db.exam.create({
      name: body.name,
      code: body.code,
      duration: body.duration,
      numberOfQuestions: body.numberOfQuestions,
      subjectId: body.subjectId,
    })
    await db.em.persistAndFlush(exam)
    return exam
  }

  async getExams() {
    const db = await initORM()
    const exams = await db.exam.findAll()
    return exams
  }

  async examDetails(id: number) {
    const db = await initORM()
    const exam = await db.exam.findOne({ id })
    if (!exam) {
      throw new Error('Exam not found')
    }
    return exam
  }

  async updateExam(id: number, data: {
    name?: string,
    code?: string,
    duration?: number,
    subjectId?: number,
  }) {
    const db = await initORM()
    const exam = await db.exam.findOne({ id })
    if (!exam) {
      throw new Error('Exam not found')
    }
    exam.name = data.name || exam.name
    exam.code = data.code || exam.code
    exam.duration = data.duration || exam.duration
    exam.subjectId = data.subjectId || exam.subjectId
    await db.em.persistAndFlush(exam)
    return exam
  }

  async deleteExam(id: number) {
    const db = await initORM()
    const exam = await db.exam.findOne({ id })
    if (!exam) {
      throw new Error('Exam not found')
    }
    await db.em.removeAndFlush(exam)
    return exam
  }

  async generateExamVariants(examId: number, numberOfVariants: number) {
    const db = await initORM()

    // Get exam details
    const exam = await db.exam.findOne({ id: examId })
    if (!exam) {
      throw new Error('Exam not found')
    }

    // Get all questions for this subject
    const questions = await db.question.find({ subjectId: exam.subjectId })
    if (questions.length === 0) {
      throw new Error('No questions found for this subject')
    }

    if (questions.length < exam.numberOfQuestions) {
      throw new Error(`Not enough questions. Need ${exam.numberOfQuestions} but only have ${questions.length}`)
    }

    // Shuffle questions array
    const shuffledQuestions = this.shuffleArray([...questions])

    // Generate variants
    const variants = []
    for (let i = 0; i < numberOfVariants; i++) {
      const variantCode = `${exam.code}-${String(i + 1).padStart(3, '0')}`

      // Select only the required number of questions for this variant
      const variantQuestions = this.shuffleArray([...shuffledQuestions]).slice(0, exam.numberOfQuestions)

      // Shuffle answers for each question
      const processedQuestions = variantQuestions.map(q => {
        const answers = [q.answerA, q.answerB, q.answerC, q.answerD]
        const shuffledAnswers = this.shuffleArray([...answers])

        // Find new position of correct answer
        const correctAnswerIndex = shuffledAnswers.indexOf(q.correctAnswer)
        let newCorrectAnswer = 'A' // Default fallback

        if (correctAnswerIndex >= 0) {
          newCorrectAnswer = ['A', 'B', 'C', 'D'][correctAnswerIndex]
        } else {
          // If correct answer not found, try to match by content
          const originalCorrectAnswer = q.correctAnswer
          if (originalCorrectAnswer === 'A') {
            const index = shuffledAnswers.indexOf(q.answerA)
            newCorrectAnswer = index >= 0 ? ['A', 'B', 'C', 'D'][index] : 'A'
          } else if (originalCorrectAnswer === 'B') {
            const index = shuffledAnswers.indexOf(q.answerB)
            newCorrectAnswer = index >= 0 ? ['A', 'B', 'C', 'D'][index] : 'A'
          } else if (originalCorrectAnswer === 'C') {
            const index = shuffledAnswers.indexOf(q.answerC)
            newCorrectAnswer = index >= 0 ? ['A', 'B', 'C', 'D'][index] : 'A'
          } else if (originalCorrectAnswer === 'D') {
            const index = shuffledAnswers.indexOf(q.answerD)
            newCorrectAnswer = index >= 0 ? ['A', 'B', 'C', 'D'][index] : 'A'
          }
        }

        return {
          question: q.question,
          answerA: shuffledAnswers[0],
          answerB: shuffledAnswers[1],
          answerC: shuffledAnswers[2],
          answerD: shuffledAnswers[3],
          correctAnswer: newCorrectAnswer,
          originalQuestionId: q.id
        }
      })

      variants.push({
        code: variantCode,
        examId: examId,
        questions: processedQuestions
      })
    }

    return variants
  }

  async saveExamVariants(examId: number, variants: any[]) {
    const db = await initORM()

    try {
      // Save each variant as exam questions
      for (const variant of variants) {
        for (const question of variant.questions) {
          // Validate required fields
          if (!question.correctAnswer) {
            throw new Error(`Missing correctAnswer for question: ${question.question}`)
          }

          const examQuestion = db.examQuestion.create({
            examId: examId,
            questionId: question.originalQuestionId,
            questionOrder: variant.questions.indexOf(question) + 1,
            variantCode: variant.code,
            questionText: question.question,
            answerA: question.answerA,
            answerB: question.answerB,
            answerC: question.answerC,
            answerD: question.answerD,
            correctAnswer: question.correctAnswer
          })
          await db.em.persist(examQuestion)
        }
      }

      await db.em.flush()
      return variants
    } catch (error) {
      console.error('Error saving exam variants:', error)
      throw new Error(`Failed to save exam variants: ${error.message}`)
    }
  }

  async getExamVariants(examId: number) {
    const db = await initORM()
    const examQuestions = await db.examQuestion.find({ examId })

    // Group by variant code
    const variants: any = {}
    examQuestions.forEach(eq => {
      if (!variants[eq.variantCode]) {
        variants[eq.variantCode] = []
      }
      variants[eq.variantCode].push(eq)
    })

    // Sort questions by order within each variant
    Object.keys(variants).forEach(code => {
      variants[code].sort((a: any, b: any) => a.questionOrder - b.questionOrder)
    })

    return variants
  }

  async exportExamToWord(examId: number, variantCode?: string, includeAnswers: boolean = false) {
    const db = await initORM()

    let examQuestions
    if (variantCode) {
      examQuestions = await db.examQuestion.find({ examId, variantCode })
    } else {
      examQuestions = await db.examQuestion.find({ examId })
    }

    if (examQuestions.length === 0) {
      throw new Error('No exam questions found')
    }

    const exam = await db.exam.findOne({ id: examId })
    if (!exam) {
      throw new Error('Exam not found')
    }

    // Generate Word document content
    let content = `ĐỀ THI: ${exam.name}\n`
    content += `Mã đề: ${variantCode || 'Tất cả'}\n`
    content += `Thời gian: ${exam.duration} phút\n\n`

    examQuestions.forEach((eq, index) => {
      content += `Câu ${index + 1}: ${eq.questionText}\n`
      content += `A. ${eq.answerA}\n`
      content += `B. ${eq.answerB}\n`
      content += `C. ${eq.answerC}\n`
      content += `D. ${eq.answerD}\n\n`
    })

    if (includeAnswers) {
      content += `\n--- ĐÁP ÁN ---\n`
      examQuestions.forEach((eq, index) => {
        content += `Câu ${index + 1}: ${eq.correctAnswer}\n`
      })
    }

    return content
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

export default ExamService
