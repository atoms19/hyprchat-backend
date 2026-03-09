import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';


export default async function createDB(env:Env){
let postgreSql: Pool = new Pool({
   connectionString: env.DATABASE_URL,
})
 const db =  drizzle(postgreSql);
 return db; 
}



