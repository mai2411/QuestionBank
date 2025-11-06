import { Elysia, t } from "elysia"
import QuestionService from "../services/QuestionService"
import authMacro from "../macros/auth"

const questionService = new QuestionService()

const questionController = new Elysia()
  .group("/questions", group =>
    group
      .use(authMacro)
      .post("/", async ({ body }) => {
        return await questionService.createQuestion(body)
      }, {
        body: t.Object({
          question: t.String(),
          answerA: t.String(),
          answerB: t.String(),
          answerC: t.String(),
          answerD: t.String(),
          correctAnswer: t.String(),
          subjectId: t.Number()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Question"],
          security: [{ JwtAuth: [] }]
        }
      })
      .post("/bulk", async ({ body }) => {
        return await questionService.createBulkQuestions(body)
      }, {
        body: t.Array(t.Object({
          question: t.String(),
          answerA: t.String(),
          answerB: t.String(),
          answerC: t.String(),
          answerD: t.String(),
          correctAnswer: t.String(),
          subjectId: t.Number()
        })),
        checkAuth: ['user'],
        detail: {
          tags: ["Question"],
          security: [{ JwtAuth: [] }]
        }
      })
      .get("/", async ({ query }) => {
        if (query.subjectId) {
          return await questionService.findBySubjectId(Number(query.subjectId))
        }
        return await questionService.getQuestions()
      }, {
        query: t.Object({
          subjectId: t.Optional(t.String())
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Question"],
          security: [{ JwtAuth: [] }]
        }
      })
      .get("/:id", async ({ params }) => {
        return await questionService.questionDetails(Number(params.id))
      }, {
        params: t.Object({
          id: t.String()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Question"],
          security: [{ JwtAuth: [] }]
        }
      })
      .put("/:id", async ({ params, body }) => {
        return await questionService.updateQuestion(Number(params.id), body)
      }, {
        params: t.Object({
          id: t.String()
        }),
        body: t.Object({
          question: t.Optional(t.String()),
          answerA: t.Optional(t.String()),
          answerB: t.Optional(t.String()),
          answerC: t.Optional(t.String()),
          answerD: t.Optional(t.String()),
          correctAnswer: t.Optional(t.String()),
          subjectId: t.Optional(t.Number())
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Question"],
          security: [{ JwtAuth: [] }]
        }
      })
      .delete("/:id", async ({ params }) => {
        return await questionService.deleteQuestion(Number(params.id))
      }, {
        params: t.Object({
          id: t.String()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Question"],
          security: [{ JwtAuth: [] }]
        }
      })
  )

export default questionController
