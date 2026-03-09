import handlePaymentProcessing from './paymentProcessor'
import handleDonationProcessing from './donationProcessor'
export default async function mainQueueHandler(batch: MessageBatch, env: Env) {
	for (const message of batch.messages) {
		switch (batch.queue) {
			case 'donation-processing-queue':
				await handleDonationProcessing(message, env);
				break
			case 'payment-processing-queue':
				await handlePaymentProcessing(message, env);
				break;
			default:
				console.log('Unknown queue:', batch.queue);

		}
	}

}
