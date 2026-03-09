import { Handler, RouterRoute } from "hono/types";

export const webookHandler: Handler = async (c) => {
  let paymentGateway = c.get('payment_gateway');  
   
  const signature = c.req.header("x-webhook-signature");
  const timestamp = c.req.header("x-webhook-timestamp");
  const rawBody = await c.req.text();
  let result; 
  try {
   result = await paymentGateway.PGVerifyWebhookSignature(signature,rawBody,timestamp)
  }catch(err){
    return c.json({
		  message: "Invalid signature"
		},400);
  }
  let order =  result.data.order
  

  c.env.DONATION_PROCESSING_QUEUE.send({
		amount:order.order_amount,
	   username:order.customer_details.customer_name,
		streamer:order.order_tags
  }) // forward the webhook data to donation processing queue for further processing
  

	 // insert donnation into the accounting DATABASE
}
