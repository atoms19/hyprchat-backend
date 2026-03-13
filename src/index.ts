import { Hono } from 'hono'
import  createDB  from './lib/drizzle'
import { drizzleMiddleware } from './middlewares/drizzleMiddleware';
import donnateRoute from './routes/donateRoute';
import MainQueueHandler from './queues';
import { webookHandler } from './routes/webHookRoute';
import { cors } from 'hono/cors';
export type  CustomContex = {
  db: ReturnType<typeof createDB>
}

const app = new Hono<{Bindings:Env,Variables:CustomContex}>();

app.use('*',drizzleMiddleware)
app.use('*',cors({
  origin: (origin) => origin	
}))

app.route('/donate',donnateRoute)
app.post('/paymentSuccess',webookHandler);
app.get('test',(c)=> c.json({message:'Hello World'}))


export default {
  fetch: app.fetch,
  queue:MainQueueHandler
}
