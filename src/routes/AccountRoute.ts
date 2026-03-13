import { Hono } from "hono";
import { CustomContex } from "..";
import { accountRegistrationDTO } from "../types/streamerSchema";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";

let accountRouter = new Hono<{Variables:CustomContex}>();


accountRouter.post('/register',async (c)=>{
        let db = await c.get('db')	
        let data = await c.req.json()
		  let parsed = accountRegistrationDTO.safeParse(data)
        if (!parsed.success) {
			  return c.json({
				message: "Invalid account registration data",
				errors: JSON.parse(parsed.error.toString())
				}, 400)
		  }
		  let [userExisting] = await db.select().from(usersTable).where(eq(usersTable.name,parsed.data.username));
		  if (userExisting) {
			   return c.json({
					 message:"Username already exists, please choose a different username"
				},400)
		  }

		  await db.insert(usersTable).values({
			  name: parsed.data.username,
			  email: parsed.data.email,
		  })

		  return c.json({
			  message: "Account registered successfully"
		  }, 200)

})









export default accountRouter
