import { Hono } from "hono";
import type { CustomContex } from "..";
import { eq, PromiseOf } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { donnationSchema } from "../types/donationSchema";
import { cashFreeMiddleware } from "../middlewares/cashFreeMiddleware";
import { createCashfreeClient } from "../lib/cashfree";

type superContext = CustomContex & {
  payment_gateway: ReturnType<typeof createCashfreeClient>
}

let donateRoute = new Hono<{Variables:superContext}>();
donateRoute.use('*',cashFreeMiddleware)

donateRoute.post('/:streamerName',async  (c) => {
   let db = await c.get('db')
	let id =c.req.param('streamerName')
	let data = await c.req.json()
	let parsed = donnationSchema.safeParse(data)
	if(!parsed.success){
		  return c.json({
			message: "Invalid donation data",
			errors: JSON.parse(parsed.error.toString())
		  },400)
  }
	let [streamer] = await db.select().from(usersTable).where(eq(usersTable.name, id))
   
	if(!streamer){
		  return c.json({
			message: "Streamer Doesnt exist are you sure you have the right id?"
		  },404)
  }

  if(streamer.kycStatus !== 'approved'){
	return c.json({
		  message: "Streamer is not eligible to receive donations yet "
	},403)
  }

  //create an order  

  let paymentGateway = c.get('payment_gateway')
  try{
  let order = await paymentGateway.PGCreateOrder({
    "order_amount": parsed.data.amount,
    "order_currency": "INR",
    "order_id": crypto.randomUUID(),
	 "order_tags":{
		"streamer_name": streamer.id.toString(), // storing data in the order tags to identify later on webhook 
		"message": parsed.data.message|| "",
	 },
    "customer_details": {
        "customer_id": "donator-"+parsed.data.phone, // we should create a customer id for the user and use it here but for now we will use a random uuid
        "customer_phone": parsed.data.phone,
    },
    "order_meta": {
        "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}"
    }
  })

    return c.json({
		  message: "Order created successfully",
		  session_id:order.data.payment_session_id // client on reciving will use cashfree-js to redirect to payment gateway
	 });
   
  }catch(e:any){
		return c.json({
			message: "Error creating order with payment gateway",
			error : e.response?.data || e.toString()
		},500)
  }

});

export default donateRoute;
