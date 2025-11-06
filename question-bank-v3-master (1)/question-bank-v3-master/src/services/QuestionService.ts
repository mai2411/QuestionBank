import { initORM } from "@server/db";

class QuestionService {
  async createQuestion(body: {
    question: string,
    answerA: string,
    answerB: string,
    answerC: string,
    answerD: string,
    correctAnswer: string,
    subjectId: number,
  }) {
    const db = await initORM()
    const question = db.question.create({
      question: body.question,
      answerA: body.answerA,
      answerB: body.answerB,
      answerC: body.answerC,
      answerD: body.answerD,
      correctAnswer: body.correctAnswer,
      subjectId: body.subjectId,
    })
    await db.em.persistAndFlush(question)
    return question
  }

  async createBulkQuestions(body: {
    question: string,
    answerA: string,
    answerB: string,
    answerC: string,
    answerD: string,
    correctAnswer: string,
    subjectId: number,
  }[]) {
    const db = await initORM()
    const questions = body.map(question => db.question.create({
      question: question.question,
      answerA: question.answerA,
      answerB: question.answerB,
      answerC: question.answerC,
      answerD: question.answerD,
      correctAnswer: question.correctAnswer,
      subjectId: question.subjectId,
    }))
    await db.em.persistAndFlush(questions)
    return questions
  }

  async updateQuestion(id: number, body: {
    question?: string,
    answerA?: string,
    answerB?: string,
    answerC?: string,
    answerD?: string,
    correctAnswer?: string,
    subjectId?: number,
  }) {
    const db = await initORM()
    const question = await db.question.findOne({ id })
    if (!question) {
      throw new Error('Question not found')
    }
    question.question = body.question || question.question
    question.answerA = body.answerA || question.answerA
    question.answerB = body.answerB || question.answerB
    question.answerC = body.answerC || question.answerC
    question.answerD = body.answerD || question.answerD
    question.correctAnswer = body.correctAnswer || question.correctAnswer
    question.subjectId = body.subjectId || question.subjectId
    await db.em.persistAndFlush(question)
    return question
  }

  async deleteQuestion(id: number) {
    const db = await initORM()
    const question = await db.question.findOne({ id })
    if (!question) {
      throw new Error('Question not found')
    }
    await db.em.removeAndFlush(question)
    return question
  }

  async questionDetails(id: number) {
    const db = await initORM()
    const question = await db.question.findOne({ id })
    if (!question) {
      throw new Error('Question not found')
    }
    return question
  }

  async findBySubjectId(subjectId: number) {
    const db = await initORM()
    const questions = await db.question.find({ subjectId })
    return questions
  }

  async getQuestions() {
    const db = await initORM()
    const questions = await db.question.findAll()
    return questions
  }
}

export default QuestionService;