import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(env.mongoUrl)
  .then(async (): Promise<void> => {
    const app = await (await import('./config/app')).default
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(err => console.error(err))
