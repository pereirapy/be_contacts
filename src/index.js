import express from 'express'
import routes from './routes'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import errorHandler from './shared/middleware/error.middleware'
import notFoundHandler from './shared/middleware/notfound.middleware'

const app = express()
const PORT = process.env.PORT || 3333

app
  .use(cors({ origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*' }))
  .use(helmet())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .disable('x-powered-by')
  .use(routes)
  .use(errorHandler)
  .use(notFoundHandler)

  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.info(`Server started on port ${PORT} 🚀`)
  })
  .on('error', err => {
    // eslint-disable-next-line no-console
    console.error(err)
  })

export default app
