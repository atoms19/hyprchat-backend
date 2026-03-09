
export default async function QueueHandler(msg : Message,env:Env){
	 console.log('Payment processor::Processing message from queue:', msg)
	 await env.DONATION_PROCESSING_QUEUE.send(msg.body) // forward the message to donation processing queue
	 
 	 msg.ack()
}
