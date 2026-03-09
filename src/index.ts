import { Hono } from 'hono'
import  createDB  from './lib/drizzle'
import { drizzleMiddleware } from './middlewares/drizzleMiddleware';
import donnateRoute from './routes/donateRoute';
import { Bindings } from 'hono/types';
import MainQueueHandler from './queues';
export type  CustomContex = {
  db: ReturnType<typeof createDB>
}

const app = new Hono<{Bindings:Env,Variables:CustomContex}>();

app.use('*',drizzleMiddleware)


app.route('/donate',donnateRoute)

export default {
  fetch: app.fetch,
  queue:MainQueueHandler
}
