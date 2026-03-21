import { createCashfreeClient } from "../lib/cashfree";
import { CustomContex } from "..";
import { Hono } from 'hono';
import { kycSchema } from "../types/kycSchema";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { cashFreeMiddleware } from "../middlewares/cashFreeMiddleware";

type superContext = CustomContex & {
  payment_gateway: ReturnType<typeof createCashfreeClient>
}

let app = new Hono<{Variables:superContext}>();

app.use('*',cashFreeMiddleware)

app.post('/streamer',async (c) => {
  let data = await c.req.json()
})

app.post('/kyc/:streamerName',async (c) => {
    let data = await c.req.json()
	 let res = kycSchema.safeParse(data);
	 if(!res.success){
			return c.json({error:res.error},400)
	 }
	 let {streamerName} = c.req.param();
	 let payment_gateway = c.get('payment_gateway');

	 let db = await  c.get('db');

	let [streamer] = await db.select().from(usersTable).where(eq(usersTable.name, streamerName))
    if(!streamer){
			return c.json({error:"Streamer not found"},404)
	 }  
	 if(streamer.kycStatus === "approved"){
			return c.json({message:"KYC already approved"},400)
	 }
	 if(streamer.kycStatus === "pending"){
			return c.json({message:"KYC already pending"},400)
	 }

	 try {
	  let xid =crypto.randomUUID(); 
	  let xidem=crypto.randomUUID();
		 await payment_gateway.PGESCreateVendors(xid,xidem,{
		  vendor_id:streamerName,
		  name: streamerName,
		  email: streamer.email,
		  phone: "9999999999", 
		  status:streamerName,
		  upi: [{
		  vpa: `${streamerName}@upi`,
		  account_holder: streamerName
		  }],
		  kyc_details:[{
			  
		  }]
		} )


	 }catch(e){
		console.log(e)
			return c.json({error:"Failed to create KYC"},500)
	 } 


})

export default app
