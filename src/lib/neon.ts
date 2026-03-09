import {drizzle} from "drizzle-orm/neon-http"
import {neon} from "@neondatabase/serverless";

export default async function createNeonInstance(env:Env){
   let neonInstance = neon(env.DATABASE_URL);
   const db = drizzle(neonInstance);

	 return db;
}
