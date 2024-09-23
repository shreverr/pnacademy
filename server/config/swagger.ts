import type { Application } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pnacademy Web API',
      description: 'API endpoints for a Pnacademy services documented on swagger',
      contact: {
        name: 'Shreshth Verma',
        email: 'verma2007s@gmail.com',
        url: 'https://github.com/shreverr/pnacademy'
      },
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:4000/',
        description: 'Local server'
      },
      {
        url: 'https://api.pnacademy.in/',
        description: 'dev deployment server'
      }
    ]
  },
  // looks for configuration in specified directories
  apis: [path.resolve(__dirname, '../routes/*.ts')]
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs (app: Application): void {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
export default swaggerDocs
