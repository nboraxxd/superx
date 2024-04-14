import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import envConfig, { API_URL } from '@/config'
import usersRouter from '@/routes/users.routes'
import databaseService from '@/services/database.services'
import { defaultErrorHandler } from '@/middlewares/error.middlewares'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API SuperX',
      version: '1.0.0',
      description:
        'SuperX is a social media platform that enables users to connect and interact with others online. Users can create profiles, share posts, photos, and videos, and engage with content from friends and followers by liking, commenting, and sharing.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
    tags: [
      {
        name: 'users',
        description: 'Operations about users',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.routes.ts', './src/models/requests/*.requests.ts'],
}

const openapiSpecification = swaggerJsdoc(options)

const port = envConfig.PORT
const app = express()

// kết nối với database
databaseService.connect()

// Use Helmet!
app.use(helmet())

// Quy định CORS
// app.use(cors({ origin: isProduction ? envConfig.CLIENT_URL : '*' }))
app.use(cors({ origin: '*' }))

// parse json của client gởi lên, chuyển thành dạnh object để xử lý
app.use(express.json())

app.use('/api', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App listening at ${API_URL}`)
})
