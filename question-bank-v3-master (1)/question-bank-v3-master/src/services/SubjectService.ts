import { initORM } from "@server/db";

class SubjectService {

  async createSubject(body: { name: string, code: string, description?: string }) {
    const db = await initORM()
    const subject = db.subject.create({
      name: body.name,
      code: body.code,
      description: body.description,
    })
    await db.em.persistAndFlush(subject)
    return subject
  }

  async getSubjects() {
    const db = await initORM()
    const subjects = await db.subject.findAll()
    return subjects
  }

  async updateSubject(id: number, data: {
    name?: string,
    code?: string,
    description?: string,
  }) {
    const db = await initORM()
    const subject = await db.subject.findOne({ id })
    if (!subject) {
      throw new Error('Subject not found')
    }
    subject.name = data.name || subject.name
    subject.code = data.code || subject.code
    subject.description = data.description || subject.description
    await db.em.persistAndFlush(subject)
    return subject
  }

  async subjectDetails(id: number) {
    const db = await initORM()
    const subject = await db.subject.findOne({ id })
    if (!subject) {
      throw new Error('Subject not found')
    }
    return subject
  }

  async deleteSubject(id: number) {
    const db = await initORM()
    const subject = await db.subject.findOne({ id })
    if (!subject) {
      throw new Error('Subject not found')
    }
    await db.em.removeAndFlush(subject)
    return subject
  }
}
export default SubjectService;