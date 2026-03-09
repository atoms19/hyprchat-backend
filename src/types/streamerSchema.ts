import {z} from 'zod';

export const streamerRegistrationSchema = z.object({
    name: z.string().min(3).max(50),
})
