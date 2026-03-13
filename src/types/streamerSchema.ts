import {z} from 'zod';

export const accountRegistrationDTO = z.object({
    username: z.string().min(3).max(50),
	 email: z.email(),
    password: z.string().min(6).max(100), 
	 role: z.enum(['streamer', 'donator'])
})

