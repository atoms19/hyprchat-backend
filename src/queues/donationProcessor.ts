export default async function QueueHandler(msg : Message,env:Env){
   console.log('Donation processor::Processing message from queue:', msg)
	msg.ack()
}
