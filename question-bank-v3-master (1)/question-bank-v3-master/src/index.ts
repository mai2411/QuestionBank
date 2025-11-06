import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { initORM } from './db'
import { RequestContext } from '@mikro-orm/core'
import responseMiddleware from './middlewares/response-middleware'
import errorMiddleware from './middlewares/error-middleware'
import userController from './controllers/user.controller'
import subjectController from './controllers/subject.controller'
import questionController from './controllers/question.controller'
import examController from './controllers/exam.controller'
import swagger from '@elysiajs/swagger'

const dataSource = await initORM()
await dataSource.orm.getSchemaGenerator().updateSchema();
export const app = new Elysia()
	.use(
		await staticPlugin({
			prefix: '/',
			assets: './client',
		})
	)
	.group("/api", group =>
		group
			.use(swagger(
				{
					path: '/docs',
					provider: 'swagger-ui',
					documentation: {
						info: {
							title: 'Elysia template v3',
							description: 'Elysia template API Documentation',
							version: '1.0.3',
						},
						components: {
							securitySchemes: {
								JwtAuth: {
									type: 'http',
									scheme: 'bearer',
									bearerFormat: 'JWT',
									description: 'Enter JWT Bearer token **_only_**'
								}
							}
						},
					},
					swaggerOptions: {
						persistAuthorization: true,
					}
				}
			))
			.onBeforeHandle(() => RequestContext.enter(dataSource.em))
			.onAfterHandle(responseMiddleware)
			.onError(errorMiddleware)
			.use(userController)
			.use(subjectController)
			.use(questionController)
			.use(examController)
	)



	.listen(3000)

console.log(
	`Server started open http://${app.server?.hostname}:${app.server?.port} in the browser`
)
console.log(
	`API can be found at  http://${app.server?.hostname}:${app.server?.port}/api/docs in the browser`
)
