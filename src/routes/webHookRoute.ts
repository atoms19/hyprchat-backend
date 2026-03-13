import { Handler, RouterRoute } from "hono/types";
import { donationsTable } from "../db/schema";

export const webookHandler: Handler = async (c) => {
	let paymentGateway = c.get('payment_gateway');

	const signature = c.req.header("x-webhook-signature");
	const timestamp = c.req.header("x-webhook-timestamp");
	const rawBody = await c.req.text();
	let result;
	try {
		result = await paymentGateway.PGVerifyWebhookSignature(signature, rawBody, timestamp)
	} catch (err) {
		return c.json({
			message: "Invalid signature"
		}, 400);
	}
	let order = result.data.order


	c.env.DONATION_PROCESSING_QUEUE.send({
		amount: order.order_amount,
		username: order.customer_details.customer_name,
		streamer: order.order_tags.streamer_name,
		message: order.order_tags.message,
		orderId: order.order_id,
	})
	// forward the webhook data to donation processing queue for further processing

	let db = c.get('db')
	db.insert(donationsTable).values({
		amount: order.order_amount,
		message: order.order_tags.message,
		ordersId: order.order_id,
		streamerName: order.order_tags.streamer_name,
		donatorName: order.customer_details.customer_name,
		donatorPhone: order.customer_details.customer_phone,
	})

	return c.json({
		  message: "Webhook received successfully"
	}, 200);
	// insert donnation into the accounting DATABASE

}
