import { MiddlewareHandler } from "hono";
import { createCashfreeClient } from "../lib/cashfree";

export const cashFreeMiddleware:MiddlewareHandler = async (c,next)=>{
  c.set('payment_gateway',createCashfreeClient(c.env))
  await next()
}
