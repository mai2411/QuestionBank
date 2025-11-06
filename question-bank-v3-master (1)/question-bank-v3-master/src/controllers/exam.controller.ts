import { Elysia, t } from "elysia"
import ExamService from "../services/ExamService"
import authMacro from "../macros/auth"

const examService = new ExamService()

const examController = new Elysia()
  .group("/exams", group =>
    group
      .use(authMacro)
      .post("/", async ({ body }) => {
        return await examService.createExam(body)
      }, {
        body: t.Object({
          name: t.String(),
          code: t.String(),
          duration: t.Number(),
          numberOfQuestions: t.Number(),
          subjectId: t.Number()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Exam"],
          security: [{ JwtAuth: [] }]
        }
      })
      .get("/", async () => {
        return await examService.getExams()
      }, {
        checkAuth: ['user'],
        detail: {
          tags: ["Exam"],
          security: [{ JwtAuth: [] }]
        }
      })
      .get("/:id", async ({ params }) => {
        return await examService.examDetails(Number(params.id))
      }, {
        params: t.Object({
          id: t.String()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Exam"],
          security: [{ JwtAuth: [] }]
        }
      })
      .put("/:id", async ({ params, body }) => {
        return await examService.updateExam(Number(params.id), body)
      }, {
        params: t.Object({
          id: t.String()
        }),
        body: t.Object({
          name: t.Optional(t.String()),
          code: t.Optional(t.String()),
          duration: t.Optional(t.Number()),
          numberOfQuestions: t.Optional(t.Number()),
          subjectId: t.Optional(t.Number())
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Exam"],
          security: [{ JwtAuth: [] }]
        }
      })
      .delete("/:id", async ({ params }) => {
        return await examService.deleteExam(Number(params.id))
      }, {
        params: t.Object({
          id: t.String()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Exam"],
          security: [{ JwtAuth: [] }]
        }
      })
      .post("/:id/generate", async ({ params, body }) => {
        const variants = await examService.generateExamVariants(Number(params.id), body.numberOfVariants)
        await examService.saveExamVariants(Number(params.id), variants)
        return variants
      }, {
        params: t.Object({
          id: t.String()
        }),
        body: t.Object({
          numberOfVariants: t.Number()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Exam"],
          security: [{ JwtAuth: [] }]
        }
      })
      .get("/:id/variants", async ({ params }) => {
        return await examService.getExamVariants(Number(params.id))
      }, {
        params: t.Object({
          id: t.String()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Exam"],
          security: [{ JwtAuth: [] }]
        }
      })
      .get("/:id/export", async ({ params, query }) => {
        const content = await examService.exportExamToWord(
          Number(params.id),
          query.variantCode,
          query.includeAnswers === 'true'
        )
        return { content }
      }, {
        params: t.Object({
          id: t.String()
        }),
        query: t.Object({
          variantCode: t.Optional(t.String()),
          includeAnswers: t.Optional(t.String())
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Exam"],
          security: [{ JwtAuth: [] }]
        }
      })
  )

export default examController
