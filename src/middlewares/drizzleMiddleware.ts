import { MiddlewareHandler } from "hono";
import createNeonInstance from "../lib/neon";
import createDB from "../lib/drizzle";

export const drizzleMiddleware :MiddlewareHandler = async (c,next) => {
	const db = await createDB(c.env);
	c.set('db', db);
	await next();
}

