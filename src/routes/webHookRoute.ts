import { Handler, RouterRoute } from "hono/types";
import { donationsTable } from "../db/schema";

export const webookHandler: Handler = async (c) => {
	let paymentGateway = await c.get('payment_gateway');
	console.log("paymentGateway ", paymentGateway);
	console.log("request recieved ", JSON.stringify(c.req));

	const signature = c.req.header("x-webhook-signature");
	const timestamp = c.req.header("x-webhook-timestamp");
	const rawBody = await c.req.text();
	let result;
	console.log("signature ", signature, "timestamp ", timestamp, "rawBody ", rawBody);
	try {
		result = await paymentGateway.PGVerifyWebhookSignature(signature, rawBody, timestamp)
	} catch (err) {
	   console.log("Error verifying webhook signature: ", err);
		return c.json({
			message: "Invalid signature"
		}, 400);
	}
	console.log("Webhook signature verified successfully: ", result);
	let parsed = JSON.parse(rawBody);
	let order = JSON.parse(rawBody).data.order;


	c.env.DONATION_PROCESSING_QUEUE.send({
		amount: order.order_amount,
		username: parsed.data.customer_details.customer_name|| "Anonymous",
		streamer: order.order_tags.streamer_name,
		message: order.order_tags.message,
		orderId: order.order_id,
	})

	// forward the webhook data to donation processing queue for further processing
try {
	let db = c.get('db')
   if (!db) {
		 console.log("Database instance not found in context");
		 return c.json({
			 message: "Internal server error"
		 }, 500);
	 }
	await db.insert(donationsTable).values({
		amount: order.order_amount,
		message: order.order_tags.message,
		ordersId: order.order_id,
		streamerName: order.order_tags.streamer_name,
		donatorName: parsed.data.customer_details.customer_name || "Anonymous",
		donatorPhone: parsed.data.customer_details.customer_phone,
	}).onConflictDoNothing()

} catch (err) {
	 console.log("Error inserting donation into database: ", err);
}
  return c.json({
		  message: "Webhook received successfully"
	}, 200);
}
