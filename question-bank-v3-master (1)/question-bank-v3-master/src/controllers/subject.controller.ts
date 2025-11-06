import { Elysia, t } from "elysia"
import SubjectService from "../services/SubjectService"
import authMacro from "../macros/auth"

const subjectService = new SubjectService()

const subjectController = new Elysia()
  .group("/subjects", group =>
    group
      .use(authMacro)
      .post("/", async ({ body }) => {
        return await subjectService.createSubject(body)
      }, {
        body: t.Object({
          name: t.String(),
          code: t.String(),
          description: t.Optional(t.String())
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Subject"],
          security: [{ JwtAuth: [] }]
        }
      })
      .get("/", async () => {
        return await subjectService.getSubjects()
      }, {
        checkAuth: ['user'],
        detail: {
          tags: ["Subject"],
          security: [{ JwtAuth: [] }]
        }
      })
      .get("/:id", async ({ params }) => {
        return await subjectService.subjectDetails(Number(params.id))
      }, {
        params: t.Object({
          id: t.String()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Subject"],
          security: [{ JwtAuth: [] }]
        }
      })
      .put("/:id", async ({ params, body }) => {
        return await subjectService.updateSubject(Number(params.id), body)
      }, {
        params: t.Object({
          id: t.String()
        }),
        body: t.Object({
          name: t.Optional(t.String()),
          code: t.Optional(t.String()),
          description: t.Optional(t.String())
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Subject"],
          security: [{ JwtAuth: [] }]
        }
      })
      .delete("/:id", async ({ params }) => {
        return await subjectService.deleteSubject(Number(params.id))
      }, {
        params: t.Object({
          id: t.String()
        }),
        checkAuth: ['user'],
        detail: {
          tags: ["Subject"],
          security: [{ JwtAuth: [] }]
        }
      })
  )

export default subjectController
